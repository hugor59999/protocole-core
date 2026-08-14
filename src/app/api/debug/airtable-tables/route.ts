export async function GET() {
  const apiKey = process.env.AIRTABLE_API_KEY;
  const baseId = process.env.AIRTABLE_BASE_ID;

  if (!apiKey || !baseId) {
    return Response.json({
      error: "Missing Airtable credentials",
    });
  }

  try {
    const response = await fetch(`https://api.airtable.com/v0/meta/bases/${baseId}/tables`, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return Response.json({
        error: data.error?.message || "Failed to fetch tables",
        status: response.status,
        fullError: data,
      });
    }

    return Response.json({
      baseId: baseId.substring(0, 3) + "***",
      tables: data.tables?.map((t: any) => ({
        id: t.id,
        name: t.name,
        fields: t.fields?.map((f: any) => ({ id: f.id, name: f.name, type: f.type })),
      })) || [],
    });
  } catch (err: any) {
    return Response.json({
      error: err.message,
    });
  }
}
