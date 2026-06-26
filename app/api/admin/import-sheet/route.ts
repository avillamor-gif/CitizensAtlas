import { NextRequest, NextResponse } from 'next/server'

const GOOGLE_SHEETS_HOST = 'docs.google.com'

function buildGoogleSheetsExportUrl(rawUrl: string): { exportUrl: string; fileName: string } {
  let parsedUrl: URL

  try {
    parsedUrl = new URL(rawUrl)
  } catch {
    throw new Error('Invalid Google Sheets URL.')
  }

  if (parsedUrl.hostname !== GOOGLE_SHEETS_HOST) {
    throw new Error('Only Google Sheets URLs are supported.')
  }

  const match = parsedUrl.pathname.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/)
  if (!match) {
    throw new Error('Could not find a Google Sheets document ID in the URL.')
  }

  const documentId = match[1]
  const gid = parsedUrl.searchParams.get('gid') || parsedUrl.hash.match(/gid=(\d+)/)?.[1] || '0'
  const exportUrl = `https://docs.google.com/spreadsheets/d/${documentId}/export?format=xlsx&gid=${gid}`

  return {
    exportUrl,
    fileName: `google-sheet-${gid}.xlsx`,
  }
}

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get('url')

  if (!url) {
    return NextResponse.json({ error: 'Missing Google Sheets URL.' }, { status: 400 })
  }

  try {
    const { exportUrl, fileName } = buildGoogleSheetsExportUrl(url)
    const response = await fetch(exportUrl, {
      headers: {
        'User-Agent': 'CitizensAtlasImporter/1.0',
      },
      cache: 'no-store',
    })

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch spreadsheet. Make sure the Google Sheet is accessible.' },
        { status: 400 }
      )
    }

    const contentType = response.headers.get('content-type') || ''
    if (contentType.includes('text/html')) {
      return NextResponse.json(
        { error: 'Google returned an HTML page instead of a spreadsheet. Make sure the sheet is shared and accessible.' },
        { status: 400 }
      )
    }

    const arrayBuffer = await response.arrayBuffer()

    return new NextResponse(arrayBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="${fileName}"`,
        'x-import-filename': fileName,
        'Cache-Control': 'no-store',
      },
    })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to import spreadsheet.' },
      { status: 400 }
    )
  }
}
