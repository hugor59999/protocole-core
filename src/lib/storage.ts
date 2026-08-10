import { promises as fs } from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), '.data');
const LEADS_FILE = path.join(DATA_DIR, 'leads.json');

interface StoredLead {
  id: string;
  firstName: string;
  email: string;
  mobile: string;
  date: string;
  answers: string[];
  diagnosis: string;
  status: string;
}

async function ensureDir() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch (err) {
    // Directory might already exist
  }
}

async function readLeads(): Promise<StoredLead[]> {
  try {
    await ensureDir();
    const content = await fs.readFile(LEADS_FILE, 'utf-8');
    return JSON.parse(content);
  } catch (err) {
    return [];
  }
}

async function writeLeads(leads: StoredLead[]): Promise<void> {
  await ensureDir();
  await fs.writeFile(LEADS_FILE, JSON.stringify(leads, null, 2));
}

export async function addLead(lead: Omit<StoredLead, 'id' | 'status'>): Promise<string> {
  const leads = await readLeads();
  const id = Math.random().toString(36).substring(2, 11);
  const newLead: StoredLead = {
    ...lead,
    id,
    status: 'À contacter',
  };
  leads.push(newLead);
  await writeLeads(leads);
  return id;
}

export async function getAllLeads(): Promise<StoredLead[]> {
  const leads = await readLeads();
  return leads.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function deleteLead(id: string): Promise<void> {
  const leads = await readLeads();
  const filtered = leads.filter((l) => l.id !== id);
  await writeLeads(filtered);
}
