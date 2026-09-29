import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { findAdminByUsername, findAdminById } from "./store";
import type { AdminUser, Role } from "./types";

export const SESSION_COOKIE = "aroura_session";
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 days

// Server-only secret used to sign session cookies. A publicly-known
// fallback here would let anyone forge an admin session (this file lives
// in a public repo), so production must set a real one -- fail loudly
// instead of silently signing with a value every reader of this code
// already knows.
const DEV_FALLBACK_SECRET = "dev-only-insecure-secret-change-me";

if (process.env.NODE_ENV === "production" && !process.env.SESSION_SECRET) {
  throw new Error(
    "SESSION_SECRET is not set in production. Set it to a long random " +
      "value (e.g. `openssl rand -hex 32`) in the hosting provider's " +
      "environment variables -- without it, session cookies would be " +
      "signed with a fallback value that's public in this repo."
  );
}

const SESSION_SECRET = process.env.SESSION_SECRET ?? DEV_FALLBACK_SECRET;

function base64url(input: ArrayBuffer | Uint8Array): string {
  const bytes = input instanceof Uint8Array ? input : new Uint8Array(input);
  let str = "";
  for (const b of bytes) str += String.fromCharCode(b);
  return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64urlToBytes(str: string): Uint8Array {
  const padded = str.replace(/-/g, "+").replace(/_/g, "/");
  const withPad = padded + "===".slice((padded.length + 3) % 4);
  const bin = atob(withPad);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
}

async function getHmacKey() {
  return crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(SESSION_SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

interface SessionPayload {
  userId: string;
  username: string;
  role: Role;
  exp: number; // unix seconds
}

async function signToken(payload: SessionPayload): Promise<string> {
  const key = await getHmacKey();
  const body = base64url(new TextEncoder().encode(JSON.stringify(payload)));
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(body));
  return `${body}.${base64url(sig)}`;
}

async function verifyToken(token: string): Promise<SessionPayload | null> {
  const parts = token.split(".");
  if (parts.length !== 2) return null;
  const [body, sig] = parts;
  const key = await getHmacKey();
  const valid = await crypto.subtle.verify(
    "HMAC",
    key,
    base64urlToBytes(sig).buffer as ArrayBuffer,
    new TextEncoder().encode(body)
  );
  if (!valid) return null;
  try {
    const payload = JSON.parse(
      new TextDecoder().decode(base64urlToBytes(body))
    ) as SessionPayload;
    if (payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch {
    return null;
  }
}

export async function verifyPassword(
  plain: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}

export async function login(
  username: string,
  password: string
): Promise<AdminUser | null> {
  const user = await findAdminByUsername(username);
  if (!user) return null;
  const ok = await verifyPassword(password, user.passwordHash);
  if (!ok) return null;
  return user;
}

export async function createSessionCookie(user: AdminUser): Promise<void> {
  const exp = Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS;
  const token = await signToken({
    userId: user.id,
    username: user.username,
    role: user.role,
    exp,
  });
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  });
}

export async function clearSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export interface CurrentUser {
  id: string;
  username: string;
  role: Role;
}

export async function getCurrentUser(): Promise<CurrentUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const payload = await verifyToken(token);
  if (!payload) return null;
  // Confirm the account still exists (e.g. wasn't deleted after login).
  const user = await findAdminById(payload.userId);
  if (!user) return null;
  return { id: user.id, username: user.username, role: user.role };
}
