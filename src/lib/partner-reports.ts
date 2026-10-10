// Shared data storage for partner reports
// In production, this should be replaced with a real database (Supabase, MongoDB, etc.)

import { PartnerReport } from '@/types/types';

// In-memory store
export const partnerReportsStore: PartnerReport[] = [];

export function addReport(report: PartnerReport): void {
  partnerReportsStore.push(report);
}

export function getReportById(id: string): PartnerReport | undefined {
  return partnerReportsStore.find(r => r.id === id);
}

export function getReportsByStatus(status: string): PartnerReport[] {
  return partnerReportsStore.filter(r => r.status === status);
}

export function getAllReports(): PartnerReport[] {
  return partnerReportsStore;
}

export function updateReport(id: string, updates: Partial<PartnerReport>): PartnerReport | null {
  const index = partnerReportsStore.findIndex(r => r.id === id);
  if (index === -1) return null;
  
  partnerReportsStore[index] = { ...partnerReportsStore[index], ...updates };
  return partnerReportsStore[index];
}
