import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { updateMenuItem, deleteMenuItem, findMenuItem } from "@/lib/store";
import { getCurrentUser } from "@/lib/auth";
import type { MenuCategory } from "@/lib/types";

const VALID_CATEGORIES: MenuCategory[] = [
  "coffee",
  "espresso",
  "cake",
  "pastry",
  "juice",
  "other",
];

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser();
  if (!user || user.role !== "super_admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const existing = await findMenuItem(id);
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const { nameEn, nameFa, descEn, descFa, priceToman, tagEn, tagFa, category, imageSrc, imageAlt } = body;

  const patch: Parameters<typeof updateMenuItem>[1] = {};
  if (nameEn !== undefined || nameFa !== undefined) {
    patch.name = {
      en: nameEn ?? existing.name.en,
      fa: nameFa ?? existing.name.fa,
    };
  }
  if (descEn !== undefined || descFa !== undefined) {
    patch.description = {
      en: descEn ?? existing.description.en,
      fa: descFa ?? existing.description.fa,
    };
  }
  if (tagEn !== undefined || tagFa !== undefined) {
    patch.tag = { en: tagEn ?? existing.tag.en, fa: tagFa ?? existing.tag.fa };
  }
  if (typeof priceToman === "number" && priceToman > 0) {
    patch.priceToman = priceToman;
  }
  if (typeof category === "string" && VALID_CATEGORIES.includes(category as MenuCategory)) {
    patch.category = category as MenuCategory;
  }
  if (typeof imageSrc === "string" && imageSrc.trim()) {
    patch.image = { src: imageSrc, alt: imageAlt ?? existing.image.alt };
  }

  const updated = await updateMenuItem(id, patch);
  revalidatePath("/");
  return NextResponse.json({ item: updated });
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser();
  if (!user || user.role !== "super_admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const { id } = await params;
  await deleteMenuItem(id);
  revalidatePath("/");
  return NextResponse.json({ ok: true });
}
