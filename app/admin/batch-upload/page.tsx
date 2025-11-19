'use client';

import React, { useState } from 'react';
import {
  generateProjectsTemplate,
  generateNewsTemplate,
  generatePublicationsTemplate,
  generateVideosTemplate,
} from '@/lib/services/excel-templates';
import {
  parseProjectsExcel,
  parseNewsExcel,
  parsePublicationsExcel,
  parseVideosExcel,
} from '@/lib/services/excel-parser';
import * as dataService from '@/lib/services/data-service';

type ContentType = 'projects' | 'news' | 'publications' | 'videos';

export default function BatchUploadPage() {
  const [contentType, setContentType] = useState<ContentType>('projects');
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [preview, setPreview] = useState<any[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [warnings, setWarnings] = useState<string[]>([]);
  const [uploadResult, setUploadResult] = useState<{ success: number; failed: number } | null>(null);

  const handleDownloadTemplate = () => {
    switch (contentType) {
      case 'projects':
        generateProjectsTemplate();
        break;
      case 'news':
        generateNewsTemplate();
        break;
      case 'publications':
        generatePublicationsTemplate();
        break;
      case 'videos':
        generateVideosTemplate();
        break;
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setIsProcessing(true);
    setErrors([]);
    setWarnings([]);
    setPreview([]);
    setUploadResult(null);

    try {
      let result;
      switch (contentType) {
        case 'projects':
          result = await parseProjectsExcel(selectedFile);
          break;
        case 'news':
          result = await parseNewsExcel(selectedFile);
          break;
        case 'publications':
          result = await parsePublicationsExcel(selectedFile);
          break;
        case 'videos':
          result = await parseVideosExcel(selectedFile);
          break;
      }

      setPreview(result.data);
      setErrors(result.errors);
      setWarnings(result.warnings);
    } catch (error) {
      setErrors([`Failed to process file: ${error instanceof Error ? error.message : 'Unknown error'}`]);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUpload = async () => {
    if (preview.length === 0) return;

    setIsProcessing(true);
    setUploadResult(null);

    let successCount = 0;
    let failedCount = 0;

    try {
      for (const item of preview) {
        try {
          switch (contentType) {
            case 'projects':
              await dataService.createProject(item);
              break;
            case 'news':
              await dataService.createNews(item);
              break;
            case 'publications':
              await dataService.createPublication(item);
              break;
            case 'videos':
              await dataService.createVideo(item);
              break;
          }
          successCount++;
        } catch (error) {
          console.error('Failed to upload item:', error);
          failedCount++;
        }
      }

      setUploadResult({ success: successCount, failed: failedCount });
      if (successCount > 0) {
        setPreview([]);
        setFile(null);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-xl p-8">
          <h1 className="text-3xl font-bold text-brand-dark-blue mb-2">
            Batch Upload
          </h1>
          <p className="text-gray-600 mb-8">
            Upload multiple items at once using an Excel file
          </p>

          {/* Content Type Selector */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Select Content Type
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {(['projects', 'news', 'publications', 'videos'] as ContentType[]).map((type) => (
                <button
                  key={type}
                  onClick={() => {
                    setContentType(type);
                    setFile(null);
                    setPreview([]);
                    setErrors([]);
                    setWarnings([]);
                    setUploadResult(null);
                  }}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    contentType === type
                      ? 'border-brand-medium-blue bg-blue-50 text-brand-dark-blue'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <div className="font-semibold capitalize">{type}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Download Template */}
          <div className="mb-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">
              Step 1: Download Template
            </h3>
            <p className="text-sm text-blue-800 mb-4">
              Download the Excel template, fill it with your data, and upload it below.
            </p>
            <button
              onClick={handleDownloadTemplate}
              className="bg-brand-light-blue text-white px-6 py-3 rounded-md hover:bg-blue-600 font-semibold"
            >
              📥 Download {contentType.charAt(0).toUpperCase() + contentType.slice(1)} Template
            </button>
          </div>

          {/* File Upload */}
          <div className="mb-8">
            <h3 className="font-semibold text-gray-900 mb-3">
              Step 2: Upload Filled Template
            </h3>
            <input
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileSelect}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-3 file:px-6 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-brand-light-blue file:text-white hover:file:bg-blue-600 cursor-pointer"
            />
            {file && (
              <p className="mt-2 text-sm text-gray-600">
                Selected: {file.name} ({(file.size / 1024).toFixed(2)} KB)
              </p>
            )}
          </div>

          {/* Errors */}
          {errors.length > 0 && (
            <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg">
              <h3 className="font-semibold text-red-900 mb-2">❌ Errors</h3>
              <ul className="list-disc list-inside text-sm text-red-800 space-y-1">
                {errors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Warnings */}
          {warnings.length > 0 && (
            <div className="mb-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h3 className="font-semibold text-yellow-900 mb-2">⚠️ Warnings</h3>
              <ul className="list-disc list-inside text-sm text-yellow-800 space-y-1">
                {warnings.map((warning, index) => (
                  <li key={index}>{warning}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Preview */}
          {preview.length > 0 && (
            <div className="mb-8">
              <h3 className="font-semibold text-gray-900 mb-3">
                Preview ({preview.length} items)
              </h3>
              <div className="max-h-96 overflow-y-auto border rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50 sticky top-0">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">#</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                      {contentType === 'projects' && (
                        <>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Country</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                        </>
                      )}
                      {contentType !== 'projects' && (
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                      )}
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {preview.map((item, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-900">{index + 1}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{item.title}</td>
                        {contentType === 'projects' && (
                          <>
                            <td className="px-4 py-3 text-sm text-gray-600">{item.country}</td>
                            <td className="px-4 py-3 text-sm text-gray-600">{item.corruptionType}</td>
                          </>
                        )}
                        {contentType !== 'projects' && (
                          <td className="px-4 py-3 text-sm text-gray-600">{item.category}</td>
                        )}
                        <td className="px-4 py-3 text-sm">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            item.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {item.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-4 flex justify-end">
                <button
                  onClick={handleUpload}
                  disabled={isProcessing || errors.length > 0}
                  className={`px-8 py-3 rounded-md font-semibold ${
                    isProcessing || errors.length > 0
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-green-600 hover:bg-green-700'
                  } text-white`}
                >
                  {isProcessing ? 'Uploading...' : `Upload ${preview.length} Items`}
                </button>
              </div>
            </div>
          )}

          {/* Upload Result */}
          {uploadResult && (
            <div className={`p-4 rounded-lg ${
              uploadResult.failed === 0 ? 'bg-green-50 border border-green-200' : 'bg-yellow-50 border border-yellow-200'
            }`}>
              <h3 className={`font-semibold mb-2 ${
                uploadResult.failed === 0 ? 'text-green-900' : 'text-yellow-900'
              }`}>
                {uploadResult.failed === 0 ? '✅ Upload Complete!' : '⚠️ Upload Completed with Errors'}
              </h3>
              <p className={`text-sm ${
                uploadResult.failed === 0 ? 'text-green-800' : 'text-yellow-800'
              }`}>
                Successfully uploaded: {uploadResult.success} items
                {uploadResult.failed > 0 && ` | Failed: ${uploadResult.failed} items`}
              </p>
            </div>
          )}

          {/* Processing Indicator */}
          {isProcessing && (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-brand-medium-blue"></div>
              <p className="mt-4 text-gray-600">Processing...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
