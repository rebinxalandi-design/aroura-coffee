import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { listMenuItems } from "@/lib/store";
import MenuManager from "@/components/admin/MenuManager";

export default async function AdminMenuPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");
  if (user.role !== "super_admin") redirect("/admin/orders");

  const items = await listMenuItems();
  return <MenuManager initialItems={items} />;
}
