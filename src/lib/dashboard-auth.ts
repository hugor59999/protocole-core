import { cookies } from "next/headers";

export async function isDashboardAuthed(): Promise<boolean> {
  const store = await cookies();
  const cookie = store.get("dashboard_auth");

  if (!cookie) {
    return false;
  }

  const password = cookie.value;

  if (!process.env.DASHBOARD_PASSWORD) {
    return password === 'admin';
  }

  return password === process.env.DASHBOARD_PASSWORD;
}
