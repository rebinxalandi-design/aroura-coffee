import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { listOrders, listMenuItems } from "@/lib/store";
import Dashboard from "@/components/admin/Dashboard";

const DAY_MS = 24 * 60 * 60 * 1000;

export default async function AdminDashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");
  if (user.role !== "super_admin") redirect("/admin/orders");

  const [orders, menuItems] = await Promise.all([listOrders(), listMenuItems()]);

  const todayStart = new Date().setHours(0, 0, 0, 0);
  const weekStart = todayStart - 6 * DAY_MS; // today + previous 6 days

  const completed = orders.filter((o) => o.status === "completed");

  const sumRevenue = (list: typeof completed) =>
    list.reduce((sum, o) => sum + o.priceToman, 0);

  const todayOrders = completed.filter(
    (o) => new Date(o.createdAt).getTime() >= todayStart
  );
  const weekOrders = completed.filter(
    (o) => new Date(o.createdAt).getTime() >= weekStart
  );

  const itemCounts = new Map<string, { name: { en: string; fa: string }; count: number; revenue: number }>();
  for (const order of completed) {
    const existing = itemCounts.get(order.itemId);
    if (existing) {
      existing.count += 1;
      existing.revenue += order.priceToman;
    } else {
      itemCounts.set(order.itemId, {
        name: order.itemName,
        count: 1,
        revenue: order.priceToman,
      });
    }
  }
  const topItems = Array.from(itemCounts.values())
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const stats = {
    today: { count: todayOrders.length, revenue: sumRevenue(todayOrders) },
    week: { count: weekOrders.length, revenue: sumRevenue(weekOrders) },
    allTime: { count: completed.length, revenue: sumRevenue(completed) },
    pendingCount: orders.filter((o) => o.status === "pending").length,
    menuItemCount: menuItems.length,
    topItems,
  };

  return <Dashboard stats={stats} />;
}
