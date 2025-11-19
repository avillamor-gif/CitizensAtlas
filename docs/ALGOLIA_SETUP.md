# Algolia Search Integration

This guide walks you through setting up Algolia search for the Atlas project.

## 1. Create Algolia Account

1. Go to https://www.algolia.com and sign up for a free account
2. Create a new application (e.g., "Atlas")
3. Navigate to **Settings → API Keys**

## 2. Configure Environment Variables

Add these variables to your `.env.local` file:

```bash
# Algolia Configuration
NEXT_PUBLIC_ALGOLIA_APP_ID=your_app_id_here
NEXT_PUBLIC_ALGOLIA_SEARCH_KEY=your_search_only_api_key_here
ALGOLIA_ADMIN_KEY=your_admin_api_key_here
```

### Where to find these keys:

- **Application ID**: Found in Settings → API Keys
- **Search-Only API Key**: Found in Settings → API Keys (this is safe to expose in the browser)
- **Admin API Key**: Found in Settings → API Keys (keep this secret, used for indexing)

⚠️ **Important**: Never commit your `.env.local` file to version control!

## 3. Initial Data Indexing

After setting up your environment variables, you need to index your existing data:

1. Start your dev server: `npm run dev`
2. Navigate to: http://localhost:3002/algolia-reindex
3. Click "Reindex All Data to Algolia"
4. Wait for the process to complete

This will sync all your:
- Projects
- News articles
- Publications  
- Videos

from Supabase to Algolia search indices.

## 4. Using Search in Your App

### Basic Usage

```tsx
import SearchComponent from '@/components/search/SearchComponent';

function MyPage() {
  return (
    <SearchComponent
      indexName="projects"
      placeholder="Search projects..."
      filters={['country', 'corruptionType', 'status']}
      onItemClick={(item) => {
        console.log('Clicked:', item);
      }}
    />
  );
}
```

### Available Indices

- `projects` - All project data
- `news` - News articles
- `publications` - Publications
- `videos` - Videos

### Automatic Indexing

To keep Algolia in sync with your data, update your create/update/delete handlers:

```tsx
import { indexProject, deleteFromProjectsIndex } from '@/lib/algolia/indexing';

// When creating a project
const newProject = await dataService.createProject(projectData);
await indexProject(newProject); // Index to Algolia

// When deleting a project
await dataService.deleteProject(projectId);
await deleteFromProjectsIndex(projectId); // Remove from Algolia
```

## 5. Search Features

### What's Included

✅ **Instant Search** - Results appear as you type
✅ **Typo Tolerance** - Finds results even with spelling mistakes
✅ **Faceted Filtering** - Filter by country, type, category, etc.
✅ **Geographic Search** - Search by location with lat/lng
✅ **Highlighting** - Search terms highlighted in results

### Customization

The search component accepts these props:

- `indexName`: Which index to search (projects, news, publications, videos)
- `placeholder`: Search box placeholder text
- `filters`: Array of attributes to show as filters (e.g., ['country', 'status'])
- `hitsPerPage`: Number of results per page (default: 10)
- `onItemClick`: Callback when user clicks a result

## 6. Configuring Search Settings (Optional)

In Algolia Dashboard:

1. Go to **Search → Configuration**
2. Configure searchable attributes:
   - For Projects: `title`, `details`, `country`, `corruptionType`
   - For News/Publications: `title`, `description`, `category`
3. Set up ranking and relevance
4. Configure facets for filtering

## 7. Monitoring Usage

- Check your usage at: https://www.algolia.com/dashboard
- Free plan includes: 10,000 searches/month, 10,000 records
- Upgrade if you exceed limits

## 8. Troubleshooting

### "No results found"
- Make sure you've run the reindex process
- Check that environment variables are set correctly
- Verify your API keys are active

### "Request failed" errors
- Check your Admin API key has the correct permissions
- Ensure you're not exceeding rate limits
- Verify your Algolia app is active

### Data not syncing
- Re-run the reindex process at `/algolia-reindex`
- Check console for error messages
- Verify Supabase data exists

## Example Implementation

See `/app/algolia-reindex/page.tsx` for a complete reindexing example.

See `/src/components/search/SearchComponent.tsx` for the search UI component.

## Additional Resources

- [Algolia Documentation](https://www.algolia.com/doc/)
- [React InstantSearch](https://www.algolia.com/doc/guides/building-search-ui/what-is-instantsearch/react/)
- [Search UI Examples](https://www.algolia.com/doc/guides/building-search-ui/ui-and-ux-patterns/in-depth/autocomplete/react/)
