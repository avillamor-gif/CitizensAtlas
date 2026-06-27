import * as XLSX from 'xlsx';
import { Project, Article, ProjectBrief } from '@/types/types';

interface ParseResult<T> {
  data: T[];
  errors: string[];
  warnings: string[];
}

const getRowValue = (row: Record<string, any>, keys: string[]): string => {
  for (const key of keys) {
    const value = row[key];
    if (value !== undefined && value !== null && String(value).trim() !== '') {
      return String(value).trim();
    }
  }
  return '';
};

const getCsvValue = (row: Record<string, any>, keys: string[]): string => getRowValue(row, keys);

const deriveDocumentNameFromLink = (rawLink: string): string => {
  try {
    const parsed = new URL(rawLink);
    const fileName = decodeURIComponent(parsed.pathname.split('/').pop() || '').trim();
    if (fileName) return fileName;
  } catch {
    // Fall through to default.
  }
  return 'Publication Link';
};

const TRUTHY_CHECKBOX_MARKERS = new Set(['x', 'yes', 'true', '1', 'y', '✓', '✔']);

const isCheckedValue = (value: any): boolean => {
  if (value === undefined || value === null) return false;
  const normalized = String(value).trim().toLowerCase();
  return TRUTHY_CHECKBOX_MARKERS.has(normalized);
};

const getCheckedLabels = (row: Record<string, any>, labelToHeaderKeys: Record<string, string[]>): string[] => {
  const selected: string[] = [];
  Object.entries(labelToHeaderKeys).forEach(([label, keys]) => {
    const checked = keys.some((key) => isCheckedValue(row[key]));
    if (checked) selected.push(label);
  });
  return selected;
};

function parseGroupedSpreadsheetProjects(worksheet: XLSX.WorkSheet): ParseResult<Omit<Project, 'id'>> {
  const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '' }) as any[][];
  const headerRow = rows[0] || [];
  const subHeaderRow = rows[1] || [];
  const projects: Omit<Project, 'id'>[] = [];
  const errors: string[] = [];
  const warnings: string[] = [];

  const indexOf = (label: string) => headerRow.findIndex((cell) => String(cell).trim() === label);
  const headerIncludes = (label: string) => headerRow.some((cell) => String(cell).trim() === label);

  if (!headerIncludes('Project name') || !headerIncludes('Country/ies')) {
    return { data: [], errors: ['Unsupported spreadsheet layout.'], warnings: [] };
  }

  const projectNameIndex = indexOf('Project name');
  const countryIndex = indexOf('Country/ies');
  const regionIndex = indexOf('Region');
  const cityIndex = indexOf('City/ies');
  const projectNumberIndex = indexOf('Project no.');
  const falseSolutionsStart = indexOf('False solutions');
  const ifiStart = indexOf('International financial institution (IFI)');
  const fundingSourceIndex = indexOf('Funding Source');
  const financialInstrumentStart = indexOf('Financial Instruments');
  const amount1Index = indexOf('Amount 1');
  const amount2Index = indexOf('Amount 2');
  const amount3Index = indexOf('Amount 3');
  const totalAmountIndex = indexOf('Total project amount in M USD');
  const ownerIndex = indexOf('Owner (Public/Private/PPP)');
  const privateBorrowerIndex = indexOf('Private Sector Borrower or Partner');
  const otherImplementorsIndex = indexOf('Other implementors');
  const descriptionIndex = indexOf('Project description');
  const statusIndex = indexOf('Status (proposed, active, cancelled, inactive)');
  const approvalDateIndex = indexOf('Approval date');
  const startDateIndex = indexOf('Start date');
  const endDateIndex = indexOf('End date');
  const environmentalStart = indexOf('Environmental and Social Safeguard categories');
  const keyDocumentsIndex = indexOf('Key documents');
  const groupsIndex = indexOf('Groups in opposition and types of actions');
  const linksIndex = indexOf('Links to actions');
  const gaiaSupportIndex = indexOf('Active GAIA support? (Y/N)');
  const notesIndex = indexOf('Notes');
  const referencesStart = indexOf('Other References');
  const genderIndex = indexOf('Gender');
  const wastePickersIndex = indexOf('Waste pickers');
  const resettlementIndex = indexOf('Resettlement');

  const pickRangeValues = (row: any[], start: number, end: number, labels?: string[]) => {
    if (start < 0 || end < start) return [] as string[];
    const values: string[] = [];
    const truthyMarkers = new Set(['x', 'yes', 'true', '1', 'y', '✓', '✔']);
    for (let index = start; index <= end; index++) {
      const raw = row[index];
      const text = String(raw ?? '').trim();
      if (!text) continue;
      const label = labels?.[index - start]?.trim();
      const normalized = text.toLowerCase();
      if (truthyMarkers.has(normalized) && label) {
        values.push(label);
      } else {
        values.push(text);
      }
    }
    return values;
  };

  const ifiLabels = subHeaderRow.slice(ifiStart, fundingSourceIndex).map((cell) => String(cell || '').trim());
  const referenceLabels = subHeaderRow.slice(referencesStart, genderIndex).map((cell) => String(cell || '').trim());

  for (let rowIndex = 2; rowIndex < rows.length; rowIndex++) {
    const row = rows[rowIndex] || [];
    const projectName = String(row[projectNameIndex] || '').trim();
    const country = String(row[countryIndex] || '').trim();

    // Skip section labels, blank rows, and non-project rows.
    if (!projectName || !country) {
      continue;
    }

    const falseSolutions = pickRangeValues(row, falseSolutionsStart, ifiStart - 1);
    if (falseSolutions.length === 0) {
      warnings.push(`Row ${rowIndex + 1}: No false solution value found.`);
    }

    const ifiValues = pickRangeValues(row, ifiStart, fundingSourceIndex - 2, ifiLabels);
    const financialInstruments = pickRangeValues(row, financialInstrumentStart, amount1Index - 1);
    const environmentalValues = pickRangeValues(row, environmentalStart, keyDocumentsIndex - 1);
    const referenceValues = pickRangeValues(row, referencesStart, genderIndex - 1, referenceLabels);
    const groupsAndActions = String(row[groupsIndex] || '').trim();

    const totalProjectAmount = String(row[totalAmountIndex] || '').trim();
    const amountParts = pickRangeValues(row, amount1Index, amount3Index);
    const references = [String(row[keyDocumentsIndex] || '').trim(), ...referenceValues].filter(Boolean).join(', ');

    const details = `
**Region:** ${String(row[regionIndex] || '').trim()}
**City:** ${String(row[cityIndex] || '').trim()}
**Project Number:** ${String(row[projectNumberIndex] || '').trim() || 'N/A'}
**IFI:** ${ifiValues.join(', ')}
**Funding Source:** ${String(row[fundingSourceIndex] || '').trim()}
**Sector:** ${String(row[otherImplementorsIndex] || '').trim()}
**Total Project Amount:** ${totalProjectAmount || amountParts.join(', ') || '0'}
**Owner:** ${String(row[ownerIndex] || '').trim()}
**Private Sector Borrowers:** ${String(row[privateBorrowerIndex] || '').trim()}
**Project Description:**
${String(row[descriptionIndex] || '').trim()}
---
**Project Status:** ${String(row[statusIndex] || '').trim() || 'Proposed'}
**Approval Date:** ${String(row[approvalDateIndex] || '').trim() || 'N/A'}
**Start Date:** ${String(row[startDateIndex] || '').trim() || 'N/A'}
**End Date:** ${String(row[endDateIndex] || '').trim() || 'N/A'}
**Environmental Category:** ${environmentalValues.join(', ')}
**Social Safeguard:** ${financialInstruments.join(', ')}
**Groups in Opposition:** ${groupsAndActions}
**Types of Actions:** ${groupsAndActions}
**Links to Actions:** ${String(row[linksIndex] || '').trim()}
**Active GAIA Support:** ${String(row[gaiaSupportIndex] || '').trim()}
**Notes:**
${String(row[notesIndex] || '').trim()}
**References:**
${references}
---
**Gender Concerns:** ${String(row[genderIndex] || '').trim()}
**Waste Workers:** ${String(row[wastePickersIndex] || '').trim()}
**Displacement:** ${String(row[resettlementIndex] || '').trim()}
    `.trim();

    projects.push({
      title: projectName,
      country,
      corruptionType: falseSolutions.join(', '),
      details,
      date: String(row[approvalDateIndex] || '').trim() || new Date().toISOString().split('T')[0],
      publishDate: new Date().toISOString().split('T')[0],
      latitude: 0,
      longitude: 0,
      status: 'published',
    });
  }

  return { data: projects, errors, warnings };
}

// Parse Projects Excel file
export function parseProjectsExcel(file: File): Promise<ParseResult<Omit<Project, 'id'>>> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const sheetRows = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '' }) as any[][];

        if ((sheetRows[0] || []).some((cell) => String(cell).trim() === 'Project name')) {
          resolve(parseGroupedSpreadsheetProjects(worksheet));
          return;
        }

        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        const projects: Omit<Project, 'id'>[] = [];
        const errors: string[] = [];
        const warnings: string[] = [];

        jsonData.forEach((row: any, index: number) => {
          const rowNum = index + 2; // +2 because Excel starts at 1 and we have headers

          const projectName = getRowValue(row, ['Project Name*', 'Project Name', 'Title']);
          const country = getRowValue(row, ['Country/ies*', 'Country/ies', 'Country*', 'Country']);
          const corruptionTypeText = getCsvValue(row, ['False Solution Type* (comma-separated)', 'False Solution Type*', 'False solution type', 'False Solution Type', 'Corruption Type*', 'Corruption Type', 'False Solutions']);
          const region = getRowValue(row, ['Region']);
          const city = getRowValue(row, ['City/ies', 'City']);
          const projectNumber = getRowValue(row, ['Project Number']);
          const totalProjectAmount = getRowValue(row, ['Total Project Amount', 'Project Amount']);
          const ifiText = getRowValue(row, ['International Financial Institution (IFI) (comma-separated)', 'International financial institution (IFI)', 'IFI']);
          const ifiOther = getRowValue(row, ['Other IFI']);
          const fundingSource = getRowValue(row, ['Funding Source', 'Funding source']);
          const financialInstruments = getRowValue(row, ['Financial Instruments (comma-separated amounts)', 'Financial Instruments']);
          const sector = getRowValue(row, ['Sector']);
          const owner = getRowValue(row, ['Owner (Public/ Private / PPP)', 'Owner']);
          const privateSectorBorrowers = getCsvValue(row, ['Private Sector Borrower (comma-separated)', 'Private Sector Borrowers (comma-separated)', 'Private Sector Borrowers']);
          const projectDescription = getRowValue(row, ['Project Description', 'Project description', 'Description']);
          const projectStatus = getRowValue(row, ['Project Status', 'Status (proposed, active, cancelled, inactive)']);
          const approvalDate = getRowValue(row, ['Approval Date*', 'Approval Date', 'Approval date']);
          const startDate = getRowValue(row, ['Start Date', 'Start date']);
          const endDate = getRowValue(row, ['End Date', 'End date']);
          const groupsInOpposition = getCsvValue(row, ['Groups in Opposition (comma-separated)', 'Groups in Opposition']);
          const typesOfActions = getCsvValue(row, ['Types of Actions', 'Types of Actions (comma-separated)']);
          const linksToActions = getCsvValue(row, ['Links to Actions', 'Links to Actions (comma-separated)']);
          const environmental = getCsvValue(row, ['Environmental (comma-separated)', 'Environmental Categories (comma-separated)', 'Environmental Category', 'Environmental']);
          const socialSafeguard = getCsvValue(row, ['Social Safeguard (comma-separated)', 'Social Safeguard', 'Social Safeguards']);
          const activeGaiASupport = getRowValue(row, ['Active GAIA Support (Yes/No)', 'Active GAIA Support', 'Active GAIA support?', 'GAIA Support']);
          const notes = getRowValue(row, ['Notes']);
          const references = getRowValue(row, ['References']);
          const genderConcerns = getRowValue(row, ['Gender Concerns']);
          const wasteWorkers = getRowValue(row, ['Waste Workers']);
          const displacement = getRowValue(row, ['Displacement']);
          const publishDate = getRowValue(row, ['Publish Date']);
          const status = getRowValue(row, ['Status']);

          const falseSolutionCheckboxValues = getCheckedLabels(row, {
            'Waste-to-Energy': ['False Solution - Waste-to-Energy (X/Yes)', 'False Solution - Waste-to-Energy'],
            'Plastic-to-Fuel Technologies': ['False Solution - Plastic-to-Fuel Technologies (X/Yes)', 'False Solution - Plastic-to-Fuel Technologies'],
            'Chemical Recycling': ['False Solution - Chemical Recycling (X/Yes)', 'False Solution - Chemical Recycling'],
            'Refuse-derived fuel': ['False Solution - Refuse-derived fuel (X/Yes)', 'False Solution - Refuse-derived fuel'],
          });

          const corruptionType = [
            ...corruptionTypeText.split(',').map((value) => value.trim()).filter(Boolean),
            ...falseSolutionCheckboxValues,
          ].filter((value, index, array) => array.indexOf(value) === index).join(', ');

          const ifiCheckboxValues = getCheckedLabels(row, {
            'ADB': ['IFI - ADB (X/Yes)', 'IFI - ADB'],
            'AIIB': ['IFI - AIIB (X/Yes)', 'IFI - AIIB'],
            'GCF': ['IFI - GCF (X/Yes)', 'IFI - GCF'],
            'GIZ': ['IFI - GIZ (X/Yes)', 'IFI - GIZ'],
            'JICA': ['IFI - JICA (X/Yes)', 'IFI - JICA'],
            'KOICA': ['IFI - KOICA (X/Yes)', 'IFI - KOICA'],
            'IFC/ WB': ['IFI - IFC/ WB (X/Yes)', 'IFI - IFC/ WB'],
            'Others': ['IFI - Others (X/Yes)', 'IFI - Others'],
          });

          const ifi = [
            ...ifiText.split(',').map((value) => value.trim()).filter(Boolean),
            ...ifiCheckboxValues,
          ].filter((value, index, array) => array.indexOf(value) === index).join(', ');

          // Required fields validation
          if (!projectName) {
            errors.push(`Row ${rowNum}: Project Name is required`);
            return;
          }
          if (!country) {
            errors.push(`Row ${rowNum}: Country is required`);
            return;
          }
          if (!corruptionType) {
            errors.push(`Row ${rowNum}: Corruption Type is required`);
            return;
          }

          const combinedIfi = [ifi, ifiOther].filter(Boolean).join(', ');
          const computedTotalAmount = totalProjectAmount || financialInstruments;

          // Build details string to match ProjectForm exactly.
          const details = `
**Region:** ${region}
**Country:** ${country}
**City:** ${city}
**Project Number:** ${projectNumber || 'N/A'}
**IFI:** ${combinedIfi}
**Funding Source:** ${fundingSource}
**Sector:** ${sector}
**Total Project Amount:** ${computedTotalAmount || '0'}
**Owner:** ${owner}
**Private Sector Borrowers:** ${privateSectorBorrowers}
**Project Description:**
${projectDescription}
---
**Project Status:** ${projectStatus || 'Proposed'}
**Approval Date:** ${approvalDate || 'N/A'}
**Start Date:** ${startDate || 'N/A'}
**End Date:** ${endDate || 'N/A'}
**Environmental Category:** ${environmental}
**Social Safeguard:** ${socialSafeguard}
**Groups in Opposition:** ${groupsInOpposition}
**Types of Actions:** ${typesOfActions}
**Links to Actions:** ${linksToActions}
**Active GAIA Support:** ${activeGaiASupport}
**Notes:**
${notes}
**References:**
${references}
---
**Gender Concerns:** ${genderConcerns}
**Waste Workers:** ${wasteWorkers}
**Displacement:** ${displacement}
          `.trim();

          projects.push({
            title: projectName,
            country,
            corruptionType,
            details,
            date: approvalDate || new Date().toISOString().split('T')[0],
            publishDate: publishDate || new Date().toISOString().split('T')[0],
            latitude: parseFloat(getRowValue(row, ['Latitude'])) || 0,
            longitude: parseFloat(getRowValue(row, ['Longitude'])) || 0,
            status: status === 'draft' ? 'draft' : 'published',
          });
        });

        resolve({ data: projects, errors, warnings });
      } catch (error) {
        resolve({ 
          data: [], 
          errors: [`Failed to parse Excel file: ${error instanceof Error ? error.message : 'Unknown error'}`], 
          warnings: [] 
        });
      }
    };

    reader.readAsBinaryString(file);
  });
}

// Parse News Excel file
export function parseNewsExcel(file: File): Promise<ParseResult<Omit<Article, 'id' | 'slug'>>> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        const news: Omit<Article, 'id' | 'slug'>[] = [];
        const errors: string[] = [];
        const warnings: string[] = [];

        jsonData.forEach((row: any, index: number) => {
          const rowNum = index + 2;

          const title = getRowValue(row, ['Title*', 'Title']);
          const category = getRowValue(row, ['Category*', 'Category']);
          const description = getRowValue(row, ['Description*', 'Description']);
          const imageUrl = getRowValue(row, ['Featured Image URL (optional)', 'Featured Image URL', 'Image URL']);
          const tagsRaw = getRowValue(row, ['Tags (comma-separated)', 'Tags']);
          const publishDate = getRowValue(row, ['Publish Date']);
          const status = getRowValue(row, ['Status (published/draft)', 'Status']);

          if (!title) {
            errors.push(`Row ${rowNum}: Title is required`);
            return;
          }
          if (!category) {
            errors.push(`Row ${rowNum}: Category is required`);
            return;
          }
          if (!description) {
            errors.push(`Row ${rowNum}: Description is required`);
            return;
          }

          const tags = tagsRaw
            ? tagsRaw.split(',').map((t: string) => t.trim())
            : [];

          news.push({
            title,
            category,
            description,
            imageUrl: imageUrl || '',
            tagColor: 'bg-yellow-400',
            tags,
            publishDate: publishDate || new Date().toISOString().split('T')[0],
            status: status === 'draft' ? 'draft' : 'published',
          });
        });

        resolve({ data: news, errors, warnings });
      } catch (error) {
        resolve({ 
          data: [], 
          errors: [`Failed to parse Excel file: ${error instanceof Error ? error.message : 'Unknown error'}`], 
          warnings: [] 
        });
      }
    };

    reader.readAsBinaryString(file);
  });
}

// Parse Publications Excel file
export function parsePublicationsExcel(file: File): Promise<ParseResult<Omit<Article, 'id' | 'slug'>>> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        const publications: Omit<Article, 'id' | 'slug'>[] = [];
        const errors: string[] = [];
        const warnings: string[] = [];

        jsonData.forEach((row: any, index: number) => {
          const rowNum = index + 2;

          const title = getRowValue(row, ['Title*', 'Title']);
          const publicationType = getRowValue(row, ['Publication Type*', 'Category*', 'Category']);
          const publicationCategory = getRowValue(row, ['Publication Category*', 'Publication Category', 'publication_category']);
          const description = getRowValue(row, ['Description*', 'Description']);
          const publisher = getRowValue(row, ['Publisher']);
          const publicationLink = getRowValue(row, ['Publication Link']);
          const imageUrl = getRowValue(row, ['Featured Image URL (optional)', 'Featured Image URL', 'Image URL']);
          const tagsRaw = getRowValue(row, ['Tags (comma-separated)', 'Tags']);
          const publishDate = getRowValue(row, ['Publish Date']);
          const status = getRowValue(row, ['Status (published/draft)', 'Status']);

          if (!title) {
            errors.push(`Row ${rowNum}: Title is required`);
            return;
          }
          if (!publicationType) {
            errors.push(`Row ${rowNum}: Publication Type is required`);
            return;
          }
          if (!publicationCategory) {
            errors.push(`Row ${rowNum}: Publication Category is required`);
            return;
          }
          if (!description) {
            errors.push(`Row ${rowNum}: Description is required`);
            return;
          }

          const tags = tagsRaw
            ? tagsRaw.split(',').map((t: string) => t.trim())
            : [];

          const documentUrls = publicationLink ? [publicationLink] : [];
          const documentNames = publicationLink ? [deriveDocumentNameFromLink(publicationLink)] : [];

          publications.push({
            title,
            category: publicationType,
            publicationCategory,
            publisher: publisher || undefined,
            description,
            imageUrl: imageUrl || '',
            tagColor: 'bg-blue-400',
            tags,
            publishDate: publishDate || new Date().toISOString().split('T')[0],
            documentNames,
            documentUrls,
            downloadCount: 0,
            status: status === 'draft' ? 'draft' : 'published',
          });
        });

        resolve({ data: publications, errors, warnings });
      } catch (error) {
        resolve({ 
          data: [], 
          errors: [`Failed to parse Excel file: ${error instanceof Error ? error.message : 'Unknown error'}`], 
          warnings: [] 
        });
      }
    };

    reader.readAsBinaryString(file);
  });
}

// Parse Videos Excel file
export function parseVideosExcel(file: File): Promise<ParseResult<Omit<Article, 'id' | 'slug'>>> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        const videos: Omit<Article, 'id' | 'slug'>[] = [];
        const errors: string[] = [];
        const warnings: string[] = [];

        jsonData.forEach((row: any, index: number) => {
          const rowNum = index + 2;

          const title = getRowValue(row, ['Title*', 'Title']);
          const category = getRowValue(row, ['Video Category*', 'Category*', 'Category']);
          const description = getRowValue(row, ['Description*', 'Description']);
          const videoUrl = getRowValue(row, ['Video URL*', 'Video URL']);
          const imageUrl = getRowValue(row, ['Featured Image URL (optional)', 'Featured Image URL', 'Image URL']);
          const tagsRaw = getRowValue(row, ['Tags (comma-separated)', 'Tags']);
          const publishDate = getRowValue(row, ['Publish Date']);
          const status = getRowValue(row, ['Status (published/draft)', 'Status']);

          if (!title) {
            errors.push(`Row ${rowNum}: Title is required`);
            return;
          }
          if (!category) {
            errors.push(`Row ${rowNum}: Category is required`);
            return;
          }
          if (!description) {
            errors.push(`Row ${rowNum}: Description is required`);
            return;
          }
          if (!videoUrl) {
            errors.push(`Row ${rowNum}: Video URL is required`);
            return;
          }

          const tags = tagsRaw
            ? tagsRaw.split(',').map((t: string) => t.trim())
            : [];

          videos.push({
            title,
            category,
            description,
            imageUrl: imageUrl || '',
            tagColor: 'bg-purple-400',
            tags,
            publishDate: publishDate || new Date().toISOString().split('T')[0],
            videoUrl,
            status: status === 'draft' ? 'draft' : 'published',
          });
        });

        resolve({ data: videos, errors, warnings });
      } catch (error) {
        resolve({ 
          data: [], 
          errors: [`Failed to parse Excel file: ${error instanceof Error ? error.message : 'Unknown error'}`], 
          warnings: [] 
        });
      }
    };

    reader.readAsBinaryString(file);
  });
}

// Parse Project Briefs Excel file
export function parseProjectBriefsExcel(file: File): Promise<ParseResult<Omit<ProjectBrief, 'id'>>> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        const briefs: Omit<ProjectBrief, 'id'>[] = [];
        const errors: string[] = [];
        const warnings: string[] = [];

        jsonData.forEach((row: any, index: number) => {
          const rowNum = index + 2;

          const projectName = getRowValue(row, ['Project Name*', 'Project Name']);
          const projectType = getRowValue(row, ['Project Type (kind of energy project)', 'Project Type']);
          const location = getRowValue(row, ['Location*', 'Location']);
          const country = getRowValue(row, ['Country*', 'Country']);
          const financingAmount = getRowValue(row, ['Financing Amount']);
          const financiers = getRowValue(row, ['Financiers']);
          const financialInstruments = getRowValue(row, ['Financial Instruments']);
          const otherPartners = getRowValue(row, ['Other partners involved', 'Other Partners Involved']);
          const timelineAndStatus = getRowValue(row, ['Timeline and Status']);
          const safeguardCategories = getRowValue(row, ['Safeguard categories', 'Safeguard Categories']);
          const negativeImpacts = getRowValue(row, ['Negative impacts of the project', 'Negative Impacts']);
          const reprisals = getRowValue(row, ['Reprisals associated with the project', 'Reprisals']);
          const advocacyTimeline = getRowValue(row, ['Advocacy Timeline']);
          const otherInformation = getRowValue(row, ['Other information and links to project documents', 'Other Information']);
          const status = getRowValue(row, ['Status (published/draft)', 'Status']);

          // Required fields validation
          if (!projectName) {
            errors.push(`Row ${rowNum}: Project Name is required`);
            return;
          }
          if (!location) {
            errors.push(`Row ${rowNum}: Location is required`);
            return;
          }
          if (!country) {
            errors.push(`Row ${rowNum}: Country is required`);
            return;
          }

          briefs.push({
            project_name: projectName,
            project_type: projectType || '',
            location,
            country,
            financing_amount: financingAmount || '',
            financiers: financiers || '',
            financial_instruments: financialInstruments || '',
            other_partners_involved: otherPartners || '',
            timeline_and_status: timelineAndStatus || '',
            safeguard_categories: safeguardCategories || '',
            negative_impacts: negativeImpacts || '',
            reprisals: reprisals || '',
            advocacy_timeline: advocacyTimeline || '',
            other_information: otherInformation || '',
            status: status === 'draft' ? 'draft' : 'published',
            submitted_at: new Date().toISOString(),
          });
        });

        resolve({ data: briefs, errors, warnings });
      } catch (error) {
        resolve({ 
          data: [], 
          errors: [`Failed to parse Excel file: ${error instanceof Error ? error.message : 'Unknown error'}`], 
          warnings: [] 
        });
      }
    };

    reader.readAsBinaryString(file);
  });
}
