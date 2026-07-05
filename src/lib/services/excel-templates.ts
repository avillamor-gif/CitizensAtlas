import * as XLSX from 'xlsx';

// Generate Excel template for Projects
export function generateProjectsTemplate() {
  const headers = [
    // Project Information
    'Project Name*',
    'Project Number',
    'Project Status',
    'False Solution Type* (comma-separated)',
    'False Solution - Waste-to-Energy (X/Yes)',
    'False Solution - Plastic-to-Fuel Technologies (X/Yes)',
    'False Solution - Chemical Recycling (X/Yes)',
    'False Solution - Refuse-derived fuel (X/Yes)',
    'Project Description',
    'Approval Date*',
    'Start Date',
    'End Date',
    'Region',
    'Country/ies*',
    'City/ies',
    
    // Financial Information
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
    'Owner (Public/ Private / PPP)',
    'Private Sector Borrower (comma-separated)',
    'Economic Cooperation or Programs',
    'Other Implementors',
    
    // Environmental and Social Safeguards
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
    
    // Key Documents
    'Key Documents URL',
    
    // Just Transition Indicators
    'Gender Concerns',
    'Waste Workers',
    'Resettlement',
    
    // Community Opposition & Actions
    'Groups in Opposition (comma-separated)',
    'Types of Actions',
    'Links to Actions',
    
    // Additional Information
    'Notes',
    'References',
    'Publish Date',
  ];

  const exampleRow = [
    // Project Information
    'Chennai City Partnership: Sustainable Urban Services Program',
    'P175221 (WB)',
    'Active',
    'Waste-to-Energy (WtE)',
    '',
    '',
    '',
    '',
    'The Program is envisioned as a first-phase engagement and a building block for the Bank\'s long-term partnership in the Chennai Metropolitan Area',
    '',
    '2021-10-01',
    '2026-06-30',
    'South Asia, Asia',
    'India',
    'Chennai',
    
    // Financial Information
    'AIIB, IFC/ WB, Others',
    'x',
    '',
    '',
    '',
    '',
    '',
    'x',
    'x',
    '',
    'ADB, WB Financing',
    'Technical Assistance',
    'Public',
    'NA',
    'NA',
    'The State of Tamil Nadu is the primary implementing entity',
    
    // Environmental and Social Safeguards
    'Category A',
    'Category A',
    'Category A',
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
    'Category B',
    'Category B',
    '',
    '',
    '',
    
    // Key Documents
    'https://www.aiib.org/en/projects/details/2021/_download/india/document/AIIB-SUSP-P000477-Project-Document_Nov-11-2021.pdf',
    
    // Just Transition Indicators
    'AIIB and WB acknowledge women may be excluded from benefits. A Gender Lab proposed under the project.',
    'Informal waste pickers and SWM workers recognized with identity cards. Need to integrate authorized waste-pickers and facilitate formation of SHGs.',
    'WB screening criteria exclude land acquisition from private owners. No RAP currently in place.',
    
    // Community Opposition & Actions
    'NA',
    '',
    '',
    
    // Additional Information
    '',
    '',
    '2026-07-04',
  ];

  const exampleRow2 = [
    // Project Information
    'Bangladesh Integrated Solid Waste Management',
    'P98765 (ADB)',
    'Active',
    'Waste-to-Energy (WtE), Chemical Recycling',
    'x',
    'x',
    '',
    '',
    'Integrated solid waste management system for major urban centers in Bangladesh',
    '',
    '2019-06-15',
    '2023-12-31',
    'South Asia',
    'Bangladesh',
    'Dhaka, Chittagong',
    
    // Financial Information
    'ADB, IFC/ WB',
    'x',
    '',
    '',
    '',
    '',
    '',
    'x',
    '',
    '',
    'ADB Loan, Government Counterpart',
    'Loans',
    'Public',
    'NA',
    'NA',
    'City Corporations of Dhaka and Chittagong',
    
    // Environmental and Social Safeguards
    'Category B',
    'Category B',
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
    'Category A',
    'Category B',
    '',
    '',
    '',
    '',
    
    // Key Documents
    'https://www.adb.org/projects/52344-001/main',
    
    // Just Transition Indicators
    'Female participation in waste management activities and training programs',
    'Informal waste workers and waste pickers to be formalized and provided livelihood training',
    'Potential land acquisition for waste processing facilities in Chittagong',
    
    // Community Opposition & Actions
    'Local residents in waste processing areas',
    'Community meetings, NGO advocacy',
    'https://example.com/bangladesh-swm',
    
    // Additional Information
    '',
    '',
    '2026-07-04',
  ];

  const exampleRow3 = [
    // Project Information
    'Kerala Solid Waste Management Project',
    'P65432 (WB)',
    'Proposed',
    'Plastic-to-Fuel Technologies',
    '',
    'x',
    '',
    '',
    'Modernization and integration of waste management systems across Kerala municipalities',
    '',
    '',
    '',
    'South Asia, Asia',
    'India',
    'Kochi, Thiruvananthapuram, Kozhikode',
    
    // Financial Information
    'IFC/ WB, GCF',
    '',
    '',
    '',
    '',
    '',
    'x',
    'x',
    '',
    '',
    'WB Loan, Green Climate Fund Grant',
    'Grants',
    'Public-Private Partnership',
    'Waste Management Solutions Ltd',
    'NA',
    'Kerala Municipalities, KSWMC',
    
    // Environmental and Social Safeguards
    '',
    '',
    '',
    '',
    '',
    '',
    'Category B',
    'Category B',
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
    
    // Key Documents
    'https://www.worldbank.org/en/country/india/projects',
    
    // Just Transition Indicators
    'Women entrepreneurs in waste collection and sorting units',
    'Skills training for informal waste workers on plastic-to-fuel processing',
    'No major resettlement; land use through lease agreements',
    
    // Community Opposition & Actions
    'NA',
    '',
    '',
    
    // Additional Information
    'Project in early design phase; community consultations ongoing',
    '',
    '2026-07-04',
  ];

  const ws = XLSX.utils.aoa_to_sheet([headers, exampleRow, exampleRow2, exampleRow3]);
  
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
