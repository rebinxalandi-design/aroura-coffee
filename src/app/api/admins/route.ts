import { NextRequest, NextResponse } from "next/server";
import { listAdmins, createAdmin } from "@/lib/store";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  const user = await getCurrentUser();
  if (!user || user.role !== "super_admin") {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }
  const admins = await listAdmins();
  return NextResponse.json({
    admins: admins.map((a) => ({
      id: a.id,
      username: a.username,
      role: a.role,
      createdAt: a.createdAt,
    })),
  });
}

export async function POST(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user || user.role !== "super_admin") {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const body = await request.json().catch(() => null);
  const username = body?.username;
  const password = body?.password;
  const role = body?.role === "super_admin" ? "super_admin" : "admin";

  if (
    typeof username !== "string" ||
    username.trim().length < 3 ||
    typeof password !== "string" ||
    password.length < 6
  ) {
    return NextResponse.json({ error: "invalid_new_admin" }, { status: 400 });
  }

  try {
    const admin = await createAdmin({
      username: username.trim(),
      password,
      role,
    });
    return NextResponse.json(
      {
        admin: {
          id: admin.id,
          username: admin.username,
          role: admin.role,
          createdAt: admin.createdAt,
        },
      },
      { status: 201 }
    );
  } catch {
    // createAdmin only throws for a duplicate username (see src/lib/store.ts).
    return NextResponse.json({ error: "username_taken" }, { status: 409 });
  }
}
