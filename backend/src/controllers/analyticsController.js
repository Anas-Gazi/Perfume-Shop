const { query } = require('../config/database');

const PERIODS = {
  weekly: { days: 7 },
  monthly: { days: 30 },
  yearly: { months: 12 },
};

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const normalizePeriod = (value) => (PERIODS[value] ? value : 'monthly');

const startOfDay = (date) => {
  const next = new Date(date);
  next.setHours(0, 0, 0, 0);
  return next;
};

const endOfDay = (date) => {
  const next = new Date(date);
  next.setHours(23, 59, 59, 999);
  return next;
};

const addDays = (date, amount) => {
  const next = new Date(date);
  next.setDate(next.getDate() + amount);
  return next;
};

const addMonths = (date, amount) => {
  const next = new Date(date);
  next.setMonth(next.getMonth() + amount);
  return next;
};

const formatDateKey = (date) => date.toISOString().slice(0, 10);

const formatDailyLabel = (date) =>
  date.toLocaleDateString('en-US', {
    day: '2-digit',
    month: 'short',
  });

const formatMonthKey = (date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

const formatMonthLabel = (date) =>
  date.toLocaleDateString('en-US', {
    month: 'short',
    year: '2-digit',
  });

const getPeriodRange = (period) => {
  const now = new Date();

  if (period === 'weekly') {
    const end = endOfDay(now);
    const start = startOfDay(addDays(now, -6));
    return { start, end };
  }

  if (period === 'yearly') {
    const end = endOfDay(now);
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const start = startOfDay(addMonths(monthStart, -11));
    return { start, end };
  }

  const end = endOfDay(now);
  const start = startOfDay(addDays(now, -29));
  return { start, end };
};

const getPreviousRange = (period, currentStart, currentEnd) => {
  if (period === 'yearly') {
    const previousEnd = endOfDay(addMonths(currentStart, -1));
    const previousStart = startOfDay(addMonths(currentStart, -12));
    return { previousStart, previousEnd };
  }

  const ms = currentEnd.getTime() - currentStart.getTime() + 1;
  const previousEnd = new Date(currentStart.getTime() - 1);
  const previousStart = new Date(previousEnd.getTime() - ms + 1);
  return {
    previousStart: startOfDay(previousStart),
    previousEnd: endOfDay(previousEnd),
  };
};

const growthRate = (current, previous) => {
  if (!previous && !current) {
    return 0;
  }
  if (!previous) {
    return 100;
  }
  return ((current - previous) / previous) * 100;
};

const normalizeGenderRows = (rows) => {
  const result = {
    male: 0,
    female: 0,
    'non-binary': 0,
    prefer_not_to_say: 0,
    unknown: 0,
  };

  for (const row of rows) {
    const key = row.gender || 'unknown';
    if (typeof result[key] !== 'number') {
      result.unknown += Number(row.count || 0);
      continue;
    }
    result[key] += Number(row.count || 0);
  }

  return result;
};

const getTrendSeries = (period, rows, start) => {
  const rowMap = new Map();
  for (const row of rows) {
    rowMap.set(String(row.period_key), row);
  }

  if (period === 'yearly') {
    const series = [];
    for (let i = 0; i < 12; i += 1) {
      const monthDate = addMonths(start, i);
      const key = formatMonthKey(monthDate);
      const row = rowMap.get(key);
      series.push({
        key,
        label: formatMonthLabel(monthDate),
        orders: Number(row?.orders || 0),
        revenue: Number(row?.revenue || 0),
      });
    }
    return series;
  }

  const totalDays = period === 'weekly' ? 7 : 30;
  const series = [];
  for (let i = 0; i < totalDays; i += 1) {
    const dayDate = addDays(start, i);
    const key = formatDateKey(dayDate);
    const row = rowMap.get(key);
    series.push({
      key,
      label: formatDailyLabel(dayDate),
      orders: Number(row?.orders || 0),
      revenue: Number(row?.revenue || 0),
    });
  }
  return series;
};

const getForecast = (trendSeries) => {
  if (!trendSeries.length) {
    return {
      nextPeriodRevenue: 0,
      method: 'moving_average',
      confidence: 'low',
    };
  }

  const recent = trendSeries.slice(-3);
  const average = recent.reduce((sum, item) => sum + Number(item.revenue || 0), 0) / recent.length;

  return {
    nextPeriodRevenue: average,
    method: 'moving_average',
    confidence: trendSeries.length >= 8 ? 'medium' : 'low',
  };
};

const getAnalyticsOverview = async (req, res, next) => {
  try {
    const period = normalizePeriod(req.query.period);
    const { start, end } = getPeriodRange(period);
    const { previousStart, previousEnd } = getPreviousRange(period, start, end);

    const [salesSummaryResult, previousSalesResult, itemsResult, stockResult, topSellingResult, leastSellingResult, genderAllResult, genderBuyerResult, purchaseHourResult, purchaseWeekdayResult, trendResult, categoryPerformanceResult, repeatCustomerResult] =
      await Promise.all([
        query(
          `SELECT
            COUNT(*) AS total_orders,
            COALESCE(SUM(total_price), 0) AS total_revenue
           FROM orders
           WHERE created_at BETWEEN $1 AND $2
             AND status <> 'cancelled'`,
          [start, end]
        ),
        query(
          `SELECT
            COUNT(*) AS total_orders,
            COALESCE(SUM(total_price), 0) AS total_revenue
           FROM orders
           WHERE created_at BETWEEN $1 AND $2
             AND status <> 'cancelled'`,
          [previousStart, previousEnd]
        ),
        query(
          `SELECT COALESCE(SUM(oi.quantity), 0) AS items_sold
           FROM order_items oi
           INNER JOIN orders o ON o.id = oi.order_id
           WHERE o.created_at BETWEEN $1 AND $2
             AND o.status <> 'cancelled'`,
          [start, end]
        ),
        query(
          `SELECT
            COUNT(*) AS total_products,
            COALESCE(SUM(stock), 0) AS total_stock_units,
            SUM(CASE WHEN stock <= 5 THEN 1 ELSE 0 END) AS low_stock_products,
            SUM(CASE WHEN stock = 0 THEN 1 ELSE 0 END) AS out_of_stock_products
           FROM products`
        ),
        query(
          `SELECT
            p.id,
            p.name,
            p.category,
            p.stock,
            COALESCE(SUM(CASE WHEN o.created_at BETWEEN $1 AND $2 AND o.status <> 'cancelled' THEN oi.quantity ELSE 0 END), 0) AS units_sold,
            COALESCE(SUM(CASE WHEN o.created_at BETWEEN $1 AND $2 AND o.status <> 'cancelled' THEN oi.quantity * oi.price ELSE 0 END), 0) AS revenue
           FROM products p
           LEFT JOIN order_items oi ON oi.product_id = p.id
           LEFT JOIN orders o ON o.id = oi.order_id
           GROUP BY p.id, p.name, p.category, p.stock
           ORDER BY units_sold DESC, revenue DESC
           LIMIT 5`,
          [start, end, start, end]
        ),
        query(
          `SELECT
            p.id,
            p.name,
            p.category,
            p.stock,
            COALESCE(SUM(CASE WHEN o.created_at BETWEEN $1 AND $2 AND o.status <> 'cancelled' THEN oi.quantity ELSE 0 END), 0) AS units_sold,
            COALESCE(SUM(CASE WHEN o.created_at BETWEEN $1 AND $2 AND o.status <> 'cancelled' THEN oi.quantity * oi.price ELSE 0 END), 0) AS revenue
           FROM products p
           LEFT JOIN order_items oi ON oi.product_id = p.id
           LEFT JOIN orders o ON o.id = oi.order_id
           GROUP BY p.id, p.name, p.category, p.stock
           ORDER BY units_sold ASC, revenue ASC
           LIMIT 5`,
          [start, end, start, end]
        ),
        query(
          `SELECT
            COALESCE(NULLIF(LOWER(gender), ''), 'unknown') AS gender,
            COUNT(*) AS count
           FROM users
           GROUP BY COALESCE(NULLIF(LOWER(gender), ''), 'unknown')`
        ),
        query(
          `SELECT
            COALESCE(NULLIF(LOWER(u.gender), ''), 'unknown') AS gender,
            COUNT(DISTINCT o.user_id) AS count
           FROM orders o
           INNER JOIN users u ON u.id = o.user_id
           WHERE o.created_at BETWEEN $1 AND $2
             AND o.status <> 'cancelled'
           GROUP BY COALESCE(NULLIF(LOWER(u.gender), ''), 'unknown')`,
          [start, end]
        ),
        query(
          `SELECT
            HOUR(created_at) AS hour,
            COUNT(*) AS orders,
            COALESCE(SUM(total_price), 0) AS revenue
           FROM orders
           WHERE created_at BETWEEN $1 AND $2
             AND status <> 'cancelled'
           GROUP BY HOUR(created_at)
           ORDER BY hour ASC`,
          [start, end]
        ),
        query(
          `SELECT
            DAYOFWEEK(created_at) AS weekday,
            COUNT(*) AS orders,
            COALESCE(SUM(total_price), 0) AS revenue
           FROM orders
           WHERE created_at BETWEEN $1 AND $2
             AND status <> 'cancelled'
           GROUP BY DAYOFWEEK(created_at)
           ORDER BY weekday ASC`,
          [start, end]
        ),
        query(
          period === 'yearly'
            ? `SELECT
                 DATE_FORMAT(created_at, '%Y-%m') AS period_key,
                 COUNT(*) AS orders,
                 COALESCE(SUM(total_price), 0) AS revenue
               FROM orders
               WHERE created_at BETWEEN $1 AND $2
                 AND status <> 'cancelled'
               GROUP BY DATE_FORMAT(created_at, '%Y-%m')
               ORDER BY period_key ASC`
            : `SELECT
                 DATE(created_at) AS period_key,
                 COUNT(*) AS orders,
                 COALESCE(SUM(total_price), 0) AS revenue
               FROM orders
               WHERE created_at BETWEEN $1 AND $2
                 AND status <> 'cancelled'
               GROUP BY DATE(created_at)
               ORDER BY period_key ASC`,
          [start, end]
        ),
        query(
          `SELECT
            COALESCE(NULLIF(p.category, ''), 'Uncategorized') AS category,
            COUNT(DISTINCT o.id) AS orders,
            COALESCE(SUM(oi.quantity), 0) AS units_sold,
            COALESCE(SUM(oi.quantity * oi.price), 0) AS revenue
           FROM order_items oi
           INNER JOIN orders o ON o.id = oi.order_id
           INNER JOIN products p ON p.id = oi.product_id
           WHERE o.created_at BETWEEN $1 AND $2
             AND o.status <> 'cancelled'
           GROUP BY COALESCE(NULLIF(p.category, ''), 'Uncategorized')
           ORDER BY revenue DESC`,
          [start, end]
        ),
        query(
          `SELECT
            SUM(CASE WHEN per_user.order_count > 1 THEN 1 ELSE 0 END) AS repeat_buyers,
            SUM(CASE WHEN per_user.order_count = 1 THEN 1 ELSE 0 END) AS one_time_buyers,
            COUNT(*) AS purchasing_users
           FROM (
            SELECT o.user_id, COUNT(*) AS order_count
            FROM orders o
            WHERE o.created_at BETWEEN $1 AND $2
              AND o.status <> 'cancelled'
            GROUP BY o.user_id
           ) per_user`,
          [start, end]
        ),
      ]);

    const salesSummary = salesSummaryResult.rows[0] || {};
    const previousSales = previousSalesResult.rows[0] || {};
    const stockSummary = stockResult.rows[0] || {};

    const totalOrders = Number(salesSummary.total_orders || 0);
    const totalRevenue = Number(salesSummary.total_revenue || 0);
    const previousOrders = Number(previousSales.total_orders || 0);
    const previousRevenue = Number(previousSales.total_revenue || 0);
    const itemsSold = Number(itemsResult.rows[0]?.items_sold || 0);
    const totalStockUnits = Number(stockSummary.total_stock_units || 0);
    const assumedCostRatio = Math.min(Math.max(Number(process.env.ANALYTICS_COGS_RATIO || 0.62), 0), 0.95);
    const estimatedCost = totalRevenue * assumedCostRatio;
    const estimatedProfit = totalRevenue - estimatedCost;
    const repeatData = repeatCustomerResult.rows[0] || {};
    const purchasingUsers = Number(repeatData.purchasing_users || 0);
    const repeatBuyers = Number(repeatData.repeat_buyers || 0);
    const oneTimeBuyers = Number(repeatData.one_time_buyers || 0);

    const orderByHour = Array.from({ length: 24 }, (_, hour) => {
      const existing = purchaseHourResult.rows.find((row) => Number(row.hour) === hour);
      return {
        hour,
        label: `${String(hour).padStart(2, '0')}:00`,
        orders: Number(existing?.orders || 0),
        revenue: Number(existing?.revenue || 0),
      };
    });

    const orderByWeekday = DAY_NAMES.map((name, index) => {
      const weekdayValue = index + 1;
      const existing = purchaseWeekdayResult.rows.find((row) => Number(row.weekday) === weekdayValue);
      return {
        day: name,
        orders: Number(existing?.orders || 0),
        revenue: Number(existing?.revenue || 0),
      };
    });

    const trendSeries = getTrendSeries(period, trendResult.rows, start);
    const forecast = getForecast(trendSeries);

    const responsePayload = {
      period,
      range: {
        start: start.toISOString(),
        end: end.toISOString(),
      },
      kpis: {
        totalOrders,
        totalRevenue,
        averageOrderValue: totalOrders > 0 ? totalRevenue / totalOrders : 0,
        itemsSold,
        orderGrowthPercent: growthRate(totalOrders, previousOrders),
        revenueGrowthPercent: growthRate(totalRevenue, previousRevenue),
        stockTurnoverRatio: totalStockUnits > 0 ? itemsSold / totalStockUnits : 0,
        estimatedCost,
        estimatedProfit,
        estimatedProfitMarginPercent: totalRevenue > 0 ? (estimatedProfit / totalRevenue) * 100 : 0,
      },
      stockHealth: {
        totalProducts: Number(stockSummary.total_products || 0),
        totalStockUnits,
        lowStockProducts: Number(stockSummary.low_stock_products || 0),
        outOfStockProducts: Number(stockSummary.out_of_stock_products || 0),
      },
      topSellingProducts: topSellingResult.rows.map((row) => ({
        id: row.id,
        name: row.name,
        category: row.category,
        stock: Number(row.stock || 0),
        unitsSold: Number(row.units_sold || 0),
        revenue: Number(row.revenue || 0),
      })),
      leastSellingProducts: leastSellingResult.rows.map((row) => ({
        id: row.id,
        name: row.name,
        category: row.category,
        stock: Number(row.stock || 0),
        unitsSold: Number(row.units_sold || 0),
        revenue: Number(row.revenue || 0),
      })),
      categoryPerformance: categoryPerformanceResult.rows.map((row) => ({
        category: row.category,
        orders: Number(row.orders || 0),
        unitsSold: Number(row.units_sold || 0),
        revenue: Number(row.revenue || 0),
      })),
      genderBreakdown: {
        allUsers: normalizeGenderRows(genderAllResult.rows),
        purchasingUsers: normalizeGenderRows(genderBuyerResult.rows),
      },
      customerInsights: {
        purchasingUsers,
        repeatBuyers,
        oneTimeBuyers,
        repeatPurchaseRatePercent: purchasingUsers > 0 ? (repeatBuyers / purchasingUsers) * 100 : 0,
      },
      purchaseTime: {
        byHour: orderByHour,
        byWeekday: orderByWeekday,
      },
      trendSeries,
      forecast,
      assumptions: {
        analyticsCogsRatio: assumedCostRatio,
      },
    };

    res.json({
      success: true,
      data: responsePayload,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAnalyticsOverview,
};
