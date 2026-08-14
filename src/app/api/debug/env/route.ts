export async function GET() {
  return Response.json({
    env: process.env.NODE_ENV,
    hasGithubToken: !!process.env.GITHUB_TOKEN,
    githubTokenLength: process.env.GITHUB_TOKEN?.length || 0,
    hasVercelKv: !!process.env.KV_URL,
    hasAirtable: !!process.env.AIRTABLE_API_KEY,
    hasTelegram: !!process.env.TELEGRAM_BOT_TOKEN,
    message: 'Check which storage is available'
  });
}
