'use client'

import React, { useState } from 'react'
import { ProjectBrief } from '@/types/types'
import { PencilIcon, TrashIcon, MagnifyingGlassIcon } from '@/components/ui/icons'
import { useTable } from './useTable'
import SortableTableHeader from './SortableTableHeader'
import Checkbox from './Checkbox'
import Pagination from './Pagination'

interface ProjectBriefListProps {
  briefs: ProjectBrief[]
  onEdit: (brief: ProjectBrief) => void
  onDelete: (ids: number[]) => void
}

export default function ProjectBriefList({ briefs, onEdit, onDelete }: ProjectBriefListProps) {
  const {
    paginatedItems,
    requestSort,
    setSearchTerm,
    sortConfig,
    currentPage,
    totalPages,
    handlePageChange,
    selectedItems,
    setSelectedItems,
    handleSelectItem,
    handleSelectAll,
    isAllSelected,
  } = useTable<ProjectBrief>({
    items: briefs,
    initialSortConfig: { key: 'id', direction: 'descending' },
    searchableFields: ['project_name', 'location', 'country', 'project_type'],
    itemsPerPage: 20
  })

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this project brief? This action cannot be undone.')) {
      onDelete([id])
      if (paginatedItems.length === 1 && currentPage > 1) {
        handlePageChange(currentPage - 1)
      }
    }
  }

  const handleBulkDelete = () => {
    if (window.confirm(`Are you sure you want to delete ${selectedItems.length} selected project briefs? This action cannot be undone.`)) {
      onDelete(selectedItems)
      setSelectedItems([])
      if (paginatedItems.length === selectedItems.length && currentPage > 1) {
        handlePageChange(currentPage - 1)
      }
    }
  }

  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-brand-dark-blue">Manage Project Briefs</h2>
          <p className="text-gray-600 mt-1">Manage all submitted project briefs.</p>
        </div>
      </div>

      {selectedItems.length > 0 && (
        <div className="flex items-center justify-between p-4 bg-blue-100 border border-blue-200 rounded-lg mb-4">
          <p className="text-sm font-medium text-blue-800">{selectedItems.length} project brief(s) selected.</p>
          <button
            onClick={handleBulkDelete}
            className="bg-red-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-red-600 text-sm flex items-center gap-2"
          >
            <TrashIcon className="w-4 h-4" />
            Delete Selected
          </button>
        </div>
      )}

      <div className="mb-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search by project name, location, country, or type..."
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-3 pl-9 border border-gray-300 rounded-md focus:ring-brand-medium-blue focus:border-brand-medium-blue"
            aria-label="Search project briefs"
          />
          <MagnifyingGlassIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      <div className="bg-white border rounded-lg shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left text-gray-700">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th scope="col" className="px-6 py-4">
                  <Checkbox
                    checked={isAllSelected(paginatedItems)}
                    onChange={() => handleSelectAll(paginatedItems)}
                    aria-label="Select all project briefs on this page"
                  />
                </th>
                <SortableTableHeader label="ID" sortKey="id" sortConfig={sortConfig} requestSort={requestSort} />
                <SortableTableHeader label="Project Name" sortKey="project_name" sortConfig={sortConfig} requestSort={requestSort} />
                <SortableTableHeader label="Location" sortKey="location" sortConfig={sortConfig} requestSort={requestSort} />
                <SortableTableHeader label="Country" sortKey="country" sortConfig={sortConfig} requestSort={requestSort} />
                <SortableTableHeader label="Status" sortKey="status" sortConfig={sortConfig} requestSort={requestSort} />
                <th scope="col" className="px-6 py-4 font-bold text-brand-dark-blue text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedItems.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                    No project briefs found.
                  </td>
                </tr>
              ) : (
                paginatedItems.map((brief) => (
                  <tr 
                    key={brief.id} 
                    className={`border-b transition-colors ${selectedItems.includes(brief.id!) ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
                  >
                    <td className="px-6 py-4">
                      <Checkbox
                        checked={selectedItems.includes(brief.id!)}
                        onChange={() => handleSelectItem(brief.id!)}
                        aria-label={`Select project brief ${brief.project_name}`}
                      />
                    </td>
                    <td className="px-6 py-4 font-medium">{brief.id}</td>
                    <td className="px-6 py-4 font-medium max-w-sm truncate">{brief.project_name || 'Untitled'}</td>
                    <td className="px-6 py-4">{brief.location || '—'}</td>
                    <td className="px-6 py-4">{brief.country ? brief.country.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ') : '—'}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded ${
                        brief.status === 'published' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {brief.status || 'draft'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end items-center space-x-3">
                        <button
                          onClick={() => onEdit(brief)}
                          className="text-blue-600 hover:text-blue-800 transition-colors"
                          aria-label={`Edit ${brief.project_name}`}
                        >
                          <PencilIcon />
                        </button>
                        <button
                          onClick={() => handleDelete(brief.id!)}
                          className="text-red-600 hover:text-red-800 transition-colors"
                          aria-label={`Delete ${brief.project_name}`}
                        >
                          <TrashIcon />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  )
}
