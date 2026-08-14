// Use Vercel KV (free Redis) - automatically available in Vercel projects
import { kv } from '@vercel/kv';

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

const LEADS_KEY = 'quiz:leads';

export async function addLeadKV(leadData: Omit<Lead, 'id' | 'status'>): Promise<string> {
  try {
    const id = Math.random().toString(36).substring(2, 11);
    const lead: Lead = {
      ...leadData,
      id,
      status: 'À contacter',
    };

    // Get existing leads
    const existingLeads = await getLeadsKV();
    existingLeads.push(lead);

    // Save updated leads
    await kv.set(LEADS_KEY, JSON.stringify(existingLeads));
    console.log(`Lead ${id} saved to Vercel KV`);

    return id;
  } catch (err) {
    console.error('Vercel KV save error:', err);
    throw err;
  }
}

export async function getLeadsKV(): Promise<Lead[]> {
  try {
    const data = await kv.get<string>(LEADS_KEY);
    if (!data) return [];

    const leads = JSON.parse(data);
    return leads.sort((a: Lead, b: Lead) =>
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  } catch (err) {
    console.error('Vercel KV fetch error:', err);
    return [];
  }
}

export async function deleteLeadKV(id: string): Promise<void> {
  try {
    const leads = await getLeadsKV();
    const filtered = leads.filter(l => l.id !== id);
    await kv.set(LEADS_KEY, JSON.stringify(filtered));
    console.log(`Lead ${id} deleted from Vercel KV`);
  } catch (err) {
    console.error('Vercel KV delete error:', err);
    throw err;
  }
}
