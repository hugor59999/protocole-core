import Airtable, { type FieldSet } from "airtable";
import { SCENARIOS } from "./scenarios";

export const STATUSES = ["À contacter", "Contacté", "En cours", "Signé"] as const;
export type LeadStatus = (typeof STATUSES)[number];

export interface Lead {
  id: string;
  firstName: string;
  email: string;
  mobile: string;
  date: string;
  answers: string[];
  diagnosis: string;
  status: LeadStatus;
}

function getTable() {
  const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
    process.env.AIRTABLE_BASE_ID as string
  );
  return base("Diagnostics");
}

export async function createLead(input: {
  firstName: string;
  email: string;
  mobile: string;
  answers: string[];
  diagnosis: string;
}): Promise<string> {
  const table = getTable();
  const fields: Partial<FieldSet> = {
    Prénom: input.firstName,
    Email: input.email,
    Mobile: input.mobile,
    Date: new Date().toISOString(),
    Diagnostic: input.diagnosis,
    Statut: "À contacter",
  };
  SCENARIOS.forEach((_, i) => {
    fields[`Réponse ${i + 1}`] = input.answers[i];
  });
  const record = await table.create(fields);
  return record.id;
}

export async function listLeads(): Promise<Lead[]> {
  const table = getTable();
  const records = await table.select({ sort: [{ field: "Date", direction: "desc" }] }).all();
  return records.map((record) => ({
    id: record.id,
    firstName: (record.get("Prénom") as string) || "",
    email: (record.get("Email") as string) || "",
    mobile: (record.get("Mobile") as string) || "",
    date: (record.get("Date") as string) || "",
    answers: SCENARIOS.map((_, i) => (record.get(`Réponse ${i + 1}`) as string) || ""),
    diagnosis: (record.get("Diagnostic") as string) || "",
    status: ((record.get("Statut") as LeadStatus) || "À contacter"),
  }));
}

export async function updateLeadStatus(id: string, status: LeadStatus): Promise<void> {
  const table = getTable();
  await table.update(id, { Statut: status });
}
