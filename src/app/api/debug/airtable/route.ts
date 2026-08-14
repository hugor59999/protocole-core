export async function GET() {
  const apiKey = process.env.AIRTABLE_API_KEY;
  const baseId = process.env.AIRTABLE_BASE_ID;

  if (!apiKey || !baseId) {
    return Response.json({
      error: "Missing Airtable credentials",
      hasApiKey: !!apiKey,
      hasBaseId: !!baseId,
    });
  }

  // Test API connection
  try {
    const response = await fetch(`https://api.airtable.com/v0/${baseId}/Leads?maxRecords=1`, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });

    const data = await response.json();

    return Response.json({
      status: response.status,
      success: response.ok,
      data,
      credentials: {
        apiKeyLength: apiKey.length,
        baseId: baseId.substring(0, 3) + "***" + baseId.substring(-3),
      },
    });
  } catch (err: any) {
    return Response.json({
      error: err.message,
      credentials: {
        apiKeyLength: apiKey.length,
        baseId: baseId.substring(0, 3) + "***" + baseId.substring(-3),
      },
    });
  }
}
