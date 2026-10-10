import { NextRequest, NextResponse } from 'next/server';
import { deleteReport } from '@/lib/partner-reports';

export async function DELETE(request: NextRequest) {
  try {
    const { reportIds } = await request.json();

    if (!reportIds || !Array.isArray(reportIds) || reportIds.length === 0) {
      return NextResponse.json(
        { error: 'reportIds array is required' },
        { status: 400 }
      );
    }

    const results = [];
    for (const reportId of reportIds) {
      const success = await deleteReport(reportId);
      results.push({ reportId, success });
    }

    const allSuccess = results.every(r => r.success);

    if (allSuccess) {
      return NextResponse.json({
        success: true,
        message: `${reportIds.length} report(s) deleted successfully`,
        results,
      });
    } else {
      return NextResponse.json(
        {
          error: 'Some reports failed to delete',
          results,
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error deleting reports:', error);
    return NextResponse.json(
      { error: 'Failed to delete reports' },
      { status: 500 }
    );
  }
}
