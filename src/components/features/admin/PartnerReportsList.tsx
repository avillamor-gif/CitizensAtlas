'use client';

import React, { useState, useEffect } from 'react';
import { PartnerReport } from '@/types/types';

interface ReportListProps {
  status?: 'pending' | 'approved' | 'rejected';
}

const PartnerReportsList: React.FC<ReportListProps> = ({ status = 'pending' }) => {
  const [reports, setReports] = useState<PartnerReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState<PartnerReport | null>(null);

  useEffect(() => {
    fetchReports();
  }, [status]);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/partner-reports?status=${status}`);
      const data = await response.json();
      setReports(data.reports || []);
    } catch (error) {
      console.error('Error fetching partner reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (reportId: string) => {
    try {
      const response = await fetch('/api/partner-reports/approve', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reportId, action: 'approve' }),
      });

      if (response.ok) {
        // Refresh the list to remove the approved report
        await fetchReports();
        setSelectedReport(null);
        alert('Report approved successfully! Confirmation email sent to submitter.');
      } else {
        alert('Failed to approve report');
      }
    } catch (error) {
      console.error('Error approving report:', error);
      alert('Failed to approve report');
    }
  };

  const handleReject = async (reportId: string, reason: string) => {
    try {
      const response = await fetch('/api/partner-reports/approve', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reportId, action: 'reject', reason }),
      });

      if (response.ok) {
        // Refresh the list to remove the rejected report
        await fetchReports();
        setSelectedReport(null);
        alert('Report rejected successfully! Notification email sent to submitter.');
      } else {
        alert('Failed to reject report');
      }
    } catch (error) {
      console.error('Error rejecting report:', error);
      alert('Failed to reject report');
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading reports...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">
          {status === 'pending' && 'Pending Approvals'}
          {status === 'approved' && 'Approved Reports'}
          {status === 'rejected' && 'Rejected Reports'}
        </h2>
        <span className="text-sm text-gray-500">{reports.length} reports</span>
      </div>

      {reports.length === 0 ? (
        <div className="rounded-lg border border-gray-200 bg-gray-50 py-8 text-center text-gray-600">
          No {status} reports at this time.
        </div>
      ) : (
        <div className="space-y-4">
          {reports.map(report => (
            <div
              key={report.id}
              className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">{report.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{report.email}</p>
                  <div className="flex gap-4 mt-2">
                    <span className="text-sm text-gray-600">Region: {report.region}</span>
                    <span className="text-sm text-gray-600">
                      Submitted: {new Date(report.submittedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedReport(report)}
                  className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-900 border border-blue-200 rounded-md hover:bg-blue-50 transition"
                >
                  View Details
                </button>
              </div>

              <p className="text-gray-700 text-sm line-clamp-2 mb-4">
                {report.issue}
              </p>

              {status === 'pending' && (
                <div className="flex gap-3">
                  <button
                    onClick={() => handleApprove(report.id!)}
                    className="px-4 py-2 text-sm font-medium bg-green-600 text-white rounded-md hover:bg-green-700 transition"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => {
                      const reason = prompt('Enter rejection reason (optional):');
                      if (reason !== null) {
                        handleReject(report.id!, reason);
                      }
                    }}
                    className="px-4 py-2 text-sm font-medium bg-red-600 text-white rounded-md hover:bg-red-700 transition"
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Details Modal */}
      {selectedReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white shadow-lg">
            <div className="sticky top-0 flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4">
              <h2 className="text-xl font-bold text-gray-900">Report Details</h2>
              <button
                onClick={() => setSelectedReport(null)}
                className="text-gray-500 hover:text-gray-700 transition"
              >
                ✕
              </button>
            </div>

            <div className="space-y-6 px-6 py-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-gray-900">Name</label>
                  <p className="text-gray-700 mt-1">{selectedReport.name}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-900">Email</label>
                  <p className="text-gray-700 mt-1">{selectedReport.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-gray-900">Phone</label>
                  <p className="text-gray-700 mt-1">{selectedReport.phone || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-900">Region</label>
                  <p className="text-gray-700 mt-1">{selectedReport.region}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-gray-900">Date</label>
                  <p className="text-gray-700 mt-1">{selectedReport.date}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-900">Consulted</label>
                  <p className="text-gray-700 mt-1">{selectedReport.consulted}</p>
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-900">Operating Company</label>
                <p className="text-gray-700 mt-1">{selectedReport.operatingCompany || 'N/A'}</p>
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-900">Issue Description</label>
                <p className="text-gray-700 mt-1 whitespace-pre-wrap">{selectedReport.issue}</p>
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-900">Observations & Impact</label>
                <p className="text-gray-700 mt-1 whitespace-pre-wrap">{selectedReport.observations}</p>
              </div>

              {selectedReport.relevantLinks && selectedReport.relevantLinks.length > 0 && (
                <div>
                  <label className="text-sm font-semibold text-gray-900">Relevant Links</label>
                  <ul className="mt-1 space-y-1">
                    {selectedReport.relevantLinks.map((link, idx) => (
                      <li key={idx}>
                        <a href={link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm">
                          {link}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {status === 'pending' && (
                <div className="flex gap-3 border-t border-gray-200 pt-6">
                  <button
                    onClick={() => handleApprove(selectedReport.id!)}
                    className="flex-1 px-4 py-2 text-sm font-medium bg-green-600 text-white rounded-md hover:bg-green-700 transition"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => {
                      const reason = prompt('Enter rejection reason (optional):');
                      if (reason !== null) {
                        handleReject(selectedReport.id!, reason);
                      }
                    }}
                    className="flex-1 px-4 py-2 text-sm font-medium bg-red-600 text-white rounded-md hover:bg-red-700 transition"
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PartnerReportsList;
