# 🚀 Quick Start Guide

Get the perfume e-commerce site running in 5 minutes!

## Prerequisites Check

```bash
# Check Node.js installed
node --version  # Should be v18+

# Check npm installed
npm --version

# Check MySQL installed
mysql --version
```

## Fast Setup (5 minutes)

### Terminal 1: Backend

```bash
cd backend

# Install & setup
npm install
cp .env.example .env

# Edit .env quickly:
# - Change DB_PASSWORD to your mysql password
# - Add temporary JWT_SECRET: jwt_test_secret_12345
# - Leave other fields for now

# Start
npm run dev
```

**Wait for:** `✓ Server running on http://localhost:5000`

### Terminal 2: Frontend

```bash
cd frontend

# Install & setup
npm install
echo "NEXT_PUBLIC_API_URL=http://localhost:5000" > .env.local

# Start
npm run dev
```

**Wait for:** `- Local: http://localhost:3000`

## Access the App

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api
- **Health Check**: http://localhost:5000/health

## Quick Test

1. Visit http://localhost:3000
2. Click "Register"
3. Create an account
4. Browse products (empty initially)
5. Visit Admin dashboard

## First Admin

Make yourself admin via database:

**PowerShell/Terminal:**
```bash
mysql -u root -p perfume_ecommerce
UPDATE users SET role = 'admin' WHERE email = 'your_email@example.com';
EXIT;
```

Then:
1. Logout & login again
2. Visit /admin
3. Create your first product

## Create Test Product

In Admin > Products:
- Name: "Dior Sauvage"
- Price: 99.99
- Category: Men
- Fragrance Type: Woody
- Stock: 50
- Upload sample images (optional)

## Commands Reference

```bash
# Backend
cd backend
npm run dev      # Development
npm run lint     # Check errors
npm run format   # Auto-format code

# Frontend
cd frontend  
npm run dev      # Development
npm run build    # Production build
npm run lint     # Check errors
npm run format   # Auto-format code
```

## File Structure Reminder

```
website/
├── backend/          ← Express API
│   └── src/
│       ├── controllers/   (Business logic)
│       ├── routes/        (API endpoints)
│       └── middleware/    (Auth, errors)
├── frontend/         ← Next.js App
│   ├── app/          (Pages)
│   ├── components/   (Reusable components)
│   └── lib/          (Stores, API setup)
├── README.md         ← Full documentation
└── DEPLOYMENT_GUIDE.md  ← Production setup
```

## Database

MySQL tables auto-created on first run:
- users
- products  
- product_images
- orders
- order_items

## Environment Variables

### Backend (.env)
```
DB_HOST=localhost
DB_PORT=3306
DB_NAME=perfume_ecommerce
DB_USER=root
DB_PASSWORD=your_mysql_password
JWT_SECRET=any_random_string_for_local_testing
PORT=5000
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:5000
```

## Key Features Ready to Use

✅ User registration & login
✅ Product listings & filtering
✅ Shopping cart (persisted)
✅ Checkout & orders
✅ Admin dashboard
✅ Product management (Admin)
✅ Order management (Admin)
✅ User management (Admin)

## Email & Image Upload

For real functionality:
1. Cloudinary: Sign up, add keys to backend .env
2. Gmail: Create app password, add to backend .env

For development: Just skip these - functionality works without them

## Common Issues

**Port 5000 already in use:**
```bash
# Windows
netstat -ano | findstr :5000

# Mac/Linux
lsof -i :5000
```

**Can't connect to database:**
```bash
# Check MySQL running
mysql -u root -p

# Create database if missing
CREATE DATABASE perfume_ecommerce;
```

**Styles not loading:**
- Clear Next.js cache: `rm -rf .next`
- Restart: `npm run dev`

## Next Steps

1. Read [README.md](./README.md) for full documentation
2. Check [POSTMAN_API_GUIDE.md](./POSTMAN_API_GUIDE.md) for API details
3. See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for production setup

## Architecture Overview

```
┌─────────────────────────────────────────┐
│           Frontend (Next.js)            │
│  (User Interface, Cart, Checkout)       │
└──────────────────┬──────────────────────┘
                   │ HTTP/REST API (Axios)
                   ▼
┌─────────────────────────────────────────┐
│         Backend (Express + Node)        │
│  (Business Logic, Authentication)       │
└──────────────────┬──────────────────────┘
                   │ SQL Queries
                   ▼
            ┌──────────────┐
            │    MySQL     │
            │   Database   │
            └──────────────┘
                   
            ┌──────────────┐
            │ Cloudinary   │ (Images)
            │    (CDN)     │
            └──────────────┘
```

## Performance Tips

- Use browser DevTools (F12) to debug
- Check Network tab for API calls
- Check Console for errors
- Use Redux DevTools for state debugging

## Security Notes

- Passwords hashed with bcrypt
- JWT tokens expire after 7 days
- Admin routes protected
- Input validated with Zod
- CORS configured for local development

---

**You're all set! Happy coding! 🎉**

Start building and customizing this platform for your needs.
