/**
 * Supabase Storage Service
 * Handles file uploads for images and documents
 */

import { createClient } from '@/lib/supabase/client'

const supabase = createClient()

// ============================================
// IMAGE UPLOADS
// ============================================

/**
 * Upload an image file to Supabase Storage
 * @param file - The image file to upload
 * @param bucket - The storage bucket (default: 'images')
 * @returns Public URL of the uploaded image
 */
export async function uploadImage(file: File, bucket: string = 'images'): Promise<string> {
  console.log('📤 [uploadImage] START', { fileName: file.name, fileSize: file.size, fileType: file.type, bucket })
  
  // Check file size (warn if > 5MB)
  const maxSize = 10 * 1024 * 1024 // 10MB hard limit
  if (file.size > maxSize) {
    throw new Error(`Image file too large (${(file.size / 1024 / 1024).toFixed(2)}MB). Maximum size is 10MB. Please compress the image and try again.`)
  }
  
  if (file.size > 5 * 1024 * 1024) {
    console.warn('⚠️ [uploadImage] Large file detected:', (file.size / 1024 / 1024).toFixed(2), 'MB')
  }
  
  // Generate unique filename with timestamp
  const fileExt = file.name.split('.').pop()
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
  const filePath = `${fileName}`
  
  console.log('📤 [uploadImage] Generated filename:', filePath)

  // Create timeout promise (60 seconds for larger images and slower connections)
  const timeoutPromise = new Promise<never>((_, reject) => {
    setTimeout(() => {
      reject(new Error('Image upload timeout after 60 seconds. Please check your connection and try again.'))
    }, 60000)
  })

  // Create upload promise
  const uploadPromise = (async () => {
    console.log('📤 [uploadImage] Calling supabase.storage.upload...')
    const uploadResult = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      })
    
    console.log('📤 [uploadImage] Upload result received:', { 
      hasData: !!uploadResult.data, 
      hasError: !!uploadResult.error,
      errorMessage: uploadResult.error?.message
    })
    
    return uploadResult
  })()

  try {
    // Race upload against timeout
    const { data, error } = await Promise.race([uploadPromise, timeoutPromise])

    if (error) {
      console.error('❌ [uploadImage] Upload error:', {
        message: error.message,
        error: error
      })
      throw new Error(`Failed to upload image: ${error.message}`)
    }

    console.log('✅ [uploadImage] Upload successful, getting public URL...')

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath)

    console.log('✅ [uploadImage] Complete:', publicUrl)
    return publicUrl
  } catch (error) {
    console.error('❌ [uploadImage] FAILED:', error)
    throw error
  }
}

/**
 * Delete an image from Supabase Storage
 * @param url - The public URL of the image to delete
 * @param bucket - The storage bucket (default: 'images')
 */
export async function deleteImage(url: string, bucket: string = 'images'): Promise<void> {
  try {
    // Extract filename from URL
    const urlParts = url.split('/')
    const fileName = urlParts[urlParts.length - 1]

    const { error } = await supabase.storage
      .from(bucket)
      .remove([fileName])

    if (error) {
      console.error('Error deleting image:', error)
      throw error
    }
  } catch (error) {
    console.error('Failed to delete image:', error)
    // Don't throw - allow the main operation to continue even if image deletion fails
  }
}

// ============================================
// DOCUMENT UPLOADS (PDFs, DOCs, etc.)
// ============================================

/**
 * Upload a document file to Supabase Storage
 * @param file - The document file to upload
 * @param bucket - The storage bucket (default: 'documents')
 * @returns Object with public URL and original filename
 */
export async function uploadDocument(
  file: File, 
  bucket: string = 'documents'
): Promise<{ url: string; name: string }> {
  // Generate unique filename while preserving original name info
  const fileExt = file.name.split('.').pop()
  const timestamp = Date.now()
  const randomId = Math.random().toString(36).substring(7)
  const fileName = `${timestamp}-${randomId}.${fileExt}`

  // Upload file
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false
    })

  if (error) {
    console.error('Error uploading document:', error)
    throw new Error(`Failed to upload document: ${error.message}`)
  }

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from(bucket)
    .getPublicUrl(fileName)

  return {
    url: publicUrl,
    name: file.name // Return original filename for display
  }
}

/**
 * Upload multiple documents
 * @param files - Array of files to upload
 * @param bucket - The storage bucket (default: 'documents')
 * @returns Array of objects with URLs and filenames
 */
export async function uploadMultipleDocuments(
  files: File[],
  bucket: string = 'documents'
): Promise<Array<{ url: string; name: string }>> {
  const uploadPromises = files.map(file => uploadDocument(file, bucket))
  return Promise.all(uploadPromises)
}

/**
 * Delete a document from Supabase Storage
 * @param url - The public URL of the document to delete
 * @param bucket - The storage bucket (default: 'documents')
 */
export async function deleteDocument(url: string, bucket: string = 'documents'): Promise<void> {
  try {
    // Extract filename from URL
    const urlParts = url.split('/')
    const fileName = urlParts[urlParts.length - 1]

    const { error } = await supabase.storage
      .from(bucket)
      .remove([fileName])

    if (error) {
      console.error('Error deleting document:', error)
      throw error
    }
  } catch (error) {
    console.error('Failed to delete document:', error)
    // Don't throw - allow the main operation to continue
  }
}

/**
 * Delete multiple documents
 * @param urls - Array of public URLs to delete
 * @param bucket - The storage bucket (default: 'documents')
 */
export async function deleteMultipleDocuments(
  urls: string[],
  bucket: string = 'documents'
): Promise<void> {
  const deletePromises = urls.map(url => deleteDocument(url, bucket))
  await Promise.allSettled(deletePromises)
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Get file size in human-readable format
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}

/**
 * Validate file type for images
 */
export function validateImageFile(file: File): { valid: boolean; error?: string } {
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
  const maxSize = 5 * 1024 * 1024 // 5MB

  if (!validTypes.includes(file.type)) {
    return {
      valid: false,
      error: 'Invalid file type. Please upload a JPEG, PNG, GIF, or WebP image.'
    }
  }

  if (file.size > maxSize) {
    return {
      valid: false,
      error: `File size too large. Maximum size is ${formatFileSize(maxSize)}.`
    }
  }

  return { valid: true }
}

/**
 * Validate file type for documents
 */
export function validateDocumentFile(file: File): { valid: boolean; error?: string } {
  const validTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/plain'
  ]
  const maxSize = 10 * 1024 * 1024 // 10MB

  if (!validTypes.includes(file.type)) {
    return {
      valid: false,
      error: 'Invalid file type. Please upload a PDF, DOC, DOCX, XLS, XLSX, or TXT file.'
    }
  }

  if (file.size > maxSize) {
    return {
      valid: false,
      error: `File size too large. Maximum size is ${formatFileSize(maxSize)}.`
    }
  }

  return { valid: true }
}
