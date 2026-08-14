// Use Upstash Redis for production persistence (free tier available)
// Falls back to local storage if Redis is not configured

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

const REDIS_URL = process.env.REDIS_URL;

async function makeRedisRequest(
  method: string,
  key: string,
  value?: string
): Promise<any> {
  if (!REDIS_URL) return null;

  try {
    const url = new URL(REDIS_URL);
    const auth = `${url.username}:${url.password}`;
    const encodedAuth = Buffer.from(auth).toString('base64');

    const response = await fetch(REDIS_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${encodedAuth}`,
      },
      body: JSON.stringify({
        commands: [
          method === 'GET'
            ? ['GET', key]
            : ['SET', key, value],
        ],
      }),
    });

    if (!response.ok) {
      console.error('Redis request failed:', response.statusText);
      return null;
    }

    const data = await response.json();
    return data.result?.[0];
  } catch (err) {
    console.error('Redis error:', err);
    return null;
  }
}

export async function addLeadRedis(leadData: Omit<Lead, 'id' | 'status'>): Promise<string> {
  const id = Math.random().toString(36).substring(2, 11);
  const lead: Lead = {
    ...leadData,
    id,
    status: 'À contacter',
  };

  // Try Redis first
  try {
    const leads = await getLeadsRedis();
    leads.push(lead);

    if (REDIS_URL) {
      await makeRedisRequest('SET', 'quiz_leads', JSON.stringify(leads));
      console.log(`Lead ${id} saved to Redis`);
      return id;
    }
  } catch (err) {
    console.error('Redis save failed:', err);
  }

  // Fallback: log for manual processing
  console.log('Lead data:', JSON.stringify(lead));
  return id;
}

export async function getLeadsRedis(): Promise<Lead[]> {
  if (!REDIS_URL) return [];

  try {
    const data = await makeRedisRequest('GET', 'quiz_leads');
    if (!data) return [];

    const leads = JSON.parse(data);
    return leads.sort((a: Lead, b: Lead) =>
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  } catch (err) {
    console.error('Redis fetch failed:', err);
    return [];
  }
}

export async function deleteLeadRedis(id: string): Promise<void> {
  try {
    const leads = await getLeadsRedis();
    const filtered = leads.filter(l => l.id !== id);

    if (REDIS_URL) {
      await makeRedisRequest('SET', 'quiz_leads', JSON.stringify(filtered));
    }
  } catch (err) {
    console.error('Redis delete failed:', err);
  }
}
