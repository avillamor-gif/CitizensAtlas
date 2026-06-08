import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { 
    generateProjectsTemplate, 
    generateProjectBriefsTemplate,
    generateNewsTemplate, 
    generatePublicationsTemplate, 
    generateVideosTemplate 
} from '@/lib/services/excel-templates';
import { 
    parseProjectsExcel, 
    parseProjectBriefsExcel,
    parseNewsExcel, 
    parsePublicationsExcel, 
    parseVideosExcel 
} from '@/lib/services/excel-parser';
import { createProject, createProjectBrief, createNews, createPublication, createVideo } from '@/lib/services/data-service';
import { ArrowUpTrayIcon, DownloadIcon } from '@/components/ui/icons';

type ContentType = 'projects' | 'project-briefs' | 'news' | 'publications' | 'videos';

interface BatchUploadProps {
    onSuccess?: () => void;
}

const BatchUpload: React.FC<BatchUploadProps> = ({ onSuccess }) => {
    const [contentType, setContentType] = useState<ContentType>('projects');
    const [file, setFile] = useState<File | null>(null);
    const [parsedData, setParsedData] = useState<any[]>([]);
    const [errors, setErrors] = useState<string[]>([]);
    const [warnings, setWarnings] = useState<string[]>([]);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadResults, setUploadResults] = useState<{ success: number; failed: number } | null>(null);

    const handleDownloadTemplate = () => {
        let filename = '';

        switch (contentType) {
            case 'projects':
                generateProjectsTemplate();
                filename = 'projects_template.xlsx';
                break;
            case 'project-briefs':
                generateProjectBriefsTemplate();
                filename = 'project_briefs_template.xlsx';
                break;
            case 'news':
                generateNewsTemplate();
                filename = 'news_template.xlsx';
                break;
            case 'publications':
                generatePublicationsTemplate();
                filename = 'publications_template.xlsx';
                break;
            case 'videos':
                generateVideosTemplate();
                filename = 'videos_template.xlsx';
                break;
        }
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (!selectedFile) return;

        setFile(selectedFile);
        setParsedData([]);
        setErrors([]);
        setWarnings([]);
        setUploadResults(null);

        try {
            const arrayBuffer = await selectedFile.arrayBuffer();
            const workbook = XLSX.read(arrayBuffer);
            
            let result: { data: any[]; errors: string[]; warnings: string[] } = { data: [], errors: [], warnings: [] };

            switch (contentType) {
                case 'projects':
                    result = await parseProjectsExcel(selectedFile);
                    break;
                case 'project-briefs':
                    result = await parseProjectBriefsExcel(selectedFile);
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

            setParsedData(result.data);
            setErrors(result.errors);
            setWarnings(result.warnings);
        } catch (error) {
            setErrors(['Failed to parse Excel file. Please ensure it matches the template format.']);
        }
    };

    const handleUpload = async () => {
        if (parsedData.length === 0) return;

        setIsUploading(true);
        let successCount = 0;
        let failedCount = 0;

        try {
            for (const item of parsedData) {
                try {
                    switch (contentType) {
                        case 'projects':
                            await createProject(item);
                            break;
                        case 'project-briefs':
                            await createProjectBrief(item);
                            break;
                        case 'news':
                            await createNews(item);
                            break;
                        case 'publications':
                            await createPublication(item);
                            break;
                        case 'videos':
                            await createVideo(item);
                            break;
                    }
                    successCount++;
                } catch (error) {
                    console.error('Failed to create item:', error);
                    failedCount++;
                }
            }

            setUploadResults({ success: successCount, failed: failedCount });
            
            if (successCount > 0 && onSuccess) {
                onSuccess();
            }
        } catch (error) {
            console.error('Batch upload error:', error);
        } finally {
            setIsUploading(false);
        }
    };

    const handleReset = () => {
        setFile(null);
        setParsedData([]);
        setErrors([]);
        setWarnings([]);
        setUploadResults(null);
    };

    return (
        <div className="bg-white rounded-lg shadow-sm p-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-brand-dark-blue mb-3">Batch Upload</h1>
                <p className="text-gray-600">
                    Upload multiple items at once using Excel files. Download the template, fill it out, and upload it back.
                </p>
            </div>

            {/* Content Type Selection */}
            <div className="mb-8">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                    Select Content Type
                </label>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    {(['projects', 'project-briefs', 'news', 'publications', 'videos'] as ContentType[]).map((type) => (
                        <button
                            key={type}
                            onClick={() => {
                                setContentType(type);
                                handleReset();
                            }}
                            className={`p-4 rounded-lg border-2 transition-all ${
                                contentType === type
                                    ? 'text-white'
                                    : 'border-gray-200 hover:border-gray-400'
                            }`}
                            style={contentType === type ? { backgroundColor: '#0d234f', borderColor: '#0d234f' } : {}}
                        >
                            <div className="font-medium capitalize">{type.replace('-', ' ')}</div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Download Template */}
            <div className="mb-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
                <h2 className="text-lg font-semibold text-gray-800 mb-3">Step 1: Download Template</h2>
                <p className="text-sm text-gray-600 mb-4">
                    Download the Excel template for {contentType}, fill in your data, and save the file.
                </p>
                <button
                    onClick={handleDownloadTemplate}
                    className="flex items-center gap-2 px-4 py-2 text-white rounded-lg transition-colors"
                    style={{ backgroundColor: '#0d234f' }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#081629'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#0d234f'}
                >
                    <DownloadIcon className="w-5 h-5" />
                    Download {contentType.charAt(0).toUpperCase() + contentType.slice(1)} Template
                </button>
            </div>

            {/* Upload File */}
            <div className="mb-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
                <h2 className="text-lg font-semibold text-gray-800 mb-3">Step 2: Upload Filled Template</h2>
                <p className="text-sm text-gray-600 mb-4">
                    Select your filled Excel file to preview and validate the data.
                </p>
                <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-gray-300 rounded-lg cursor-pointer hover:border-brand-light-blue transition-colors">
                        <ArrowUpTrayIcon className="w-5 h-5 text-gray-600" />
                        <span className="text-gray-700">Choose File</span>
                        <input
                            type="file"
                            accept=".xlsx,.xls"
                            onChange={handleFileChange}
                            className="hidden"
                        />
                    </label>
                    {file && (
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-700">{file.name}</span>
                            <button
                                onClick={handleReset}
                                className="text-sm text-red-600 hover:text-red-700"
                            >
                                Remove
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Errors and Warnings */}
            {(errors.length > 0 || warnings.length > 0) && (
                <div className="mb-8 space-y-4">
                    {errors.length > 0 && (
                        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                            <h3 className="font-semibold text-red-800 mb-2">Errors ({errors.length})</h3>
                            <ul className="list-disc list-inside space-y-1 text-sm text-red-700">
                                {errors.map((error, index) => (
                                    <li key={index}>{error}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                    {warnings.length > 0 && (
                        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                            <h3 className="font-semibold text-yellow-800 mb-2">Warnings ({warnings.length})</h3>
                            <ul className="list-disc list-inside space-y-1 text-sm text-yellow-700">
                                {warnings.map((warning, index) => (
                                    <li key={index}>{warning}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            )}

            {/* Preview Data */}
            {parsedData.length > 0 && (
                <div className="mb-8">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">
                        Preview ({parsedData.length} items)
                    </h2>
                    <div className="overflow-x-auto border border-gray-200 rounded-lg">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    {Object.keys(parsedData[0] || {}).slice(0, 5).map((key) => (
                                        <th
                                            key={key}
                                            className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                        >
                                            {key}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {parsedData.slice(0, 5).map((item, index) => (
                                    <tr key={index}>
                                        {Object.values(item).slice(0, 5).map((value: any, cellIndex) => (
                                            <td key={cellIndex} className="px-4 py-3 text-sm text-gray-700">
                                                {typeof value === 'string' || typeof value === 'number'
                                                    ? String(value).substring(0, 50)
                                                    : JSON.stringify(value).substring(0, 50)}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {parsedData.length > 5 && (
                        <p className="text-sm text-gray-500 mt-2">
                            Showing first 5 of {parsedData.length} items
                        </p>
                    )}
                </div>
            )}

            {/* Upload Button */}
            {parsedData.length > 0 && errors.length === 0 && (
                <div className="mb-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-800 mb-3">Step 3: Upload to Database</h2>
                    <button
                        onClick={handleUpload}
                        disabled={isUploading}
                        className={`px-6 py-3 rounded-lg font-medium transition-colors text-white ${
                            isUploading ? 'cursor-not-allowed opacity-50' : ''
                        }`}
                        style={{ backgroundColor: isUploading ? '#6b7280' : '#0d234f' }}
                        onMouseEnter={(e) => !isUploading && (e.currentTarget.style.backgroundColor = '#081629')}
                        onMouseLeave={(e) => !isUploading && (e.currentTarget.style.backgroundColor = '#0d234f')}
                    >
                        {isUploading ? 'Uploading...' : `Upload ${parsedData.length} Items`}
                    </button>
                </div>
            )}

            {/* Upload Results */}
            {uploadResults && (
                <div className="p-6 bg-green-50 border border-green-200 rounded-lg">
                    <h3 className="font-semibold text-green-800 mb-2">Upload Complete</h3>
                    <p className="text-sm text-green-700">
                        Successfully uploaded {uploadResults.success} items.
                        {uploadResults.failed > 0 && ` ${uploadResults.failed} items failed.`}
                    </p>
                    <button
                        onClick={handleReset}
                        className="mt-4 px-4 py-2 text-white rounded-lg transition-colors"
                        style={{ backgroundColor: '#0d234f' }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#081629'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#0d234f'}
                    >
                        Upload Another Batch
                    </button>
                </div>
            )}
        </div>
    );
};

export default BatchUpload;
