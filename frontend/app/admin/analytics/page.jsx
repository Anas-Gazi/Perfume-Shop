'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { useAuthStore } from '@/lib/authStore';
import toast from 'react-hot-toast';

const PERIOD_OPTIONS = [
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'yearly', label: 'Yearly' },
];

const currency = (value) => `$${Number(value || 0).toFixed(2)}`;
const percent = (value) => {
  const amount = Number(value || 0);
  return `${amount > 0 ? '+' : ''}${amount.toFixed(1)}%`;
};

const maxValue = (items, key) => {
  const highest = Math.max(...items.map((item) => Number(item[key] || 0)), 0);
  return highest > 0 ? highest : 1;
};

const barGradientClass = (index) => {
  const variants = [
    'from-amber-500 to-orange-500',
    'from-blue-500 to-cyan-500',
    'from-emerald-500 to-teal-500',
    'from-rose-500 to-pink-500',
  ];
  return variants[index % variants.length];
};

const csvValue = (value) => {
  if (value === null || value === undefined) return '';
  const text = String(value).replace(/"/g, '""');
  return `"${text}"`;
};

const BarChart = ({ title, subtitle, data, valueKey, labelKey, formatValue }) => {
  const peak = useMemo(() => maxValue(data, valueKey), [data, valueKey]);

  return (
    <div className="rounded-2xl border border-white/10 bg-gradient-to-b from-slate-900 to-slate-950 p-6 text-white shadow-xl">
      <h3 className="text-lg font-semibold text-amber-200">{title}</h3>
      <p className="mb-5 text-sm text-slate-300">{subtitle}</p>
      <div className="space-y-3">
        {data.map((item, index) => {
          const value = Number(item[valueKey] || 0);
          const width = Math.max((value / peak) * 100, value > 0 ? 8 : 0);
          return (
            <div key={`${item[labelKey]}-${index}`}>
              <div className="mb-1 flex items-center justify-between text-xs text-slate-300">
                <span>{item[labelKey]}</span>
                <span>{formatValue ? formatValue(value) : value}</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-white/10">
                <div
                  className={`h-full rounded-full bg-gradient-to-r ${barGradientClass(index)} transition-all duration-500`}
                  style={{ width: `${width}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default function AdminAnalyticsPage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const hasInitialized = useAuthStore((state) => state.hasInitialized);

  const [period, setPeriod] = useState('monthly');
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState(null);

  const handleExportCsv = () => {
    if (!analytics) return;

    const rows = [];
    rows.push(['Section', 'Metric', 'Value']);
    rows.push(['KPI', 'Period', analytics.period]);
    rows.push(['KPI', 'Revenue', analytics.kpis.totalRevenue]);
    rows.push(['KPI', 'Orders', analytics.kpis.totalOrders]);
    rows.push(['KPI', 'Items Sold', analytics.kpis.itemsSold]);
    rows.push(['KPI', 'Estimated Profit', analytics.kpis.estimatedProfit]);
    rows.push(['KPI', 'Estimated Profit Margin %', analytics.kpis.estimatedProfitMarginPercent]);
    rows.push(['Customer', 'Purchasing Users', analytics.customerInsights.purchasingUsers]);
    rows.push(['Customer', 'Repeat Buyers', analytics.customerInsights.repeatBuyers]);
    rows.push(['Customer', 'Repeat Purchase Rate %', analytics.customerInsights.repeatPurchaseRatePercent]);
    rows.push(['Forecast', 'Next Period Revenue', analytics.forecast.nextPeriodRevenue]);

    for (const item of analytics.categoryPerformance || []) {
      rows.push(['Category', item.category, `${item.orders} orders | ${item.unitsSold} units | ${item.revenue} revenue`]);
    }

    const csv = rows.map((row) => row.map(csvValue).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics-${analytics.period}-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportPdf = () => {
    window.print();
  };

  useEffect(() => {
    if (!hasInitialized) {
      return;
    }

    if (user?.role !== 'admin') {
      router.push('/');
      return;
    }

    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const response = await api.get('/analytics/overview', {
          params: { period },
        });
        setAnalytics(response.data.data);
      } catch (error) {
        toast.error('Failed to load analytics');
        console.error('Analytics error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [period, user, router, hasInitialized]);

  const genderRows = useMemo(() => {
    if (!analytics?.genderBreakdown) return [];

    const displayName = {
      male: 'Male',
      female: 'Female',
      'non-binary': 'Non-binary',
      prefer_not_to_say: 'Prefer not to say',
      unknown: 'Unknown',
    };

    return Object.entries(analytics.genderBreakdown.allUsers).map(([key, value]) => ({
      gender: displayName[key] || key,
      count: Number(value || 0),
      buyers: Number(analytics.genderBreakdown.purchasingUsers[key] || 0),
    }));
  }, [analytics]);

  const peakHour = useMemo(() => {
    if (!analytics?.purchaseTime?.byHour?.length) {
      return null;
    }
    return analytics.purchaseTime.byHour.reduce((best, item) =>
      Number(item.orders || 0) > Number(best.orders || 0) ? item : best
    );
  }, [analytics]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-luxury-gold border-t-luxury-dark" />
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 text-center md:px-8">
        <p className="text-xl text-gray-600">No analytics data available</p>
      </div>
    );
  }

  const hourSnapshot = analytics.purchaseTime.byHour.filter((item) => Number(item.orders) > 0).slice(0, 8);
  const trendSnapshot = analytics.trendSeries;

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_right,_#fde68a_0,_#f8f5ef_45%,_#efe8dc_100%)]">
      <div className="mx-auto max-w-7xl px-4 py-10 md:px-8">
        <div className="mb-8 rounded-3xl border border-amber-200/70 bg-white/75 p-6 shadow-lg backdrop-blur">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="mb-2 inline-flex rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-amber-900">
                Admin Intelligence Hub
              </p>
              <h1 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">Premium Analytics</h1>
              <p className="mt-2 text-sm text-slate-600 sm:text-base">
                Monitor sales flow, stock pressure, customer demographics, and buying patterns.
              </p>
            </div>

            <div className="flex w-full flex-col gap-2 md:w-auto">
              <div className="inline-flex w-full gap-2 rounded-xl border border-slate-200 bg-white p-1 md:w-auto">
                {PERIOD_OPTIONS.map((item) => (
                  <button
                    key={item.value}
                    onClick={() => setPeriod(item.value)}
                    className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
                      period === item.value ? 'bg-slate-900 text-white shadow' : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
              <div className="inline-flex gap-2">
                <button onClick={handleExportCsv} className="btn-luxury-outline px-3 py-2 text-xs">
                  Export CSV
                </button>
                <button onClick={handleExportPdf} className="btn-luxury px-3 py-2 text-xs">
                  Export PDF
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 p-5 text-white shadow-lg">
            <p className="text-xs uppercase tracking-wide text-slate-300">Revenue</p>
            <p className="mt-2 text-3xl font-bold">{currency(analytics.kpis.totalRevenue)}</p>
            <p className="mt-2 text-sm text-emerald-300">{percent(analytics.kpis.revenueGrowthPercent)} vs prev</p>
          </div>

          <div className="rounded-2xl bg-gradient-to-br from-amber-600 to-orange-600 p-5 text-white shadow-lg">
            <p className="text-xs uppercase tracking-wide text-amber-100">Orders</p>
            <p className="mt-2 text-3xl font-bold">{analytics.kpis.totalOrders}</p>
            <p className="mt-2 text-sm text-amber-100">{percent(analytics.kpis.orderGrowthPercent)} vs prev</p>
          </div>

          <div className="rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 p-5 text-white shadow-lg">
            <p className="text-xs uppercase tracking-wide text-emerald-100">Items Sold</p>
            <p className="mt-2 text-3xl font-bold">{analytics.kpis.itemsSold}</p>
            <p className="mt-2 text-sm text-emerald-100">AOV: {currency(analytics.kpis.averageOrderValue)}</p>
          </div>

          <div className="rounded-2xl bg-gradient-to-br from-violet-700 to-indigo-800 p-5 text-white shadow-lg">
            <p className="text-xs uppercase tracking-wide text-violet-200">Stock Turnover</p>
            <p className="mt-2 text-3xl font-bold">{Number(analytics.kpis.stockTurnoverRatio || 0).toFixed(2)}x</p>
            <p className="mt-2 text-sm text-violet-200">Low stock: {analytics.stockHealth.lowStockProducts}</p>
          </div>
        </div>

        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl border border-emerald-200 bg-white p-5 shadow-md">
            <p className="text-xs uppercase tracking-wide text-slate-500">Estimated Profit</p>
            <p className="mt-2 text-2xl font-bold text-emerald-700">{currency(analytics.kpis.estimatedProfit)}</p>
            <p className="mt-2 text-xs text-slate-500">Based on configurable COGS assumption</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-md">
            <p className="text-xs uppercase tracking-wide text-slate-500">Profit Margin</p>
            <p className="mt-2 text-2xl font-bold text-slate-800">{percent(analytics.kpis.estimatedProfitMarginPercent)}</p>
            <p className="mt-2 text-xs text-slate-500">COGS ratio: {Number(analytics.assumptions.analyticsCogsRatio || 0).toFixed(2)}</p>
          </div>
          <div className="rounded-2xl border border-blue-200 bg-white p-5 shadow-md">
            <p className="text-xs uppercase tracking-wide text-slate-500">Repeat Buyers</p>
            <p className="mt-2 text-2xl font-bold text-blue-700">{analytics.customerInsights.repeatBuyers}</p>
            <p className="mt-2 text-xs text-slate-500">
              Rate: {percent(analytics.customerInsights.repeatPurchaseRatePercent)} | One-time: {analytics.customerInsights.oneTimeBuyers}
            </p>
          </div>
          <div className="rounded-2xl border border-amber-200 bg-white p-5 shadow-md">
            <p className="text-xs uppercase tracking-wide text-slate-500">Next Period Forecast</p>
            <p className="mt-2 text-2xl font-bold text-amber-700">{currency(analytics.forecast.nextPeriodRevenue)}</p>
            <p className="mt-2 text-xs text-slate-500">Method: {analytics.forecast.method}</p>
          </div>
        </div>

        <div className="mb-8 grid grid-cols-1 gap-6 xl:grid-cols-2">
          <BarChart
            title="Revenue Trend"
            subtitle="Performance over selected period"
            data={trendSnapshot}
            valueKey="revenue"
            labelKey="label"
            formatValue={(value) => currency(value)}
          />

          <BarChart
            title="Order Activity by Time"
            subtitle={peakHour ? `Peak hour: ${peakHour.label} (${peakHour.orders} orders)` : 'No orders yet in this period'}
            data={hourSnapshot.length ? hourSnapshot : analytics.purchaseTime.byHour.slice(0, 8)}
            valueKey="orders"
            labelKey="label"
          />
        </div>

        <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-md">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900">Category Performance</h2>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">Revenue Ranked</span>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-[640px] w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-700">
                <tr>
                  <th className="px-3 py-2">Category</th>
                  <th className="px-3 py-2">Orders</th>
                  <th className="px-3 py-2">Units Sold</th>
                  <th className="px-3 py-2">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {(analytics.categoryPerformance || []).map((item) => (
                  <tr key={item.category} className="border-t border-slate-200">
                    <td className="px-3 py-2 font-medium text-slate-800">{item.category}</td>
                    <td className="px-3 py-2 text-slate-700">{item.orders}</td>
                    <td className="px-3 py-2 text-slate-700">{item.unitsSold}</td>
                    <td className="px-3 py-2 font-semibold text-slate-900">{currency(item.revenue)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mb-8 grid grid-cols-1 gap-6 xl:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-md">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">Most Selling Products</h2>
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">Top 5</span>
            </div>
            <div className="space-y-3">
              {analytics.topSellingProducts.map((item) => (
                <div key={item.id} className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-3">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold text-slate-800">{item.name}</p>
                      <p className="text-xs text-slate-500">{item.category || 'Uncategorized'}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-emerald-700">{item.unitsSold} sold</p>
                      <p className="text-xs text-slate-500">{currency(item.revenue)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-md">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">Less Selling Products</h2>
              <span className="rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-700">Needs Action</span>
            </div>
            <div className="space-y-3">
              {analytics.leastSellingProducts.map((item) => (
                <div key={item.id} className="rounded-xl border border-rose-100 bg-rose-50/50 p-3">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold text-slate-800">{item.name}</p>
                      <p className="text-xs text-slate-500">Stock: {item.stock}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-rose-700">{item.unitsSold} sold</p>
                      <p className="text-xs text-slate-500">{currency(item.revenue)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-md">
            <h2 className="mb-4 text-xl font-bold text-slate-900">User Gender Analytics</h2>
            <div className="overflow-hidden rounded-xl border border-slate-200">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-700">
                  <tr>
                    <th className="px-4 py-3">Gender</th>
                    <th className="px-4 py-3">Total Users</th>
                    <th className="px-4 py-3">Purchasing Users</th>
                  </tr>
                </thead>
                <tbody>
                  {genderRows.map((row) => (
                    <tr key={row.gender} className="border-t border-slate-200">
                      <td className="px-4 py-3 font-medium text-slate-800">{row.gender}</td>
                      <td className="px-4 py-3 text-slate-700">{row.count}</td>
                      <td className="px-4 py-3 text-slate-700">{row.buyers}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-md">
            <h2 className="mb-4 text-xl font-bold text-slate-900">Purchase Day Heat</h2>
            <div className="space-y-3">
              {analytics.purchaseTime.byWeekday.map((item, index) => {
                const maxOrders = maxValue(analytics.purchaseTime.byWeekday, 'orders');
                const width = Math.max((Number(item.orders || 0) / maxOrders) * 100, Number(item.orders || 0) > 0 ? 10 : 0);
                return (
                  <div key={item.day}>
                    <div className="mb-1 flex items-center justify-between text-xs text-slate-600">
                      <span>{item.day}</span>
                      <span>
                        {item.orders} orders • {currency(item.revenue)}
                      </span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className={`h-full rounded-full bg-gradient-to-r ${barGradientClass(index)}`}
                        style={{ width: `${width}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3 rounded-xl bg-slate-50 p-4 text-sm">
              <div>
                <p className="text-slate-500">Products</p>
                <p className="font-semibold text-slate-800">{analytics.stockHealth.totalProducts}</p>
              </div>
              <div>
                <p className="text-slate-500">Total Stock Units</p>
                <p className="font-semibold text-slate-800">{analytics.stockHealth.totalStockUnits}</p>
              </div>
              <div>
                <p className="text-slate-500">Low Stock Products</p>
                <p className="font-semibold text-amber-700">{analytics.stockHealth.lowStockProducts}</p>
              </div>
              <div>
                <p className="text-slate-500">Out of Stock</p>
                <p className="font-semibold text-rose-700">{analytics.stockHealth.outOfStockProducts}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
