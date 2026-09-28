import { NextRequest, NextResponse } from "next/server";
import { login, createSessionCookie } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const username = body?.username;
  const password = body?.password;

  if (typeof username !== "string" || typeof password !== "string") {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  const user = await login(username, password);
  if (!user) {
    return NextResponse.json({ error: "invalid_credentials" }, { status: 401 });
  }

  await createSessionCookie(user);

  return NextResponse.json({
    user: { id: user.id, username: user.username, role: user.role },
  });
}
