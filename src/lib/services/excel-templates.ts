import * as XLSX from 'xlsx';

// Generate Excel template for Projects
export function generateProjectsTemplate() {
  const headers = [
    'Project Name*',
    'Project Number',
    'Country*',
    'Region',
    'City',
    'Latitude',
    'Longitude',
    'Corruption Type*',
    'Project Description',
    'Project Status',
    'Approval Date',
    'Start Date',
    'End Date',
    'Total Project Amount',
    'IFI',
    'Funding Source',
    'Sector',
    'Owner',
    'Private Sector Borrowers (comma-separated)',
    'Groups in Opposition (comma-separated)',
    'Types of Actions (comma-separated)',
    'Links to Actions (comma-separated)',
    'Environmental Categories (comma-separated)',
    'Social Safeguard (comma-separated)',
  ];

  const exampleRow = [
    'Highway Construction Project',
    'P12345',
    'Philippines',
    'Asia',
    'Manila',
    '14.5995',
    '120.9842',
    'Procurement Fraud',
    'Construction of a new highway connecting major cities',
    'Active',
    '2024-01-15',
    '2024-03-01',
    '2026-12-31',
    '500000000',
    'World Bank',
    'Government Budget',
    'Transportation',
    'Department of Public Works',
    'ABC Construction, XYZ Engineering',
    'Local Communities, Environmental Groups',
    'Protests, Legal Action, Media Campaign',
    'https://example.com/action1, https://example.com/action2',
    'Category A, Category B',
    'Involuntary Resettlement, Indigenous Peoples',
  ];

  const ws = XLSX.utils.aoa_to_sheet([headers, exampleRow]);
  
  // Set column widths
  ws['!cols'] = headers.map(() => ({ wch: 20 }));
  
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Projects');
  
  XLSX.writeFile(wb, 'projects-upload-template.xlsx');
}

// Generate Excel template for News
export function generateNewsTemplate() {
  const headers = [
    'Title*',
    'Category*',
    'Description',
    'Image URL',
    'Video URL',
    'Publish Date',
    'Tags (comma-separated)',
    'Status',
  ];

  const exampleRow = [
    'Breaking News: Major Corruption Case Unveiled',
    'Breaking News',
    '<p>Details about the corruption case...</p>',
    'https://example.com/image.jpg',
    '',
    '2024-11-15',
    'corruption, investigation, government',
    'published',
  ];

  const ws = XLSX.utils.aoa_to_sheet([headers, exampleRow]);
  ws['!cols'] = headers.map(() => ({ wch: 25 }));
  
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'News');
  
  XLSX.writeFile(wb, 'news-upload-template.xlsx');
}

// Generate Excel template for Publications
export function generatePublicationsTemplate() {
  const headers = [
    'Title*',
    'Category*',
    'Description',
    'Image URL',
    'Document Names (comma-separated)',
    'Publish Date',
    'Tags (comma-separated)',
    'Status',
  ];

  const exampleRow = [
    'Annual Corruption Report 2024',
    'Report',
    '<p>Comprehensive analysis of corruption trends...</p>',
    'https://example.com/report-cover.jpg',
    'annual-report-2024.pdf, executive-summary.pdf',
    '2024-11-15',
    'report, annual, statistics',
    'published',
  ];

  const ws = XLSX.utils.aoa_to_sheet([headers, exampleRow]);
  ws['!cols'] = headers.map(() => ({ wch: 25 }));
  
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Publications');
  
  XLSX.writeFile(wb, 'publications-upload-template.xlsx');
}

// Generate Excel template for Videos
export function generateVideosTemplate() {
  const headers = [
    'Title*',
    'Category*',
    'Description',
    'Image URL',
    'Video URL*',
    'Publish Date',
    'Tags (comma-separated)',
    'Status',
  ];

  const exampleRow = [
    'Documentary: Fighting Corruption',
    'Documentary',
    '<p>A documentary about anti-corruption efforts...</p>',
    'https://example.com/thumbnail.jpg',
    'https://youtube.com/watch?v=example',
    '2024-11-15',
    'documentary, video, awareness',
    'published',
  ];

  const ws = XLSX.utils.aoa_to_sheet([headers, exampleRow]);
  ws['!cols'] = headers.map(() => ({ wch: 25 }));
  
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Videos');
  
  XLSX.writeFile(wb, 'videos-upload-template.xlsx');
}

// Generate Excel template for Project Briefs
export function generateProjectBriefsTemplate() {
  const headers = [
    'Project Name*',
    'Project Type',
    'Location*',
    'Country*',
    'Financing Amount',
    'Financiers',
    'Financial Instruments',
    'Other Partners Involved',
    'Timeline and Status',
    'Safeguard Categories',
    'Negative Impacts',
    'Reprisals',
    'Advocacy Timeline',
    'Other Information',
    'Status',
  ];

  const exampleRow = [
    'Metro Manila Rail Project',
    'Infrastructure',
    'Metro Manila',
    'Philippines',
    '2.5 billion USD',
    'Asian Development Bank, World Bank',
    'Loans, Grants',
    'Department of Transportation, Private Contractors',
    'Phase 1: 2024-2026, Phase 2: 2027-2029',
    'Environmental Assessment Required',
    'Displacement of 500 families, Air quality concerns',
    'Community leaders received threats',
    '2023: Initial complaints filed, 2024: Legal action initiated',
    'Additional context and relevant information',
    'published',
  ];

  const ws = XLSX.utils.aoa_to_sheet([headers, exampleRow]);
  ws['!cols'] = headers.map(() => ({ wch: 25 }));
  
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Project Briefs');
  
  XLSX.writeFile(wb, 'project-briefs-upload-template.xlsx');
}
