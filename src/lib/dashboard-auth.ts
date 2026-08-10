import { cookies } from "next/headers";

export async function isDashboardAuthed(): Promise<boolean> {
  const store = await cookies();
  const cookie = store.get("dashboard_auth");

  if (!process.env.DASHBOARD_PASSWORD) {
    return true;
  }

  return !!cookie && cookie.value === process.env.DASHBOARD_PASSWORD;
}
