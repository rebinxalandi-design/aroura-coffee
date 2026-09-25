import { NextRequest, NextResponse } from "next/server";
import { listMenuItems, createMenuItem } from "@/lib/store";
import { getCurrentUser } from "@/lib/auth";
import type { MenuCategory } from "@/lib/types";

const VALID_CATEGORIES: MenuCategory[] = [
  "coffee",
  "espresso",
  "cake",
  "pastry",
  "other",
];

export async function GET() {
  const items = await listMenuItems();
  return NextResponse.json({ items });
}

export async function POST(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user || user.role !== "super_admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const { nameEn, nameFa, descEn, descFa, priceToman, tagEn, tagFa, category, imageSrc, imageAlt } = body;

  if (
    typeof nameEn !== "string" ||
    !nameEn.trim() ||
    typeof nameFa !== "string" ||
    !nameFa.trim() ||
    typeof priceToman !== "number" ||
    priceToman <= 0 ||
    typeof imageSrc !== "string" ||
    !imageSrc.trim()
  ) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const safeCategory: MenuCategory = VALID_CATEGORIES.includes(category)
    ? category
    : "other";

  const item = await createMenuItem({
    name: { en: nameEn.trim(), fa: nameFa.trim() },
    description: { en: (descEn ?? "").trim(), fa: (descFa ?? "").trim() },
    priceToman,
    tag: { en: (tagEn ?? "").trim(), fa: (tagFa ?? "").trim() },
    category: safeCategory,
    image: { src: imageSrc, alt: (imageAlt ?? nameEn).trim() },
  });

  return NextResponse.json({ item }, { status: 201 });
}
