import { NextRequest, NextResponse } from "next/server";
import { deleteAdmin, findAdminById } from "@/lib/store";
import { getCurrentUser } from "@/lib/auth";

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser();
  if (!user || user.role !== "super_admin") {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const { id } = await params;

  if (id === user.id) {
    return NextResponse.json({ error: "cannot_delete_self" }, { status: 400 });
  }

  const target = await findAdminById(id);
  if (!target) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  await deleteAdmin(id);
  return NextResponse.json({ ok: true });
}
