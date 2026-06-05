import { getSupabase } from "@/lib/supabaseClient";

// ── Helpers ──────────────────────────────────────────────────
function generateTicketId(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "TN-";
  for (let i = 0; i < 5; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// ── Types ────────────────────────────────────────────────────
export type Report = {
  id: string;
  ticket_id: string;
  email: string;
  date: string;
  location: string;
  chronology: string;
  images: string[];
  category: string | null;
  status: "pending" | "in_progress" | "resolved" | "closed";
  created_at: string;
  updated_at: string;
};

export type ReportLog = {
  id: string;
  report_id: string;
  action: string;
  description: string | null;
  created_by: string;
  created_at: string;
};

export type ReportConversation = {
  id: string;
  report_id: string;
  sender: "user" | "admin";
  message: string;
  created_at: string;
};

// ── Reports ──────────────────────────────────────────────────
export type CreateReportInput = {
  email: string;
  date: string;
  location: string;
  chronology: string;
  images?: string[];
};

export async function createReport(input: CreateReportInput) {
  let ticket_id = generateTicketId();

  // Ensure uniqueness
  let exists = await supabase
    .from("reports")
    .select("ticket_id")
    .eq("ticket_id", ticket_id)
    .maybeSingle();

  while (exists.data) {
    ticket_id = generateTicketId();
    exists = await supabase
      .from("reports")
      .select("ticket_id")
      .eq("ticket_id", ticket_id)
      .maybeSingle();
  }

  const { data, error } = await supabase
    .from("reports")
    .insert({
      ticket_id,
      email: input.email,
      date: input.date,
      location: input.location,
      chronology: input.chronology,
      images: input.images ?? [],
    })
    .select()
    .single();

  if (error) throw error;
  return data as Report;
}

export async function getReportByTicket(ticketId: string) {
  const { data, error } = await supabase
    .from("reports")
    .select("*")
    .eq("ticket_id", ticketId)
    .single();

  if (error) throw error;
  return data as Report;
}

export async function getReportById(id: string) {
  const { data, error } = await supabase
    .from("reports")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data as Report;
}

export async function getAllReports() {
  const { data, error } = await supabase
    .from("reports")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data as Report[];
}

export async function updateReport(
  id: string,
  updates: Partial<Pick<Report, "category" | "status">>
) {
  const { data, error } = await supabase
    .from("reports")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data as Report;
}

export async function deleteReport(id: string) {
  const { error } = await getSupabase().from("reports").delete().eq("id", id);
  if (error) throw error;
}

// ── Report Logs ──────────────────────────────────────────────
export async function addReportLog(input: {
  report_id: string;
  action: string;
  description?: string;
  created_by: string;
}) {
  const { data, error } = await supabase
    .from("report_logs")
    .insert({
      report_id: input.report_id,
      action: input.action,
      description: input.description ?? null,
      created_by: input.created_by,
    })
    .select()
    .single();

  if (error) throw error;
  return data as ReportLog;
}

export async function getReportLogs(reportId: string) {
  const { data, error } = await supabase
    .from("report_logs")
    .select("*")
    .eq("report_id", reportId)
    .order("created_at", { ascending: true });

  if (error) throw error;
  return data as ReportLog[];
}

// ── Report Conversations ─────────────────────────────────────
export async function addConversationMessage(input: {
  report_id: string;
  sender: "user" | "admin";
  message: string;
}) {
  const { data, error } = await supabase
    .from("report_conversations")
    .insert({
      report_id: input.report_id,
      sender: input.sender,
      message: input.message,
    })
    .select()
    .single();

  if (error) throw error;
  return data as ReportConversation;
}

export async function getConversations(reportId: string) {
  const { data, error } = await supabase
    .from("report_conversations")
    .select("*")
    .eq("report_id", reportId)
    .order("created_at", { ascending: true });

  if (error) throw error;
  return data as ReportConversation[];
}

// ── Get full report details (report + logs + conversations) ──
export async function getReportDetail(ticketId: string) {
  const report = await getReportByTicket(ticketId);
  const logs = await getReportLogs(report.id);
  const conversations = await getConversations(report.id);
  return { ...report, logs, conversations };
}
