'use client';

import React, { useState } from 'react';
import { PartnerReport } from '@/types/types';
import { TrashIcon, MagnifyingGlassIcon } from '@/components/ui/icons';
import Pagination from './Pagination';
import Checkbox from './Checkbox';

interface ReportListProps {
  reports: PartnerReport[];
  onDeleteReports: (reportIds: string[]) => void;
}

const ReportList: React.FC<ReportListProps> = ({ reports, onDeleteReports }) => {
  const ITEMS_PER_PAGE = 20;
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [sortKey, setSortKey] = useState<keyof PartnerReport>('submittedAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  // Filter reports
  const filteredReports = reports.filter(report => {
    const searchLower = searchTerm.toLowerCase();
    return (
      report.name.toLowerCase().includes(searchLower) ||
      report.email.toLowerCase().includes(searchLower) ||
      report.region.toLowerCase().includes(searchLower) ||
      report.issue.toLowerCase().includes(searchLower)
    );
  });

  // Sort reports
  const sortedReports = [...filteredReports].sort((a, b) => {
    const aValue = a[sortKey];
    const bValue = b[sortKey];

    if (aValue === null || aValue === undefined) return 1;
    if (bValue === null || bValue === undefined) return -1;

    if (typeof aValue === 'string') {
      return sortDirection === 'asc'
        ? (aValue as string).localeCompare(bValue as string)
        : (bValue as string).localeCompare(aValue as string);
    }

    return sortDirection === 'asc'
      ? Number(aValue) - Number(bValue)
      : Number(bValue) - Number(aValue);
  });

  // Paginate
  const totalPages = Math.ceil(sortedReports.length / ITEMS_PER_PAGE);
  const paginatedReports = sortedReports.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const isAllSelected = paginatedReports.length > 0 && 
    paginatedReports.every(r => selectedItems.includes(r.id!));

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedItems([...new Set([...selectedItems, ...paginatedReports.map(r => r.id!)])]);
    } else {
      setSelectedItems(selectedItems.filter(id => !paginatedReports.some(r => r.id === id)));
    }
  };

  const handleSelectItem = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedItems([...selectedItems, id]);
    } else {
      setSelectedItems(selectedItems.filter(item => item !== id));
    }
  };

  const handleDelete = (reportId: string) => {
    if (window.confirm('Are you sure you want to delete this report? This action cannot be undone.')) {
      onDeleteReports([reportId]);
      if (paginatedReports.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    }
  };

  const handleBulkDelete = () => {
    if (window.confirm(`Are you sure you want to delete ${selectedItems.length} selected reports? This action cannot be undone.`)) {
      onDeleteReports(selectedItems);
      setSelectedItems([]);
      if (paginatedReports.length === selectedItems.length && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    }
  };

  const getStatusBadge = (status: string) => {
    const statusStyles = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
    };
    return statusStyles[status as keyof typeof statusStyles] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-brand-dark-blue">Citizens' Reports</h2>
          <p className="text-gray-600 mt-1">View, manage, and delete all reports.</p>
        </div>
      </div>

      {selectedItems.length > 0 && (
        <div className="flex items-center justify-between p-4 bg-blue-100 border border-blue-200 rounded-lg mb-4">
          <p className="text-sm font-medium text-blue-800">{selectedItems.length} report(s) selected.</p>
          <button
            onClick={handleBulkDelete}
            className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 transition"
          >
            Delete Selected
          </button>
        </div>
      )}

      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, email, region, or issue..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-yellow"
          />
        </div>
      </div>

      <div className="overflow-x-auto shadow-md rounded-lg">
        <table className="w-full bg-white">
          <thead className="bg-gray-100 border-b border-gray-300">
            <tr>
              <th className="w-8 px-4 py-3">
                <Checkbox
                  checked={isAllSelected}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                />
              </th>
              <th 
                className="px-6 py-3 text-left cursor-pointer hover:bg-gray-200"
                onClick={() => {
                  if (sortKey === 'name') {
                    setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
                  } else {
                    setSortKey('name');
                    setSortDirection('asc');
                  }
                }}
              >
                Name {sortKey === 'name' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th className="px-6 py-3 text-left">Email</th>
              <th className="px-6 py-3 text-left">Region</th>
              <th 
                className="px-6 py-3 text-left cursor-pointer hover:bg-gray-200"
                onClick={() => {
                  if (sortKey === 'status') {
                    setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
                  } else {
                    setSortKey('status');
                    setSortDirection('asc');
                  }
                }}
              >
                Status {sortKey === 'status' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th 
                className="px-6 py-3 text-left cursor-pointer hover:bg-gray-200"
                onClick={() => {
                  if (sortKey === 'submittedAt') {
                    setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
                  } else {
                    setSortKey('submittedAt');
                    setSortDirection('desc');
                  }
                }}
              >
                Submitted {sortKey === 'submittedAt' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th className="px-6 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedReports.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                  No reports found
                </td>
              </tr>
            ) : (
              paginatedReports.map((report) => (
                <tr
                  key={report.id}
                  className="border-b border-gray-200 hover:bg-gray-50 transition"
                >
                  <td className="px-4 py-3">
                    <Checkbox
                      checked={selectedItems.includes(report.id!)}
                      onChange={(e) => handleSelectItem(report.id!, e.target.checked)}
                    />
                  </td>
                  <td className="px-6 py-3 font-medium text-gray-900">{report.name}</td>
                  <td className="px-6 py-3 text-gray-600 text-sm">{report.email}</td>
                  <td className="px-6 py-3 text-gray-600">{report.region}</td>
                  <td className="px-6 py-3">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(report.status)}`}>
                      {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-gray-600 text-sm">
                    {new Date(report.submittedAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-3 text-center">
                    <button
                      onClick={() => handleDelete(report.id!)}
                      className="inline-flex items-center justify-center w-9 h-9 rounded-md text-red-600 hover:bg-red-50 transition"
                      title="Delete report"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default ReportList;
