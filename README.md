# ID Scanner & Digital Card Generator# React + TypeScript + Vite



A comprehensive web application for authenticated users to scan QR codes on student IDs, extract student data, store it in Supabase, and automatically generate unique digital membership cards.This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.



## 🎯 FeaturesCurrently, two official plugins are available:



- **User Authentication**: Secure login system with Supabase Authentication- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh

- **QR Code Scanning**: Real-time camera-based QR code scanning- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

- **Data Extraction**: Intelligent parsing of student information (Full Name, School ID, Program)

- **Dashboard Management**: Full CRUD operations on student data## React Compiler

- **Digital Card Generation**: Automatic creation of unique, shareable digital membership cards

- **Responsive Design**: Mobile-friendly interfaceThe React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).



## 🛠️ Tech Stack## Expanding the ESLint configuration



- **Frontend**: React 19 + TypeScript + ViteIf you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

- **Backend**: Supabase (Database & Authentication)

- **Libraries**:```js

  - `@supabase/supabase-js` - Supabase clientexport default defineConfig([

  - `react-router-dom` - Routing  globalIgnores(['dist']),

  - `html5-qrcode` - QR code scanning  {

  - `qrcode.react` - QR code generation    files: ['**/*.{ts,tsx}'],

    extends: [

## 📋 Prerequisites      // Other configs...



1. **Node.js** (v18 or higher)      // Remove tseslint.configs.recommended and replace with this

2. **Supabase Account** - Create a free account at [supabase.com](https://supabase.com)      tseslint.configs.recommendedTypeChecked,

3. **Modern Browser** with camera access      // Alternatively, use this for stricter rules

      tseslint.configs.strictTypeChecked,

## 🚀 Setup Instructions      // Optionally, add this for stylistic rules

      tseslint.configs.stylisticTypeChecked,

### 1. Supabase Configuration

      // Other configs...

#### Create a Supabase Project    ],

    languageOptions: {

1. Go to [supabase.com](https://supabase.com) and create a new project      parserOptions: {

2. Wait for the project to be set up (2-3 minutes)        project: ['./tsconfig.node.json', './tsconfig.app.json'],

        tsconfigRootDir: import.meta.dirname,

#### Create the Database Table      },

      // other options...

Run this SQL in the Supabase SQL Editor:    },

  },

```sql])

-- Create the scanned_students table```

CREATE TABLE scanned_students (

  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

  full_name TEXT NOT NULL,

  school_id TEXT UNIQUE NOT NULL,```js

  program TEXT NOT NULL,// eslint.config.js

  digital_card_link TEXT NOT NULL,import reactX from 'eslint-plugin-react-x'

  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,import reactDom from 'eslint-plugin-react-dom'

  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL

);export default defineConfig([

  globalIgnores(['dist']),

-- Create index on school_id for faster lookups  {

CREATE INDEX idx_school_id ON scanned_students(school_id);    files: ['**/*.{ts,tsx}'],

    extends: [

-- Create updated_at trigger      // Other configs...

CREATE OR REPLACE FUNCTION update_updated_at_column()      // Enable lint rules for React

RETURNS TRIGGER AS $$      reactX.configs['recommended-typescript'],

BEGIN      // Enable lint rules for React DOM

    NEW.updated_at = NOW();      reactDom.configs.recommended,

    RETURN NEW;    ],

END;    languageOptions: {

$$ language 'plpgsql';      parserOptions: {

        project: ['./tsconfig.node.json', './tsconfig.app.json'],

CREATE TRIGGER update_scanned_students_updated_at         tsconfigRootDir: import.meta.dirname,

  BEFORE UPDATE ON scanned_students       },

  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();      // other options...

    },

-- Enable Row Level Security (RLS)  },

ALTER TABLE scanned_students ENABLE ROW LEVEL SECURITY;])

```

-- Create policies (allows authenticated users full access)
CREATE POLICY "Enable read access for authenticated users" 
  ON scanned_students FOR SELECT 
  TO authenticated 
  USING (true);

CREATE POLICY "Enable insert for authenticated users" 
  ON scanned_students FOR INSERT 
  TO authenticated 
  WITH CHECK (true);

CREATE POLICY "Enable update for authenticated users" 
  ON scanned_students FOR UPDATE 
  TO authenticated 
  USING (true);

CREATE POLICY "Enable delete for authenticated users" 
  ON scanned_students FOR DELETE 
  TO authenticated 
  USING (true);

-- Allow public access to read digital cards
CREATE POLICY "Enable read access for digital cards" 
  ON scanned_students FOR SELECT 
  TO anon 
  USING (true);
```

#### Create Authentication User

1. In Supabase Dashboard, go to **Authentication** > **Users**
2. Click **Add User**
3. Enter email and password
4. Confirm the user creation

### 2. Local Project Setup

#### Clone and Install Dependencies

```powershell
# Navigate to your project directory
cd c:\Users\bnoel\OneDrive\Desktop\programming\site-digital-card\site-digital-card

# Install dependencies (already done)
npm install
```

#### Environment Configuration

1. Copy the example environment file:
```powershell
copy .env.example .env
```

2. Open `.env` and fill in your Supabase credentials:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

**Where to find these:**
- **VITE_SUPABASE_URL**: Supabase Dashboard → Settings → API → Project URL
- **VITE_SUPABASE_ANON_KEY**: Supabase Dashboard → Settings → API → Project API keys → `anon` `public`

### 3. Run the Application

```powershell
# Start the development server
npm run dev
```

The application will open at `http://localhost:5173`

## 📱 Usage Guide

### Login

1. Open the application in your browser
2. Enter the email and password you created in Supabase
3. Click **Login**

### Scanning Student IDs

1. Navigate to **Scanner** from the navigation bar
2. Click **Start Scanner**
3. Allow camera access when prompted
4. Position a QR code containing student data in the camera view
5. The format should be: `FULL NAME SCHOOLID PROGRAM`
   - Example: `NOEL JHUMEL G. BLANCO 2024300617 BSIT`
6. Review the extracted data
7. Click **Save to Database**

### Managing Students (Dashboard)

1. Navigate to **Dashboard**
2. View all scanned students in the table

**CRUD Operations:**
- **Create**: Click **+ Add Student** button, fill the form, and submit
- **Read**: View all students in the table
- **Update**: Click the ✏️ (edit) icon, modify the data, and save
- **Delete**: Click the 🗑️ (delete) icon and confirm

### Viewing Digital Cards

1. In the Dashboard, click **View Card** next to any student
2. The digital card will open in a new tab
3. The card displays:
   - Member's name
   - Membership ID (School ID)
   - Program
   - Expiration date
   - QR code for verification
4. You can print or share the card link

**Public Access**: Digital cards are publicly accessible via their unique URL:
- Format: `https://your-domain.com/card/SCHOOLID`
- Example: `https://your-domain.com/card/2024300617`

## 🎨 QR Code Format

The QR scanner expects data in this format:

```
FULL NAME SCHOOLID PROGRAM
```

**Example:**
```
NOEL JHUMEL G. BLANCO 2024300617 BSIT
```

**Components:**
- **Full Name**: Any length, can include middle initials (before 10-digit ID)
- **School ID**: Exactly 10 digits
- **Program**: Uppercase program code (after School ID)

## 🔒 Security

- **Authentication**: All admin operations require login
- **RLS Policies**: Row Level Security enabled on database
- **Public Cards**: Digital cards are publicly viewable (intentional for sharing)
- **Secure API Keys**: Environment variables keep credentials safe

## 🌐 Deployment

### Deploy to Vercel/Netlify

1. Push your code to GitHub
2. Connect your repository to Vercel or Netlify
3. Set environment variables in the deployment dashboard:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Deploy!

### Build for Production

```powershell
npm run build
```

The production files will be in the `dist` folder.

## 📂 Project Structure

```
site-digital-card/
├── src/
│   ├── components/
│   │   ├── Login.tsx           # Authentication component
│   │   ├── Login.css
│   │   ├── Dashboard.tsx       # Student management with CRUD
│   │   ├── Dashboard.css
│   │   ├── QRScanner.tsx       # QR code scanning
│   │   ├── QRScanner.css
│   │   ├── DigitalCard.tsx     # Digital card display
│   │   └── DigitalCard.css
│   ├── lib/
│   │   └── supabase.ts         # Supabase client setup
│   ├── types/
│   │   └── database.ts         # TypeScript types
│   ├── App.tsx                 # Main app with routing
│   ├── App.css
│   ├── main.tsx
│   └── index.css
├── .env                        # Environment variables (create this)
├── .env.example                # Environment template
├── package.json
└── README.md
```

## 🐛 Troubleshooting

### Camera Not Working
- Ensure you're using HTTPS (required for camera access)
- Grant camera permissions in browser settings
- Try a different browser (Chrome recommended)

### Authentication Errors
- Verify Supabase credentials in `.env`
- Check that the user exists in Supabase Authentication
- Ensure email is confirmed

### Database Errors
- Verify the SQL table was created correctly
- Check RLS policies are set up
- Ensure the user is authenticated

### Build Errors
- Run `npm install` again
- Delete `node_modules` and reinstall: `rm -rf node_modules; npm install`
- Check Node.js version: `node --version` (should be v18+)

## 📝 License

This project is created for educational purposes.

## 👨‍💻 Support

For issues or questions:
1. Check the Supabase documentation: [supabase.com/docs](https://supabase.com/docs)
2. Review browser console for error messages
3. Verify environment variables are set correctly

---

**Built with ❤️ using React, TypeScript, and Supabase**
