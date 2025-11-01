# Food Delivery Admin Panel - Frontend

A modern, responsive React-based admin panel for managing a food delivery system with comprehensive CRUD operations, dashboard analytics, and role-based access control.

## 🚀 Features

- **Modern React 18** with TypeScript
- **React Router v6** for navigation
- **Tailwind CSS** for responsive design
- **Chart.js** for data visualization
- **React Hook Form** for form management
- **Zustand** for state management
- **Axios** for API communication
- **JWT Authentication** with protected routes
- **Role-based Access Control** (Admin/Customer)
- **Image Upload** with cropping and WebP conversion
- **Advanced Pagination** with URL state management
- **Search & Filtering** on all resources
- **Loading Skeletons** for better UX
- **Toast Notifications** for user feedback
- **Error Boundaries** for graceful error handling
- **Responsive Design** - Mobile, Tablet, Desktop

---

## 📋 Prerequisites

- **Node.js** (v16 or higher)
- **Yarn** or npm package manager
- **Backend API** running (see server README)

---

## 🛠️ Installation

### 1. Clone the repository

```bash
git clone <repository-url>
cd food-delivery/client
```

### 2. Install dependencies

```bash
yarn install
# or
npm install
```

### 3. Environment Setup

Create a `.env` file in the client root directory:

```env
# API Base URL
VITE_API_URL=http://localhost:5000/api

```

---

## 🏃 Running the Application

### Development Mode

```bash
yarn dev
# or
npm run dev
```

The application will start on `http://localhost:5173`

### Production Build

```bash
yarn build
# or
npm run build
```

### Preview Production Build

```bash
yarn preview
# or
npm run preview
```

---

## 📱 Application Pages

### 1. **Authentication**

- `/login` - User login page
- `/register` - User registration page

### 2. **Dashboard** (`/dashboard`)

- Overview statistics (Users, Products, Orders, Revenue)
- Order status charts (Doughnut & Bar)
- Recent orders table
- Quick stats cards

### 3. **Products** (`/products`)

- Grid view with product cards
- Create/Edit/Delete products
- Image upload with cropping
- Filter by category, status, stock, featured
- Search by name/description
- Sort by multiple fields
- Pagination with URL state

### 4. **Categories** (`/categories`)

- Grid view with category cards
- Create/Edit/Delete categories
- Image upload with cropping
- Search and sort functionality
- Prevents deletion if products are linked

### 5. **Orders** (`/orders`)

- Table view with order details
- Create new orders
- Update order status with confirmation
- View order details
- Filter by status
- Search by order ID or customer details
- Order statistics

### 6. **Users** (`/users`) - Admin Only

- Table view with user data
- Create/Edit/Delete users
- Filter by role (Admin/Customer)
- Search by name, email, mobile
- User statistics by role

### 7. **Profile** (`/profile`)

- View and edit personal information
- Update name, email, mobile
- Change password with validation
- Visual profile with avatar
- Account information (ID, member since)
- Secure password update with current password requirement

---

## 🎨 UI Components

### Common Components

#### Forms

- **CommonForm** - Reusable form with validation
- **ProductForm** - Product creation/editing
- **CategoryForm** - Category management
- **OrderForm** - Order creation with dynamic items
- **UserForm** - User management

#### Tables

- **CommonTable** - Advanced table with:
  - Sorting
  - Pagination
  - Loading states
  - Empty states
  - Server-side data

#### UI Elements

- **Modal** - Reusable modal (sm, md, lg, xl sizes)
- **Pagination** - Advanced pagination with mobile responsive design
- **EmptyState** - No data display with icons
- **LoadingSkeleton** - Loading placeholders
- **ErrorBoundary** - Error handling component
- **FileUpload** - Image upload with drag-drop and cropping

---

## 🔐 Authentication & Authorization

### Login Flow

1. User enters email and password
2. JWT token is returned from API
3. Token is stored in localStorage
4. Token is included in all API requests
5. Protected routes check authentication status

### Role-Based Access

- **Admin**: Full access to all features
- **Customer**: Limited access (view products, manage own orders)

### Protected Routes

All routes except `/login` and `/register` require authentication.

---

## 📊 Features in Detail

### Dashboard

- **Statistics Cards**: Total Users, Products, Orders, Revenue
- **Charts**:
  - Doughnut chart for orders by status
  - Bar chart for order statistics
- **Recent Orders**: Last 10 orders with details
- **Quick Stats**: Pending, Confirmed, Delivered orders, Average order value

### Product Management

- **Grid View**: Product cards with images
- **Filters**:
  - Category dropdown
  - Status (Available/Unavailable/Out of Stock)
  - Stock availability
  - Featured products
- **Search**: By name and description
- **Sort**: Name, Price, Stock, Created date
- **Image Upload**: With cropping and WebP conversion
- **Decimal Price Input**: Supports prices like $12.99

### Category Management

- **Grid View**: Category cards with images
- **Image Upload**: With cropping
- **Search**: By name and description
- **Sort**: Name, Created date
- **Delete Protection**: Cannot delete if products are linked

### Order Management

- **Create Orders**:
  - Select customer
  - Add multiple products
  - Automatic price calculation
  - Total amount calculation
- **Status Management**: With confirmation modal
- **View Details**: Full order information
- **Search**: By order ID or customer info
- **Filter**: By status
- **Statistics**: Total orders, revenue, orders by status

### User Management (Admin Only)

- **Create Users**: With role selection (no password required - default password is set)
- **Edit Users**: Update details and role
- **Delete Users**: With confirmation
- **Filter**: By role
- **Search**: By name, email, mobile
- **Statistics**: Total users, admins, customers
- **Default Password**: New users get `Welcome@123` as default password (can be changed via profile)

### Profile Management

- **View Mode**: Display all user information
- **Edit Mode**: Toggle to edit profile fields
- **Update Information**:
  - Name (required, min 3 characters)
  - Email (validated, unique check)
  - Mobile (10-15 digits, optional)
- **Change Password** (optional):
  - Current password verification
  - New password (min 6 characters)
  - Confirm password match validation
- **Visual Elements**:
  - Profile avatar with first letter
  - Role badge display
  - Account creation date
  - Account ID display
- **Security**:
  - Users can only edit their own profile
  - Password change requires current password
  - All changes validated on both client and server

---

## 🗂️ Project Structure

```
client/
├── public/
│   └── logo.svg                 # App logo
├── src/
│   ├── assets/                  # Static assets
│   ├── components/
│   │   ├── forms/
│   │   │   ├── CommonForm.tsx
│   │   │   ├── ProductForm.tsx
│   │   │   ├── CategoryForm.tsx
│   │   │   ├── OrderForm.tsx
│   │   │   ├── UserForm.tsx
│   │   │   ├── FormInput.tsx
│   │   │   ├── FormRow.tsx
│   │   │   └── FileUpload.tsx
│   │   ├── CommonTable.tsx
│   │   ├── Pagination.tsx
│   │   ├── Modal.tsx
│   │   ├── EmptyState.tsx
│   │   ├── LoadingSkeleton.tsx
│   │   └── ErrorBoundary.tsx
│   ├── hooks/
│   │   ├── useFetch.ts          # Data fetching
│   │   ├── useCRUD.ts           # CRUD operations
│   │   ├── useModal.ts          # Modal state
│   │   ├── usePagination.ts     # Pagination logic
│   │   ├── useRole.ts           # Role checking
│   │   └── useForm.ts           # Form handling
│   ├── layouts/
│   │   ├── MainLayout.tsx       # Authenticated layout
│   │   └── AuthLayout.tsx       # Login/Register layout
│   ├── pages/
│   │   ├── auth/
│   │   │   ├── Login.tsx
│   │   │   └── Register.tsx
│   │   ├── Dashboard.tsx
│   │   ├── Products.tsx
│   │   ├── Categories.tsx
│   │   ├── Orders.tsx
│   │   ├── Users.tsx
│   │   ├── Profile.tsx
│   │   └── NotFound.tsx
│   ├── services/
│   │   ├── authService.ts       # Auth API calls
│   │   ├── productService.ts
│   │   ├── categoryService.ts
│   │   ├── orderService.ts
│   │   ├── userService.ts
│   │   └── dashboardService.ts
│   ├── stores/
│   │   └── authStore.ts         # Zustand auth store
│   ├── types/
│   │   ├── index.ts             # Common types
│   │   └── form.ts              # Form types
│   ├── utils/
│   │   ├── axios.ts             # Axios configuration
│   │   └── imageUtils.ts        # Image processing
│   ├── App.tsx                  # Main app component
│   ├── main.tsx                 # Entry point
│   └── index.css                # Global styles
├── .env                          # Environment variables
├── package.json
├── vite.config.ts
├── tailwind.config.js
├── tsconfig.json
└── README.md
```

---

## 🎨 Styling

### Tailwind CSS Configuration

The application uses a custom Tailwind theme:

**Primary Color**: `rgb(3, 82, 78)` - Teal/Dark Green

**Theme Colors**:

```css
primary-50 to primary-950
```

**Custom Components**:

- `.btn-primary` - Primary button
- `.btn-secondary` - Secondary button
- `.btn-danger` - Danger/Delete button
- `.card` - Card container
- `.card-hover` - Card with hover effect
- `.input-field` - Form input

### Responsive Breakpoints

- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

---

## 🔌 API Integration

### Axios Configuration

All API calls use a configured Axios instance with:

- Base URL from environment variables
- Automatic JWT token injection
- Request/Response interceptors
- Error handling

### Example API Call

```typescript
import { productService } from "./services/productService";

// Fetch products with filters
const response = await productService.getProducts({
  page: 1,
  limit: 10,
  search: "burger",
  category: "categoryId",
  status: "available",
});
```

---

## 🔄 State Management

### Zustand Store (Auth)

```typescript
const { user, isAuthenticated, login, logout, checkAuth } = useAuthStore();
```

### URL State Management

Pagination, filters, and search params are stored in the URL:

```
/products?page=2&limit=20&search=burger&category=xyz&sort=price&order=asc
```

Benefits:

- Shareable URLs
- Browser back/forward navigation
- State persistence on refresh

---

## 🎯 Key Features Implementation

### Image Upload with Cropping

```typescript
// Features:
- Drag & drop
- Image preview
- Crop with aspect ratio
- WebP conversion
- Max file size validation
```

### Advanced Pagination

```typescript
// URL-driven pagination
const [searchParams, setSearchParams] = useSearchParams();
const pagination = usePagination({ initialPage: 1, pageSize: 10 });

// Responsive design
- Mobile: Shows only prev/next
- Desktop: Shows first/prev/next/last
```

### Error Boundaries

```typescript
// Catches React errors
<ErrorBoundary>
  <YourComponent />
</ErrorBoundary>

// Shows friendly error message
// Allows page reload
```

---

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. **Install Vercel CLI**

```bash
npm i -g vercel
```

2. **Deploy**

```bash
vercel
```

3. **Set Environment Variables**

```bash
vercel env add VITE_API_URL
```

### Deploy to Netlify

1. **Build Command**: `yarn build`
2. **Publish Directory**: `dist`
3. **Environment Variables**: Set `VITE_API_URL`

### Configuration Files

**vercel.json** (included):

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

---

## 🛠️ Available Scripts

```bash
# Start development server
yarn dev

# Build for production
yarn build

# Preview production build
yarn preview

# Lint code
yarn lint

# Format code with Prettier
yarn format

# Type check
yarn type-check
```

---

## 📦 Key Dependencies

### Core

- `react` ^18.3.1
- `react-dom` ^18.3.1
- `react-router-dom` ^7.1.3
- `typescript` ^5.6.2

### UI & Styling

- `tailwindcss` ^4.0.0
- `lucide-react` ^0.468.0
- `classnames` ^2.5.1

### Forms & Validation

- `react-hook-form` ^7.54.2
- `react-quill` ^2.0.0

### State & Data

- `zustand` ^5.0.3
- `axios` ^1.7.9
- `@tanstack/react-table` ^8.20.6

### Charts & Visualization

- `chart.js` ^4.4.7
- `react-chartjs-2` ^5.3.0

### Image Processing

- `react-easy-crop` ^5.0.8

### Utilities

- `date-fns` ^4.1.0
- `react-hot-toast` ^2.4.1
- `react-loading-skeleton` ^3.5.0

---

## 🔒 Security Features

- **JWT Token Storage**: Secure localStorage
- **Protected Routes**: Authentication required
- **Role-Based Access**: Admin/Customer permissions
- **Input Validation**: Form validation with react-hook-form
- **Error Boundaries**: Graceful error handling
- **CORS**: Configured for backend API
- **XSS Protection**: React's built-in protection

---

## 📱 Responsive Design

### Mobile (< 768px)

- Hamburger menu
- Stacked layouts
- Simplified pagination
- Touch-friendly buttons

### Tablet (768px - 1024px)

- 2-column grids
- Condensed navigation
- Optimized tables

### Desktop (> 1024px)

- Full navigation sidebar
- 4-column grids
- Full-featured tables
- Enhanced tooltips

---

## 🎓 Usage Guide

### 1. Login

- Use default admin credentials (see server README)
- Or register a new account

### 2. Dashboard

- View overview statistics
- Check recent orders
- Monitor order status distribution

### 3. Manage Products

- Click "New Product" to add products
- Upload images (auto-converted to WebP)
- Set price, stock, category, and status
- Mark products as featured

### 4. Manage Categories

- Create categories with images
- Edit or delete (if no products linked)

### 5. Manage Orders

- Create orders for customers
- Add multiple products per order
- Update order status
- View order details

### 6. Manage Users (Admin)

- Create admin or customer accounts
- Edit user roles and details
- Filter and search users

---

## 🐛 Troubleshooting

### API Connection Issues

```bash
# Check if backend is running
curl http://localhost:5000/api/health

# Verify VITE_API_URL in .env
echo $VITE_API_URL
```

### Build Errors

```bash
# Clear cache and reinstall
rm -rf node_modules yarn.lock
yarn install
```

### Image Upload Issues

- Check file size (max 5MB)
- Ensure backend `/uploads` folder exists
- Verify multer configuration in backend

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 👨‍💻 Support

For issues and questions, please open an issue on the GitHub repository.

---

## 🎉 Acknowledgments

- Tailwind CSS for styling
- Lucide React for icons
- Chart.js for data visualization
- React Hook Form for form management

---

## 🔄 Version History

- **v1.0.0** - Initial release with full admin panel features
