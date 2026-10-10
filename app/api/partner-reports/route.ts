import { NextRequest, NextResponse } from 'next/server';
import { PartnerReport } from '@/types/types';

// In-memory storage for partner reports (in production, use a database)
// This could be replaced with Supabase, MongoDB, PostgreSQL, etc.
const partnerReports: PartnerReport[] = [];

export async function POST(request: NextRequest) {
  try {
    const body: Omit<PartnerReport, 'id' | 'submittedAt' | 'status'> = await request.json();
    
    // Validate required fields
    if (!body.name || !body.email || !body.observations) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create new report with pending status
    const newReport: PartnerReport = {
      id: `report_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...body,
      status: 'pending',
      submittedAt: new Date().toISOString(),
    };

    partnerReports.push(newReport);

    return NextResponse.json({
      success: true,
      message: 'Report submitted successfully. It will be reviewed by our team.',
      reportId: newReport.id,
    });
  } catch (error) {
    console.error('Error submitting partner report:', error);
    return NextResponse.json(
      { error: 'Failed to submit report' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    // Filter by status if provided
    const filtered = status
      ? partnerReports.filter(r => r.status === status)
      : partnerReports;

    return NextResponse.json({ reports: filtered });
  } catch (error) {
    console.error('Error fetching partner reports:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reports' },
      { status: 500 }
    );
  }
}
