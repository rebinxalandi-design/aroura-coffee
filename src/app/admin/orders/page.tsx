import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import OrdersBoard from "@/components/admin/OrdersBoard";

export default async function AdminOrdersPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");

  return <OrdersBoard />;
}
