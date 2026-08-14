// Use JSONBin.io for free persistent JSON storage (no setup required)
// Alternative: Use a simple in-memory storage that lasts the session

interface Lead {
  firstName: string;
  email: string;
  mobile: string;
  date: string;
  answers: string[];
  diagnosis: string;
  status?: string;
  id?: string;
}

// In-memory storage for production (lasts during the Vercel invocation)
let memoryStorage: Lead[] = [];

export async function addLeadMemory(lead: Omit<Lead, 'id' | 'status'>): Promise<string> {
  const id = Math.random().toString(36).substring(2, 11);
  const newLead: Lead = {
    ...lead,
    id,
    status: 'À contacter',
  };
  memoryStorage.push(newLead);

  // Also save to a persistent layer (could be replaced with real DB)
  console.log(`Lead saved in-memory with ID: ${id}`);

  return id;
}

export async function getLeadsMemory(): Promise<Lead[]> {
  return memoryStorage.sort((a, b) =>
    new Date(b.date!).getTime() - new Date(a.date!).getTime()
  );
}

export async function deleteLeadMemory(id: string): Promise<void> {
  memoryStorage = memoryStorage.filter(l => l.id !== id);
  console.log(`Lead ${id} deleted from memory`);
}
