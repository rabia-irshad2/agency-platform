# 🚀 COMPLETE STEP-BY-STEP DEPLOYMENT GUIDE

## 📖 TABLE OF CONTENTS
1. Create GitHub Repository
2. Push Code to GitHub
3. Deploy Frontend to Vercel
4. Deploy Backend to Render
5. Connect & Test

---

# 🔧 PART 1: CREATE GITHUB REPOSITORY

## Step 1.1: Create GitHub Account (If you don't have one)

1. Go to **https://github.com**
2. Click **"Sign up"** button (top right)
3. Enter:
   - Email address
   - Password
   - Username (you'll use this in URLs)
4. Verify your email
5. Click **"Create account"**

---

## Step 1.2: Create New Repository

1. Log in to GitHub
2. Click **"+"** icon (top right) → Select **"New repository"**
3. Fill in details:
   - **Repository name**: `agency-platform` ← (use this exact name)
   - **Description**: `Full-stack agency website with admin panel`
   - **Visibility**: Select **"Public"** (free requires public)
   - **DO NOT initialize** with README/gitignore

4. Click **"Create repository"**

✅ Your repository is created!

---

# 📤 PART 2: PUSH CODE TO GITHUB

## Step 2.1: Install Git (If not installed)

1. Go to **https://git-scm.com/download/win**
2. Download and install
3. Accept all default settings
4. Restart your computer

---

## Step 2.2: Setup Git on Your Computer

Open PowerShell/Terminal and run:

```
git config --global user.name "Your Name"
git config --global user.email "your-email@gmail.com"
```

Example:
```
git config --global user.name "John Doe"
git config --global user.email "john@gmail.com"
```

---

## Step 2.3: Initialize Git in Your Project

Open PowerShell in your project folder:

```
E:\webdevlopment\Agency-Platform
```

Run these commands ONE BY ONE:

```bash
git init
```

Then:

```bash
git add .
```

Then:

```bash
git commit -m "Initial commit: Agency Platform Full Stack App"
```

Expected output: Lots of files being committed

---

## Step 2.4: Add Remote Repository

Go back to GitHub in browser. You'll see empty repository with blue code button.

Copy the command that looks like:
```
git remote add origin https://github.com/YOUR_USERNAME/agency-platform.git
```

Paste it in PowerShell.

---

## Step 2.5: Push Code to GitHub

Run:

```bash
git branch -M main
```

Then:

```bash
git push -u origin main
```

This will ask for:
- Username: Your GitHub username
- Password: Your GitHub password (or access token)

⏳ Wait for upload (1-5 minutes depending on internet)

✅ All your code is now on GitHub!

---

# 🌐 PART 3: DEPLOY FRONTEND TO VERCEL

## Step 3.1: Create Vercel Account

1. Go to **https://vercel.com**
2. Click **"Sign Up"** button
3. Select **"Continue with GitHub"**
4. Click **"Authorize Vercel"**
5. You're logged in! ✅

---

## Step 3.2: Import Project

1. On Vercel dashboard, click **"Add New..."** → **"Project"**
2. Click **"Import Git Repository"**
3. Paste your GitHub repository URL:
   ```
   https://github.com/YOUR_USERNAME/agency-platform
   ```
4. Click **"Continue"**

---

## Step 3.3: Configure Project

1. **Select Framework**: Choose **"Vite"** (or React)
2. **Root Directory**: Click dropdown and select **`frontend`**
3. **Build Command**: Should auto-fill as `npm run build`
4. **Output Directory**: Should show `dist`
5. Click **"Deploy"**

⏳ Wait 2-5 minutes for deployment

---

## Step 3.4: Add Environment Variable

1. After deployment finishes, go to **Settings** tab
2. Click **"Environment Variables"**
3. Click **"Add"**
4. Fill in:
   - **Name**: `VITE_API_URL`
   - **Value**: `https://agency-platform-backend.onrender.com/api`
   
   (You'll get the exact URL from Render in next part)

5. Click **"Save"**
6. Go to **Deployments** tab
7. Click **"Redeploy"** button
8. Click **"Redeploy"** in popup

✅ Your frontend is now deployed!

**Frontend URL**: https://agency-platform-YOURNAME.vercel.app

---

# 🖥️ PART 4: DEPLOY BACKEND TO RENDER

## Step 4.1: Create Render Account

1. Go to **https://render.com**
2. Click **"Get Started"** button
3. Click **"Sign up with GitHub"**
4. Click **"Authorize"**
5. You're logged in! ✅

---

## Step 4.2: Create Web Service

1. On Render dashboard, click **"New +"** button (top right)
2. Select **"Web Service"**
3. You'll see your GitHub repos
4. Find and select **`agency-platform`** repository
5. Click **"Connect"**

---

## Step 4.3: Configure Backend Settings

Fill in these fields:

- **Name**: `agency-platform-backend`
- **Environment**: `Node`
- **Region**: Select your country (or closest)
- **Branch**: `main`
- **Build Command**: `npm install`
- **Start Command**: `npm start`

**IMPORTANT - Set Root Directory:**
1. Scroll down to **"Root Directory"**
2. Enter: `backend`
3. Click **"Create Web Service"**

⏳ Wait 5-10 minutes for deployment

---

## Step 4.4: Add Environment Variables

1. After deployment starts, go to **Environment** tab
2. Under **"Environment Variables"**, click **"Add Environment Variable"**
3. Add these ONE BY ONE:

**Variable 1:**
- Name: `NODE_ENV`
- Value: `production`
- Click **"Add"**

**Variable 2:**
- Name: `PORT`
- Value: `5000`
- Click **"Add"**

**Variable 3:**
- Name: `JWT_SECRET`
- Value: `your-super-secret-random-key-at-least-32-characters-long-12345678901234567890`
- Click **"Add"**

**Variable 4:**
- Name: `ADMIN_EMAIL`
- Value: `admin@agency.com`
- Click **"Add"**

**Variable 5:**
- Name: `ADMIN_PASSWORD`
- Value: `Admin@123`
- Click **"Add"**

---

## Step 4.5: Deploy Backend

1. Scroll to top of page
2. Click **"Deploy"** button
3. Wait for logs to show: `🚀 Agency API running on...`

✅ Your backend is deployed!

**Backend URL**: https://agency-platform-backend.onrender.com

---

# 🔗 PART 5: CONNECT FRONTEND & BACKEND

## Step 5.1: Update Frontend with Backend URL

1. Go back to **Vercel** dashboard
2. Go to your **`agency-platform`** project
3. Click **Settings** tab
4. Click **Environment Variables**
5. Find **`VITE_API_URL`** variable
6. Change value to your Render URL:
   ```
   https://agency-platform-backend.onrender.com/api
   ```
7. Click **Update**
8. Go to **Deployments** tab
9. Click **"Redeploy"** button

⏳ Wait 2 minutes for redeploy

---

## Step 5.2: Test Your Website

### Test 1: Frontend Loads
1. Go to your Vercel URL:
   ```
   https://agency-platform-YOURNAME.vercel.app
   ```
2. Should see your beautiful agency website ✅

### Test 2: Backend Responds
1. Go to:
   ```
   https://agency-platform-backend.onrender.com/api/health
   ```
2. Should see JSON response:
   ```json
   {"success":true,"message":"Agency API is running"}
   ```
   ✅

### Test 3: Admin Login Works
1. Go to your frontend URL
2. Click **"Admin"** in navbar
3. Login with:
   - Email: `admin@agency.com`
   - Password: `Admin@123`
4. Should see admin dashboard ✅

---

# 🔒 SECURITY UPDATES

## Step 6.1: Update .env (IMPORTANT!)

**Backend** `backend/.env`:
```env
PORT=5000
NODE_ENV=production
JWT_SECRET=your-random-secret-key-min-32-chars-change-this
ADMIN_EMAIL=your-real-email@gmail.com
ADMIN_PASSWORD=YourNewSecurePassword@123
```

**Frontend** `frontend/.env`:
```env
VITE_API_URL=https://agency-platform-backend.onrender.com/api
```

---

## Step 6.2: Commit Changes to GitHub

1. Open PowerShell in project folder
2. Run:
   ```bash
   git add .
   ```
3. Run:
   ```bash
   git commit -m "Update environment variables for production"
   ```
4. Run:
   ```bash
   git push
   ```

This automatically redeploys on both Vercel and Render! 🎉

---

# 📊 SUMMARY - YOUR LIVE WEBSITE

| Part | URL | Status |
|------|-----|--------|
| **Frontend** | https://agency-platform-YOURNAME.vercel.app | ✅ Live |
| **Backend API** | https://agency-platform-backend.onrender.com/api | ✅ Live |
| **GitHub Code** | https://github.com/YOUR_USERNAME/agency-platform | ✅ Backed Up |

---

# 🎯 WHAT YOU GET (FREE)

✅ Website hosted on Vercel (unlimited traffic)
✅ API hosted on Render (free tier)
✅ Database (SQLite included)
✅ Auto updates (push to GitHub = auto deploy)
✅ HTTPS/SSL included
✅ Custom domain support (buy domain separately)
✅ $0/month cost

---

# 💾 NEXT STEPS (After Deployment)

1. ✅ Buy custom domain from GoDaddy/Namecheap (~$12/year)
2. ✅ Connect domain to Vercel (in Vercel Settings)
3. ✅ Add Google Analytics
4. ✅ Setup email notifications for contacts

---

# 🆘 TROUBLESHOOTING

### Website Shows 404?
- Check Vercel deployment logs
- Ensure frontend/.env has correct API URL
- Redeploy frontend

### Admin Login Not Working?
- Check Render backend logs
- Verify environment variables are set in Render
- Check database with: `node test-login.js` locally

### Backend Not Connecting?
- Check Render logs for errors
- Verify API URL in frontend is correct
- Make sure Render backend is running (green dot)

---

# 📞 NEED HELP?

If something doesn't work:
1. Check Vercel Logs: Settings → Deployments → Logs
2. Check Render Logs: Logs tab on Render
3. Check GitHub: Make sure code is pushed
4. Restart services: Redeploy manually

---

**You're now deployed! Congratulations! 🎉**

Share your website: https://agency-platform-YOURNAME.vercel.app
