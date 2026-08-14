import { cookies } from "next/headers";

export async function isDashboardAuthed(): Promise<boolean> {
  const store = await cookies();
  const cookie = store.get("dashboard_auth");

  if (!cookie || !cookie.value) {
    return false;
  }

  const password = cookie.value;
  const expectedPassword = process.env.DASHBOARD_PASSWORD || "admin";

  return password === expectedPassword;
}
