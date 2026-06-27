import { cookies } from "next/headers";

export async function isDashboardAuthed(): Promise<boolean> {
  // En production sans mot de passe configuré, accès libre
  return true;
}
