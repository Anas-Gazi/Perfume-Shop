# Perfume E-Commerce Platform

Production-ready full-stack e-commerce application for perfumes.

This guide is written for beginners, but follows professional workflows used in real projects.

## 1. What You Built

You now have:
- Frontend: Next.js app for user and admin interfaces
- Backend: Express API for auth, products, orders, users
- Database: MySQL for persistent data
- Auth: JWT login system with role-based access (user/admin)
- Optional integrations: Cloudinary (images), Email (order confirmations)

## 2. Project Architecture

- frontend: UI and page routes
- backend: API and business logic
- MySQL: users, products, orders, order_items, product_images

Request flow:
1. Browser opens frontend route
2. Frontend calls backend API through Axios
3. Backend validates data and token
4. Backend reads/writes MySQL
5. API response returns to frontend

## 3. Prerequisites

Install these first:
- Node.js 18+
- npm (comes with Node.js)
- MySQL 8+
- Git (recommended)

Optional for full features:
- Cloudinary account (image hosting)
- Gmail app password or SMTP provider (email)

Check installed versions:

```bash
node --version
npm --version
mysql --version
```

## 4. Folder Structure

```text
website/
  backend/
    src/
      app.js
      server.js
      config/
      controllers/
      middleware/
      routes/
      utils/
  frontend/
    app/
    components/
    lib/
  README.md
  QUICK_START.md
  DEPLOYMENT_GUIDE.md
```

## 5. First-Time Setup (Local)

Open two terminals from project root.

### Terminal A: Backend

```bash
cd backend
npm install
cp .env.example .env
```

Update backend .env values:

```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=perfume_ecommerce
DB_USER=root
DB_PASSWORD=your_mysql_password
JWT_SECRET=replace_with_a_long_random_secret
JWT_EXPIRE=7d
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

Create database:

```sql
mysql -u root -p
CREATE DATABASE perfume_ecommerce;
EXIT;
```

Start backend:

```bash
npm run dev
```

Expected:
- server listening on port 5000
- database initialization success

### Terminal B: Frontend

```bash
cd frontend
npm install
```

Create frontend env file:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

Start frontend:

```bash
npm run dev
```

Expected:
- app available at http://localhost:3000

## 6. Health and Verification Checklist

Check backend endpoints in browser:
- http://localhost:5000/health
- http://localhost:5000/api
- http://localhost:5000/api/products

Check frontend routes:
- http://localhost:3000
- http://localhost:3000/products
- http://localhost:3000/login
- http://localhost:3000/register
- http://localhost:3000/cart
- http://localhost:3000/checkout
- http://localhost:3000/admin

If these open, your app is wired correctly.

## 7. How To Use The App End-to-End

### User flow
1. Register a new account
2. Login
3. Browse products
4. Add to cart
5. Checkout to create an order

### Admin flow
1. Promote your account to admin in MySQL
2. Login again
3. Open admin dashboard
4. Create products
5. View users and orders

Promote user to admin:

```sql
mysql -u root -p perfume_ecommerce
UPDATE users SET role = 'admin' WHERE email = 'your_email@example.com';
EXIT;
```

Important: logout and login again after role update so token refreshes.

## 8. Where You Can See Data

### In the application UI
- Products: admin products page
- Orders: admin orders page
- Users: admin users page

### In database directly
Use MySQL Workbench or terminal:

```sql
mysql -u root -p perfume_ecommerce
SHOW TABLES;
SELECT * FROM users;
SELECT * FROM products;
SELECT * FROM orders;
SELECT * FROM order_items;
EXIT;
```

## 9. Useful API Endpoints

Auth:
- POST /api/auth/register
- POST /api/auth/login
- GET /api/auth/me

Products:
- GET /api/products
- GET /api/products/:id
- POST /api/products (admin)
- PUT /api/products/:id (admin)
- DELETE /api/products/:id (admin)

Orders:
- POST /api/orders
- GET /api/orders/user/orders
- GET /api/orders/:id
- GET /api/orders (admin)
- PUT /api/orders/:id/status (admin)

Users:
- GET /api/users (admin)
- GET /api/users/:id (admin)
- GET /api/users/stats (admin)

## 10. Command Reference (Everything)

### Backend commands

```bash
cd backend
npm install
npm run dev
npm start
npm run lint
npm run format
```

### Frontend commands

```bash
cd frontend
npm install
npm run dev
npm run build
npm start
npm run lint
npm run format
```

### Database commands

```sql
mysql -u root -p
SHOW DATABASES;
USE perfume_ecommerce;
SHOW TABLES;
DESCRIBE users;
SELECT * FROM users;
EXIT;
```

### Port/process checks (Windows)

```powershell
netstat -ano | findstr :3000
netstat -ano | findstr :5000
taskkill /PID <PID_NUMBER> /F
```

## 11. Beginner Problems You Will Face (And Fixes)

### Problem 1: Frontend opens but other pages look broken
Cause:
- Backend not running
- API URL wrong

Fix:
- Start backend
- Verify frontend env: NEXT_PUBLIC_API_URL=http://localhost:5000
- Open http://localhost:5000/health

### Problem 2: Port already in use
Cause:
- old node process still running

Fix:
- find PID with netstat
- kill with taskkill
- restart server

### Problem 3: Access denied for MySQL user root
Cause:
- wrong DB password in backend .env

Fix:
- update DB_PASSWORD
- test with mysql -u root -p
- restart backend

### Problem 4: You cannot access admin pages fully
Cause:
- account still role=user
- old JWT token still in browser

Fix:
- update role in DB
- logout and login again

### Problem 5: Products do not show images
Cause:
- Cloudinary keys missing

Fix:
- add CLOUDINARY credentials in backend .env
- restart backend

### Problem 6: Order email not sent
Cause:
- email credentials missing/invalid

Fix:
- configure EMAIL_USER and EMAIL_PASSWORD
- use Gmail app password, not normal password

### Problem 7: Route not found at /api
Fix:
- use /api endpoint list or /api/products directly
- verify backend has latest code and restarted

## 12. Debugging Like a Professional

Use this quick procedure:
1. Check browser console errors
2. Check browser network tab (API status codes)
3. Check backend terminal logs
4. Check database table data
5. Verify env files
6. Restart both servers after env changes

Status code meaning:
- 200: success
- 201: created
- 400: bad request (validation)
- 401: not authenticated
- 403: no permission
- 404: route/resource missing
- 500: server error

## 13. Security and Best Practices

- Never commit .env files
- Use strong JWT secret
- Use strong DB password
- Do not expose admin token
- Validate all user input
- Use HTTPS in production
- Keep dependencies updated

## 14. Free Hosting Options

Recommended beginner-friendly stack:
- Frontend: Vercel (free)
- Backend: Render (free web service)
- Database: MySQL provider (Railway trial / PlanetScale / Aiven / other free-tier options)

Important free-tier note:
- Some services sleep when idle, first request may be slow

### Deploy order
1. Deploy database and get credentials
2. Deploy backend and set env vars
3. Deploy frontend and set NEXT_PUBLIC_API_URL to backend URL
4. Re-test login, product, order flow

## 15. Required Production Environment Variables

Backend:
- DB_HOST
- DB_PORT
- DB_NAME
- DB_USER
- DB_PASSWORD
- JWT_SECRET
- JWT_EXPIRE
- FRONTEND_URL
- CLOUDINARY_CLOUD_NAME (optional if no image upload)
- CLOUDINARY_API_KEY (optional)
- CLOUDINARY_API_SECRET (optional)
- EMAIL_SERVICE (optional)
- EMAIL_USER (optional)
- EMAIL_PASSWORD (optional)

Frontend:
- NEXT_PUBLIC_API_URL

## 16. Quick Professional QA Checklist Before Going Live

- Can register and login
- Can logout and login again
- Can create product as admin
- Can add to cart and checkout
- Order appears in orders table
- Admin can update order status
- No console errors on key pages
- Backend health endpoint returns success
- CORS allows your frontend domain only

## 17. Optional Next Improvements

- Add Swagger API docs
- Add automated tests (backend + frontend)
- Add payment gateway
- Add CI pipeline
- Add server-side logging/monitoring

---

If you are new, do this today in order:
1. Run local setup
2. Create one user
3. Promote to admin
4. Add one product
5. Place one test order
6. Verify data in MySQL
7. Deploy frontend and backend

That sequence will make you understand the whole system quickly and practically.
