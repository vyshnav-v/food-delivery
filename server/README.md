# Food Delivery Admin Panel - Backend API

A robust Node.js/Express backend API for managing a food delivery administration system with MongoDB database integration.

## 🚀 Features

- **RESTful API Architecture** with Express.js
- **MongoDB Database** with Mongoose ODM
- **JWT Authentication** with role-based access control (Admin/Customer)
- **TypeScript** for type safety
- **Image Upload** with Multer and Sharp (WebP conversion)
- **Input Validation** with express-validator
- **Pagination, Search & Filtering** on all resources
- **MongoDB Aggregation** for dashboard statistics
- **Error Handling** with centralized middleware
- **CORS Enabled** for cross-origin requests

---

## 📋 Prerequisites

- **Node.js** (v16 or higher)
- **MongoDB** (v4.4 or higher)
- **Yarn** or npm package manager

---

## 🛠️ Installation

### 1. Clone the repository

```bash
git clone <repository-url>
cd food-delivery/server
```

### 2. Install dependencies

```bash
yarn install
# or
npm install
```

### 3. Environment Setup

Create a `.env` file in the server root directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/food-delivery
# Or use MongoDB Atlas
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/food-delivery

# JWT Secret
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production

# Client URL (for CORS)
CLIENT_URL=http://localhost:5173

# Optional API base route configuration
# API_PREFIX defaults to /api when not provided
# API_VERSION is optional. When set (e.g. v1), your routes become /api/v1/...
API_PREFIX=/api
API_VERSION=
```

### 4. Seed Database (Optional)

Populate the database with sample data:

```bash
yarn seed
# or
npm run seed
```

This will create:

- 2 Admin users
- 50+ Customer users
- 10+ Categories
- 100+ Products
- 200+ Orders with various statuses

---

## 🏃 Running the Server

### Development Mode (with hot reload)

```bash
yarn dev
# or
npm run dev
```

### Production Mode

```bash
# Build TypeScript
yarn build
# or
npm run build

# Start server
yarn start
# or
npm start
```

The server will start on `http://localhost:5000`

---

## 📚 API Documentation

### Base URL

```
http://localhost:5000/api
```

> **Note:** The base path is composed of `API_PREFIX` and `API_VERSION` environment variables. With the defaults (`API_PREFIX=/api`, `API_VERSION=`), routes look like `/api/...`. Setting `API_VERSION=v1` changes the path to `/api/v1/...`.

### Authentication

All protected routes require a JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

---

## 🔐 Authentication API

### Register User

```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "mobile": "1234567890",
  "password": "password123"
}
```

**Response:**

```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "_id": "...",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "customer"
    },
    "token": "jwt_token_here"
  }
}
```

### Login

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

### Get Current User

```http
GET /api/auth/me
Authorization: Bearer <token>
```

**Response:**

```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "...",
      "name": "John Doe",
      "email": "john@example.com",
      "mobile": "1234567890",
      "role": "customer",
      "createdAt": "2025-11-01T00:00:00.000Z"
    }
  }
}
```

### Update Profile

Users can update their own profile information.

```http
PUT /api/auth/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "John Smith",
  "email": "johnsmith@example.com",
  "mobile": "9876543210",
  "password": "newpassword123"
}
```

**Request Body (all fields optional):**

- `name`: User's full name
- `email`: User's email address
- `mobile`: User's mobile number
- `password`: New password (will be hashed)

**Response:**

```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "_id": "...",
    "name": "John Smith",
    "email": "johnsmith@example.com",
    "mobile": "9876543210",
    "role": "customer",
    "createdAt": "2025-11-01T00:00:00.000Z"
  }
}
```

**Notes:**

- Users can only update their own profile
- Email uniqueness is validated
- Password is optional; only include if changing password
- Password is automatically hashed before saving

### Logout

```http
POST /api/auth/logout
Authorization: Bearer <token>
```

---

## 👥 Users API

**Base Path:** `/api/users`  
**Access:** Admin only

### List Users (with pagination, search, filter)

```http
GET /api/users?page=1&limit=10&search=john&role=customer&sort=name&order=asc
Authorization: Bearer <admin_token>
```

**Query Parameters:**

- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `search` (optional): Search by name, email, or mobile
- `role` (optional): Filter by role (admin/customer)
- `sort` (optional): Sort field (name, email, createdAt, role)
- `order` (optional): Sort order (asc/desc)

**Response:**

```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "total": 52,
    "totalPages": 6,
    "currentPage": 1,
    "limit": 10
  },
  "stats": {
    "totalUsers": 52,
    "byRole": {
      "admin": 2,
      "customer": 50
    }
  }
}
```

### Create User

```http
POST /api/users
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "mobile": "1234567890",
  "role": "customer"
}
```

**Note:** Password is optional. If not provided, a default password `Welcome@123` will be set. Users can change their password via the profile page.

### Update User

```http
PUT /api/users/:id
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "name": "Jane Smith",
  "mobile": "0987654321"
}
```

### Delete User

```http
DELETE /api/users/:id
Authorization: Bearer <admin_token>
```

---

## 📁 Categories API

**Base Path:** `/api/categories`  
**Access:** Authenticated users (Create/Update/Delete: Any authenticated user)

### List Categories

```http
GET /api/categories?page=1&limit=10&search=pizza&sort=name&order=asc
Authorization: Bearer <token>
```

**Query Parameters:**

- `page`, `limit`, `search`, `sort`, `order` (same as Users API)

### Create Category

```http
POST /api/categories
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Desserts",
  "description": "Sweet treats and desserts"
}
```

### Update Category

```http
PUT /api/categories/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Updated Category Name",
  "description": "Updated description"
}
```

### Delete Category

```http
DELETE /api/categories/:id
Authorization: Bearer <token>
```

---

## 🍔 Products API

**Base Path:** `/api/products`  
**Access:** Public (Read), Authenticated (Create/Update/Delete)

### List Products

```http
GET /api/products?page=1&limit=10&search=burger&category=<category_id>&status=available&featured=true&sort=price&order=asc
```

**Query Parameters:**

- `page`, `limit`, `search`, `sort`, `order`
- `category`: Filter by category ID
- `status`: Filter by status (available/unavailable/out-of-stock)
- `featured`: Filter featured products (true/false)
- `stock`: Filter by stock availability (in-stock/out-of-stock)

### Get Product by ID

```http
GET /api/products/:id
```

### Create Product (with image upload)

```http
POST /api/products
Authorization: Bearer <token>
Content-Type: multipart/form-data

{
  "name": "Cheeseburger",
  "description": "Delicious beef burger with cheese",
  "price": 12.99,
  "category": "<category_id>",
  "stock": 50,
  "status": "available",
  "featured": true,
  "image": <file>
}
```

### Update Product

```http
PUT /api/products/:id
Authorization: Bearer <token>
Content-Type: multipart/form-data

{
  "price": 14.99,
  "stock": 45,
  "image": <file>
}
```

### Delete Product

```http
DELETE /api/products/:id
Authorization: Bearer <token>
```

---

## 🛒 Orders API

**Base Path:** `/api/orders`  
**Access:** Authenticated users

### List Orders

```http
GET /api/orders?page=1&limit=10&search=ORD123&status=pending&userId=<user_id>&sort=-createdAt
Authorization: Bearer <token>
```

**Query Parameters:**

- `page`, `limit`, `search`, `sort`, `order`
- `status`: Filter by status (pending/confirmed/delivered/cancelled)
- `userId`: Filter by user ID
- `search`: Search by order ID or customer details

**Response includes stats:**

```json
{
  "success": true,
  "data": [...],
  "stats": {
    "totalOrders": 200,
    "totalRevenue": 15420.50,
    "byStatus": {
      "pending": 45,
      "confirmed": 30,
      "delivered": 100,
      "cancelled": 25
    }
  }
}
```

### Get Order by ID

```http
GET /api/orders/:id
Authorization: Bearer <token>
```

### Create Order

```http
POST /api/orders
Authorization: Bearer <token>
Content-Type: application/json

{
  "user": "<user_id>",
  "items": [
    {
      "product": "<product_id>",
      "quantity": 2,
      "price": 12.99
    },
    {
      "product": "<product_id_2>",
      "quantity": 1,
      "price": 8.99
    }
  ],
  "totalAmount": 34.97,
  "status": "pending"
}
```

### Update Order Status

```http
PUT /api/orders/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "confirmed"
}
```

### Delete Order

```http
DELETE /api/orders/:id
Authorization: Bearer <token>
```

---

## 📊 Dashboard API

**Base Path:** `/api/dashboard`  
**Access:** Authenticated users

### Get Dashboard Statistics

```http
GET /api/dashboard
Authorization: Bearer <token>
```

**Response:**

```json
{
  "success": true,
  "data": {
    "totalUsers": 52,
    "totalProducts": 120,
    "totalOrders": 200,
    "totalRevenue": 15420.5,
    "ordersByStatus": {
      "pending": 45,
      "confirmed": 30,
      "delivered": 100,
      "cancelled": 25
    },
    "recentOrders": [
      {
        "_id": "...",
        "user": {
          "name": "John Doe",
          "email": "john@example.com"
        },
        "totalAmount": 34.97,
        "status": "pending",
        "orderDate": "2025-01-15T10:30:00.000Z"
      }
    ]
  }
}
```

---

## 🗂️ Project Structure

```
server/
├── src/
│   ├── config/
│   │   └── database.ts          # MongoDB connection
│   ├── controllers/
│   │   ├── authController.ts    # Authentication logic
│   │   ├── userController.ts    # User CRUD operations
│   │   ├── categoryController.ts
│   │   ├── productController.ts
│   │   ├── orderController.ts
│   │   └── dashboardController.ts
│   ├── middleware/
│   │   ├── auth.ts              # JWT verification
│   │   ├── roleCheck.ts         # Role-based access
│   │   ├── errorHandler.ts      # Error handling
│   │   └── upload.ts            # File upload (multer)
│   ├── models/
│   │   ├── User.ts              # User schema
│   │   ├── Category.ts
│   │   ├── Product.ts
│   │   └── Order.ts
│   ├── routes/
│   │   ├── auth.ts              # Auth routes
│   │   ├── users.ts
│   │   ├── categories.ts
│   │   ├── products.ts
│   │   ├── orders.ts
│   │   └── dashboard.ts
│   ├── scripts/
│   │   └── seedData.ts          # Database seeding
│   ├── types/
│   │   └── index.ts             # TypeScript types
│   ├── utils/
│   │   └── pagination.ts        # Pagination helpers
│   └── server.ts                # Express app setup
├── uploads/                      # Uploaded images
├── .env                          # Environment variables
├── package.json
├── tsconfig.json
└── README.md
```

---

## 🔒 Security Features

- **Password Hashing** with bcryptjs
- **JWT Token Authentication**
- **Role-based Access Control** (Admin/Customer)
- **Input Validation** with express-validator
- **CORS Protection**
- **Error Handling** with custom middleware
- **MongoDB Injection Protection** with Mongoose

---

## 🧪 Testing the API

### Using cURL

```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Get Products
curl http://localhost:5000/api/products?page=1&limit=10
```

### Using Postman

1. Import the API collection (if available)
2. Set environment variable for `BASE_URL`: `http://localhost:5000/api`
3. Set `TOKEN` variable after login
4. Use `{{BASE_URL}}` and `{{TOKEN}}` in requests

---

## 📦 Default Credentials (After Seeding)

### Admin Account

- **Email:** `admin@fooddelivery.com`
- **Password:** `admin123`

### Customer Account

- **Email:** `customer@fooddelivery.com`
- **Password:** `customer123`

---

## 🚀 Deployment

### Deploy to Render/Railway/Heroku

1. Set environment variables in the hosting platform
2. Ensure MongoDB Atlas connection string is set
3. Build command: `yarn build`
4. Start command: `yarn start`

### Environment Variables for Production

```env
PORT=5000
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/food-delivery
JWT_SECRET=your_production_secret_key_min_32_characters
CLIENT_URL=https://your-frontend-domain.com
```

---

## 🛠️ Available Scripts

```bash
# Development mode with hot reload
yarn dev

# Build TypeScript
yarn build

# Start production server
yarn start

# Seed database
yarn seed

# Format code with Prettier
yarn format

# Lint code
yarn lint
```

---

## 📝 API Response Format

### Success Response

```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... },
  "pagination": { ... }  // if applicable
}
```

### Error Response

```json
{
  "success": false,
  "message": "Error message",
  "error": "Detailed error information"
}
```

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 👨‍💻 Support

For issues and questions, please open an issue on the GitHub repository.

---

## 🔄 Version History

- **v1.0.0** - Initial release with full CRUD operations, authentication, and dashboard
