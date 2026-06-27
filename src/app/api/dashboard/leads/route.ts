import { NextRequest, NextResponse } from "next/server";
import { isDashboardAuthed } from "@/lib/dashboard-auth";
import { listLeads, updateLeadStatus, STATUSES } from "@/lib/airtable";

export async function GET() {
  if (!(await isDashboardAuthed())) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }
  try {
    const leads = await listLeads();
    return NextResponse.json({ leads });
  } catch (err) {
    console.error("leads list error", err);
    return NextResponse.json({ error: "Erreur lors du chargement" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  if (!(await isDashboardAuthed())) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }
  const { id, status } = await req.json();
  if (typeof id !== "string" || !STATUSES.includes(status)) {
    return NextResponse.json({ error: "Champs invalides" }, { status: 400 });
  }
  try {
    await updateLeadStatus(id, status);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("lead update error", err);
    return NextResponse.json({ error: "Erreur lors de la mise à jour" }, { status: 500 });
  }
}
// rebuild 1782591408
