# Database Migrations

This directory contains SQL migrations for the Citizens Atlas database setup in Supabase PostgreSQL.

## Available Migrations

### 1. Partner Reports Table (`001_create_partner_reports_table.sql`)

Creates the `partner_reports` table for persistent storage of citizen reports.

#### Setup Instructions

Go to your Supabase project:
- Navigate to **SQL Editor** → **New Query**
- Copy the contents of `001_create_partner_reports_table.sql`
- Execute the query

### 2. Publication Solution Type Column (`002_add_publication_solution_type.sql`)

Adds the `publication_solution_type` column to the `publications` table to enable the display of solution type badges on the publications page.

#### Setup Instructions

Go to your Supabase project:
- Navigate to **SQL Editor** → **New Query**
- Copy the contents of `002_add_publication_solution_type.sql`
- Execute the query

This migration:
- Adds `publication_solution_type` column with type VARCHAR(50)
- Sets default value to 'False Solutions'
- Creates an index for efficient filtering

#### Verify the Column

```sql
SELECT id, title, publication_solution_type FROM publications LIMIT 5;
```

#### Update Existing Records (Optional)

```sql
UPDATE publications 
SET publication_solution_type = 'False Solutions' 
WHERE publication_solution_type IS NULL;
```

---

## General Setup Instructions

### 1. Run SQL Migrations

Go to your Supabase project:
- Navigate to **SQL Editor** → **New Query**
- Copy the contents of each migration file in numerical order
- Execute the queries

### 2. Verify the Tables

```sql
SELECT * FROM partner_reports LIMIT 1;
SELECT * FROM publications LIMIT 1;
```

### 3. Verify the Table

```sql
SELECT * FROM partner_reports LIMIT 1;
```

You should see the table structure with these columns:
- `id` (TEXT) - Unique report identifier
- `name`, `email`, `phone` - Submitter info
- `date`, `region` - When and where
- `photos` (array) - Photo URLs
- `issue`, `observations` - Report content
- `consulted`, `operating_company` - Additional details
- `relevant_links` (array) - External links
- `privacy_accepted` - Privacy consent
- `status` - pending/approved/rejected
- `submitted_at`, `approved_at`, `approved_by`, `rejection_reason` - Tracking

### 3. Check Environment Variables

Ensure these are set in `.env.local` or Vercel:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
PARTNER_REPORT_ADMIN_EMAIL=admin@citizensatlas.org
RESEND_API_KEY=re_xxxxx
RESEND_FROM=noreply@citizensatlas.org
```

### 4. Test the Implementation

Submit a test report:
```bash
curl -X POST https://citizensatlas.vercel.app/api/partner-reports \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "phone": "+1-234-567-8900",
    "date": "2026-10-10",
    "region": "Test City, Country",
    "photos": [],
    "issue": "Test issue",
    "consulted": "No",
    "operatingCompany": "Test Company",
    "observations": "Test observations",
    "relevantLinks": [],
    "privacyAccepted": true
  }'
```

### 5. Verify Data Persistence

Check the table:
```sql
SELECT id, name, email, status, submitted_at FROM partner_reports ORDER BY submitted_at DESC;
```

## Features Included

✅ **Persistent Storage** - Data survives server restarts/redeployment
✅ **Automatic Timestamps** - `submitted_at`, `approved_at`, `updated_at` auto-managed
✅ **Indexes** - Fast queries by status, email, date
✅ **Row-Level Security** - Protected with RLS policies
✅ **Data Integrity** - Constraints on status and consulted values
✅ **Soft Tracking** - Approval metadata (who, when, reason)

## Migration Rollback

If needed, you can delete the table:
```sql
DROP TABLE IF EXISTS partner_reports CASCADE;
```

## Future Enhancements

- Add audit logs for status changes
- Add soft delete (archived_at) instead of hard delete
- Add full-text search on observations
- Add geographic indexing for region queries
- Add batch operations for admin bulk actions
