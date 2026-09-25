import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";

export default async function AdminIndexPage() {
  const user = await getCurrentUser();
  redirect(user ? "/admin/orders" : "/admin/login");
}
