import { isDashboardAuthed } from "@/lib/dashboard-auth";
import LoginForm from "./LoginForm";
import DashboardClient from "./DashboardClient";

export default async function DashboardPage() {
  // Si pas de mot de passe configuré, accès libre
  if (!process.env.DASHBOARD_PASSWORD?.trim()) {
    return <DashboardClient />;
  }

  const authed = await isDashboardAuthed();

  if (!authed) {
    return <LoginForm />;
  }

  return <DashboardClient />;
}
