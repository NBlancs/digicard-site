# Application Flow Diagram

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     ID SCANNER & DIGITAL CARD                   │
│                         GENERATOR SYSTEM                         │
└─────────────────────────────────────────────────────────────────┘

┌──────────────────┐         ┌──────────────────┐         ┌──────────────────┐
│                  │         │                  │         │                  │
│   ADMIN USER     │────────▶│  REACT FRONTEND  │◀────────│  SUPABASE        │
│   (Browser)      │         │  (TypeScript)    │         │  BACKEND         │
│                  │         │                  │         │                  │
└──────────────────┘         └──────────────────┘         └──────────────────┘
                                     │                            │
                                     │                            │
                                     ▼                            ▼
                            ┌─────────────────┐          ┌─────────────────┐
                            │  Components:    │          │  Database:      │
                            │  - Login        │          │  - Auth Table   │
                            │  - Dashboard    │          │  - Students Tbl │
                            │  - QR Scanner   │          │                 │
                            │  - Digital Card │          │  Security:      │
                            └─────────────────┘          │  - JWT Auth     │
                                     │                   │  - RLS Policies │
                                     │                   └─────────────────┘
                                     ▼
                            ┌─────────────────┐
                            │  Libraries:     │
                            │  - html5-qrcode │
                            │  - qrcode.react │
                            │  - router-dom   │
                            └─────────────────┘
```

## User Journey Flow

### 1. Authentication Flow
```
┌────────────┐
│   START    │
└─────┬──────┘
      │
      ▼
┌────────────────────┐
│  Login Screen      │
│  - Enter Email     │
│  - Enter Password  │
└─────┬──────────────┘
      │
      ▼
┌────────────────────┐
│  Supabase Auth     │
│  - Validate User   │
│  - Create Session  │
└─────┬──────────────┘
      │
      ├─── ✅ Success ────▶ Dashboard
      │
      └─── ❌ Error ──────▶ Error Message
```

### 2. QR Scanning Flow
```
┌────────────┐
│  Dashboard │
└─────┬──────┘
      │
      ▼
┌────────────────────┐
│  Click Scanner     │
└─────┬──────────────┘
      │
      ▼
┌────────────────────┐
│  Start Camera      │
│  - Request Access  │
│  - Activate Scanner│
└─────┬──────────────┘
      │
      ▼
┌────────────────────┐
│  QR Code Detected  │
│  - Read Data       │
│  - Parse Text      │
└─────┬──────────────┘
      │
      ▼
┌────────────────────┐
│  Extract Data      │
│  - Full Name       │
│  - School ID       │
│  - Program         │
└─────┬──────────────┘
      │
      ▼
┌────────────────────┐
│  Display Preview   │
│  - Show Extracted  │
│  - Confirm/Cancel  │
└─────┬──────────────┘
      │
      ▼
┌────────────────────┐
│  Save to Database  │
│  - Generate Link   │
│  - Store Record    │
└─────┬──────────────┘
      │
      ▼
┌────────────────────┐
│  Success Message   │
│  - Show Card Link  │
└────────────────────┘
```

### 3. CRUD Operations Flow
```
┌──────────────┐
│  Dashboard   │
└──────┬───────┘
       │
       ├─── CREATE ────┐
       │               │
       │               ▼
       │      ┌─────────────────┐
       │      │  Add Student    │
       │      │  - Fill Form    │
       │      │  - Validate     │
       │      │  - Save         │
       │      └─────────────────┘
       │
       ├─── READ ──────┐
       │               │
       │               ▼
       │      ┌─────────────────┐
       │      │  View Table     │
       │      │  - List All     │
       │      │  - Show Details │
       │      └─────────────────┘
       │
       ├─── UPDATE ────┐
       │               │
       │               ▼
       │      ┌─────────────────┐
       │      │  Edit Student   │
       │      │  - Load Data    │
       │      │  - Modify       │
       │      │  - Update DB    │
       │      └─────────────────┘
       │
       └─── DELETE ────┐
                       │
                       ▼
              ┌─────────────────┐
              │  Remove Student │
              │  - Confirm      │
              │  - Delete       │
              └─────────────────┘
```

### 4. Digital Card Generation Flow
```
┌────────────────────┐
│  Student Added     │
│  to Database       │
└─────┬──────────────┘
      │
      ▼
┌────────────────────┐
│  Generate Link     │
│  /card/{schoolId}  │
└─────┬──────────────┘
      │
      ▼
┌────────────────────┐
│  Store Link in DB  │
└─────┬──────────────┘
      │
      ▼
┌────────────────────┐
│  User Visits Link  │
└─────┬──────────────┘
      │
      ▼
┌────────────────────┐
│  Fetch Student     │
│  Data from DB      │
└─────┬──────────────┘
      │
      ▼
┌────────────────────┐
│  Render Card       │
│  - Name            │
│  - ID              │
│  - Program         │
│  - QR Code         │
└─────┬──────────────┘
      │
      ▼
┌────────────────────┐
│  Actions           │
│  - Print           │
│  - Share           │
└────────────────────┘
```

## Data Flow Diagram

```
┌─────────────┐
│   Camera    │
└──────┬──────┘
       │ QR Code Image
       ▼
┌─────────────┐
│html5-qrcode │
└──────┬──────┘
       │ Decoded Text
       ▼
┌─────────────┐
│   Regex     │
│  Extractor  │
└──────┬──────┘
       │ Parsed Data
       ▼
┌─────────────┐
│   React     │
│   State     │
└──────┬──────┘
       │ Student Object
       ▼
┌─────────────┐
│  Supabase   │
│   Client    │
└──────┬──────┘
       │ SQL Insert
       ▼
┌─────────────┐
│ PostgreSQL  │
│  Database   │
└──────┬──────┘
       │ Stored Record
       ▼
┌─────────────┐
│  Dashboard  │
│   Table     │
└─────────────┘
```

## Component Hierarchy

```
App.tsx
│
├── Router
│   │
│   ├── Public Routes
│   │   └── /card/:schoolId ────▶ DigitalCard.tsx
│   │
│   └── Protected Routes (Auth Required)
│       │
│       ├── /login ────▶ Login.tsx
│       │
│       ├── Navbar
│       │   ├── Dashboard Link
│       │   ├── Scanner Link
│       │   └── Logout Button
│       │
│       ├── Main Content
│       │   │
│       │   ├── /dashboard ────▶ Dashboard.tsx
│       │   │                    ├── Student Table
│       │   │                    ├── Add Form
│       │   │                    ├── Edit Form
│       │   │                    └── CRUD Actions
│       │   │
│       │   └── /scanner ────▶ QRScanner.tsx
│       │                       ├── Camera View
│       │                       ├── Scanner Controls
│       │                       └── Data Preview
│       │
│       └── Footer
```

## Database Relationships

```
┌─────────────────────────────────────┐
│     scanned_students (Table)        │
├─────────────────────────────────────┤
│  id (PK) ────────────────┐          │
│  full_name               │          │
│  school_id (UNIQUE) ─────┼──┐       │
│  program                 │  │       │
│  digital_card_link       │  │       │
│  created_at              │  │       │
│  updated_at              │  │       │
└──────────────────────────┼──┼───────┘
                           │  │
                           │  │ Used in URL
                           │  └──────────────┐
                           │                 │
                Primary    │                 ▼
                Key        │    /card/:schoolId
                           │    (Digital Card Route)
                           │
                           │
                           ▼
                 Indexed for Fast Lookup
```

## Security Layers

```
┌─────────────────────────────────────────┐
│           Security Architecture          │
└─────────────────────────────────────────┘

Layer 1: Frontend Protection
┌─────────────────────────────────────────┐
│  - Protected Routes (React Router)      │
│  - Session Validation                   │
│  - Input Sanitization                   │
└─────────────────────────────────────────┘
                   │
                   ▼
Layer 2: Authentication
┌─────────────────────────────────────────┐
│  - Supabase Auth (JWT)                  │
│  - Email/Password Validation            │
│  - Session Management                   │
└─────────────────────────────────────────┘
                   │
                   ▼
Layer 3: Database Security
┌─────────────────────────────────────────┐
│  - Row Level Security (RLS)             │
│  - Policy-based Access Control          │
│  - Prepared Statements                  │
└─────────────────────────────────────────┘
                   │
                   ▼
Layer 4: Environment Security
┌─────────────────────────────────────────┐
│  - Environment Variables                │
│  - .gitignore Protection                │
│  - HTTPS in Production                  │
└─────────────────────────────────────────┘
```

## Deployment Pipeline

```
┌──────────────┐
│  Developer   │
└──────┬───────┘
       │ git push
       ▼
┌──────────────┐
│   GitHub     │
└──────┬───────┘
       │ webhook
       ▼
┌──────────────┐
│ Vercel/      │
│ Netlify      │
└──────┬───────┘
       │
       ├─── Install Dependencies (npm install)
       │
       ├─── Build (npm run build)
       │
       ├─── Add Environment Variables
       │
       └─── Deploy to CDN
              │
              ▼
       ┌──────────────┐
       │  Production  │
       │     URL      │
       └──────────────┘
```

---

This diagram provides a visual representation of the entire application architecture, data flow, and user journeys.
