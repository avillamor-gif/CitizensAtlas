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
          const country = getRowValue(row, ['Country*', 'Country']);
          const corruptionType = getCsvValue(row, ['Corruption Type*', 'Corruption Type', 'False Solution Type*', 'False Solution Type', 'False Solutions']);
          const region = getRowValue(row, ['Region']);
          const city = getRowValue(row, ['City']);
          const projectNumber = getRowValue(row, ['Project Number']);
          const totalProjectAmount = getRowValue(row, ['Total Project Amount', 'Project Amount']);
          const ifi = getRowValue(row, ['IFI']);
          const fundingSource = getRowValue(row, ['Funding Source']);
          const sector = getRowValue(row, ['Sector']);
          const owner = getRowValue(row, ['Owner']);
          const privateSectorBorrowers = getCsvValue(row, ['Private Sector Borrowers (comma-separated)', 'Private Sector Borrowers']);
          const projectDescription = getRowValue(row, ['Project Description', 'Description']);
          const projectStatus = getRowValue(row, ['Project Status']);
          const approvalDate = getRowValue(row, ['Approval Date']);
          const startDate = getRowValue(row, ['Start Date']);
          const endDate = getRowValue(row, ['End Date']);
          const groupsInOpposition = getCsvValue(row, ['Groups in Opposition (comma-separated)', 'Groups in Opposition']);
          const typesOfActions = getCsvValue(row, ['Types of Actions (comma-separated)', 'Types of Actions']);
          const linksToActions = getCsvValue(row, ['Links to Actions (comma-separated)', 'Links to Actions']);
          const environmental = getCsvValue(row, ['Environmental Categories (comma-separated)', 'Environmental Category', 'Environmental']);
          const socialSafeguard = getCsvValue(row, ['Social Safeguard (comma-separated)', 'Social Safeguard', 'Social Safeguards']);
          const activeGaiASupport = getRowValue(row, ['Active GAIA Support', 'Active GAIA support?', 'GAIA Support']);
          const notes = getRowValue(row, ['Notes']);
          const references = getRowValue(row, ['References']);
          const genderConcerns = getRowValue(row, ['Gender Concerns']);
          const wasteWorkers = getRowValue(row, ['Waste Workers']);
          const displacement = getRowValue(row, ['Displacement']);
          const publishDate = getRowValue(row, ['Publish Date']);
          const status = getRowValue(row, ['Status']);

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

          // Build details string to match ProjectForm exactly.
          const details = `
**Region:** ${region}
**City:** ${city}
**Project Number:** ${projectNumber || 'N/A'}
**IFI:** ${ifi}
**Funding Source:** ${fundingSource}
**Sector:** ${sector}
**Total Project Amount:** ${totalProjectAmount || '0'}
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

          if (!row['Title*']) {
            errors.push(`Row ${rowNum}: Title is required`);
            return;
          }
          if (!row['Category*']) {
            errors.push(`Row ${rowNum}: Category is required`);
            return;
          }

          const tags = row['Tags (comma-separated)']
            ? row['Tags (comma-separated)'].split(',').map((t: string) => t.trim())
            : [];

          news.push({
            title: row['Title*'],
            category: row['Category*'],
            description: row['Description'] || '',
            imageUrl: row['Image URL'] || '',
            tagColor: 'bg-yellow-400',
            tags,
            publishDate: row['Publish Date'] || new Date().toISOString().split('T')[0],
            videoUrl: row['Video URL'] || undefined,
            status: row['Status'] === 'draft' ? 'draft' : 'published',
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

          if (!row['Title*']) {
            errors.push(`Row ${rowNum}: Title is required`);
            return;
          }
          if (!row['Category*']) {
            errors.push(`Row ${rowNum}: Category is required`);
            return;
          }

          const tags = row['Tags (comma-separated)']
            ? row['Tags (comma-separated)'].split(',').map((t: string) => t.trim())
            : [];

          const documentNames = row['Document Names (comma-separated)']
            ? row['Document Names (comma-separated)'].split(',').map((d: string) => d.trim())
            : [];

          publications.push({
            title: row['Title*'],
            category: row['Category*'],
            description: row['Description'] || '',
            imageUrl: row['Image URL'] || '',
            tagColor: 'bg-blue-400',
            tags,
            publishDate: row['Publish Date'] || new Date().toISOString().split('T')[0],
            documentNames,
            downloadCount: 0,
            status: row['Status'] === 'draft' ? 'draft' : 'published',
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

          if (!row['Title*']) {
            errors.push(`Row ${rowNum}: Title is required`);
            return;
          }
          if (!row['Category*']) {
            errors.push(`Row ${rowNum}: Category is required`);
            return;
          }
          if (!row['Video URL*']) {
            errors.push(`Row ${rowNum}: Video URL is required`);
            return;
          }

          const tags = row['Tags (comma-separated)']
            ? row['Tags (comma-separated)'].split(',').map((t: string) => t.trim())
            : [];

          videos.push({
            title: row['Title*'],
            category: row['Category*'],
            description: row['Description'] || '',
            imageUrl: row['Image URL'] || '',
            tagColor: 'bg-purple-400',
            tags,
            publishDate: row['Publish Date'] || new Date().toISOString().split('T')[0],
            videoUrl: row['Video URL*'],
            status: row['Status'] === 'draft' ? 'draft' : 'published',
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

          // Required fields validation
          if (!row['Project Name*']) {
            errors.push(`Row ${rowNum}: Project Name is required`);
            return;
          }
          if (!row['Location*']) {
            errors.push(`Row ${rowNum}: Location is required`);
            return;
          }
          if (!row['Country*']) {
            errors.push(`Row ${rowNum}: Country is required`);
            return;
          }

          briefs.push({
            project_name: row['Project Name*'],
            project_type: row['Project Type'] || '',
            location: row['Location*'],
            country: row['Country*'],
            financing_amount: row['Financing Amount'] || '',
            financiers: row['Financiers'] || '',
            financial_instruments: row['Financial Instruments'] || '',
            other_partners_involved: row['Other Partners Involved'] || '',
            timeline_and_status: row['Timeline and Status'] || '',
            safeguard_categories: row['Safeguard Categories'] || '',
            negative_impacts: row['Negative Impacts'] || '',
            reprisals: row['Reprisals'] || '',
            advocacy_timeline: row['Advocacy Timeline'] || '',
            other_information: row['Other Information'] || '',
            status: row['Status'] === 'draft' ? 'draft' : 'published',
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
