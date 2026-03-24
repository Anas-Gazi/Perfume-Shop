# Perfume E-Commerce Platform

A production-ready, full-stack perfume e-commerce website built with modern technologies and clean architecture.

## 🎯 Features

### Authentication & Security
- User registration and login with JWT
- Role-based access control (User/Admin)
- Secure password hashing with bcrypt
- Protected routes and endpoints

### Product Management
- Full CRUD operations for products
- Product categorization and filtering
- Image uploads to Cloudinary
- Multiple images per product
- Fragrance type classification

### Shopping Experience
- Product listing with advanced filters
- Product detail pages
- Shopping cart with persistent storage
- Checkout process
- Order management

### Admin Dashboard
- Dashboard overview with statistics
- Product management interface
- Order management and status updates
- User management
- Order history and tracking

### Email Integration
- Order confirmation emails
- User notifications

## 📚 Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Form Validation**: React Hook Form + Zod
- **HTTP Client**: Axios
- **Notifications**: react-hot-toast

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MySQL
- **Authentication**: JWT
- **Password Hashing**: bcrypt
- **File Upload**: Multer + Cloudinary
- **Validation**: Zod
- **Email**: Nodemailer

### DevOps & Tools
- **Linting**: ESLint
- **Formatting**: Prettier
- **Package Manager**: npm
- **Version Control**: Git

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- MySQL 8.0+
- Cloudinary account (for image uploads)

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file from `.env.example`:
```bash
cp .env.example .env
```

4. Configure environment variables:
```env
# Database
DB_HOST=localhost
DB_PORT=3306
DB_NAME=perfume_ecommerce
DB_USER=root
DB_PASSWORD=your_password

# JWT
JWT_SECRET=your_ultra_secret_jwt_key
JWT_EXPIRE=7d

# Email (Gmail)
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Server
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

5. Create MySQL database:
```bash
mysql -u root -p
CREATE DATABASE perfume_ecommerce;
```

6. Start the backend:
```bash
npm run dev
```

Backend runs on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env.local` file:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

4. Start the development server:
```bash
npm run dev
```

Frontend runs on `http://localhost:3000`

## 📁 Project Structure

```
root/
├── backend/
│   ├── src/
│   │   ├── config/          # Database configuration
│   │   ├── controllers/     # Business logic
│   │   ├── middleware/      # Custom middleware
│   │   ├── models/          # Database models (query functions)
│   │   ├── routes/          # API routes
│   │   ├── utils/           # Helper functions & validation
│   │   ├── app.js          # Express app setup
│   │   └── server.js       # Server entry point
│   ├── uploads/            # Temporary file storage
│   ├── package.json
│   ├── .env.example
│   └── .gitignore
│
├── frontend/
│   ├── app/                # Next.js app directory
│   │   ├── (pages)         # Route pages
│   │   ├── admin/          # Admin pages
│   │   ├── layout.jsx      # Root layout
│   │   └── globals.css     # Global styles
│   ├── components/         # Reusable components
│   ├── lib/               # Utilities & stores
│   │   ├── api.js         # Axios configuration
│   │   ├── authStore.js   # Zustand auth store
│   │   ├── cartStore.js   # Zustand cart store
│   │   ├── productStore.js # Zustand product store
│   │   └── validation.js   # Zod schemas
│   ├── public/            # Static assets
│   ├── package.json
│   ├── next.config.js
│   ├── tailwind.config.js
│   └── .env.example
│
└── README.md
```

## 📊 Database Schema

### Users Table
```sql
- id (Primary Key)
- name (String)
- email (String, Unique)
- password (String, Hashed)
- role (enum: 'user', 'admin')
- created_at (Timestamp)
- updated_at (Timestamp)
```

### Products Table
```sql
- id (Primary Key)
- name (String)
- price (Decimal)
- description (Text)
- category (String)
- fragrance_type (String)
- stock (Integer)
- created_at (Timestamp)
- updated_at (Timestamp)
```

### Product Images Table
```sql
- id (Primary Key)
- product_id (Foreign Key)
- image_url (String)
- created_at (Timestamp)
```

### Orders Table
```sql
- id (Primary Key)
- user_id (Foreign Key)
- total_price (Decimal)
- status (enum: 'pending', 'processing', 'shipped', 'delivered', 'cancelled')
- shipping_address (Text)
- created_at (Timestamp)
- updated_at (Timestamp)
```

### Order Items Table
```sql
- id (Primary Key)
- order_id (Foreign Key)
- product_id (Foreign Key)
- quantity (Integer)
- price (Decimal)
- created_at (Timestamp)
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user (Protected)

### Products
- `GET /api/products` - Get all products with filters
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (Admin)
- `PUT /api/products/:id` - Update product (Admin)
- `DELETE /api/products/:id` - Delete product (Admin)

### Orders
- `POST /api/orders` - Place order (Protected)
- `GET /api/orders/user/orders` - Get user's orders (Protected)
- `GET /api/orders/:id` - Get order details (Protected)
- `GET /api/orders` - Get all orders (Admin)
- `PUT /api/orders/:id/status` - Update order status (Admin)

### Users
- `GET /api/users` - Get all users (Admin)
- `GET /api/users/:id` - Get user details (Admin)
- `GET /api/users/stats` - Get statistics (Admin)

## 🔑 Authentication Flow

1. User registers or logs in
2. Backend validates credentials and returns JWT token
3. Token stored in localStorage
4. Token included in Authorization header for protected routes
5. Backend validates token on each protected request

## 🛒 Cart Persistence

Cart data is persisted using Zustand with localStorage middleware, so users don't lose their cart on page refresh.

## 📸 Image Upload

1. User selects images from admin dashboard
2. Images uploaded to temporary storage via Multer
3. Images transferred to Cloudinary
4. Cloudinary URLs stored in database
5. Local files deleted after successful upload

## 🚢 Deployment

### Frontend (Vercel)
```bash
npm run build
npm start
```

### Backend (Render/Railway)
1. Push code to GitHub
2. Connect repository to Render/Railway
3. Set environment variables
4. Deploy

## 📝 Scripts

### Backend
```bash
npm run dev      # Start development server
npm run start    # Start production server
npm run lint     # Run ESLint
npm run format   # Format code with Prettier
```

### Frontend
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm start        # Start production server
npm run lint     # Run ESLint
npm run format   # Format code with Prettier
```

## 🔒 Security Features

- JWT token-based authentication
- bcrypt password hashing (10 salt rounds)
- Input validation with Zod
- CORS protection
- Helmet for HTTP headers
- Role-based access control
- Protected admin routes

## 📧 Email Setup

### Gmail Configuration
1. Enable 2-factor authentication on Gmail account
2. Generate app-specific password
3. Use app password in `.env` file

## 🤝 Contributing

This is a demonstration project. Feel free to fork and modify for your needs.

## 📄 License

MIT License - feel free to use this project as a template.

## 🆘 Support

For issues and questions, please refer to the documentation or create an issue in the repository.

---

**Built with ❤️** - Production-ready perfume e-commerce platform
