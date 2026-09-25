import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { randomUUID } from "crypto";
import { getCurrentUser } from "@/lib/auth";

const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

export async function POST(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user || user.role !== "super_admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const formData = await request.formData().catch(() => null);
  if (!formData) {
    return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
  }

  const file = formData.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  if (file.size === 0) {
    return NextResponse.json({ error: "Empty file" }, { status: 400 });
  }

  if (file.size > MAX_SIZE_BYTES) {
    return NextResponse.json(
      { error: "File too large (max 5MB)" },
      { status: 400 }
    );
  }

  const extension = ALLOWED_TYPES[file.type];
  if (!extension) {
    return NextResponse.json(
      { error: "Unsupported file type. Use JPEG, PNG, or WebP." },
      { status: 400 }
    );
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  // Minimal magic-byte sniffing to avoid trusting the client-declared MIME type.
  const isValidImage =
    (extension === "jpg" && buffer[0] === 0xff && buffer[1] === 0xd8) ||
    (extension === "png" &&
      buffer[0] === 0x89 &&
      buffer[1] === 0x50 &&
      buffer[2] === 0x4e &&
      buffer[3] === 0x47) ||
    (extension === "webp" &&
      buffer.slice(0, 4).toString("ascii") === "RIFF" &&
      buffer.slice(8, 12).toString("ascii") === "WEBP");

  if (!isValidImage) {
    return NextResponse.json(
      { error: "File content does not match a valid image" },
      { status: 400 }
    );
  }

  const uploadsDir = path.join(process.cwd(), "public", "uploads");
  await fs.mkdir(uploadsDir, { recursive: true });

  const filename = `${randomUUID()}.${extension}`;
  const filePath = path.join(uploadsDir, filename);
  await fs.writeFile(filePath, buffer);

  return NextResponse.json({ src: `/uploads/${filename}` }, { status: 201 });
}
