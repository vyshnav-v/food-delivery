# 🍔 Food Delivery Admin Panel

A full-stack MERN application for managing a food delivery administration system with comprehensive features for products, orders, categories, and users management.

![Tech Stack](https://img.shields.io/badge/MongoDB-4.4+-green)
![Tech Stack](https://img.shields.io/badge/Express-4.x-blue)
![Tech Stack](https://img.shields.io/badge/React-18.x-blue)
![Tech Stack](https://img.shields.io/badge/Node.js-16+-green)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)

---

## ✨ Features

### 🔐 Authentication & Authorization

- JWT-based authentication
- Role-based access control (Admin/Customer)
- Protected routes and API endpoints
- Secure password hashing

### 📊 Dashboard

- Real-time statistics (Users, Products, Orders, Revenue)
- Interactive charts (Doughnut & Bar charts)
- Recent orders overview
- Order status distribution
- Average order value calculation

### 🍕 Product Management

- Full CRUD operations
- Image upload with cropping and WebP conversion
- Category assignment
- Stock management
- Featured products
- Status tracking (Available/Unavailable/Out of Stock)
- Advanced search and filtering
- Pagination with URL state

### 📁 Category Management

- Create, Read, Update, Delete categories
- Image upload support
- Search and sort functionality
- Delete protection (prevents deletion if products are linked)

### 🛒 Order Management

- Create orders with multiple items
- Dynamic order item management
- Status updates (Pending/Confirmed/Delivered/Cancelled)
- Order status confirmation modal
- Search by order ID or customer details
- Filter by status
- Order statistics and revenue tracking
- User and product population

### 👥 User Management (Admin Only)

- User CRUD operations
- Role assignment (Admin/Customer)
- Default password assigned automatically (Welcome@123)
- Search by name, email, mobile
- Filter by role
- User statistics

### 👤 Profile Management

- View and edit personal profile
- Update name, email, mobile
- Change password securely
- Avatar display with role badge
- Account information tracking

### 🎨 UI/UX

- Modern, responsive design
- Mobile-first approach
- Loading skeletons
- Empty states
- Toast notifications
- Error boundaries
- Confirmation modals
- Dark theme ready

---

## 🛠️ Tech Stack

### Backend

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **TypeScript** - Type safety
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Multer** - File upload handling
- **Sharp** - Image processing
- **Express Validator** - Input validation

### Frontend

- **React 18** - UI library
- **TypeScript** - Type safety
- **React Router v6** - Client-side routing
- **Tailwind CSS** - Styling
- **Zustand** - State management
- **Axios** - HTTP client
- **React Hook Form** - Form management
- **Chart.js** - Data visualization
- **Lucide React** - Icon library
- **React Easy Crop** - Image cropping
- **Date-fns** - Date formatting
- **React Hot Toast** - Notifications

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher)
- **MongoDB** (v4.4 or higher) - Local or Atlas
- **Yarn** or npm package manager
- **Git** - Version control

---

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd food-delivery
```

### 2. Backend Setup

```bash
# Navigate to server directory
cd server

# Install dependencies
yarn install

# Create .env file
cp .env.example .env

# Edit .env with your configuration
# Required variables:
# - MONGODB_URI
# - JWT_SECRET
# - CLIENT_URL
# - PORT

# Seed database with sample data (optional)
yarn seed

# Start development server
yarn dev
```

Backend will run on `http://localhost:5000`

### 3. Frontend Setup

```bash
# Navigate to client directory (from root)
cd ../client

# Install dependencies
yarn install

# Create .env file
cp .env.example .env

# Edit .env with your configuration
# Required variables:
# - VITE_API_URL=http://localhost:5000/api

# Start development server
yarn dev
```

Frontend will run on `http://localhost:5173`

---

## 📁 Project Structure

```
food-delivery/
├── server/                    # Backend application
│   ├── src/
│   │   ├── config/           # Configuration files
│   │   ├── controllers/      # Route controllers
│   │   ├── middleware/       # Custom middleware
│   │   ├── models/           # Mongoose models
│   │   ├── routes/           # API routes
│   │   ├── scripts/          # Utility scripts
│   │   ├── types/            # TypeScript types
│   │   ├── utils/            # Helper functions
│   │   └── server.ts         # Express app setup
│   ├── uploads/              # Uploaded files
│   ├── .env                  # Environment variables
│   ├── package.json
│   └── tsconfig.json
│
├── client/                    # Frontend application
│   ├── src/
│   │   ├── components/       # Reusable components
│   │   ├── hooks/            # Custom React hooks
│   │   ├── layouts/          # Layout components
│   │   ├── pages/            # Page components
│   │   ├── services/         # API services
│   │   ├── stores/           # Zustand stores
│   │   ├── types/            # TypeScript types
│   │   ├── utils/            # Helper functions
│   │   ├── App.tsx           # Main app component
│   │   ├── main.tsx          # Entry point
│   │   └── index.css         # Global styles
│   ├── public/               # Static assets
│   ├── .env                  # Environment variables
│   ├── package.json
│   ├── vite.config.ts
│   └── tailwind.config.js
│
├── README.md                  # This file
└── REQUIREMENTS_CHECKLIST.md  # Feature checklist
```

---

## 🔑 Default Credentials (After Seeding)

### Admin Account

```
Email: admin@fooddelivery.com
Password: admin123
```

### Customer Account

```
Email: customer@fooddelivery.com
Password: customer123
```

---

## 📚 API Documentation

### Base URL

```
http://localhost:5000/api
```

### Available Endpoints

#### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update user profile
- `POST /api/auth/logout` - Logout user

#### Users (Admin only)

- `GET /api/users` - List users (with pagination, search, filter)
- `POST /api/users` - Create user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

#### Categories

- `GET /api/categories` - List categories
- `POST /api/categories` - Create category
- `PUT /api/categories/:id` - Update category
- `DELETE /api/categories/:id` - Delete category

#### Products

- `GET /api/products` - List products (with filters)
- `POST /api/products` - Create product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

#### Orders

- `GET /api/orders` - List orders
- `POST /api/orders` - Create order
- `PUT /api/orders/:id` - Update order status
- `DELETE /api/orders/:id` - Delete order

#### Dashboard

- `GET /api/dashboard` - Get dashboard statistics

For detailed API documentation, see [server/README.md](server/README.md)

---

## 🎯 Features Checklist

All requirements from the original specification have been implemented:

✅ **Backend**

- ✅ MongoDB Collections (Users, Categories, Products, Orders)
- ✅ All CRUD APIs with validation
- ✅ Pagination, Search, and Filtering
- ✅ Dashboard aggregation statistics
- ✅ Image upload with processing
- ✅ JWT Authentication
- ✅ Role-based authorization

✅ **Frontend**

- ✅ Dashboard with charts and statistics
- ✅ User Management (CRUD)
- ✅ Category Management (CRUD)
- ✅ Product Management (CRUD with category select)
- ✅ Order Creation (Select user, products, quantity, total)
- ✅ Modern UI with Tailwind CSS
- ✅ Responsive design
- ✅ Form validation
- ✅ Loading states
- ✅ Error handling

For a complete checklist, see [REQUIREMENTS_CHECKLIST.md](REQUIREMENTS_CHECKLIST.md)

---

## 🖥️ Screenshots

### Dashboard

![Dashboard](docs/screenshots/dashboard.png)

### Products Management

![Products](docs/screenshots/products.png)

### Order Creation

![Order Creation](docs/screenshots/order-form.png)

---

## 🔧 Configuration

### Backend Environment Variables

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/food-delivery
JWT_SECRET=your_super_secret_key
CLIENT_URL=http://localhost:5173
```

### Frontend Environment Variables

```env
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=Food Delivery Admin
```

---

## 🚀 Deployment

### Backend Deployment (Render/Railway/Heroku)

1. Create new web service
2. Connect GitHub repository
3. Set build command: `yarn build`
4. Set start command: `yarn start`
5. Add environment variables:
   - `MONGODB_URI` (MongoDB Atlas connection string)
   - `JWT_SECRET` (Strong secret key)
   - `CLIENT_URL` (Frontend URL)
   - `NODE_ENV=production`

### Frontend Deployment (Vercel/Netlify)

#### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd client
vercel

# Add environment variable
vercel env add VITE_API_URL
```

#### Netlify

1. Build command: `yarn build`
2. Publish directory: `dist`
3. Add environment variable: `VITE_API_URL`

---

## 🧪 Testing

### Backend

```bash
cd server

# Test API health
curl http://localhost:5000/api/health

# Test authentication
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@fooddelivery.com","password":"admin123"}'
```

### Frontend

```bash
cd client

# Run development server
yarn dev

# Build for production
yarn build

# Preview production build
yarn preview
```

---

## 📝 Development Scripts

### Backend

```bash
yarn dev          # Start development server with hot reload
yarn build        # Build TypeScript
yarn start        # Start production server
yarn seed         # Seed database
yarn format       # Format code with Prettier
```

### Frontend

```bash
yarn dev          # Start development server
yarn build        # Build for production
yarn preview      # Preview production build
yarn lint         # Lint code
yarn format       # Format code with Prettier
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

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 👨‍💻 Author

[Your Name]

---

## 🙏 Acknowledgments

- MongoDB for the database
- Express.js for the backend framework
- React for the frontend library
- Tailwind CSS for styling
- Chart.js for data visualization
- All open-source contributors

---

## 📞 Support

For support, email support@fooddelivery.com or open an issue on GitHub.

---

## 🔄 Changelog

### v1.0.0 (2025-01-15)

- Initial release
- Full CRUD operations for all resources
- Dashboard with statistics and charts
- Authentication and authorization
- Image upload with processing
- Responsive design
- Advanced pagination and filtering

---

## 🗺️ Roadmap

- [ ] Add unit and integration tests
- [ ] Implement real-time notifications with WebSockets
- [ ] Add email notifications for order status changes
- [ ] Implement advanced analytics and reporting
- [ ] Add multi-language support (i18n)
- [ ] Implement dark mode
- [ ] Add export functionality (CSV, PDF)
- [ ] Implement advanced user permissions
- [ ] Add audit logs
- [ ] Implement caching with Redis

---

Made with ❤️ for Food Delivery Management
