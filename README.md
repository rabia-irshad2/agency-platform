# 🚀 Agency Platform - Full-Stack Web Application

A **modern, professional agency website** built with React + Node.js. Features admin dashboard, portfolio management, blog system, and appointment booking.

**Live Demo:** [https://agency-platform-ten.vercel.app/](https://agency-platform-ten.vercel.app/)

---

## ✨ Features

### 🌐 **Public Website**
- **Modern Hero Section** - Eye-catching landing page with animated gradients
- **Services Showcase** - Display your agency services professionally
- **Portfolio Gallery** - Interactive portfolio with category filtering
- **Blog System** - Write and publish blog posts
- **Appointment Booking** - Clients can book consultation slots
- **Contact Form** - Inquiries management system
- **Responsive Design** - Works perfectly on mobile, tablet, desktop

### 👨‍💼 **Admin Dashboard**
- **Secure Login** - JWT-based authentication
- **Service Management** - Add/edit/delete services
- **Portfolio Management** - Upload and showcase projects
- **Blog Management** - Create and publish articles
- **Appointment Management** - View and manage client bookings
- **Inquiry Management** - Track customer inquiries
- **Statistics Dashboard** - View website analytics

---

## 🛠️ Tech Stack

### **Frontend**
- **React 18** - UI library
- **Vite** - Fast build tool
- **Tailwind CSS** - Styling framework
- **Axios** - HTTP client
- **React Router** - Navigation
- **Lucide React** - Icons

### **Backend**
- **Node.js** - Runtime
- **Express.js** - Web framework
- **SQLite** - Database
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **CORS** - Cross-origin requests

---

## 📁 Project Structure

```
Agency-Platform/
├── frontend/                    # React application
│   ├── src/
│   │   ├── pages/             # Page components
│   │   ├── components/        # Reusable components
│   │   ├── context/           # Auth context
│   │   ├── api/               # Axios configuration
│   │   └── index.css          # Tailwind styles
│   ├── vite.config.js         # Vite configuration
│   └── package.json
│
├── backend/                     # Express API
│   ├── routes/                # API endpoints
│   ├── middleware/            # Auth middleware
│   ├── config/                # Database config
│   ├── server.js              # Main server file
│   ├── .env                   # Environment variables
│   └── package.json
│
└── README.md
```

---

## 🚀 Getting Started

### **Prerequisites**
- Node.js 16+ installed
- npm or yarn package manager
- Git

### **Local Installation**

1. **Clone the repository**
```bash
git clone https://github.com/rabia-irshad2/agency-platform.git
cd agency-platform
```

2. **Setup Backend**
```bash
cd backend
npm install
```

3. **Setup Frontend**
```bash
cd ../frontend
npm install
```

4. **Configure Environment Variables**

Create `.env` in `backend/` folder:
```env
PORT=5000
NODE_ENV=development
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_2024
ADMIN_EMAIL=admin@agency.com
ADMIN_PASSWORD=Admin@123
```

5. **Run Backend** (Terminal 1)
```bash
cd backend
npm start
```
Backend runs at: `http://localhost:5000`

6. **Run Frontend** (Terminal 2)
```bash
cd frontend
npm run dev
```
Frontend runs at: `http://localhost:5173`

---

## 🔐 Admin Login

**Default Credentials:**
- **Email:** `admin@agency.com`
- **Password:** `Admin@123`

⚠️ **Change these in production!** Update `.env` file.

---

## 📦 API Endpoints

### **Authentication**
- `POST /api/auth/login` - Login admin
- `GET /api/auth/verify` - Verify token

### **Services**
- `GET /api/services` - Get all services
- `POST /api/services` - Create service (admin only)
- `PUT /api/services/:id` - Update service (admin only)
- `DELETE /api/services/:id` - Delete service (admin only)

### **Portfolio**
- `GET /api/portfolio` - Get portfolio items
- `POST /api/portfolio` - Create item (admin only)
- `PUT /api/portfolio/:id` - Update item (admin only)
- `DELETE /api/portfolio/:id` - Delete item (admin only)

### **Blog**
- `GET /api/blog` - Get all posts
- `GET /api/blog/:id` - Get single post
- `POST /api/blog` - Create post (admin only)
- `PUT /api/blog/:id` - Update post (admin only)
- `DELETE /api/blog/:id` - Delete post (admin only)

### **Appointments**
- `GET /api/appointments` - Get all appointments
- `POST /api/appointments` - Book appointment
- `GET /api/appointments/booked-slots` - Get booked slots
- `DELETE /api/appointments/:id` - Cancel appointment (admin only)

### **Inquiries**
- `POST /api/inquiries` - Submit inquiry
- `GET /api/inquiries` - Get all inquiries (admin only)
- `DELETE /api/inquiries/:id` - Delete inquiry (admin only)

---

## 🌐 Deployment

### **Frontend (Vercel)**

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "Import Project"
4. Select your GitHub repository
5. Set **Root Directory** to `frontend`
6. Deploy! 🚀

**Live at:** `https://your-project.vercel.app`

---

## 🔧 Configuration

### **Change Admin Credentials**

Edit `backend/.env`:
```env
ADMIN_EMAIL=your-email@example.com
ADMIN_PASSWORD=YourSecurePassword123
```

### **Change JWT Secret**

For production, update `JWT_SECRET` to a strong random string:
```bash
# Generate secure secret (on Linux/Mac)
openssl rand -base64 32
```

### **Configure API URL**

Frontend `.env`:
```env
# Development (uses Vite proxy)
VITE_API_URL=/api

# Production (use your backend URL)
VITE_API_URL=https://your-backend-url.com/api
```

---

## 📝 Database

- **Type:** SQLite
- **Location:** `backend/agency.db`
- **Auto-creates on startup** with sample data

### **Reset Database**
```bash
cd backend
node reset-db.js
```

---

## 🐛 Troubleshooting

### **Login not working?**
- Check backend is running: `http://localhost:5000`
- Verify `.env` credentials
- Clear browser cache and try again

### **API errors (ECONNREFUSED)?**
- Make sure backend is running
- Check port 5000 is available
- Restart backend server

### **Build errors?**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run dev
```

---

## 📞 Support

For issues or questions:
1. Check existing GitHub issues
2. Create new GitHub issue with detailed description
3. Include error messages and screenshots

---

## 📄 License

This project is open source and available under the MIT License.

---

## 🎉 Made with ❤️

Built with modern web technologies for agencies that want to shine online!

**Deploy now and go live!** 🚀

---

## 📊 Quick Stats

- ⚡ **Fast** - Vite build tool, optimized performance
- 🎨 **Beautiful** - Modern UI with Tailwind CSS
- 🔒 **Secure** - JWT authentication, password hashing
- 📱 **Responsive** - Works on all devices
- 🚀 **Production Ready** - Deployed on Vercel + Cyclic

---

**Repository:** [github.com/rabia-irshad2/agency-platform](https://github.com/rabia-irshad2/agency-platform)

**Live Demo:** [agency-platform-ten.vercel.app](https://agency-platform-ten.vercel.app/)
