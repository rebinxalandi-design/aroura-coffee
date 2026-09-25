import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { listAdmins } from "@/lib/store";
import AccountsManager from "@/components/admin/AccountsManager";

export default async function AdminAccountsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");
  if (user.role !== "super_admin") redirect("/admin/orders");

  const admins = await listAdmins();
  const safeAdmins = admins.map((a) => ({
    id: a.id,
    username: a.username,
    role: a.role,
    createdAt: a.createdAt,
  }));

  return <AccountsManager initialAdmins={safeAdmins} currentUserId={user.id} />;
}
