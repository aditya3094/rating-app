# Store Rating System - Frontend

A complete React.js frontend application for a store rating system with role-based authentication and beautiful UI.

## 🚀 Features

- **Role-based Authentication** (Admin, Normal User, Store Owner)
- **Beautiful Responsive UI** with Tailwind CSS and custom animations
- **Form Validations** with real-time feedback
- **Interactive Rating System** with star ratings
- **Modern Dashboard Design** with cards, charts, and gradients
- **Search & Filter Functionality**
- **Password Management**
- **Professional Blue-Purple Theme**

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- **Express.js + MongoDB backend** (not included - must be running separately)

## 🛠️ Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the Development Server
```bash
npm start
```

The application will run on `http://localhost:3000`

### 3. Backend Requirements
Make sure your Express.js + MongoDB backend is running on `http://localhost:5000/api`

## 📱 User Roles & Features

### 🔧 System Administrator
- Add new stores, users, and admin users
- View dashboard with total users, stores, and ratings
- Manage users with filtering and sorting
- View detailed user profiles
- Role-based user management

### 👤 Normal User
- Sign up with validation (Name: 20-60 chars, Address: max 400 chars, Password: 8-16 chars with 1 uppercase + 1 special char)
- Search stores by name and address
- Submit and update ratings (1-5 stars)
- View overall store ratings
- Update password

### 🏪 Store Owner
- View store dashboard with average rating
- See list of users who rated their store
- Monitor rating distribution
- Update password
- View recent activity

## 🎨 Design Features

- **Modern Gradient Backgrounds** with blue-purple theme
- **Smooth Animations** (fade-in, slide-up, hover effects)
- **Interactive Components** with scale animations
- **Responsive Design** for all screen sizes
- **Beautiful Cards** with shadow effects
- **Professional Form Design** with validation feedback
- **Star Rating System** with hover interactions

## 📡 API Integration

The frontend connects to your backend via axios with the base URL `http://localhost:5000/api`

### Authentication Endpoints
- `POST /auth/login` - User login
- `POST /auth/signup` - User registration
- `PUT /auth/change-password` - Password update

### Admin Endpoints
- `GET /admin/dashboard` - Dashboard statistics
- `GET /admin/users` - List users with filters
- `GET /admin/stores` - List stores with filters
- `GET /admin/users/:id` - User details
- `POST /admin/users` - Add new user
- `POST /admin/stores` - Add new store

### User Endpoints
- `GET /user/stores` - List stores with search
- `POST /user/ratings` - Submit rating
- `PUT /user/ratings/:id` - Update rating
- `GET /user/ratings` - Get user's ratings

### Store Owner Endpoints
- `GET /owner/dashboard` - Owner dashboard data
- `GET /owner/ratings` - Store ratings

## 📝 Form Validations

- **Name**: 20-60 characters
- **Email**: Valid email format
- **Password**: 8-16 characters with at least 1 uppercase letter and 1 special character
- **Address**: Maximum 400 characters

## 🔒 Authentication

- JWT token-based authentication
- Automatic token refresh handling
- Role-based route protection
- Persistent login state

## 🏗️ Project Structure

```
src/
├── components/
│   ├── Navbar.jsx          # Navigation with user info
│   ├── RatingStars.jsx     # Interactive star rating component
│   ├── Login.jsx           # Login form with validation
│   └── Signup.jsx          # Registration form
├── pages/
│   ├── AdminDashboard.jsx  # Admin management interface
│   ├── UserDashboard.jsx   # Store browsing and rating
│   └── OwnerDashboard.jsx  # Store owner analytics
├── api.js                  # Axios configuration and API calls
├── App.tsx                 # Main app with routing
├── index.css               # Custom styles and animations
└── main.tsx               # Application entry point
```

## 🎯 Key Components

### RatingStars
Interactive star rating component with hover effects and click handling.

### Navbar
Dynamic navigation showing user role and logout functionality.

### Dashboard Cards
Animated cards with statistics and hover effects for modern UI.

### Form Components
Beautifully styled forms with real-time validation and error handling.

## 🚨 Important Notes

- **Backend Dependency**: This frontend requires a running Express.js + MongoDB backend
- **API Base URL**: Currently set to `http://localhost:5000/api`
- Uses traditional REST API integration (REST endpoints)
- **Modern Browser Required**: For CSS Grid, Flexbox, and ES6+ features

## 🎨 Customization

The design system is fully customizable through `src/index.css`:
- Color schemes and gradients
- Animation timing and effects
- Component styles and variants
- Responsive breakpoints

## 📦 Build for Production

```bash
npm run build
```

This creates an optimized build in the `dist/` directory ready for deployment.

---

**Note**: Make sure your backend server is running and accessible before starting the frontend application.
