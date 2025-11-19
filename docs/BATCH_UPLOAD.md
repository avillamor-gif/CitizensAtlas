# Batch Upload Feature

## Overview
The batch upload feature allows administrators to upload multiple items (Projects, News, Publications, or Videos) at once using Excel files.

## How to Use

### 1. Access Batch Upload
Navigate to `/admin/batch-upload` in your application.

### 2. Select Content Type
Choose what type of content you want to upload:
- Projects
- News Updates
- Publications
- Videos

### 3. Download Template
Click "Download Template" to get an Excel file with the correct format for your selected content type.

### 4. Fill the Template
Open the downloaded Excel file and fill in your data:
- **Required fields** are marked with an asterisk (*)
- Follow the example row for reference
- Use comma-separated values for list fields (tags, categories, etc.)
- Dates should be in YYYY-MM-DD format
- Status can be 'published' or 'draft'

### 5. Upload the File
- Click "Choose File" and select your filled Excel file
- The system will automatically validate and preview your data
- Review any errors or warnings

### 6. Confirm Upload
- Check the preview table to ensure data is correct
- Click "Upload X Items" to import all records
- Wait for the success message

## Template Fields

### Projects Template
- Project Name* (required)
- Project Number
- Country* (required)
- Region
- City
- Latitude
- Longitude
- Corruption Type* (required)
- Project Description
- Project Status
- Approval Date
- Start Date
- End Date
- Total Project Amount
- IFI
- Funding Source
- Sector
- Owner
- Private Sector Borrowers (comma-separated)
- Groups in Opposition (comma-separated)
- Types of Actions (comma-separated)
- Links to Actions (comma-separated)
- Environmental Categories (comma-separated)
- Social Safeguard (comma-separated)

### News Template
- Title* (required)
- Category* (required)
- Description (supports HTML)
- Image URL
- Video URL
- Publish Date
- Tags (comma-separated)
- Status (published/draft)

### Publications Template
- Title* (required)
- Category* (required)
- Description (supports HTML)
- Image URL
- Document Names (comma-separated)
- Publish Date
- Tags (comma-separated)
- Status (published/draft)

### Videos Template
- Title* (required)
- Category* (required)
- Description (supports HTML)
- Image URL
- Video URL* (required)
- Publish Date
- Tags (comma-separated)
- Status (published/draft)

## Tips

✅ **Do:**
- Fill required fields for every row
- Use consistent date formats (YYYY-MM-DD)
- Test with a small batch first
- Keep Excel file under 5MB for best performance
- Use valid URLs for images and videos

❌ **Don't:**
- Leave required fields empty
- Mix different content types in one file
- Use special characters in URLs
- Upload files larger than 10MB

## Error Handling

The system will show errors if:
- Required fields are missing
- Data format is incorrect
- File cannot be parsed

Review all errors before attempting upload. Items with errors will not be uploaded.

## Data Integration

Uploaded items are automatically:
- Saved to Supabase database
- Available in the admin dashboard
- Searchable via Algolia (if configured)
- Visible on the public site (if status is 'published')

## Technical Notes

- Uses `xlsx` library for Excel parsing
- Validates data before upload
- Uploads items sequentially to avoid rate limits
- Shows progress and results
- Maintains data integrity with error handling

## Support

For issues or questions, check:
1. Template examples in the Excel file
2. Error messages during upload
3. Browser console for technical details
