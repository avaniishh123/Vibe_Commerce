# 🎯 Vibe Commerce - Command Reference Guide

Complete guide for running and managing your Vibe Commerce application.

---

## 🚀 Quick Start (Most Common)

### Start Everything (Frontend + Backend)
```bash
npm run dev
```
- Starts both frontend and backend simultaneously
- Frontend: http://localhost:5173 (or 5174)
- Backend: http://localhost:5000

---

## 📦 First Time Setup

### 1. Install All Dependencies
```bash
npm run install-all
```
This installs dependencies for:
- Root project
- Server (backend)
- Client (frontend)

### 2. Configure Environment Variables

Make sure you have these files:

**Root `.env`:**
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
NODE_ENV=development
```

**Client `.env`:**
```env
VITE_API_URL=http://localhost:5000
```

### 3. Seed the Database
```bash
cd server
npm run seed
cd ..
```
This adds 15 products to your database.

### 4. Start the Application
```bash
npm run dev
```

---

## 🎮 Running Commands

### Option 1: Run Both Together (Recommended)

**From root directory:**
```bash
npm run dev
```

**What it does:**
- Runs `concurrently` to start both servers
- Backend starts on port 5000
- Frontend starts on port 5173 (or next available)
- Both run in the same terminal

**To stop:**
- Press `Ctrl + C`

---

### Option 2: Run Separately

#### Backend Only

**Terminal 1:**
```bash
cd server
npm run dev
```
- Runs on: http://localhost:5000
- API endpoints available at `/api/*`

#### Frontend Only

**Terminal 2:**
```bash
cd client
npm run dev
```
- Runs on: http://localhost:5173
- Opens in browser automatically

---

## 🧪 Testing Commands

### Run All Tests

**Frontend Tests:**
```bash
cd client
npm test
```

**Backend Tests:**
```bash
cd server
npm test
```

### Watch Mode (Auto-rerun on changes)

**Frontend:**
```bash
cd client
npm run test:watch
```

**Backend:**
```bash
cd server
npm test -- --watch
```

---

## 🗄️ Database Commands

### Seed Database (Add Products)
```bash
cd server
npm run seed
```
- Clears existing products
- Adds 15 products
- Creates mock user

### Clear Database
```bash
cd server
node -e "require('./config/db')(); require('./models/Product').deleteMany({}).then(() => process.exit())"
```

---

## 🏗️ Build Commands

### Build Frontend for Production
```bash
cd client
npm run build
```
- Creates optimized production build
- Output in `client/dist/`

### Preview Production Build
```bash
cd client
npm run preview
```
- Serves the production build locally
- Test before deploying

---

## 📊 Development Commands

### Check for Errors (Linting)

**Frontend:**
```bash
cd client
npm run lint
```

**Backend:**
```bash
cd server
npm run lint
```

### Format Code
```bash
# If you have prettier installed
npm run format
```

---

## 🔧 Troubleshooting Commands

### Check if Ports are in Use

**Windows:**
```bash
netstat -ano | findstr :5000
netstat -ano | findstr :5173
```

**Kill Process on Port:**
```bash
# Replace PID with the process ID from netstat
taskkill /PID <PID> /F
```

### Clear Node Modules and Reinstall

**Root:**
```bash
rmdir /s /q node_modules
npm install
```

**Server:**
```bash
cd server
rmdir /s /q node_modules
npm install
cd ..
```

**Client:**
```bash
cd client
rmdir /s /q node_modules
npm install
cd ..
```

### Clear All and Reinstall Everything
```bash
rmdir /s /q node_modules
cd server
rmdir /s /q node_modules
cd ../client
rmdir /s /q node_modules
cd ..
npm run install-all
```

---

## 🌐 Access URLs

Once running, access these URLs:

| Page | URL |
|------|-----|
| Landing Page | http://localhost:5173/ |
| Login | http://localhost:5173/login |
| Signup | http://localhost:5173/signup |
| Shop (Products) | http://localhost:5173/shop |
| Cart | http://localhost:5173/cart |
| Checkout | http://localhost:5173/checkout |
| API Root | http://localhost:5000/ |
| API Products | http://localhost:5000/api/products |
| API Cart | http://localhost:5000/api/cart |

---

## 📝 Package.json Scripts Reference

### Root Package.json
```json
{
  "dev": "concurrently \"npm run server\" \"npm run client\"",
  "server": "cd server && npm run dev",
  "client": "cd client && npm run dev",
  "install-all": "npm install && cd server && npm install && cd ../client && npm install"
}
```

### Server Package.json
```json
{
  "dev": "node server.js",
  "start": "node server.js",
  "seed": "node seed.js",
  "test": "jest --runInBand --detectOpenHandles"
}
```

### Client Package.json
```json
{
  "dev": "vite",
  "build": "vite build",
  "preview": "vite preview",
  "test": "vitest --run",
  "test:watch": "vitest"
}
```

---

## 🎯 Common Workflows

### Starting Fresh Development Session
```bash
# 1. Navigate to project
cd path/to/vibe-commerce

# 2. Start everything
npm run dev

# 3. Open browser to http://localhost:5173
```

### After Pulling New Code
```bash
# 1. Install any new dependencies
npm run install-all

# 2. Reseed database if needed
cd server
npm run seed
cd ..

# 3. Start application
npm run dev
```

### Before Committing Code
```bash
# 1. Run tests
cd client
npm test
cd ../server
npm test
cd ..

# 2. Check for errors
# (Run linting if configured)

# 3. Commit your changes
git add .
git commit -m "Your message"
git push
```

---

## 🐛 Common Issues & Solutions

### Issue: "Port 5173 is already in use"
**Solution:** Vite will automatically use the next available port (5174, 5175, etc.)

### Issue: "Cannot connect to MongoDB"
**Solution:** 
1. Check your MongoDB URI in `.env`
2. Ensure your IP is whitelisted in MongoDB Atlas
3. Check internet connection

### Issue: "Module not found"
**Solution:**
```bash
npm run install-all
```

### Issue: "Products not showing"
**Solution:**
```bash
cd server
npm run seed
cd ..
npm run dev
```

### Issue: Backend not responding
**Solution:**
1. Check if backend is running (should see "Server running on port 5000")
2. Check MongoDB connection (should see "MongoDB connected")
3. Restart: `Ctrl+C` then `npm run dev`

---

## 💡 Pro Tips

### Tip 1: Keep Terminal Open
Keep the terminal running `npm run dev` open while developing. It shows:
- Server logs
- API requests
- Errors and warnings
- Hot reload notifications

### Tip 2: Use Multiple Terminals
For better control:
- Terminal 1: Backend (`cd server && npm run dev`)
- Terminal 2: Frontend (`cd client && npm run dev`)
- Terminal 3: For running commands (seed, test, etc.)

### Tip 3: Auto-Reload
Both frontend and backend support hot reload:
- Frontend: Changes reflect immediately
- Backend: Restart server to see changes

### Tip 4: Check Logs
If something isn't working:
1. Check the terminal for errors
2. Check browser console (F12)
3. Check Network tab for API errors

---

## 📚 Additional Resources

- **README.md** - Complete project documentation
- **QUICK_START.md** - Quick start guide
- **.kiro/specs/** - Detailed specifications and reviews

---

## 🎉 You're All Set!

**To start developing right now:**

```bash
npm run dev
```

Then open http://localhost:5173 in your browser!

---

**Need help?** Check the troubleshooting section above or review the documentation files.

**Happy coding! 🚀**
