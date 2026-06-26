import { NextRequest, NextResponse } from 'next/server';

function extractMetaContent(html: string, property: string): string | null {
  const escaped = property.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const patterns = [
    new RegExp(`<meta[^>]*property=["']${escaped}["'][^>]*content=["']([^"']+)["'][^>]*>`, 'i'),
    new RegExp(`<meta[^>]*content=["']([^"']+)["'][^>]*property=["']${escaped}["'][^>]*>`, 'i'),
    new RegExp(`<meta[^>]*name=["']${escaped}["'][^>]*content=["']([^"']+)["'][^>]*>`, 'i'),
    new RegExp(`<meta[^>]*content=["']([^"']+)["'][^>]*name=["']${escaped}["'][^>]*>`, 'i'),
  ];

  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match?.[1]) {
      return match[1].trim();
    }
  }

  return null;
}

export async function GET(request: NextRequest) {
  const targetUrl = request.nextUrl.searchParams.get('url');

  if (!targetUrl) {
    return NextResponse.json({ error: 'Missing url query parameter' }, { status: 400 });
  }

  let parsedUrl: URL;
  try {
    parsedUrl = new URL(targetUrl);
  } catch {
    return NextResponse.json({ error: 'Invalid URL' }, { status: 400 });
  }

  if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
    return NextResponse.json({ error: 'Only http/https URLs are supported' }, { status: 400 });
  }

  try {
    const response = await fetch(parsedUrl.toString(), {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; CitizensAtlasBot/1.0)',
        Accept: 'text/html,application/xhtml+xml',
      },
      redirect: 'follow',
      signal: AbortSignal.timeout(8000),
    });

    if (!response.ok) {
      return NextResponse.json({ error: `Failed to fetch URL (${response.status})` }, { status: 400 });
    }

    const contentType = response.headers.get('content-type') || '';
    if (!contentType.toLowerCase().includes('text/html')) {
      return NextResponse.json({ error: 'URL is not an HTML page' }, { status: 400 });
    }

    const html = await response.text();

    const candidates = [
      extractMetaContent(html, 'og:image:secure_url'),
      extractMetaContent(html, 'og:image'),
      extractMetaContent(html, 'twitter:image'),
      extractMetaContent(html, 'twitter:image:src'),
    ].filter(Boolean) as string[];

    if (candidates.length === 0) {
      return NextResponse.json({ imageUrl: null }, { status: 404 });
    }

    const resolvedImageUrl = new URL(candidates[0], parsedUrl).toString();
    return NextResponse.json({ imageUrl: resolvedImageUrl });
  } catch (error) {
    console.error('Link preview image fetch error:', error);
    return NextResponse.json({ error: 'Unable to fetch link preview image' }, { status: 500 });
  }
}
