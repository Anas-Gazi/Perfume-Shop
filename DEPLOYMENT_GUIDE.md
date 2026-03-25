# Installation & Deployment Guide

## Prerequisites

- Node.js 18+ (Download from https://nodejs.org/)
- MySQL 8.0+ (Download from https://dev.mysql.com/downloads/mysql/)
- Git (Download from https://git-scm.com/)
- Cloudinary Account (Sign up at https://cloudinary.com/)
- Email account (Gmail or other SMTP provider)

## Step-by-Step Installation

### 1. Clone & Setup Project

```bash
# Navigate to your desired directory
cd /your/desired/path

# Clone the project (you should have the files ready)
# Or if in existing directory:
cd website
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env
```

**Configure .env file:**

```env
# MySQL Settings
DB_HOST=localhost
DB_PORT=3306
DB_NAME=perfume_ecommerce
DB_USER=root
DB_PASSWORD=your_mysql_password

# JWT Configuration
JWT_SECRET=change_this_to_a_very_long_random_string_at_least_32_characters
JWT_EXPIRE=7d

# Email Configuration (Gmail example)
EMAIL_SERVICE=gmail
EMAIL_USER=your.email@gmail.com
EMAIL_PASSWORD=your_app_specific_password

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Server Settings
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

#### Setting Up Gmail for Email

1. Go to https://myaccount.google.com/apppasswords
2. Select Mail and Windows/Linux (or your OS)
3. Generate an app password
4. Copy this password to `EMAIL_PASSWORD` in .env

#### Setting Up Cloudinary

1. Sign up at https://cloudinary.com/
2. Go to your Dashboard
3. Copy Cloud Name, API Key, and API Secret to .env

#### Setting Up MySQL

**On Windows (PowerShell):**
```powershell
# Start MySQL service
Start-Service -Name MySQL80

# Connect to MySQL
mysql -u root -p

# In MySQL console:
CREATE DATABASE perfume_ecommerce;
EXIT;
```

**On macOS (via Homebrew):**
```bash
# Start MySQL
brew services start mysql

# Create database
mysql -u root -p
# Then in MySQL: CREATE DATABASE perfume_ecommerce;
```

**On Linux:**
```bash
# Start MySQL service
sudo systemctl start mysql

# Create database
mysql -u root -p
# Then in MySQL: CREATE DATABASE perfume_ecommerce;
```

### 3. Start Backend Server

```bash
# From backend directory
npm run dev

# Should output:
# ✓ Server running on https://perfume-backend-rgvf.onrender.com
# ✓ Database tables initialized successfully
```

### 4. Frontend Setup

**In a new terminal, navigate to frontend:**

```bash
cd frontend

# Install dependencies
npm install

# Create .env.local file
echo "NEXT_PUBLIC_API_URL=https://perfume-backend-rgvf.onrender.com" > .env.local
```

### 5. Start Frontend Server

```bash
# From frontend directory
npm run dev

# Should output:
# ▲ Next.js ...
# - Local: http://localhost:3000
```

## 🧪 Testing the Application

### Create Test Data

1. **Go to registration page** - http://localhost:3000/register
   - Create a test user account

2. **Create admin account** (manual DB update):
   
   ```bash
   # In your MySQL terminal or client:
   mysql -u root -p perfume_ecommerce
   
   # Update a user to admin:
   UPDATE users SET role = 'admin' WHERE id = 1;
   EXIT;
   ```

3. **Login to admin dashboard**:
   - Login with your admin account
   - Visit http://localhost:3000/admin
   - Create test products

4. **Test shopping flow**:
   - Go to /products
   - Add items to cart
   - Proceed to checkout
   - Verify order is created

## 🚀 Production Deployment

### Frontend Deployment (Vercel)

```bash
# 1. Push to GitHub
git add .
git commit -m "Initial commit"
git push origin main

# 2. Visit https://vercel.com
# 3. Click "New Project"
# 4. Import your GitHub repository
# 5. Configure environment variables:
#    - NEXT_PUBLIC_API_URL=your_backend_url
# 6. Deploy

# 7. Update backend CORS:
#    FRONTEND_URL=your_vercel_url
```

### Backend Deployment (Render)

```bash
# 1. Push backend to GitHub in a separate repo
cd backend
git init
git add .
git commit -m "Initial commit"
git push origin main

# 2. Visit https://render.com
# 3. New > Web Service
# 4. Connect GitHub repository
# 5. Configure:
#    - Build Command: npm install
#    - Start Command: npm start
# 6. Add Environment Variables:
#    - DB_HOST (MySQL host)
#    - DB_NAME
#    - DB_USER
#    - DB_PASSWORD
#    - JWT_SECRET
#    - CLOUDINARY_* keys
#    - EMAIL_* settings
#    - FRONTEND_URL (your Vercel URL)
# 7. Deploy
```

### Upgrade MySQL to Cloud

For production, use:
- **AWS RDS MySQL** (https://aws.amazon.com/rds/)
- **Google Cloud SQL MySQL** (https://cloud.google.com/sql)
- **Azure Database for MySQL** (https://azure.microsoft.com/en-us/services/mysql/)
- **DigitalOcean Managed MySQL** (https://www.digitalocean.com/)

Update DB_HOST, DB_USER, DB_PASSWORD in production .env

## 📋 Environment Configuration Checklist

- [ ] Backend .env created and configured
- [ ] MySQL database created
- [ ] Cloudinary account configured
- [ ] Gmail/Email account configured and app password created
- [ ] JWT_SECRET is strong and unique
- [ ] Frontend .env.local created
- [ ] Both servers running on correct ports
- [ ] Can access http://localhost:3000 (frontend)
- [ ] Can access https://perfume-backend-rgvf.onrender.com/health (backend)

## 🐛 Troubleshooting

### Backend won't start

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Database connection error

```bash
# Verify MySQL is running
# Test connection
mysql -u root -p -h localhost perfume_ecommerce

# If connection denied, check credentials in .env
```

### Images not uploading

- Verify Cloudinary credentials in .env
- Check file size limits (max 5MB)
- Ensure only JPEG, PNG, WebP files

### Email not sending

- Verify Gmail app password (not regular password)
- Enable "Less secure app access" if needed
- Check EMAIL_USER and EMAIL_PASSWORD

### Frontend can't connect to backend

- Verify backend is running on port 5000
- Check NEXT_PUBLIC_API_URL in frontend .env
- Check CORS settings in backend/src/app.js

## 📊 Database Backup

```bash
# Backup
mysqldump -u root -p perfume_ecommerce > backup.sql

# Restore
mysql -u root -p perfume_ecommerce < backup.sql
```

## 🔐 Security Checklist

- [ ] Change JWT_SECRET to random value
- [ ] Change DB_PASSWORD to strong password
- [ ] Enable HTTPS in production
- [ ] Set NODE_ENV=production in backend
- [ ] Store sensitive data in environment variables only
- [ ] Never commit .env files to Git
- [ ] Use strong admin passwords
- [ ] Enable CORS only for trusted domains

## 📞 Getting Help

- Check POSTMAN_API_GUIDE.md for API documentation
- Review README.md for project structure
- Check backend console for error messages
- Check browser DevTools for frontend errors

---

**Happy deploying! 🚀**
