# Chart Visibility Feature Setup

## Overview
The dashboard now uses shadcn/ui components and supports chart visibility toggling for super admins.

## Features Implemented

### 1. **Dynamic Data Updates** ✅
- Charts automatically update when projects are added/edited
- Uses React's `useMemo` hook to recompute data when projects change
- No manual refresh needed

### 2. **Upgraded Frontend Dashboard** ✅
- Replaced basic Recharts with shadcn/ui Card and Chart components
- Matches the professional design of admin analytics
- Better tooltips, responsive layout, and modern styling
- Located at: `/src/components/pages/DashboardV2.tsx`

### 3. **Chart Visibility Control** ✅
- Super admins see ellipsis (⋮) menu on each chart
- Click to show/hide charts from frontend dashboard
- Regular users only see visible charts
- Settings persist in database

## Database Setup

### Step 1: Run SQL Script
1. Go to Supabase Dashboard → SQL Editor
2. Open `/supabase/chart-visibility-table.sql`
3. Copy and paste the entire script
4. Click "Run" to execute

This script will:
- Create `chart_visibility` table
- Insert default settings for all 5 charts
- Set up RLS policies (anyone can read, only super admins can update)
- Add timestamps and audit trail

### Step 2: Verify Table
Check that the table was created:
```sql
SELECT * FROM chart_visibility ORDER BY display_order;
```

You should see:
```
chart_id            | is_visible | display_order
--------------------|------------|---------------
projectsByIFI       | true       | 1
investmentByIFI     | true       | 2
falseSolutionTypes  | true       | 3
gaiaSupport         | true       | 4
projectStatus       | true       | 5
```

## Available Charts

1. **No. of Projects by IFI** - Bar chart showing project counts
2. **Investment by IFI (in Billions)** - Bar chart showing investment amounts
3. **Projects by False Solution Type** - Donut chart with project types
4. **Active GAIA Support** - Pie chart showing support status
5. **Project Status** - Pie chart showing project statuses

## Usage

### For Super Admins (Control from Admin Dashboard):
1. Login and navigate to **Admin Dashboard → Analytics**
2. Scroll through the analytics charts
3. Charts that can be shown/hidden on frontend have an **ellipsis menu (⋮)** in the upper-right corner
4. Click the ellipsis menu on any chart
5. Select **"Hide from frontend"** or **"Show on frontend"**
6. If hidden, you'll see an orange label: "Hidden from public dashboard"
7. Changes are saved immediately to the database
8. Navigate to the **homepage (Map view)** to see the updated public dashboard

### Charts Available for Frontend Toggle:
- ✅ **No. of Projects by IFI** - Bar chart (can toggle)
- ✅ **Investment by IFI** - Bar chart (can toggle)
- ✅ **False Solution Types** - Donut chart (can toggle)
- ✅ **Active GAIA Support** - Pie chart (can toggle)
- ✅ **Project Status** - Pie chart (can toggle)

### Other Analytics Charts (Admin Only):
- Top Countries by Project Count
- Investment by Country
- Projects Timeline
- Projects by Region
- Community Actions
- Submission Trend

### For All Users (Frontend):
- Navigate to homepage → Map view → Dashboard section
- Only **visible charts** are displayed
- No editing controls appear
- Clean, streamlined dashboard experience

## Technical Details

### Components Created:
- `/src/components/pages/DashboardV2.tsx` - New shadcn/ui frontend dashboard (read-only)
- `FrontendChartCard` component in `/src/components/features/admin/EnhancedProjectsAnalytics.tsx`
- Database service functions in `/src/lib/services/supabase-service.ts`

### Updated Components:
- `/src/components/features/admin/EnhancedProjectsAnalytics.tsx` - Added ellipsis menus to 5 charts
- `/src/components/pages/Hero.tsx` - Uses DashboardV2
- `/src/components/pages/Home.tsx` - Passes currentUser prop
- `/app/page.tsx` - Provides user context

### Database Schema:
```typescript
interface ChartVisibilitySetting {
  id: string              // UUID
  chart_id: string        // Unique chart identifier
  is_visible: boolean     // Visibility state
  display_order: number   // Sort order
  updated_at: timestamp   // Last update time
  updated_by: UUID        // User who made the change
}
```

### API Functions:
```typescript
// Load all chart visibility settings
await getChartVisibilitySettings()

// Update a specific chart's visibility
await updateChartVisibility(chartId, isVisible)
```

## Testing

1. **Dynamic Updates Test:**
   - Add a new project via admin dashboard
   - Navigate to Admin → Analytics
   - Verify new project appears in charts immediately
   - Navigate to homepage → Map view → Dashboard
   - Verify new project also appears in frontend charts

2. **Visibility Toggle Test (Super Admin):**
   - Login as super admin
   - Go to **Admin Dashboard → Analytics**
   - Find "Project Status Distribution" chart
   - Click ellipsis (⋮) menu
   - Select "Hide from frontend"
   - Verify orange label appears: "Hidden from public dashboard"
   - Navigate to homepage → Map view → Dashboard
   - Verify "Project Status" chart is no longer visible
   - Go back to Admin Analytics
   - Click ellipsis menu again
   - Select "Show on frontend"
   - Refresh homepage
   - Verify chart reappears

3. **Persistence Test:**
   - Hide a chart from frontend
   - Logout and login again
   - Navigate to Admin Analytics
   - Verify chart still shows "Hidden from public dashboard"
   - Check frontend - chart should still be hidden

4. **Regular User Test:**
   - Login as contributor (non-super-admin)
   - Go to Admin Dashboard → Analytics
   - Verify ellipsis menu DOES appear (admin panel shows controls to all admins)
   - Try toggling visibility
   - Should work if contributor has access to admin panel
   - Frontend respects settings regardless of who set them

## Troubleshooting

### Ellipsis menu not showing in Admin Analytics:
- Verify you're logged in as admin/super-admin
- Check that you're on the Analytics page, not Projects List
- Only 5 specific charts have the ellipsis menu
- Check browser console for errors

### Visibility changes not persisting:
- Check Supabase logs for database errors
- Verify `chart_visibility` table exists
- Run the SQL script if table is missing
- Check network tab for failed API calls

### Frontend still showing hidden charts:
- Hard refresh the browser (Cmd+Shift+R or Ctrl+Shift+R)
- Check that chart_id matches in database
- Verify `is_visible` column is set to false
- Check browser console for loading errors

### Charts not updating with new data:
- Charts should update automatically via React hooks
- If not, check console for errors
- Verify projects data is being passed correctly
- Try hard refresh

## Future Enhancements

Potential additions:
- Drag-and-drop chart reordering
- Custom chart color themes
- Export chart data as CSV/PDF
- Chart templates for different user groups
- Real-time collaborative editing
