# Troubleshooting Guide

## Common Issues and Solutions

### Issue: "Network error occurred" when creating account or logging in

**Cause:** The backend server is not running.

**Solution:**
1. Open a terminal in the project root directory
2. Run: `npm run dev`
3. Wait for the message: "Server running on port 5000"
4. Try again in the browser

**Alternative:** Run servers separately:
```bash
# Terminal 1 - Backend
cd server
npm run dev

# Terminal 2 - Frontend
cd client
npm run dev
```

### Issue: "Port 5000 already in use" (EADDRINUSE)

**Cause:** Another process is using port 5000.

**Solution:**
```bash
# Find the process using port 5000
netstat -ano | findstr :5000

# Kill the process (replace XXXX with the PID from above)
taskkill /F /PID XXXX

# Then start the server again
npm run dev
```

### Issue: "User with this email already exists"

**Cause:** You're trying to register with an email that's already in the database.

**Solutions:**
1. Use the login page instead
2. Use a different email address
3. Use "Forgot password?" to reset the password

### Issue: "Invalid email or password"

**Causes and Solutions:**
1. **Wrong password** - Passwords are case-sensitive, check your password
2. **Wrong email** - Check for typos in the email
3. **User doesn't exist** - Use the signup page to create an account
4. **Extra spaces** - The system trims spaces, but double-check your input

### Issue: Login/Signup works but then shows "Network error"

**Cause:** Server crashed or stopped after initial request.

**Solution:**
1. Check the server terminal for error messages
2. Restart the server: `npm run dev`
3. Check MongoDB connection in `.env` file

### Issue: Can't connect to MongoDB

**Cause:** Invalid MongoDB URI or network issues.

**Solution:**
1. Check `.env` file has correct `MONGODB_URI`
2. Make sure MongoDB Atlas allows your IP address
3. Check internet connection
4. Verify MongoDB cluster is running

## Quick Checks

### Is the backend server running?
```bash
netstat -ano | findstr :5000
```
If you see output, the server is running. If not, start it with `npm run dev`.

### Is the frontend server running?
```bash
netstat -ano | findstr :5173
```
If you see output, the frontend is running. If not, start it with `npm run dev` in the client folder.

### Test backend directly
```bash
# Test registration
curl -X POST http://localhost:5000/api/auth/register -H "Content-Type: application/json" -d "{\"name\":\"Test\",\"email\":\"test@test.com\",\"password\":\"test123\"}"

# Test login
curl -X POST http://localhost:5000/api/auth/login -H "Content-Type: application/json" -d "{\"email\":\"test@test.com\",\"password\":\"test123\"}"
```

## Current Working Credentials

After database seed, these accounts exist:
1. **john.doe@example.com** / `password123`
2. **avaniishh@gmail.com** / `test123`

## Server Status Check

### Backend (Port 5000)
- URL: http://localhost:5000
- Status: Should show "Cannot GET /" (this is normal)
- API: http://localhost:5000/api/auth/login

### Frontend (Port 5173 or 5174)
- URL: http://localhost:5173 or http://localhost:5174
- Should show the landing page

## Getting Help

If issues persist:
1. Check server console for error messages
2. Check browser console (F12) for errors
3. Verify `.env` file exists and has correct values
4. Try restarting both servers
5. Clear browser cache and localStorage

## Emergency Reset

If nothing works:
```bash
# Stop all Node processes
taskkill /F /IM node.exe

# Reinstall dependencies
cd server
npm install
cd ../client
npm install

# Reseed database
cd ../server
node seed.js

# Start fresh
cd ..
npm run dev
```
