import * as XLSX from 'xlsx';
import { Project, Article } from '@/types/types';

interface ParseResult<T> {
  data: T[];
  errors: string[];
  warnings: string[];
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
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        const projects: Omit<Project, 'id'>[] = [];
        const errors: string[] = [];
        const warnings: string[] = [];

        jsonData.forEach((row: any, index: number) => {
          const rowNum = index + 2; // +2 because Excel starts at 1 and we have headers

          // Required fields validation
          if (!row['Project Name*']) {
            errors.push(`Row ${rowNum}: Project Name is required`);
            return;
          }
          if (!row['Country*']) {
            errors.push(`Row ${rowNum}: Country is required`);
            return;
          }
          if (!row['Corruption Type*']) {
            errors.push(`Row ${rowNum}: Corruption Type is required`);
            return;
          }

          // Build details string (this matches your ProjectForm format)
          const details = `
Region: ${row['Region'] || ''}
City: ${row['City'] || ''}
Project Number: ${row['Project Number'] || ''}
Total Project Amount: ${row['Total Project Amount'] || '0'}
IFI: ${row['IFI'] || ''}
Funding Source: ${row['Funding Source'] || ''}
Sector: ${row['Sector'] || ''}
Owner: ${row['Owner'] || ''}
Private Sector Borrowers: ${row['Private Sector Borrowers (comma-separated)'] || ''}
Project Description:
${row['Project Description'] || ''}
Project Status: ${row['Project Status'] || 'Proposed'}
Approval Date: ${row['Approval Date'] || ''}
Start Date: ${row['Start Date'] || ''}
End Date: ${row['End Date'] || ''}
Groups in Opposition: ${row['Groups in Opposition (comma-separated)'] || ''}
Types of Actions: ${row['Types of Actions (comma-separated)'] || ''}
Links to Actions: ${row['Links to Actions (comma-separated)'] || ''}
Environmental: ${row['Environmental Categories (comma-separated)'] || ''}
Social Safeguard: ${row['Social Safeguard (comma-separated)'] || ''}
          `.trim();

          projects.push({
            title: row['Project Name*'],
            country: row['Country*'],
            corruptionType: row['Corruption Type*'],
            details,
            date: row['Approval Date'] || new Date().toISOString().split('T')[0],
            publishDate: new Date().toISOString().split('T')[0],
            latitude: parseFloat(row['Latitude']) || 0,
            longitude: parseFloat(row['Longitude']) || 0,
            status: row['Status'] === 'draft' ? 'draft' : 'published',
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
