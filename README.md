# Notes Application - Development Journey

## Project Overview
A full-stack notes application built with React and Node.js, featuring authentication, role-based access, and advanced note management. This document outlines our development journey, challenges faced, and solutions implemented.

## Live Demo
- Frontend: [https://kenmark-suraj.vercel.app/login](https://kenmark-suraj.vercel.app/login)
- Backend API: [https://kenmark1.onrender.com](https://kenmark1.onrender.com)

### Demo Credentials
```bash
Email: admin@gmail.com
Password: Admin@123
```

### Features
- 🔐 User Authentication (JWT + Google OAuth)
- 👥 Role-Based Access Control (Admin/User)
- 📝 Advanced Note Management
- 🏷️ Tags and Categories
- 🎨 Color Customization
- 🌓 Dark Mode Support
- 📱 Responsive Design
- 🔍 Advanced Search & Filtering

## Phase 1: Project Foundation & Authentication
### Initial Setup 
- Set up the project structure for both frontend and backend
- Configured essential dependencies:
  - Backend: Express, MongoDB, JWT, Passport
  - Frontend: React, Tailwind CSS, Framer Motion
- Established MongoDB connection and basic server setup

### Authentication Implementation 
- Created user model with password hashing using bcrypt
- Implemented JWT-based authentication
- Built login and signup pages
- Added form validation and error handling

### Authentication Challenges & Fixes
1. **Session Management Issue**
   - Problem: Users were being logged out unexpectedly
   - Solution: Implemented proper JWT storage and refresh mechanism

2. **Google OAuth Integration**
   - Challenge: Callback URL configuration issues
   - Fix: Properly configured environment variables and added clear error handling
   - Added proper state management for OAuth flow

## Phase 2: Notes Management 
### Core Notes Functionality
- Implemented CRUD operations for notes
- Added tags system and color customization
- Created responsive dashboard layout

### UI/UX Improvements
- Added smooth transitions using Framer Motion
- Implemented dark mode support
- Created loading states and error handling
- Added toast notifications for user feedback

### Notable Fixes
1. **Note Creation Bug**
   - Issue: Notes weren't showing up immediately after creation
   - Solution: Implemented optimistic updates in the UI

2. **Mobile Responsiveness**
   - Problem: Layout issues on smaller screens
   - Fix: Added proper responsive design and tested across devices

## Phase 3: Admin Features & RBAC 
### Admin Dashboard
- Implemented role-based access control
- Created admin dashboard for user management
- Added user role modification functionality

### Security Enhancements
- Added protected routes
- Implemented proper error handling middleware
- Added input validation and sanitization

### Challenges Addressed
1. **Permission Management**
   - Issue: Users accessing admin routes through URL manipulation
   - Solution: Added server-side role verification

2. **User Role Updates**
   - Problem: Role changes weren't reflecting immediately
   - Fix: Implemented proper state management and real-time updates

## Phase 4: Search & Filter Features
### Advanced Note Management
- Implemented full-text search
- Added multiple filtering options:
  - Date-based filtering
  - Tag-based filtering
  - Color filtering
- Added sorting functionality

### Performance Optimizations
- Implemented debounced search
- Added proper indexing in MongoDB
- Optimized state management for better performance

## Phase 5: Testing & Documentation 
### Testing Implementation
- Added unit tests for Dashboard component
- Implemented API endpoint testing
- Added error boundary testing

### Documentation
- Added comprehensive API documentation
- Created user guides
- Documented setup process

## API Endpoints Documentation

### Authentication Endpoints
```bash
# User Registration
POST /api/auth/signup
Content-Type: application/json
{
    "username": "string",
    "email": "string",
    "password": "string"
}

# User Login
POST /api/auth/login
Content-Type: application/json
{
    "email": "string",
    "password": "string"
}

# Google OAuth Login
GET /api/auth/google

# Google OAuth Callback
GET /api/auth/google/callback

# Get Current User Profile
GET /api/auth/me
Authorization: Bearer <token>

# Password Reset Request
POST /api/auth/forgot-password
Content-Type: application/json
{
    "email": "string"
}
```

### Notes Endpoints
```bash
# Get All Notes
GET /api/notes
Authorization: Bearer <token>

# Get Single Note
GET /api/notes/:id
Authorization: Bearer <token>

# Create Note
POST /api/notes
Authorization: Bearer <token>
Content-Type: application/json
{
    "title": "string",
    "content": "string",
    "tags": ["string"],
    "color": "string"
}

# Update Note
PUT /api/notes/:id
Authorization: Bearer <token>
Content-Type: application/json
{
    "title": "string",
    "content": "string",
    "tags": ["string"],
    "color": "string"
}

# Delete Note
DELETE /api/notes/:id
Authorization: Bearer <token>
```

### Admin Endpoints
```bash
# Get All Users (Admin Only)
GET /api/admin/users
Authorization: Bearer <token>

# Update User Role (Admin Only)
PATCH /api/admin/users/:userId/role
Authorization: Bearer <token>
Content-Type: application/json
{
    "role": "user" | "admin"
}
```

### Response Formats

#### Success Response
```json
{
    "data": {}, // Response data
    "message": "Success message"
}
```

#### Error Response
```json
{
    "message": "Error message",
    "errors": [] // Validation errors if any
}
```

### Authentication
All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

### Status Codes
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Server Error

## Current Features
### Authentication & Authorization
- User authentication (signup, login, JWT)
- Google OAuth integration
- Role-based access control
- Password reset functionality(Not Working)
- Admin credentials for testing

### Note Management
- Create, read, update, delete notes
- Color customization
- Tags and categories
- Advanced search and filtering
- Responsive design with dark mode

### Admin Features
- User management dashboard
- Role management
- User activity monitoring

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- npm or yarn
- Google OAuth credentials

### Installation Steps
1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd <project-directory>
   ```

2. Backend setup:
   ```bash
   cd backend
   npm install
   ```

3. Create .env file in backend:
   ```env
   MONGODB_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   PORT=5000
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   FRONTEND_URL=http://localhost:5173
   BACKEND_URL=http://localhost:5000
   ```

4. Frontend setup:
   ```bash
   cd ../frontend
   npm install
   ```

5. Start development servers:
   ```bash
   # Terminal 1 - Backend
   cd backend
   npm run dev

   # Terminal 2 - Frontend
   cd frontend
   npm run dev
   ```

## Admin Access
Use these credentials to access admin features:
- Email: admin@gmail.com
- Password: Admin@123

## Future Roadmap
### Planned Features
- Rich text editor integration
- Real-time collaboration
- Note sharing functionality
- File attachments
- E2E testing implementation

### Known Issues & TODOs
1. Implement email verification
2. Add rate limiting for API endpoints
3. Implement refresh token mechanism
4. Add more comprehensive test coverage

## Contributing
1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## Tech Stack
### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT & Passport.js
- bcrypt

### Frontend
- React
- Tailwind CSS
- Framer Motion
- React Router
- Axios

## License
This project is licensed under the MIT License.
