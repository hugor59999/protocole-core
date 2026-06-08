import { isDashboardAuthed } from "@/lib/dashboard-auth";
import LoginForm from "./LoginForm";
import DashboardClient from "./DashboardClient";

export default async function DashboardPage() {
  const authed = await isDashboardAuthed();

  if (!authed) {
    return <LoginForm />;
  }

  return <DashboardClient />;
}
