import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { getCurrentUser } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};
const BUCKET = "menu-photos";

export async function POST(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user || user.role !== "super_admin") {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const formData = await request.formData().catch(() => null);
  if (!formData) {
    return NextResponse.json({ error: "invalid_form_data" }, { status: 400 });
  }

  const file = formData.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "no_file_provided" }, { status: 400 });
  }

  if (file.size === 0) {
    return NextResponse.json({ error: "empty_file" }, { status: 400 });
  }

  if (file.size > MAX_SIZE_BYTES) {
    return NextResponse.json({ error: "file_too_large" }, { status: 400 });
  }

  const extension = ALLOWED_TYPES[file.type];
  if (!extension) {
    return NextResponse.json({ error: "unsupported_file_type" }, { status: 400 });
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
    return NextResponse.json({ error: "invalid_image_content" }, { status: 400 });
  }

  const filename = `${randomUUID()}.${extension}`;
  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(filename, buffer, { contentType: file.type });
  if (uploadError) {
    return NextResponse.json({ error: "upload_failed" }, { status: 500 });
  }

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(filename);
  return NextResponse.json({ src: data.publicUrl }, { status: 201 });
}
