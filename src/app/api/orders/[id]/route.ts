import { NextRequest, NextResponse } from "next/server";
import { updateOrderStatus } from "@/lib/store";
import { getCurrentUser } from "@/lib/auth";
import type { OrderStatus } from "@/lib/types";

const VALID_STATUSES: OrderStatus[] = [
  "pending",
  "accepted",
  "rejected",
  "completed",
];

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json().catch(() => null);
  const status = body?.status;

  if (typeof status !== "string" || !VALID_STATUSES.includes(status as OrderStatus)) {
    return NextResponse.json({ error: "invalid_status" }, { status: 400 });
  }

  const updated = await updateOrderStatus(id, status as OrderStatus);
  if (!updated) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  return NextResponse.json({ order: updated });
}
