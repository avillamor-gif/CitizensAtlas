'use client';

import React, { useState, useEffect } from 'react';
import { PartnerReport } from '@/types/types';

interface ReportListProps {
  status?: 'pending' | 'approved' | 'rejected';
}

interface Notification {
  type: 'success' | 'error';
  message: string;
  id: string;
}

const PartnerReportsList: React.FC<ReportListProps> = ({ status = 'pending' }) => {
  const [reports, setReports] = useState<PartnerReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState<PartnerReport | null>(null);
  const [notification, setNotification] = useState<Notification | null>(null);
  const [photoSliderIndex, setPhotoSliderIndex] = useState(0);

  useEffect(() => {
    fetchReports();
  }, [status]);

  const showNotification = (type: 'success' | 'error', message: string) => {
    const id = Date.now().toString();
    setNotification({ type, message, id });
    setTimeout(() => setNotification(null), 4000);
  };

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
        showNotification('success', '✅ Report approved successfully! Confirmation email sent to submitter.');
      } else {
        showNotification('error', '❌ Failed to approve report');
      }
    } catch (error) {
      console.error('Error approving report:', error);
      showNotification('error', '❌ Failed to approve report');
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
        showNotification('success', '✅ Report rejected successfully! Notification email sent to submitter.');
      } else {
        showNotification('error', '❌ Failed to reject report');
      }
    } catch (error) {
      console.error('Error rejecting report:', error);
      showNotification('error', '❌ Failed to reject report');
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading reports...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Branded Notification Toast */}
      {notification && (
        <div className={`fixed top-6 left-1/2 transform -translate-x-1/2 z-[9999] max-w-md w-full mx-auto animate-in fade-in slide-in-from-top-2 ${
          notification.type === 'success' 
            ? 'bg-gradient-to-r from-green-600 to-emerald-600' 
            : 'bg-gradient-to-r from-red-600 to-orange-600'
        } text-white shadow-2xl rounded-lg p-4 flex items-center gap-3`}>
          <div className="flex-1">
            <p className="font-semibold text-center">{notification.message}</p>
          </div>
          <button
            onClick={() => setNotification(null)}
            className="flex-shrink-0 text-white/80 hover:text-white transition"
          >
            ✕
          </button>
        </div>
      )}
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

              {selectedReport.photos && selectedReport.photos.length > 0 && (
                <div>
                  <label className="text-sm font-semibold text-gray-900 block mb-3">
                    📸 Photos ({selectedReport.photos.length})
                  </label>
                  <div className="relative bg-gray-900 rounded-lg overflow-hidden">
                    {/* Photo Display */}
                    <div className="aspect-video bg-gray-800 flex items-center justify-center">
                      {selectedReport.photos[photoSliderIndex] ? (
                        <img 
                          src={selectedReport.photos[photoSliderIndex]} 
                          alt={`Photo ${photoSliderIndex + 1}`}
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <div className="text-gray-400 text-center">
                          <p className="text-sm">Photo unavailable</p>
                        </div>
                      )}
                    </div>

                    {/* Photo Navigation Controls */}
                    {selectedReport.photos.length > 1 && (
                      <>
                        {/* Previous Button */}
                        <button
                          onClick={() => setPhotoSliderIndex((prev) => (prev === 0 ? selectedReport.photos!.length - 1 : prev - 1))}
                          className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/75 text-white rounded-full p-2 transition z-10"
                          title="Previous photo"
                        >
                          ◀
                        </button>

                        {/* Next Button */}
                        <button
                          onClick={() => setPhotoSliderIndex((prev) => (prev === selectedReport.photos!.length - 1 ? 0 : prev + 1))}
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/75 text-white rounded-full p-2 transition z-10"
                          title="Next photo"
                        >
                          ▶
                        </button>

                        {/* Photo Counter */}
                        <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 bg-black/60 text-white text-xs px-3 py-1 rounded-full">
                          {photoSliderIndex + 1} / {selectedReport.photos.length}
                        </div>
                      </>
                    )}
                  </div>

                  {/* Photo Thumbnails */}
                  {selectedReport.photos.length > 1 && (
                    <div className="mt-3 flex gap-2 overflow-x-auto pb-2">
                      {selectedReport.photos.map((photo, idx) => (
                        <button
                          key={idx}
                          onClick={() => setPhotoSliderIndex(idx)}
                          className={`flex-shrink-0 w-16 h-16 rounded-md overflow-hidden border-2 transition ${
                            idx === photoSliderIndex 
                              ? 'border-blue-500 ring-2 ring-blue-300' 
                              : 'border-gray-300 hover:border-gray-400'
                          }`}
                        >
                          <img src={photo} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

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
