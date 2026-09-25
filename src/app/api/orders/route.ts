import { NextRequest, NextResponse } from "next/server";
import { listOrders, createOrder, findMenuItem } from "@/lib/store";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const orders = await listOrders();
  return NextResponse.json({ orders });
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const { itemId, customerName, note, tableOrLocation } = body;

  if (typeof itemId !== "string" || !itemId) {
    return NextResponse.json({ error: "Missing itemId" }, { status: 400 });
  }
  if (typeof customerName !== "string" || !customerName.trim()) {
    return NextResponse.json(
      { error: "Missing customerName" },
      { status: 400 }
    );
  }

  const item = await findMenuItem(itemId);
  if (!item) {
    return NextResponse.json({ error: "Menu item not found" }, { status: 404 });
  }

  const order = await createOrder({
    itemId: item.id,
    itemName: item.name,
    priceToman: item.priceToman,
    customerName: customerName.trim().slice(0, 100),
    note: typeof note === "string" ? note.trim().slice(0, 500) : undefined,
    tableOrLocation:
      typeof tableOrLocation === "string"
        ? tableOrLocation.trim().slice(0, 100)
        : undefined,
  });

  return NextResponse.json({ order }, { status: 201 });
}
