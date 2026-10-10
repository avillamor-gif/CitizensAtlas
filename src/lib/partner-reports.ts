// Partner Reports Database Functions using Supabase
// Replaces in-memory storage with persistent PostgreSQL

import { PartnerReport } from '@/types/types';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function addReport(report: PartnerReport): Promise<PartnerReport | null> {
  try {
    const { data, error } = await supabase
      .from('partner_reports')
      .insert({
        id: report.id,
        name: report.name,
        email: report.email,
        phone: report.phone || null,
        date: report.date,
        region: report.region,
        photos: report.photos || [],
        issue: report.issue,
        consulted: report.consulted,
        operating_company: report.operatingCompany || null,
        observations: report.observations,
        relevant_links: report.relevantLinks || [],
        privacy_accepted: report.privacyAccepted,
        status: report.status,
        submitted_at: report.submittedAt,
        approved_at: report.approvedAt || null,
        approved_by: report.approvedBy || null,
        rejection_reason: report.rejectionReason || null,
      })
      .select();

    if (error) {
      console.error('Error adding report to database:', error);
      return null;
    }

    return data?.[0] ? convertToPartnerReport(data[0]) : null;
  } catch (error) {
    console.error('Error adding report:', error);
    return null;
  }
}

export async function getReportById(id: string): Promise<PartnerReport | undefined> {
  try {
    const { data, error } = await supabase
      .from('partner_reports')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return undefined; // Not found
      console.error('Error fetching report:', error);
      return undefined;
    }

    return data ? convertToPartnerReport(data) : undefined;
  } catch (error) {
    console.error('Error fetching report:', error);
    return undefined;
  }
}

export async function getReportsByStatus(status: string): Promise<PartnerReport[]> {
  try {
    const { data, error } = await supabase
      .from('partner_reports')
      .select('*')
      .eq('status', status)
      .order('submitted_at', { ascending: false });

    if (error) {
      console.error('Error fetching reports by status:', error);
      return [];
    }

    return data ? data.map(convertToPartnerReport) : [];
  } catch (error) {
    console.error('Error fetching reports:', error);
    return [];
  }
}

export async function getAllReports(): Promise<PartnerReport[]> {
  try {
    const { data, error } = await supabase
      .from('partner_reports')
      .select('*')
      .order('submitted_at', { ascending: false });

    if (error) {
      console.error('Error fetching all reports:', error);
      return [];
    }

    return data ? data.map(convertToPartnerReport) : [];
  } catch (error) {
    console.error('Error fetching all reports:', error);
    return [];
  }
}

export async function updateReport(id: string, updates: Partial<PartnerReport>): Promise<PartnerReport | null> {
  try {
    const updateData: any = {};

    if (updates.status) updateData.status = updates.status;
    if (updates.approvedAt) updateData.approved_at = updates.approvedAt;
    if (updates.approvedBy) updateData.approved_by = updates.approvedBy;
    if (updates.rejectionReason) updateData.rejection_reason = updates.rejectionReason;
    if (updates.observations) updateData.observations = updates.observations;
    if (updates.photos) updateData.photos = updates.photos;

    const { data, error } = await supabase
      .from('partner_reports')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating report:', error);
      return null;
    }

    return data ? convertToPartnerReport(data) : null;
  } catch (error) {
    console.error('Error updating report:', error);
    return null;
  }
}

// Helper function to convert database row to PartnerReport type
function convertToPartnerReport(row: any): PartnerReport {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone,
    date: row.date,
    region: row.region,
    photos: row.photos || [],
    issue: row.issue,
    consulted: row.consulted,
    operatingCompany: row.operating_company,
    observations: row.observations,
    relevantLinks: row.relevant_links || [],
    privacyAccepted: row.privacy_accepted,
    status: row.status,
    submittedAt: row.submitted_at,
    approvedAt: row.approved_at,
    approvedBy: row.approved_by,
    rejectionReason: row.rejection_reason,
  };
}

export async function deleteReport(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('partner_reports')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting report:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error deleting report:', error);
    return false;
  }
}
