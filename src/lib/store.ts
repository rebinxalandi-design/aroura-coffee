import bcrypt from "bcryptjs";
import { supabase } from "./supabase";
import type { AdminUser, MenuCategory, MenuItem, Order, OrderStatus } from "./types";

const DEFAULT_SUPER_ADMIN_USERNAME = "superadmin";
const DEFAULT_SUPER_ADMIN_PASSWORD = "Aroura@2025";

const SEED_MENU_ITEMS: Omit<MenuItem, "id" | "createdAt" | "updatedAt" | "available">[] = [
  {
    name: { en: "Signature Espresso", fa: "اسپرسو ویژه" },
    description: {
      en: "Dark chocolate, red fruit, a long caramel finish.",
      fa: "شکلات تلخ، میوه‌های قرمز، ته‌مزه‌ی طولانی کارامل.",
    },
    priceToman: 65000,
    tag: { en: "Classic", fa: "کلاسیک" },
    category: "espresso",
    image: {
      src: "/menu/signature-espresso.jpg",
      alt: "A single shot of espresso in a white cup beside coffee beans and a moka pot",
    },
  },
  {
    name: { en: "Aroura Latte", fa: "لاته آئورا" },
    description: {
      en: "Silky steamed milk over our signature espresso blend.",
      fa: "شیر بخار داده‌شده‌ی مخملی روی میکس اسپرسوی ویژه‌ی ما.",
    },
    priceToman: 85000,
    tag: { en: "Signature", fa: "ویژه" },
    category: "coffee",
    image: {
      src: "/menu/aroura-latte.jpg",
      alt: "Steamed milk being poured into an espresso to form latte art",
    },
  },
  {
    name: { en: "Cortado", fa: "کورتادو" },
    description: {
      en: "Equal parts espresso and warm milk, no foam.",
      fa: "مقدار برابر اسپرسو و شیر گرم، بدون فوم.",
    },
    priceToman: 75000,
    tag: { en: "Classic", fa: "کلاسیک" },
    category: "espresso",
    image: {
      src: "/menu/cortado.jpg",
      alt: "Coffee beans, grounds, and a latte in a portafilter basket on a wooden board",
    },
  },
  {
    name: { en: "Pour Over", fa: "پوراوور" },
    description: {
      en: "Single-origin, brewed to order, bright and clean.",
      fa: "تک‌خاستگاه، دم‌کرده به‌سفارش، روشن و تمیز.",
    },
    priceToman: 95000,
    tag: { en: "Single Origin", fa: "تک‌خاستگاه" },
    category: "coffee",
    image: {
      src: "/menu/pour-over.jpg",
      alt: "Coffee being poured over a Chemex brewer with steam rising",
    },
  },
  {
    name: { en: "Iced Oat Latte", fa: "لاته یخ با شیر جو" },
    description: {
      en: "Espresso, oat milk, a touch of Madagascar vanilla.",
      fa: "اسپرسو، شیر جو، رگه‌ای از وانیل ماداگاسکار.",
    },
    priceToman: 92000,
    tag: { en: "Seasonal", fa: "فصلی" },
    category: "coffee",
    image: {
      src: "/menu/iced-oat-latte.jpg",
      alt: "An iced latte with swirling milk in a glass on a cafe counter",
    },
  },
  {
    name: { en: "Cold Brew", fa: "کلد برو" },
    description: {
      en: "Steeped 18 hours, smooth, low acidity, no ice dilution.",
      fa: "18 ساعت دم‌کشیده، ملایم، اسیدیته کم، بدون رقیق‌شدن با یخ.",
    },
    priceToman: 80000,
    tag: { en: "Classic", fa: "کلاسیک" },
    category: "coffee",
    image: {
      src: "/menu/cold-brew.jpg",
      alt: "A glass of iced cold brew coffee on a wooden table with brewing equipment behind it",
    },
  },
  {
    name: { en: "Red Velvet Slice", fa: "برش رد ولوت" },
    description: {
      en: "Layered red velvet sponge with cream cheese frosting.",
      fa: "کیک اسفنجی رد ولوت لایه‌ای با روکش خامه پنیر.",
    },
    priceToman: 120000,
    tag: { en: "Bakery", fa: "شیرینی‌پزی" },
    category: "cake",
    image: {
      src: "https://images.unsplash.com/photo-1586985289906-406988974504?w=1200&q=80&auto=format&fit=crop",
      alt: "A slice of red velvet cake with cream cheese frosting on a plate",
    },
  },
  {
    name: { en: "Chocolate Fudge Cake", fa: "کیک فاج شکلاتی" },
    description: {
      en: "Dense dark chocolate layers, warm fudge glaze.",
      fa: "لایه‌های شکلات تلخ فشرده با گلیز فاج گرم.",
    },
    priceToman: 130000,
    tag: { en: "Bakery", fa: "شیرینی‌پزی" },
    category: "cake",
    image: {
      src: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=1200&q=80&auto=format&fit=crop",
      alt: "A rich chocolate fudge cake slice with glossy glaze",
    },
  },
  {
    name: { en: "Lemon Cheesecake", fa: "چیزکیک لیمو" },
    description: {
      en: "Baked cheesecake with a bright lemon curd top.",
      fa: "چیزکیک پخته‌شده با روکش لیموی تازه.",
    },
    priceToman: 125000,
    tag: { en: "Bakery", fa: "شیرینی‌پزی" },
    category: "cake",
    image: {
      src: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=1200&q=80&auto=format&fit=crop",
      alt: "A slice of lemon cheesecake with citrus topping",
    },
  },
  {
    name: { en: "Fresh Orange Juice", fa: "آب پرتقال تازه" },
    description: {
      en: "Cold-pressed, squeezed to order, nothing added.",
      fa: "تازه گرفته‌شده، به‌سفارش شما، بدون هیچ افزودنی.",
    },
    priceToman: 65000,
    tag: { en: "Fresh", fa: "تازه" },
    category: "juice",
    image: {
      src: "https://images.unsplash.com/photo-1613478223719-2ab802602423?w=1200&q=80&auto=format&fit=crop",
      alt: "A glass of fresh orange juice with orange slices",
    },
  },
  {
    name: { en: "Watermelon Sherbet", fa: "شربت هندوانه" },
    description: {
      en: "Chilled watermelon sherbet, a bright summer classic.",
      fa: "شربت خنک هندوانه، کلاسیک تابستانی و شاداب.",
    },
    priceToman: 55000,
    tag: { en: "Seasonal", fa: "فصلی" },
    category: "juice",
    image: {
      src: "https://images.unsplash.com/photo-1546173159-315724a31696?w=1200&q=80&auto=format&fit=crop",
      alt: "A refreshing glass of watermelon sherbet with mint garnish",
    },
  },
  {
    name: { en: "Mixed Berry Smoothie", fa: "اسموتی توت‌فرنگی" },
    description: {
      en: "Strawberry, blueberry, and yogurt, blended smooth.",
      fa: "توت‌فرنگی، بلوبری و ماست، میکس‌شده و مخملی.",
    },
    priceToman: 78000,
    tag: { en: "Signature", fa: "ویژه" },
    category: "juice",
    image: {
      src: "https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=1200&q=80&auto=format&fit=crop",
      alt: "A mixed berry smoothie in a glass topped with fresh berries",
    },
  },
];

// ---- Row <-> domain type mapping ----
// Postgres/Supabase rows use snake_case column names; the rest of the app
// (types.ts, every component) uses the camelCase MenuItem/Order/AdminUser
// shapes that predate this migration from a JSON file store. Mapping here
// keeps every other file in the codebase completely unaware of the switch.

interface AdminRow {
  id: string;
  username: string;
  password_hash: string;
  role: AdminUser["role"];
  created_at: string;
}

function adminFromRow(row: AdminRow): AdminUser {
  return {
    id: row.id,
    username: row.username,
    passwordHash: row.password_hash,
    role: row.role,
    createdAt: row.created_at,
  };
}

interface MenuItemRow {
  id: string;
  name: MenuItem["name"];
  description: MenuItem["description"];
  price_toman: number;
  tag: MenuItem["tag"];
  category: MenuCategory;
  image: MenuItem["image"];
  available: boolean;
  created_at: string;
  updated_at: string;
}

function menuItemFromRow(row: MenuItemRow): MenuItem {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    priceToman: row.price_toman,
    tag: row.tag,
    category: row.category,
    image: row.image,
    available: row.available,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

interface OrderRow {
  id: string;
  item_id: string;
  item_name: Order["itemName"];
  price_toman: number;
  customer_name: string;
  note: string | null;
  table_or_location: string | null;
  status: OrderStatus;
  created_at: string;
  updated_at: string;
}

function orderFromRow(row: OrderRow): Order {
  return {
    id: row.id,
    itemId: row.item_id,
    itemName: row.item_name,
    priceToman: row.price_toman,
    customerName: row.customer_name,
    note: row.note ?? undefined,
    tableOrLocation: row.table_or_location ?? undefined,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

// ---- One-time seeding ----
// Runs at most once per server process (module-level flag), and each check
// is a cheap "is this table empty" query -- safe to call from every list*()
// so a fresh database seeds itself on first use without a separate manual
// migration step.
let seeded = false;
async function ensureSeeded() {
  if (seeded) return;

  const { count: adminCount, error: adminCountError } = await supabase
    .from("admins")
    .select("*", { count: "exact", head: true });
  if (adminCountError) throw adminCountError;

  if (!adminCount) {
    const passwordHash = await bcrypt.hash(DEFAULT_SUPER_ADMIN_PASSWORD, 10);
    const { error } = await supabase.from("admins").insert({
      username: DEFAULT_SUPER_ADMIN_USERNAME,
      password_hash: passwordHash,
      role: "super_admin",
    });
    if (error) throw error;
  }

  const { count: menuCount, error: menuCountError } = await supabase
    .from("menu_items")
    .select("*", { count: "exact", head: true });
  if (menuCountError) throw menuCountError;

  if (!menuCount) {
    const rows = SEED_MENU_ITEMS.map((item) => ({
      name: item.name,
      description: item.description,
      price_toman: item.priceToman,
      tag: item.tag,
      category: item.category,
      image: item.image,
    }));
    const { error } = await supabase.from("menu_items").insert(rows);
    if (error) throw error;
  }

  seeded = true;
}

// ---- Admins ----
export async function listAdmins(): Promise<AdminUser[]> {
  await ensureSeeded();
  const { data, error } = await supabase.from("admins").select("*");
  if (error) throw error;
  return (data as AdminRow[]).map(adminFromRow);
}

export async function findAdminByUsername(
  username: string
): Promise<AdminUser | undefined> {
  await ensureSeeded();
  const { data, error } = await supabase
    .from("admins")
    .select("*")
    .ilike("username", username)
    .maybeSingle();
  if (error) throw error;
  return data ? adminFromRow(data as AdminRow) : undefined;
}

export async function findAdminById(id: string): Promise<AdminUser | undefined> {
  await ensureSeeded();
  const { data, error } = await supabase
    .from("admins")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data ? adminFromRow(data as AdminRow) : undefined;
}

export async function createAdmin(input: {
  username: string;
  password: string;
  role: AdminUser["role"];
}): Promise<AdminUser> {
  const existing = await findAdminByUsername(input.username);
  if (existing) {
    throw new Error("Username already exists");
  }
  const passwordHash = await bcrypt.hash(input.password, 10);
  const { data, error } = await supabase
    .from("admins")
    .insert({
      username: input.username,
      password_hash: passwordHash,
      role: input.role,
    })
    .select()
    .single();
  if (error) throw error;
  return adminFromRow(data as AdminRow);
}

export async function deleteAdmin(id: string): Promise<void> {
  const { error } = await supabase.from("admins").delete().eq("id", id);
  if (error) throw error;
}

export async function updateAdminPassword(
  id: string,
  newPassword: string
): Promise<AdminUser | undefined> {
  const passwordHash = await bcrypt.hash(newPassword, 10);
  const { data, error } = await supabase
    .from("admins")
    .update({ password_hash: passwordHash })
    .eq("id", id)
    .select()
    .maybeSingle();
  if (error) throw error;
  return data ? adminFromRow(data as AdminRow) : undefined;
}

export async function updateAdminUsername(
  id: string,
  newUsername: string
): Promise<AdminUser | undefined> {
  const existing = await findAdminByUsername(newUsername);
  if (existing && existing.id !== id) {
    throw new Error("Username already exists");
  }
  const { data, error } = await supabase
    .from("admins")
    .update({ username: newUsername })
    .eq("id", id)
    .select()
    .maybeSingle();
  if (error) throw error;
  return data ? adminFromRow(data as AdminRow) : undefined;
}

// ---- Menu ----
export async function listMenuItems(): Promise<MenuItem[]> {
  await ensureSeeded();
  const { data, error } = await supabase
    .from("menu_items")
    .select("*")
    .order("created_at", { ascending: true });
  if (error) throw error;
  return (data as MenuItemRow[]).map(menuItemFromRow);
}

export async function findMenuItem(id: string): Promise<MenuItem | undefined> {
  const { data, error } = await supabase
    .from("menu_items")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data ? menuItemFromRow(data as MenuItemRow) : undefined;
}

export async function createMenuItem(
  input: Omit<MenuItem, "id" | "createdAt" | "updatedAt" | "available"> &
    Partial<Pick<MenuItem, "available">>
): Promise<MenuItem> {
  const { data, error } = await supabase
    .from("menu_items")
    .insert({
      name: input.name,
      description: input.description,
      price_toman: input.priceToman,
      tag: input.tag,
      category: input.category,
      image: input.image,
      available: input.available ?? true,
    })
    .select()
    .single();
  if (error) throw error;
  return menuItemFromRow(data as MenuItemRow);
}

export async function updateMenuItem(
  id: string,
  patch: Partial<Omit<MenuItem, "id" | "createdAt">>
): Promise<MenuItem | undefined> {
  const row: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (patch.name !== undefined) row.name = patch.name;
  if (patch.description !== undefined) row.description = patch.description;
  if (patch.priceToman !== undefined) row.price_toman = patch.priceToman;
  if (patch.tag !== undefined) row.tag = patch.tag;
  if (patch.category !== undefined) row.category = patch.category;
  if (patch.image !== undefined) row.image = patch.image;
  if (patch.available !== undefined) row.available = patch.available;

  const { data, error } = await supabase
    .from("menu_items")
    .update(row)
    .eq("id", id)
    .select()
    .maybeSingle();
  if (error) throw error;
  return data ? menuItemFromRow(data as MenuItemRow) : undefined;
}

export async function deleteMenuItem(id: string): Promise<void> {
  const { error } = await supabase.from("menu_items").delete().eq("id", id);
  if (error) throw error;
}

// ---- Orders ----
export async function listOrders(): Promise<Order[]> {
  await ensureSeeded();
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data as OrderRow[]).map(orderFromRow);
}

export async function createOrder(
  input: Omit<Order, "id" | "status" | "createdAt" | "updatedAt">
): Promise<Order> {
  const { data, error } = await supabase
    .from("orders")
    .insert({
      item_id: input.itemId,
      item_name: input.itemName,
      price_toman: input.priceToman,
      customer_name: input.customerName,
      note: input.note ?? null,
      table_or_location: input.tableOrLocation ?? null,
      status: "pending",
    })
    .select()
    .single();
  if (error) throw error;
  return orderFromRow(data as OrderRow);
}

export async function updateOrderStatus(
  id: string,
  status: OrderStatus
): Promise<Order | undefined> {
  const { data, error } = await supabase
    .from("orders")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .maybeSingle();
  if (error) throw error;
  return data ? orderFromRow(data as OrderRow) : undefined;
}

export const SEEDED_SUPER_ADMIN_CREDENTIALS = {
  username: DEFAULT_SUPER_ADMIN_USERNAME,
  password: DEFAULT_SUPER_ADMIN_PASSWORD,
};
