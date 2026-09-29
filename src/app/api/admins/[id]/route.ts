import { NextRequest, NextResponse } from "next/server";
import {
  deleteAdmin,
  findAdminById,
  updateAdminPassword,
  updateAdminUsername,
} from "@/lib/store";
import { getCurrentUser } from "@/lib/auth";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser();
  if (!user || user.role !== "super_admin") {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const target = await findAdminById(id);
  if (!target) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  const { password, username } = body;

  if (password === undefined && username === undefined) {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  if (password !== undefined) {
    if (typeof password !== "string" || password.length < 6) {
      return NextResponse.json({ error: "invalid_password" }, { status: 400 });
    }
    await updateAdminPassword(id, password);
  }

  if (username !== undefined) {
    if (typeof username !== "string" || username.trim().length < 3) {
      return NextResponse.json({ error: "invalid_username" }, { status: 400 });
    }
    try {
      await updateAdminUsername(id, username.trim());
    } catch {
      return NextResponse.json({ error: "username_taken" }, { status: 409 });
    }
  }

  return NextResponse.json({ ok: true });
}

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
