# 🔐 Admin Login Troubleshooting Guide

## Your Login Credentials
- **Email**: `admin@agency.com`
- **Password**: `Admin@123`

## Login Page Location
The admin login page is at: **`http://localhost:5173/admin/login`**

---

## If Login is Not Working

### **Option 1: Quick Verify (Recommended First)**

1. Open terminal in the backend folder:
   ```bash
   cd backend
   node verify-admin.js
   ```

This will:
- ✅ Check if admin user exists in database
- ✅ Verify password hash is correct
- ✅ Create admin user if missing

---

### **Option 2: Reset Database (If Option 1 doesn't work)**

If the admin user is corrupted or missing, reset the database:

1. Open terminal in the backend folder:
   ```bash
   cd backend
   node reset-db.js
   ```

This will:
- 🗑️  Delete old database files
- 🔄 Recreate database with fresh seed
- 📝 Automatically create admin user with credentials from .env

---

### **Option 3: Manual Fix (Advanced)**

If you need to change credentials, edit `backend/.env`:

```env
PORT=5000
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_2024
ADMIN_EMAIL=admin@agency.com
ADMIN_PASSWORD=Admin@123
```

Then run the reset script (Option 2).

---

## Step-by-Step Login

1. Go to: **http://localhost:5173/admin/login**
2. Enter email: `admin@agency.com`
3. Enter password: `Admin@123`
4. Click "Sign In to Dashboard"
5. You should see the admin dashboard with options to:
   - ➕ Add/Edit/Delete Services
   - 📁 Manage Portfolio Projects
   - 📝 Manage Blog Posts
   - 💬 View Client Inquiries
   - 📅 View Scheduled Appointments

---

## What's on the Admin Dashboard?

After logging in, you can manage:

### 📊 Dashboard Overview
- Total inquiries received
- Total appointments booked
- Recent activities

### ➕ Services Management
- Add new services
- Edit existing services
- Delete services
- See what's on the website in real-time

### 📁 Portfolio Management
- Upload and manage project portfolio
- Mark projects as featured
- Organize by category

### 📝 Blog Management
- Create new blog posts
- Edit and delete posts
- Publish/unpublish articles
- See how many views each post has

### 💬 Inquiries
- View all client inquiries
- Mark as read/closed
- Add internal notes
- Track follow-ups

### 📅 Appointments
- View all scheduled meetings
- Confirm/cancel appointments
- Add meeting links
- Track appointment status

---

## Technical Details

**Backend API Endpoint**: `http://localhost:5000/api/auth/login`

**Request Format**:
```json
POST /api/auth/login
{
  "email": "admin@agency.com",
  "password": "Admin@123"
}
```

**Success Response**:
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "admin": {
    "id": 1,
    "email": "admin@agency.com",
    "name": "Agency Admin"
  }
}
```

---

## Common Issues & Fixes

| Issue | Solution |
|-------|----------|
| "Invalid email or password" | Run `node verify-admin.js` to check if admin exists |
| Login page won't load | Make sure frontend is running on port 5173 |
| Server connection error | Make sure backend is running on port 5000 |
| Token expired | Clear localStorage and log in again |
| Database locked | Restart both backend and frontend servers |

---

## Need to Reset Everything?

```bash
# 1. Stop both servers (Ctrl+C)

# 2. Reset database
cd backend
node reset-db.js

# 3. Start backend
npm start

# 4. In another terminal, start frontend
cd frontend
npm run dev

# 5. Login again with credentials above
```

---

**All set! Your admin panel is ready to manage the agency platform.** 🎉
