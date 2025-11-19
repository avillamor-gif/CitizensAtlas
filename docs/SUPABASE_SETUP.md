# Supabase Setup Guide for Atlas CMS

This guide will walk you through setting up Supabase for your Atlas CMS project.

## Prerequisites

- A Supabase account (sign up at https://supabase.com if you don't have one)
- Your Atlas CMS project ready to integrate with a database

## Step 1: Create a Supabase Project

1. Go to https://app.supabase.com
2. Click **"New Project"**
3. Fill in the following:
   - **Name**: `atlas-cms` (or your preferred name)
   - **Database Password**: Generate a strong password (save this somewhere safe!)
   - **Region**: Choose the region closest to your users
   - **Pricing Plan**: Start with the Free plan
4. Click **"Create new project"**
5. Wait for the project to be provisioned (2-3 minutes)

## Step 2: Get Your API Credentials

1. Once your project is ready, go to **Settings** (gear icon in the left sidebar)
2. Click on **API** in the settings menu
3. You'll see your credentials:
   - **Project URL**: Copy this (e.g., `https://xxxxx.supabase.co`)
   - **anon public**: Copy this key (safe to use in client-side code)
   - **service_role**: Copy this key (⚠️ NEVER expose this to the client!)

## Step 3: Configure Environment Variables

1. In your Atlas project root, create or update `.env.local`:

```bash
# Copy from .env.local.example and fill in your values
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

2. Replace the placeholder values with your actual Supabase credentials
3. **Never commit `.env.local` to version control!** (it's already in `.gitignore`)

## Step 4: Create Database Tables

1. In your Supabase dashboard, click on **SQL Editor** in the left sidebar
2. Click **"New Query"**
3. Copy the entire contents of `supabase/schema.sql` from your project
4. Paste it into the SQL Editor
5. Click **"Run"** or press `Ctrl/Cmd + Enter`
6. You should see a success message

This will create:
- Tables: `projects`, `news`, `publications`, `videos`
- Category tables: `news_categories`, `publication_types`, `video_categories`
- Indexes for better performance
- Row Level Security (RLS) policies for access control
- Triggers for automatic timestamp updates

## Step 5: Verify Your Setup

1. In the Supabase dashboard, click on **Table Editor**
2. You should see all 7 tables created:
   - projects
   - news
   - publications
   - videos
   - news_categories
   - publication_types
   - video_categories

## Step 6: Optional - Add Initial Categories

If you want to pre-populate categories, run these SQL statements in the SQL Editor:

```sql
-- Add initial news categories
INSERT INTO news_categories (name) VALUES
  ('Policy Updates'),
  ('Research'),
  ('Events'),
  ('Press Releases')
ON CONFLICT (name) DO NOTHING;

-- Add initial publication types
INSERT INTO publication_types (name) VALUES
  ('Report'),
  ('Policy Brief'),
  ('Case Study'),
  ('Research Paper')
ON CONFLICT (name) DO NOTHING;

-- Add initial video categories
INSERT INTO video_categories (name) VALUES
  ('Interviews'),
  ('Webinars'),
  ('Tutorials'),
  ('Documentaries')
ON CONFLICT (name) DO NOTHING;
```

## Step 7: Test the Connection

1. Restart your Next.js development server:
   ```bash
   npm run dev
   ```

2. Check the terminal for any errors related to Supabase connection

3. Your app should now be able to connect to Supabase!

## Step 8: Migrate from localStorage (Optional)

If you have existing data in localStorage that you want to migrate to Supabase:

1. Open your browser console while on the app
2. Export your localStorage data:
   ```javascript
   const data = {
     projects: JSON.parse(localStorage.getItem('atlas_projects') || '[]'),
     news: JSON.parse(localStorage.getItem('atlas_news') || '[]'),
     publications: JSON.parse(localStorage.getItem('atlas_publications') || '[]'),
     videos: JSON.parse(localStorage.getItem('atlas_videos') || '[]'),
   }
   console.log(JSON.stringify(data, null, 2))
   ```
3. Copy the output
4. Use the Supabase Table Editor to manually insert the data, or create a migration script

## Troubleshooting

### "Failed to connect to Supabase"
- ✅ Check that your `.env.local` file exists and has the correct values
- ✅ Verify your Supabase project is active (not paused due to inactivity)
- ✅ Make sure you copied the full URL including `https://`
- ✅ Restart your dev server after updating `.env.local`

### "Row Level Security policy violation"
- ✅ Make sure you ran the complete `schema.sql` file
- ✅ Check that RLS policies were created in the SQL Editor
- ✅ For testing, you can temporarily disable RLS on a table (not recommended for production)

### "Column does not exist"
- ✅ Re-run the `schema.sql` file to ensure all columns are created
- ✅ Check for typos in column names (use snake_case: `image_url` not `imageUrl`)

## Next Steps

Now that Supabase is connected, you can:

1. **Switch from localStorage to Supabase** by updating your app to use the service functions in `lib/services/supabase-service.ts`
2. **Set up authentication** to protect admin routes
3. **Enable real-time subscriptions** to see changes instantly across users
4. **Add file storage** with Supabase Storage for images and PDFs
5. **Deploy to production** with your Supabase credentials

## Security Notes

⚠️ **Important Security Practices:**

1. **Never expose `SUPABASE_SERVICE_ROLE_KEY`** in client-side code
2. Always use **Row Level Security (RLS)** policies in production
3. Keep your `.env.local` file out of version control
4. Rotate your keys if they're ever exposed
5. Use environment variables for all sensitive data

## Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Next.js + Supabase Guide](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Supabase Storage](https://supabase.com/docs/guides/storage)

---

Need help? Check the Supabase community forum or Discord!
