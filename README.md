# Project Analysization Platform - Authentication Module

A complete authentication system for a project analysis platform with role-based access control.

## 🚀 Features

### Authentication
- User Registration (Students only)
- Login with email/password
- Forgot Password with OTP verification
- Password Reset
- Role-based redirects (Admin, Mentor, Student)

### Security
- JWT Authentication
- bcrypt Password Hashing
- OTP-based password reset
- Protected Routes
- Role-based Authorization

### UI/UX
- Modern, clean design with Tailwind CSS
- Mobile-first responsive layout
- Form validation
- Loading states
- Error handling

## 🛠 Tech Stack

### Frontend
- React.js (Vite)
- Tailwind CSS
- React Router DOM
- Axios

### Backend
- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT
- bcrypt
- Nodemailer

## 📁 Project Structure

```
├── backend/
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   └── admin.controller.js
│   ├── middleware/
│   │   └── auth.middleware.js
│   ├── models/
│   │   └── user.model.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   └── admin.routes.js
│   ├── seed/
│   │   └── seedAdmin.js
│   ├── utils/
│   │   ├── generateOtp.js
│   │   └── sendEmail.js
│   ├── server.js
│   └── package.json
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── InputField.jsx
    │   │   └── Button.jsx
    │   ├── pages/
    │   │   ├── Login.jsx
    │   │   ├── Signup.jsx
    │   │   ├── ForgotPassword.jsx
    │   │   ├── VerifyOtp.jsx
    │   │   └── ResetPassword.jsx
    │   ├── routes/
    │   │   └── ProtectedRoute.jsx
    │   ├── services/
    │   │   └── api.js
    │   └── App.jsx
    └── package.json
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- Gmail account (for OTP emails)

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```env
MONGODB_URI=mongodb://localhost:27017/project-analization-platform
JWT_SECRET=your-super-secret-jwt-key-here
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASS=your-app-password
```

4. Seed admin user:
```bash
npm run seed
```

5. Start backend server:
```bash
npm start
```

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
npm run dev
```

## 📧 Email Configuration

For OTP functionality, you need to:
1. Enable 2-factor authentication on your Gmail account
2. Generate an App Password
3. Use the App Password in `EMAIL_PASS` environment variable

## 👥 User Roles

### Admin
- Default credentials: `admin@ecothrive.com` / `admin123`
- Can create mentors
- Full system access

### Mentor
- Created by admin
- Limited access to mentor features

### Student
- Self-registration
- Access to student features

## 🔗 API Endpoints

### Authentication
- `POST /api/auth/register` - Student registration
- `POST /api/auth/login` - User login
- `POST /api/auth/forgot-password` - Send OTP
- `POST /api/auth/verify-otp` - Verify OTP
- `POST /api/auth/reset-password` - Reset password

### Admin
- `POST /api/admin/create-mentor` - Create mentor (Admin only)

## 🌟 Pages

1. **Login** (`/login`) - User authentication
2. **Signup** (`/signup`) - Student registration
3. **Forgot Password** (`/forgot-password`) - Request OTP
4. **Verify OTP** (`/verify-otp`) - OTP verification
5. **Reset Password** (`/reset-password`) - Set new password

## 🔐 Security Features

- Password hashing with bcrypt
- JWT token authentication
- OTP-based password reset
- Role-based access control
- Input validation and sanitization
- Protected routes

## 📱 Responsive Design

The application is fully responsive and works seamlessly on:
- Desktop computers
- Tablets
- Mobile devices

## 🎨 UI Features

- Modern, clean interface
- Soft shadows and rounded corners
- Orange primary color scheme
- Loading states
- Form validation feedback
- Password visibility toggle

## 🚀 Deployment

### Backend (Heroku/Render)
- Set environment variables
- Connect to MongoDB Atlas
- Deploy using build command: `npm start`

### Frontend (Vercel/Netlify)
- Build command: `npm run build`
- Output directory: `dist`
- Set API base URL in environment

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License.
