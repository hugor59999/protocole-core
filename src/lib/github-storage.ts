// Use GitHub Issues as free persistent storage
// No additional configuration needed - just uses the repo that already exists

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

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_REPO = 'hugor59999/protocole-core';
const GITHUB_OWNER = 'hugor59999';
const GITHUB_REPO_NAME = 'protocole-core';

export async function addLeadGitHub(leadData: Omit<Lead, 'id' | 'status'>): Promise<string> {
  if (!GITHUB_TOKEN) {
    console.warn('GitHub token not configured, skipping GitHub storage');
    return 'no-github';
  }

  try {
    const id = Math.random().toString(36).substring(2, 11);
    const lead: Lead = {
      ...leadData,
      id,
      status: 'À contacter',
    };

    const title = `Lead: ${lead.firstName} (${lead.email})`;
    const body = `**Lead ID**: ${id}
**Date**: ${lead.date}
**Email**: ${lead.email}
**Mobile**: ${lead.mobile}
**Status**: ${lead.status}

## Réponses
${lead.answers.map((a, i) => `**Q${i + 1}**: ${a}`).join('\n\n')}

## Diagnostic
\`\`\`
${lead.diagnosis}
\`\`\``;

    const response = await fetch(`https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO_NAME}/issues`, {
      method: 'POST',
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title,
        body,
        labels: ['lead', 'quiz'],
      }),
    });

    if (!response.ok) {
      console.error('GitHub API error:', response.statusText);
      return id;
    }

    const data = await response.json();
    console.log(`Lead ${id} saved to GitHub issue #${data.number}`);
    return id;
  } catch (err) {
    console.error('GitHub storage error:', err);
    return 'error';
  }
}

export async function getLeadsGitHub(): Promise<Lead[]> {
  if (!GITHUB_TOKEN) {
    return [];
  }

  try {
    const response = await fetch(
      `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO_NAME}/issues?state=open&labels=lead&per_page=100`,
      {
        headers: {
          Authorization: `token ${GITHUB_TOKEN}`,
        },
      }
    );

    if (!response.ok) {
      return [];
    }

    const issues = await response.json();
    const leads: Lead[] = issues.map((issue: any) => ({
      id: issue.number.toString(),
      firstName: issue.title.split('Lead: ')[1]?.split(' (')[0] || 'Unknown',
      email: issue.title.match(/\(([^)]+)\)/)?.[1] || '',
      mobile: '',
      date: issue.created_at,
      answers: [],
      diagnosis: issue.body.split('## Diagnostic')[1]?.trim() || '',
      status: 'À contacter',
    }));

    return leads.sort((a, b) =>
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  } catch (err) {
    console.error('GitHub fetch error:', err);
    return [];
  }
}

export async function deleteLeadGitHub(id: string): Promise<void> {
  if (!GITHUB_TOKEN) {
    return;
  }

  try {
    await fetch(
      `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO_NAME}/issues/${id}`,
      {
        method: 'PATCH',
        headers: {
          Authorization: `token ${GITHUB_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ state: 'closed' }),
      }
    );
  } catch (err) {
    console.error('GitHub delete error:', err);
  }
}
