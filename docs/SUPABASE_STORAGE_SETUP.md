# Supabase Storage Setup Guide

## Overview
This guide walks you through setting up Supabase Storage for handling file uploads (images and documents) in your Atlas CMS.

---

## Step 1: Create Storage Buckets

### Option A: Using Supabase Dashboard (Easiest)

1. **Go to Supabase Dashboard**
   - Open: https://supabase.com/dashboard/project/srsjynjccivtjvordrlc/storage/buckets

2. **Create Images Bucket**
   - Click "New bucket"
   - Name: `images`
   - Public: ✅ **Enable** (so images can be viewed publicly)
   - Click "Create bucket"

3. **Create Documents Bucket**
   - Click "New bucket"
   - Name: `documents`
   - Public: ✅ **Enable** (so documents can be downloaded publicly)
   - Click "Create bucket"

### Option B: Using SQL (Alternative)

1. Open SQL Editor: https://supabase.com/dashboard/project/srsjynjccivtjvordrlc/sql
2. Run the script: `/supabase/setup-storage.sql`

---

## Step 2: Configure Bucket Policies

After creating buckets, set up access policies:

1. **For Images Bucket:**
   - Go to Storage → images → Policies
   - Add these policies (or use the SQL script):
     - Public can view images (SELECT)
     - Authenticated users can upload (INSERT)
     - Authenticated users can update (UPDATE)
     - Authenticated users can delete (DELETE)

2. **For Documents Bucket:**
   - Go to Storage → documents → Policies
   - Add the same policies as above

**Or simply run the SQL script** which handles everything automatically.

---

## Step 3: Verify Setup

Run this command to test the storage setup:

```bash
cd /Users/leopura/Desktop/atlas

# Test storage access (will create a test file)
npx tsx scripts/test-storage.ts
```

---

## Step 4: Update Your Forms

Now you can use the storage functions in your forms:

### Example: Upload Image for News Article

```typescript
import { uploadImage } from '@/lib/supabase/storage'
import { createNews } from '@/lib/services/supabase-service'

async function handleCreateNews(formData: FormData) {
  const imageFile = formData.get('image') as File
  
  // Upload image first
  const imageUrl = await uploadImage(imageFile, 'images')
  
  // Create news article with image URL
  await createNews({
    title: 'My Article',
    imageUrl: imageUrl, // Use the uploaded image URL
    // ... other fields
  })
}
```

### Example: Upload Documents for Publication

```typescript
import { uploadMultipleDocuments } from '@/lib/supabase/storage'
import { createPublication } from '@/lib/services/supabase-service'

async function handleCreatePublication(formData: FormData) {
  const files = formData.getAll('documents') as File[]
  
  // Upload all documents
  const uploadedDocs = await uploadMultipleDocuments(files, 'documents')
  
  // Create publication with document URLs
  await createPublication({
    title: 'My Publication',
    documentNames: uploadedDocs.map(doc => doc.url), // Store URLs
    // ... other fields
  })
}
```

---

## Available Functions

### Image Uploads
```typescript
// Upload single image
uploadImage(file: File, bucket?: string): Promise<string>

// Delete image
deleteImage(url: string, bucket?: string): Promise<void>

// Validate image file
validateImageFile(file: File): { valid: boolean; error?: string }
```

### Document Uploads
```typescript
// Upload single document
uploadDocument(file: File, bucket?: string): Promise<{ url: string; name: string }>

// Upload multiple documents
uploadMultipleDocuments(files: File[], bucket?: string): Promise<Array<{ url: string; name: string }>>

// Delete document
deleteDocument(url: string, bucket?: string): Promise<void>

// Delete multiple documents
deleteMultipleDocuments(urls: string[], bucket?: string): Promise<void>

// Validate document file
validateDocumentFile(file: File): { valid: boolean; error?: string }
```

---

## File Limits

### Images Bucket
- **Max file size:** 5MB
- **Allowed types:** JPEG, PNG, GIF, WebP
- **Use for:** News thumbnails, publication covers, video thumbnails

### Documents Bucket
- **Max file size:** 10MB
- **Allowed types:** PDF, DOC, DOCX, XLS, XLSX, TXT
- **Use for:** Publication documents, attachments

---

## Storage Structure

```
Supabase Storage
├── images/
│   ├── 1234567890-abc123.jpg
│   ├── 1234567891-def456.png
│   └── ...
└── documents/
    ├── 1234567892-ghi789.pdf
    ├── 1234567893-jkl012.docx
    └── ...
```

Files are automatically named with:
- Timestamp (to prevent collisions)
- Random ID (extra uniqueness)
- Original file extension

---

## Example: Complete Form Handler

```typescript
import { uploadImage, uploadMultipleDocuments, validateImageFile, validateDocumentFile } from '@/lib/supabase/storage'
import { createPublication } from '@/lib/services/supabase-service'

async function handleSubmitPublication(event: FormEvent<HTMLFormElement>) {
  event.preventDefault()
  const formData = new FormData(event.currentTarget)
  
  try {
    // 1. Get files from form
    const imageFile = formData.get('coverImage') as File
    const documentFiles = formData.getAll('documents') as File[]
    
    // 2. Validate files
    if (imageFile) {
      const imageValidation = validateImageFile(imageFile)
      if (!imageValidation.valid) {
        alert(imageValidation.error)
        return
      }
    }
    
    for (const doc of documentFiles) {
      const docValidation = validateDocumentFile(doc)
      if (!docValidation.valid) {
        alert(docValidation.error)
        return
      }
    }
    
    // 3. Upload files
    let imageUrl = ''
    if (imageFile && imageFile.size > 0) {
      imageUrl = await uploadImage(imageFile, 'images')
    }
    
    let documentUrls: string[] = []
    if (documentFiles.length > 0) {
      const uploads = await uploadMultipleDocuments(documentFiles, 'documents')
      documentUrls = uploads.map(u => u.url)
    }
    
    // 4. Create publication with uploaded file URLs
    await createPublication({
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      category: formData.get('category') as string,
      imageUrl: imageUrl,
      documentNames: documentUrls,
      // ... other fields
    })
    
    alert('Publication created successfully!')
  } catch (error) {
    console.error('Error creating publication:', error)
    alert('Failed to create publication')
  }
}
```

---

## Troubleshooting

### Issue: "Permission denied" when uploading
**Solution:** Make sure you're logged in and the storage policies are set correctly.

### Issue: "Bucket not found"
**Solution:** Verify buckets exist in Storage dashboard or run setup SQL script.

### Issue: Files not appearing
**Solution:** Check if bucket is set to "Public" in the bucket settings.

### Issue: Upload fails with "Invalid file type"
**Solution:** Check file type matches allowed types (use validation functions).

---

## Next Steps

1. ✅ Run the setup SQL script
2. ✅ Verify buckets exist in Supabase Dashboard
3. ✅ Update your form components to use upload functions
4. ✅ Test uploading files in admin dashboard

---

**Storage is ready!** You can now upload images and documents directly to Supabase. 🎉
