# Directory Structure & File Navigation

## 📂 Complete Project Tree

```
website/
├── 📄 README.md                     ← Start here! Full documentation
├── 📄 QUICK_START.md                ← 5-minute setup guide  
├── 📄 DEPLOYMENT_GUIDE.md           ← Production deployment
├── 📄 POSTMAN_API_GUIDE.md          ← API endpoint reference
├── 📄 PROJECT_SUMMARY.md            ← What was built
├── 📄 .gitignore                    ← Git configuration
│
├── 📁 backend/                      ← Node.js + Express API
│   ├── 📄 package.json              ← Dependencies: express, pg, bcryptjs, jwt, etc.
│   ├── 📄 .env.example              ← Environment template
│   ├── 📄 .eslintrc.json            ← Code linting rules
│   ├── 📄 .prettierrc               ← Code formatting
│   ├── 📄 .gitignore                ← Backend git ignore
│   │
│   └── 📁 src/                      ← Source code
│       │
│       ├── 📄 server.js             ← ⭐ ENTRY POINT (npm run dev)
│       ├── 📄 app.js                ← Express app configuration
│       │
│       ├── 📁 config/
│       │   └── 📄 database.js       ← MySQL connection & table setup
│       │
│       ├── 📁 middleware/           ← Request processing
│       │   ├── 📄 auth.js           ← JWT verification & role checking
│       │   ├── 📄 errorHandler.js   ← Global error handling
│       │   └── 📄 upload.js         ← Multer file upload config
│       │
│       ├── 📁 utils/                ← Helper functions
│       │   ├── 📄 auth.js           ← Password hashing, JWT generation
│       │   ├── 📄 cloudinary.js     ← Image upload to Cloudinary
│       │   ├── 📄 email.js          ← Email sending with Nodemailer
│       │   └── 📄 validation.js     ← Zod validation schemas
│       │
│       ├── 📁 controllers/          ← Business logic (route handlers)
│       │   ├── 📄 authController.js
│       │   │   ├── register()       ← Create new user
│       │   │   ├── login()          ← User authentication
│       │   │   └── getCurrentUser() ← Get logged-in user info
│       │   │
│       │   ├── 📄 productController.js
│       │   │   ├── getAllProducts() ← Products with filters
│       │   │   ├── getProductById() ← Single product details
│       │   │   ├── createProduct()  ← Admin: create (with images)
│       │   │   ├── updateProduct()  ← Admin: update (with images)
│       │   │   └── deleteProduct()  ← Admin: delete
│       │   │
│       │   ├── 📄 orderController.js
│       │   │   ├── placeOrder()     ← Create order from cart
│       │   │   ├── getUserOrders()  ← User's order history
│       │   │   ├── getAllOrders()   ← Admin: all orders
│       │   │   ├── getOrderById()   ← Order details
│       │   │   └── updateOrderStatus() ← Admin: change status
│       │   │
│       │   └── 📄 userController.js
│       │       ├── getAllUsers()    ← Admin: view users
│       │       ├── getUserById()    ← Admin: user details
│       │       └── getUserStatistics() ← Admin: dashboard stats
│       │
│       └── 📁 routes/               ← API endpoint definitions
│           ├── 📄 auth.js           ← /api/auth routes
│           ├── 📄 products.js       ← /api/products routes
│           ├── 📄 orders.js         ← /api/orders routes
│           └── 📄 users.js          ← /api/users routes
│
│
├── 📁 frontend/                     ← Next.js 14 Frontend
│   ├── 📄 package.json              ← Dependencies: next, react, zustand, etc.
│   ├── 📄 .env.example              ← Environment template
│   ├── 📄 .eslintrc.json            ← Code linting
│   ├── 📄 .prettierrc               ← Code formatting
│   ├── 📄 .gitignore                ← Frontend git ignore
│   ├── 📄 next.config.js            ← Next.js configuration
│   ├── 📄 tsconfig.json             ← TypeScript config
│   ├── 📄 tailwind.config.js        ← Tailwind CSS setup
│   ├── 📄 postcss.config.js         ← PostCSS (Tailwind plugin)
│   │
│   └── 📁 app/                      ← Next.js App Router (pages)
│       │
│       ├── 📄 layout.jsx            ← ⭐ ROOT LAYOUT (Header, Footer, Toaster)
│       ├── 📄 page.jsx              ← / (Home page with hero)
│       ├── 📄 globals.css           ← Global styles & Tailwind utilities
│       │
│       ├── 📁 products/
│       │   ├── 📄 page.jsx          ← /products (Listing with filters)
│       │   └── 📁 [id]/
│       │       └── 📄 page.jsx      ← /products/[id] (Product details)
│       │
│       ├── 📁 login/
│       │   └── 📄 page.jsx          ← /login (Login form)
│       │
│       ├── 📁 register/
│       │   └── 📄 page.jsx          ← /register (Registration form)
│       │
│       ├── 📁 cart/
│       │   └── 📄 page.jsx          ← /cart (Shopping cart)
│       │
│       ├── 📁 checkout/
│       │   └── 📄 page.jsx          ← /checkout (Payment form)
│       │
│       ├── 📁 orders/
│       │   └── 📁 [id]/
│       │       └── 📄 page.jsx      ← /orders/[id] (Order confirmation)
│       │
│       └── 📁 admin/                ← Admin Dashboard (Protected)
│           ├── 📄 page.jsx          ← /admin (Dashboard overview)
│           │
│           ├── 📁 products/
│           │   ├── 📄 page.jsx      ← /admin/products (Product list)
│           │   └── 📁 [id]/
│           │       └── 📄 page.jsx  ← /admin/products/[id] (Create/Edit)
│           │
│           ├── 📁 orders/
│           │   └── 📄 page.jsx      ← /admin/orders (Order management)
│           │
│           └── 📁 users/
│               └── 📄 page.jsx      ← /admin/users (User list)
│
│
├── 📁 components/                   ← Reusable React components
│   ├── 📄 Header.jsx                ← Navigation bar (with cart icon)
│   ├── 📄 Footer.jsx                ← Footer with links
│   ├── 📄 ProductCard.jsx           ← Product card component
│   └── 📄 ProductFilters.jsx        ← Filter sidebar component
│
│
├── 📁 lib/                          ← Utilities & State Management
│   │
│   ├── 📄 api.js                    ← Axios instance with JWT interceptor
│   │
│   ├── 📄 authStore.js              ← Zustand Auth Store
│   │   ├── user state
│   │   ├── token state
│   │   ├── setUser() action
│   │   └── logout() action
│   │
│   ├── 📄 cartStore.js              ← Zustand Cart Store (Persisted)
│   │   ├── items array
│   │   ├── addToCart() action
│   │   ├── removeFromCart() action
│   │   └── updateQuantity() action
│   │
│   ├── 📄 productStore.js           ← Zustand Product Store
│   │   ├── products array
│   │   ├── filters object
│   │   └── setFilters() action
│   │
│   └── 📄 validation.js             ← Zod validation schemas
│       ├── registerSchema
│       ├── loginSchema
│       ├── checkoutSchema
│       └── productReviewSchema
│
│
└── 📁 public/                       ← Static assets (images, icons)
    └── (Icons and images can be added here)
```

## 🔄 Data Flow Diagram

```
USER ACTIONS (Frontend)
        ↓
   [React Components]
        ↓
   [Zustand Stores]
        ↓
   [Axios API client]
        ↓
   [HTTP Request]
        ↓
─── N E T W O R K ───
        ↓
   [Express Routes]
        ↓
   [Middleware Stack]
   (Auth, Validation, Errors)
        ↓
   [Controllers]
   (Business Logic)
        ↓
   [Database Queries]
        ↓
     [MySQL]
        ↓
   [Response sent back]
        ↓
   [Frontend updates]
        ↓
   [UI re-renders]
```

## 📍 Key File Locations Quick Reference

### To modify authentication:
- Backend logic: `backend/src/controllers/authController.js`
- Frontend form: `frontend/app/login/page.jsx`, `register/page.jsx`
- State: `frontend/lib/authStore.js`

### To customize products:
- Backend: `backend/src/controllers/productController.js`
- Frontend display: `frontend/components/ProductCard.jsx`
- Admin management: `frontend/app/admin/products/[id]/page.jsx`

### To change styling:
- Global styles: `frontend/app/globals.css`
- Tailwind config: `frontend/tailwind.config.js`
- Individual components: Use Tailwind classes directly

### To add new API endpoint:
1. Create controller method in `backend/src/controllers/`
2. Add route in `backend/src/routes/`
3. Import and use in `backend/src/app.js`
4. Call from frontend using `api.get()`, `api.post()`, etc. from `frontend/lib/api.js`

### To add new page:
- Create file in `frontend/app/your-page/page.jsx`
- Automatically routed as `/your-page`

### To add database field:
1. Update table creation in `backend/src/config/database.js`
2. Update queries in `backend/src/controllers/`
3. Update validation in `backend/src/utils/validation.js`

## ✅ Quality Checklist

- ✅ All files created and structured
- ✅ Clean, readable code
- ✅ Comprehensive comments
- ✅ Error handling implemented
- ✅ Input validation in place
- ✅ Database properly configured
- ✅ Authentication secured
- ✅ Admin routes protected
- ✅ Responsive design
- ✅ Production-ready standards

## 🚀 Running the Project

```bash
# Terminal 1 - Backend
cd backend && npm install && npm run dev

# Terminal 2 - Frontend  
cd frontend && npm install && npm run dev

# Visit: http://localhost:3000
```

---

**All files are ready. Happy coding! 🎉**
