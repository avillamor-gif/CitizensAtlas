import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const currentHost = request.nextUrl.host
    const protocol = request.nextUrl.protocol
    const appUrl = `${protocol}//${currentHost}`
    
    return NextResponse.json({
      success: true,
      environment: {
        NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
        currentHost,
        protocol,
        constructedAppUrl: appUrl,
        fullUrl: request.nextUrl.toString(),
        headers: Object.fromEntries(request.headers.entries())
      },
      timestamp: new Date().toISOString()
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}