import * as XLSX from 'xlsx';

// Generate Excel template for Projects
export function generateProjectsTemplate() {
  const headers = [
    'Project Name*',
    'Project Number',
    'Region',
    'Country/ies*',
    'City/ies',
    'International Financial Institution (IFI) (comma-separated)',
    'IFI - ADB (X/Yes)',
    'IFI - AIIB (X/Yes)',
    'IFI - GCF (X/Yes)',
    'IFI - GIZ (X/Yes)',
    'IFI - JICA (X/Yes)',
    'IFI - KOICA (X/Yes)',
    'IFI - IFC/ WB (X/Yes)',
    'IFI - Others (X/Yes)',
    'Other IFI',
    'Funding Source',
    'Financial Instruments',
    'False Solution Type* (comma-separated)',
    'False Solution - Waste-to-Energy (X/Yes)',
    'False Solution - Plastic-to-Fuel Technologies (X/Yes)',
    'False Solution - Chemical Recycling (X/Yes)',
    'False Solution - Refuse-derived fuel (X/Yes)',
    'Owner (Public/ Private / PPP)',
    'Private Sector Borrower (comma-separated)',
    'Economic Cooperation or Programs',
    'Other Implementors',
    'Project Description',
    'Project Status',
    'Approval Date*',
    'Start Date',
    'End Date',
    'ADB - Environment',
    'ADB - Involuntary Resettlement',
    'ADB - Indigenous Peoples',
    'AIIB - Environment',
    'AIIB - Involuntary Resettlement',
    'AIIB - Indigenous Peoples',
    'GCF - Environment',
    'GCF - Involuntary Resettlement',
    'GCF - Indigenous Peoples',
    'GIZ - Environment',
    'GIZ - Involuntary Resettlement',
    'GIZ - Indigenous Peoples',
    'JICA - Environment',
    'JICA - Involuntary Resettlement',
    'JICA - Indigenous Peoples',
    'KOICA - Environment',
    'KOICA - Involuntary Resettlement',
    'KOICA - Indigenous Peoples',
    'IFC/ WB - Environment',
    'IFC/ WB - Involuntary Resettlement',
    'IFC/ WB - Indigenous Peoples',
    'Others - Environment',
    'Others - Involuntary Resettlement',
    'Others - Indigenous Peoples',
    'Groups in Opposition (comma-separated)',
    'Types of Actions',
    'Links to Actions',
    'Active GAIA Support (Yes/No)',
    'Notes',
    'References',
    'Gender Concerns',
    'Waste Workers',
    'Resettlement',
    'Publish Date',
    'Status',
  ];

  const exampleRow = [
    'Highway Construction Project',
    'P12345',
    'Asia',
    'Philippines',
    'Philippines::Manila',
    'ADB, IFC/ WB, Others',
    'x',
    '',
    '',
    '',
    '',
    '',
    'x',
    'x',
    'Development Bank of South Asia',
    'Government Budget',
    'Loans',
    'Waste-to-Energy, Chemical Recycling',
    'x',
    '',
    'x',
    '',
    'Public',
    'ABC Construction, XYZ Engineering',
    'RCEP Framework',
    'Ministry, Local NGOs',
    'Construction of a new highway connecting major cities',
    'Active',
    '2024-01-15',
    '2024-03-01',
    '2026-12-31',
    'Category A',
    'Category C',
    'Category C',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    'Category B',
    '',
    '',
    '',
    '',
    '',
    'Local Communities, Environmental Groups',
    'Protests, Legal Action, Media Campaign',
    'https://example.com/action1, https://example.com/action2',
    'Yes',
    'Community groups reported repeated consultation gaps.',
    'https://example.com/report, https://example.com/investigation',
    'Women-led households face disproportionate care burdens.',
    'Waste pickers may lose access to livelihoods.',
    'Potential relocation of nearby communities.',
    '2024-11-15',
    'published',
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
    'Description*',
    'Category*',
    'Featured Image URL (optional)',
    'Tags (comma-separated)',
    'Publish Date',
    'Status (published/draft)',
  ];

  const exampleRow = [
    'Breaking News: Major Corruption Case Unveiled',
    '<p>Details about the corruption case...</p>',
    'Breaking News',
    'https://example.com/image.jpg',
    'corruption, investigation, government',
    '2024-11-15',
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
    'Description*',
    'Publication Type*',
    'Publication Category*',
    'Publisher',
    'Publication Link',
    'Featured Image URL (optional)',
    'Tags (comma-separated)',
    'Publish Date',
    'Status (published/draft)',
  ];

  const exampleRow = [
    'Annual Corruption Report 2024',
    '<p>Comprehensive analysis of corruption trends...</p>',
    'Report',
    'Plastics',
    'GAIA Asia Pacific',
    'https://example.com/reports/annual-report-2024.pdf',
    'https://example.com/report-cover.jpg',
    'report, annual, statistics',
    '2024-11-15',
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
    'Description*',
    'Video Category*',
    'Video URL*',
    'Featured Image URL (optional)',
    'Tags (comma-separated)',
    'Publish Date',
    'Status (published/draft)',
  ];

  const exampleRow = [
    'Documentary: Fighting Corruption',
    '<p>A documentary about anti-corruption efforts...</p>',
    'Documentary',
    'https://youtube.com/watch?v=example',
    'https://example.com/thumbnail.jpg',
    'documentary, video, awareness',
    '2024-11-15',
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
    'Country*',
    'Project Name*',
    'Project Type (kind of energy project)',
    'Location*',
    'Financing Amount',
    'Financiers',
    'Financial Instruments',
    'Other partners involved',
    'Timeline and Status',
    'Safeguard categories',
    'Negative impacts of the project',
    'Reprisals associated with the project',
    'Advocacy Timeline',
    'Other information and links to project documents',
    'Status (published/draft)',
  ];

  const exampleRow = [
    'Philippines',
    'Metro Manila Rail Project',
    'Infrastructure',
    'Metro Manila',
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
