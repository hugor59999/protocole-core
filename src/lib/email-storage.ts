import { sendDiagnosisEmail } from './email';

interface Lead {
  id: string;
  firstName: string;
  email: string;
  mobile: string;
  date: string;
  answers: string[];
  diagnosis: string;
  status: string;
}

// In-memory storage for this session
let sessionLeads: Lead[] = [];

export async function addLeadMemory(leadData: Omit<Lead, 'id' | 'status'>): Promise<string> {
  const id = Math.random().toString(36).substring(2, 11);
  const lead: Lead = {
    ...leadData,
    id,
    status: 'À contacter',
  };

  sessionLeads.push(lead);
  console.log(`Lead ${id} saved in session memory. Total leads: ${sessionLeads.length}`);

  return id;
}

export async function getLeadsMemory(): Promise<Lead[]> {
  return sessionLeads.sort((a, b) =>
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export async function deleteLeadMemory(id: string): Promise<void> {
  sessionLeads = sessionLeads.filter(l => l.id !== id);
  console.log(`Lead ${id} deleted from session memory`);
}
