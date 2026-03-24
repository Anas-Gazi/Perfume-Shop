# Postman API Collection Reference

This guide provides API endpoint documentation for testing with Postman.

## Base URL
```
http://localhost:5000/api
```

## 🔐 Authentication Endpoints

### 1. Register User
```
POST /auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}

Response:
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 2. Login User
```
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}

Response:
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 3. Get Current User
```
GET /auth/me
Authorization: Bearer {token}

Response:
{
  "success": true,
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "created_at": "2024-01-15T10:30:00Z"
  }
}
```

## 📦 Product Endpoints

### 1. Get All Products (with filters)
```
GET /products?category=Men&fragranceType=woody&minPrice=50&maxPrice=500&search=Dior

Response:
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Dior Sauvage",
      "price": 99.99,
      "description": "Fresh aromatic perfume",
      "category": "Men",
      "fragrance_type": "woody",
      "stock": 50,
      "images": ["https://res.cloudinary.com/.../image.jpg"],
      "created_at": "2024-01-15T10:30:00Z",
      "updated_at": "2024-01-15T10:30:00Z"
    }
  ]
}
```

### 2. Get Single Product
```
GET /products/1

Response:
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Dior Sauvage",
    "price": 99.99,
    "description": "Fresh aromatic perfume",
    "category": "Men",
    "fragrance_type": "woody",
    "stock": 50,
    "images": ["https://res.cloudinary.com/.../image.jpg"],
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-01-15T10:30:00Z"
  }
}
```

### 3. Create Product (Admin Only)
```
POST /products
Authorization: Bearer {admin-token}
Content-Type: multipart/form-data

Body (form-data):
- name: "Chanel No. 5"
- price: 150
- description: "Iconic floral perfume"
- category: "Women"
- fragranceType: "floral"
- stock: 100
- images: [file1.jpg, file2.jpg]

Response:
{
  "success": true,
  "message": "Product created successfully",
  "data": {
    "id": 2,
    "name": "Chanel No. 5",
    "price": 150,
    "description": "Iconic floral perfume",
    "category": "Women",
    "fragrance_type": "floral",
    "stock": 100,
    "images": ["https://res.cloudinary.com/.../image1.jpg", "https://res.cloudinary.com/.../image2.jpg"],
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-01-15T10:30:00Z"
  }
}
```

### 4. Update Product (Admin Only)
```
PUT /products/1
Authorization: Bearer {admin-token}
Content-Type: multipart/form-data

Body (form-data):
- name: "Dior Sauvage EDP"
- price: 110
- description: "Updated description"
- category: "Men"
- fragranceType: "woody"
- stock: 45
- images: [file1.jpg]

Response:
{
  "success": true,
  "message": "Product updated successfully",
  "data": { ... }
}
```

### 5. Delete Product (Admin Only)
```
DELETE /products/1
Authorization: Bearer {admin-token}

Response:
{
  "success": true,
  "message": "Product deleted successfully"
}
```

## 🛒 Order Endpoints

### 1. Place Order
```
POST /orders
Authorization: Bearer {user-token}
Content-Type: application/json

{
  "items": [
    {
      "productId": 1,
      "quantity": 2
    },
    {
      "productId": 2,
      "quantity": 1
    }
  ],
  "shippingAddress": "123 Main St, New York, NY 10001, USA"
}

Response:
{
  "success": true,
  "message": "Order placed successfully",
  "data": {
    "id": 1,
    "user_id": 1,
    "total_price": 319.97,
    "status": "pending",
    "shipping_address": "123 Main St, New York, NY 10001, USA",
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-01-15T10:30:00Z"
  }
}
```

### 2. Get User's Orders
```
GET /orders/user/orders
Authorization: Bearer {user-token}

Response:
{
  "success": true,
  "data": [
    {
      "id": 1,
      "user_id": 1,
      "total_price": 319.97,
      "status": "pending",
      "shipping_address": "123 Main St, New York, NY 10001, USA",
      "items": [
        {
          "id": 1,
          "order_id": 1,
          "product_id": 1,
          "quantity": 2,
          "price": 99.99,
          "name": "Dior Sauvage",
          "description": "..."
        }
      ],
      "created_at": "2024-01-15T10:30:00Z"
    }
  ]
}
```

### 3. Get Order Details
```
GET /orders/1
Authorization: Bearer {user-token}

Response:
{
  "success": true,
  "data": {
    "id": 1,
    "user_id": 1,
    "total_price": 319.97,
    "status": "pending",
    "shipping_address": "123 Main St, New York, NY 10001, USA",
    "items": [ ... ],
    "created_at": "2024-01-15T10:30:00Z"
  }
}
```

### 4. Get All Orders (Admin Only)
```
GET /orders
Authorization: Bearer {admin-token}

Response:
{
  "success": true,
  "data": [
    {
      "id": 1,
      "user_id": 1,
      "user_name": "John Doe",
      "user_email": "john@example.com",
      "total_price": 319.97,
      "status": "pending",
      "items": [ ... ],
      "created_at": "2024-01-15T10:30:00Z"
    }
  ]
}
```

### 5. Update Order Status (Admin Only)
```
PUT /orders/1/status
Authorization: Bearer {admin-token}
Content-Type: application/json

{
  "status": "shipped"
}

Response:
{
  "success": true,
  "message": "Order status updated",
  "data": {
    "id": 1,
    "user_id": 1,
    "total_price": 319.97,
    "status": "shipped",
    "updated_at": "2024-01-15T11:00:00Z"
  }
}
```

## 👥 User Endpoints (Admin Only)

### 1. Get All Users
```
GET /users
Authorization: Bearer {admin-token}

Response:
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user",
      "created_at": "2024-01-15T10:30:00Z"
    }
  ]
}
```

### 2. Get User Statistics
```
GET /users/stats
Authorization: Bearer {admin-token}

Response:
{
  "success": true,
  "data": {
    "totalUsers": 50,
    "totalOrders": 150,
    "totalRevenue": 15000.00,
    "recentUsers": [
      {
        "id": 50,
        "name": "Jane Smith",
        "email": "jane@example.com",
        "created_at": "2024-01-15T10:30:00Z"
      }
    ]
  }
}
```

### 3. Get User Details
```
GET /users/1
Authorization: Bearer {admin-token}

Response:
{
  "success": true,
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "created_at": "2024-01-15T10:30:00Z"
  }
}
```

## 🧪 Test Workflow

1. **Register a user** with POST /auth/register
2. **Login** with POST /auth/login to get token
3. **Get products** with GET /products
4. **View product details** with GET /products/{id}
5. **Place order** with POST /orders
6. **View order history** with GET /orders/user/orders

For Admin testing:
1. Create admin account (manually in database or through registration + role update)
2. Login to get admin token
3. **Create product** with POST /products
4. **Update product** with PUT /products/{id}
5. **View all orders** with GET /orders
6. **Update order status** with PUT /orders/{id}/status

## Error Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request (Validation Error)
- `401` - Unauthorized (Missing/Invalid Token)
- `403` - Forbidden (Insufficient Permissions)
- `404` - Not Found
- `409` - Conflict (Duplicate Email)
- `500` - Server Error
