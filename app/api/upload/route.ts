import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('files') as File[];

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: 'No files provided' },
        { status: 400 }
      );
    }

    const uploadedUrls: string[] = [];

    for (const file of files) {
      // Validate file type (images only)
      if (!file.type.startsWith('image/')) {
        return NextResponse.json(
          { error: 'Only image files are allowed' },
          { status: 400 }
        );
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        return NextResponse.json(
          { error: 'File size must be less than 5MB' },
          { status: 400 }
        );
      }

      const buffer = await file.arrayBuffer();
      const filename = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}_${file.name}`;
      const filepath = `partner-reports/${filename}`;

      const { data, error } = await supabase.storage
        .from('reports')
        .upload(filepath, buffer, {
          contentType: file.type,
        });

      if (error) {
        console.error('Supabase upload error:', error);
        return NextResponse.json(
          { error: 'Failed to upload file' },
          { status: 500 }
        );
      }

      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from('reports')
        .getPublicUrl(filepath);

      uploadedUrls.push(publicUrlData.publicUrl);
    }

    return NextResponse.json({
      success: true,
      urls: uploadedUrls,
      message: `${uploadedUrls.length} file(s) uploaded successfully`,
    });
  } catch (error) {
    console.error('Error uploading files:', error);
    return NextResponse.json(
      { error: 'Failed to upload files' },
      { status: 500 }
    );
  }
}
