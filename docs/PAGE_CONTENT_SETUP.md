# Page Content Setup Guide

## Overview
This feature allows admins to manage editable content cards on pages like "What We Do". Content is stored in a database table and can be edited through the UI.

## Database Setup

### Step 1: Run SQL Migration
1. Go to your Supabase Dashboard → SQL Editor
2. Open the file `/supabase/page-content-table.sql`
3. Copy and paste the entire script
4. Click **"Run"** to execute

This script will:
- Create the `page_content` table with proper structure
- Set up Row Level Security (RLS) policies:
  - Anyone can read content
  - Only admins and super-admins can create/edit
  - Only super-admins can delete
- Insert default content for the "What We Do" page (6 cards)
- Add automatic timestamp updates

### Step 2: Verify Table
Check that the table was created successfully:

```sql
SELECT * FROM page_content WHERE page_name = 'what-we-do' ORDER BY display_order;
```

You should see 6 cards with titles:
1. Map False Solutions
2. Investigate Corruption & Greenwashing
3. Empower Communities with Data
4. Amplify Local Stories
5. Promote Real Solutions
6. Foster Global Collaboration

## Features

### For All Users
- **Click any card** on the "What We Do" page to view full content in a modal
- Cards show a preview with "Click to read more" link
- Smooth hover effects on cards

### For Admins & Super-Admins
When logged in as an admin or super-admin:
- **"Edit Content" button** appears in the modal header
- Click to enter edit mode
- Edit the title and content inline
- Save changes directly to the database
- Changes are immediately visible to all users

## Technical Details

### Database Schema
```sql
page_content (
  id BIGSERIAL PRIMARY KEY,
  page_name TEXT NOT NULL,        -- 'what-we-do', 'about', etc.
  card_id TEXT NOT NULL,           -- 'map-false-solutions', etc.
  title TEXT NOT NULL,
  icon_name TEXT,                  -- 'map-pin', 'search', 'document', etc.
  content TEXT NOT NULL,
  display_order INTEGER NOT NULL,
  is_visible BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
)
```

### Service Functions
Located in `/src/lib/services/supabase-service.ts`:
- `getPageContent(pageName)` - Fetch all visible content for a page
- `updatePageContent(id, data)` - Update content (admin only)
- `createPageContent(data)` - Create new content (admin only)

### Component Structure
- **WhatWeDoPage.tsx** - Main page component
  - Fetches content from database on mount
  - Displays cards in a responsive grid (1/2/3 columns)
  - Opens modal on card click
  - Shows edit mode for admins

## Icon Mapping
Available icons (mapped in component):
- `map-pin` - Location/map icon
- `search` - Search/investigation icon
- `document` - Document/data icon
- `play` - Video/media icon
- `lightning` - Energy/action icon
- `globe` - Global/collaboration icon

## Usage Example

### Adding a New Page
To add editable content to another page:

1. Insert content in database:
```sql
INSERT INTO page_content (page_name, card_id, title, icon_name, content, display_order)
VALUES ('about', 'our-mission', 'Our Mission', 'lightning', 'Your mission statement here...', 1);
```

2. Import WhatWeDoPage component logic or create similar component
3. Pass `currentUser` prop to check for admin access
4. Call `getPageContent('about')` to fetch content

## Permissions

| Action | Contributor | Admin | Super-Admin |
|--------|-------------|-------|-------------|
| View content | ✅ | ✅ | ✅ |
| Edit content | ❌ | ✅ | ✅ |
| Create content | ❌ | ✅ | ✅ |
| Delete content | ❌ | ❌ | ✅ |

## Troubleshooting

### Content not loading
- Check that the SQL migration ran successfully
- Verify data exists: `SELECT * FROM page_content;`
- Check browser console for errors

### Edit button not showing
- Ensure user is logged in as admin or super-admin
- Check user role: `SELECT role FROM profiles WHERE email = 'your@email.com';`

### Changes not saving
- Verify RLS policies are enabled
- Check that user has admin role in database
- Look for errors in browser console

## Future Enhancements
Potential improvements:
- Add rich text editor for content
- Support for custom icons/images
- Drag-and-drop reordering
- Multi-language support
- Version history/revisions
