# Quick Start Guide

Get the ID Scanner & Digital Card Generator running in 5 minutes!

## Prerequisites Checklist

- [ ] Node.js v18+ installed
- [ ] Modern browser (Chrome, Firefox, Edge)
- [ ] Supabase account created
- [ ] Camera-enabled device (for QR scanning)

## Step 1: Supabase Setup (5 minutes)

### 1.1 Create Project
1. Go to [supabase.com](https://supabase.com) → **New Project**
2. Name: `id-scanner` | Region: Choose nearest | Create

### 1.2 Create Database Table
1. Click **SQL Editor** → **New query**
2. Paste and run the SQL from `SUPABASE_SETUP.md` (Step 3)
3. Verify: Check **Table Editor** → See `scanned_students` table

### 1.3 Create Admin User
1. Click **Authentication** → **Users** → **Add user**
2. Email: `admin@test.com` (or your email)
3. Password: Create a strong one
4. ✅ **Auto Confirm User** checkbox
5. Click **Create user**

### 1.4 Get API Keys
1. **Settings** → **API**
2. Copy:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public key**: `eyJ...`

## Step 2: Local Setup (2 minutes)

### 2.1 Install Dependencies
```powershell
npm install
```

### 2.2 Configure Environment
1. Copy the example file:
   ```powershell
   copy .env.example .env
   ```

2. Edit `.env` with your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJ...your-anon-key...
   ```

### 2.3 Start Development Server
```powershell
npm run dev
```

Open: http://localhost:5173

## Step 3: Test the Application (3 minutes)

### 3.1 Login
1. Open the application
2. Enter the admin credentials you created
3. Click **Login**

### 3.2 Add a Test Student (Manual)
1. Navigate to **Dashboard**
2. Click **+ Add Student**
3. Fill in:
   - Full Name: `JOHN SMITH DOE`
   - School ID: `1234567890` (10 digits)
   - Program: `BSIT`
4. Click **Save Student**

### 3.3 View Digital Card
1. In the Dashboard table, find your test student
2. Click **View Card**
3. A new tab opens showing the digital membership card
4. Test the **Print Card** and **Share Link** buttons

### 3.4 Test QR Scanner (Optional)
1. Generate a QR code with text: `JOHN SMITH DOE 1234567890 BSIT`
   - Use any QR generator: https://www.qr-code-generator.com
2. Navigate to **Scanner**
3. Click **Start Scanner**
4. Allow camera access
5. Show the QR code to your camera
6. Verify data is extracted correctly
7. Click **Save to Database**

### 3.5 Test CRUD Operations
- **Read**: View all students in the dashboard ✅
- **Update**: Click ✏️ icon, modify data, save
- **Delete**: Click 🗑️ icon, confirm deletion

## Common Issues & Quick Fixes

### ❌ "Cannot connect to Supabase"
**Fix**: Check `.env` file has correct credentials. Restart server after editing `.env`.

### ❌ "Authentication failed"
**Fix**: 
1. Verify user exists in Supabase → Authentication → Users
2. Ensure "Auto Confirm User" was checked
3. Try creating a new user

### ❌ "Row Level Security policy violation"
**Fix**: Run the full SQL script from `SUPABASE_SETUP.md` - you might have missed the RLS policies.

### ❌ Camera not working
**Fix**:
1. Use Chrome browser (best compatibility)
2. Allow camera permissions when prompted
3. Use HTTPS in production (required for camera access)
4. Check browser settings → Privacy & Security → Site Settings → Camera

### ❌ TypeScript errors in VS Code
**Fix**: These are Supabase type generation warnings. The app will work correctly. To fix:
```powershell
npm install --save-dev supabase
npx supabase gen types typescript --project-id your-project-id > src/types/database.ts
```

## What's Next?

### Production Deployment
1. Push code to GitHub
2. Deploy to Vercel/Netlify
3. Add environment variables in hosting dashboard
4. Done! 🚀

### Customization Ideas
- Change color scheme in CSS files
- Add more student fields (year, section, etc.)
- Customize digital card design
- Add email notifications
- Export data to Excel/CSV
- Add student photos
- Implement QR code bulk generation

## Support

- **Full documentation**: See `README.md`
- **Detailed Supabase guide**: See `SUPABASE_SETUP.md`
- **Supabase docs**: https://supabase.com/docs
- **React Router docs**: https://reactrouter.com

## Project Structure Overview

```
src/
├── components/
│   ├── Login.tsx         → Authentication
│   ├── Dashboard.tsx     → Student management (CRUD)
│   ├── QRScanner.tsx     → QR code scanning
│   └── DigitalCard.tsx   → Membership card display
├── lib/
│   └── supabase.ts       → Supabase client
├── types/
│   └── database.ts       → TypeScript types
└── App.tsx               → Main app + routing
```

## Feature Checklist

- [x] User authentication with Supabase
- [x] QR code scanning with camera
- [x] Data extraction (Name, ID, Program)
- [x] Automatic data storage
- [x] Full CRUD operations
- [x] Digital card generation
- [x] Unique public card URLs
- [x] Responsive design
- [x] Print/Share functionality

---

**🎉 You're all set! Start scanning and generating digital cards!**
