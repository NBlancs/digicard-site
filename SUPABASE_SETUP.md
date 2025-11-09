# Supabase Setup Guide

This guide will walk you through setting up Supabase for the ID Scanner & Digital Card Generator application.

## Step 1: Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Click **Start your project**
3. Sign in with GitHub or create an account
4. Click **New Project**
5. Fill in the details:
   - **Name**: `id-scanner-digital-card` (or any name you prefer)
   - **Database Password**: Create a strong password (save it!)
   - **Region**: Choose the closest region to you
   - **Pricing Plan**: Free (sufficient for this project)
6. Click **Create new project**
7. Wait 2-3 minutes for the project to be provisioned

## Step 2: Get Your API Credentials

1. In your Supabase project dashboard, click on **Settings** (gear icon in sidebar)
2. Click on **API** in the settings menu
3. You'll see two important values:
   - **Project URL**: Looks like `https://xxxxx.supabase.co`
   - **anon public key**: A long string starting with `eyJ...`
4. Copy these values - you'll need them for your `.env` file

## Step 3: Create the Database Table

1. In your Supabase dashboard, click on **SQL Editor** in the sidebar
2. Click **New query**
3. Copy and paste the following SQL code:

```sql
-- Create the scanned_students table
CREATE TABLE scanned_students (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  school_id TEXT UNIQUE NOT NULL,
  program TEXT NOT NULL,
  digital_card_link TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create index on school_id for faster lookups
CREATE INDEX idx_school_id ON scanned_students(school_id);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_scanned_students_updated_at 
  BEFORE UPDATE ON scanned_students 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE scanned_students ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users
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

4. Click **Run** (or press Ctrl+Enter)
5. You should see "Success. No rows returned" message

## Step 4: Verify the Table

1. Click on **Table Editor** in the sidebar
2. You should see `scanned_students` in the list of tables
3. Click on it to verify the structure:
   - id (uuid)
   - full_name (text)
   - school_id (text)
   - program (text)
   - digital_card_link (text)
   - created_at (timestamptz)
   - updated_at (timestamptz)

## Step 5: Create an Admin User

1. Click on **Authentication** in the sidebar
2. Click on **Users** tab
3. Click **Add user** (top right)
4. Choose **Create new user**
5. Fill in:
   - **Email**: Your email (e.g., `admin@example.com`)
   - **Password**: Create a strong password
   - **Auto Confirm User**: ✅ Check this box (important!)
6. Click **Create user**
7. The user should appear in the users list with a green "confirmed" badge

## Step 6: Test the Setup (Optional)

1. In **Table Editor**, click on `scanned_students`
2. Click **Insert row**
3. Fill in a test record:
   - full_name: `TEST USER`
   - school_id: `1234567890`
   - program: `TEST`
   - digital_card_link: `https://example.com/card/1234567890`
4. Click **Save**
5. The record should appear in the table
6. You can delete this test record after verification

## Step 7: Configure Your Local Project

1. In your project folder, copy `.env.example` to `.env`:
   ```powershell
   copy .env.example .env
   ```

2. Open `.env` and add your credentials:
   ```env
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-public-key
   ```

3. Replace:
   - `your-project-id` with your actual project ID
   - `your-anon-public-key` with your actual anon key (from Step 2)

## Step 8: Start Your Application

```powershell
npm run dev
```

## Troubleshooting

### "relation 'scanned_students' does not exist"
- Make sure you ran the SQL in Step 3
- Check that you're in the correct Supabase project
- Refresh the Table Editor to see if the table appears

### "Row Level Security policy violation"
- Ensure you enabled RLS and created the policies in Step 3
- Make sure the user is authenticated (logged in)
- Check that the policies were created successfully

### Cannot Login
- Verify the user exists in Authentication > Users
- Ensure "Auto Confirm User" was checked when creating the user
- Check that your `.env` file has the correct credentials
- Try creating a new user

### Database Connection Errors
- Verify your VITE_SUPABASE_URL is correct
- Verify your VITE_SUPABASE_ANON_KEY is correct
- Make sure you're using the `anon` key, not the `service_role` key
- Restart your development server after changing `.env`

## Security Notes

1. **Never commit your `.env` file** to version control
2. The `.env.example` file is safe to commit (it has placeholder values)
3. Use the `anon` key for client-side code, never the `service_role` key
4. Row Level Security (RLS) is enabled to protect your data
5. Only authenticated users can perform CRUD operations
6. Digital cards are publicly readable (this is intentional for sharing)

## Next Steps

After completing this setup:
1. Test the login functionality
2. Try scanning a QR code (or manually adding a student)
3. View the generated digital card
4. Test all CRUD operations in the dashboard

---

For more information, visit the [Supabase Documentation](https://supabase.com/docs)
