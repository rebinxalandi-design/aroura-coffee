import { promises as fs } from "fs";
import path from "path";
import { randomUUID } from "crypto";
import bcrypt from "bcryptjs";
import type { AdminUser, MenuItem, Order } from "./types";

const DATA_DIR = path.join(process.cwd(), "data");
const FILES = {
  admins: path.join(DATA_DIR, "admins.json"),
  menu: path.join(DATA_DIR, "menu.json"),
  orders: path.join(DATA_DIR, "orders.json"),
} as const;

const DEFAULT_SUPER_ADMIN_USERNAME = "superadmin";
const DEFAULT_SUPER_ADMIN_PASSWORD = "Aroura@2025";

const SEED_MENU_ITEMS: Omit<MenuItem, "id" | "createdAt" | "updatedAt">[] = [
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
      fa: "۱۸ ساعت دم‌کشیده، ملایم، اسیدیته کم، بدون رقیق‌شدن با یخ.",
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

async function ensureDataDir() {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

/** Atomic write: write to a temp file then rename, to avoid corruption from concurrent writes. */
async function atomicWrite(filePath: string, data: unknown) {
  await ensureDataDir();
  const tmpPath = `${filePath}.${randomUUID()}.tmp`;
  await fs.writeFile(tmpPath, JSON.stringify(data, null, 2), "utf-8");
  await fs.rename(tmpPath, filePath);
}

async function readJson<T>(filePath: string, fallback: T): Promise<T> {
  try {
    const raw = await fs.readFile(filePath, "utf-8");
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

// Simple in-process write queue per file to serialize concurrent writes from
// the same server instance (atomic rename protects against partial writes;
// this queue protects against lost updates from interleaved read-modify-write).
const writeQueues = new Map<string, Promise<unknown>>();
function queueWrite<T>(key: string, fn: () => Promise<T>): Promise<T> {
  const prev = writeQueues.get(key) ?? Promise.resolve();
  const next = prev.then(fn, fn);
  writeQueues.set(
    key,
    next.catch(() => undefined)
  );
  return next;
}

let seeded = false;
async function ensureSeeded() {
  if (seeded) return;
  await ensureDataDir();

  const admins = await readJson<AdminUser[]>(FILES.admins, []);
  if (admins.length === 0) {
    const passwordHash = await bcrypt.hash(DEFAULT_SUPER_ADMIN_PASSWORD, 10);
    const superAdmin: AdminUser = {
      id: randomUUID(),
      username: DEFAULT_SUPER_ADMIN_USERNAME,
      passwordHash,
      role: "super_admin",
      createdAt: new Date().toISOString(),
    };
    await atomicWrite(FILES.admins, [superAdmin]);
  }

  const menu = await readJson<MenuItem[]>(FILES.menu, []);
  if (menu.length === 0) {
    const now = new Date().toISOString();
    const seededMenu: MenuItem[] = SEED_MENU_ITEMS.map((item) => ({
      ...item,
      id: randomUUID(),
      createdAt: now,
      updatedAt: now,
    }));
    await atomicWrite(FILES.menu, seededMenu);
  }

  const orders = await readJson<Order[] | null>(FILES.orders, null);
  if (orders === null) {
    await atomicWrite(FILES.orders, []);
  }

  seeded = true;
}

// ---- Admins ----
export async function listAdmins(): Promise<AdminUser[]> {
  await ensureSeeded();
  return readJson<AdminUser[]>(FILES.admins, []);
}

export async function findAdminByUsername(
  username: string
): Promise<AdminUser | undefined> {
  const admins = await listAdmins();
  return admins.find(
    (a) => a.username.toLowerCase() === username.toLowerCase()
  );
}

export async function findAdminById(
  id: string
): Promise<AdminUser | undefined> {
  const admins = await listAdmins();
  return admins.find((a) => a.id === id);
}

export async function createAdmin(input: {
  username: string;
  password: string;
  role: AdminUser["role"];
}): Promise<AdminUser> {
  return queueWrite("admins", async () => {
    const admins = await readJson<AdminUser[]>(FILES.admins, []);
    if (
      admins.some(
        (a) => a.username.toLowerCase() === input.username.toLowerCase()
      )
    ) {
      throw new Error("Username already exists");
    }
    const passwordHash = await bcrypt.hash(input.password, 10);
    const newAdmin: AdminUser = {
      id: randomUUID(),
      username: input.username,
      passwordHash,
      role: input.role,
      createdAt: new Date().toISOString(),
    };
    await atomicWrite(FILES.admins, [...admins, newAdmin]);
    return newAdmin;
  });
}

export async function deleteAdmin(id: string): Promise<void> {
  await queueWrite("admins", async () => {
    const admins = await readJson<AdminUser[]>(FILES.admins, []);
    await atomicWrite(
      FILES.admins,
      admins.filter((a) => a.id !== id)
    );
  });
}

// ---- Menu ----
export async function listMenuItems(): Promise<MenuItem[]> {
  await ensureSeeded();
  return readJson<MenuItem[]>(FILES.menu, []);
}

export async function findMenuItem(id: string): Promise<MenuItem | undefined> {
  const items = await listMenuItems();
  return items.find((i) => i.id === id);
}

export async function createMenuItem(
  input: Omit<MenuItem, "id" | "createdAt" | "updatedAt">
): Promise<MenuItem> {
  return queueWrite("menu", async () => {
    const items = await readJson<MenuItem[]>(FILES.menu, []);
    const now = new Date().toISOString();
    const newItem: MenuItem = {
      ...input,
      id: randomUUID(),
      createdAt: now,
      updatedAt: now,
    };
    await atomicWrite(FILES.menu, [...items, newItem]);
    return newItem;
  });
}

export async function updateMenuItem(
  id: string,
  patch: Partial<Omit<MenuItem, "id" | "createdAt">>
): Promise<MenuItem | undefined> {
  return queueWrite("menu", async () => {
    const items = await readJson<MenuItem[]>(FILES.menu, []);
    const idx = items.findIndex((i) => i.id === id);
    if (idx === -1) return undefined;
    const updated: MenuItem = {
      ...items[idx],
      ...patch,
      updatedAt: new Date().toISOString(),
    };
    items[idx] = updated;
    await atomicWrite(FILES.menu, items);
    return updated;
  });
}

export async function deleteMenuItem(id: string): Promise<void> {
  await queueWrite("menu", async () => {
    const items = await readJson<MenuItem[]>(FILES.menu, []);
    await atomicWrite(
      FILES.menu,
      items.filter((i) => i.id !== id)
    );
  });
}

// ---- Orders ----
export async function listOrders(): Promise<Order[]> {
  await ensureSeeded();
  const orders = await readJson<Order[]>(FILES.orders, []);
  return orders.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function createOrder(
  input: Omit<Order, "id" | "status" | "createdAt" | "updatedAt">
): Promise<Order> {
  return queueWrite("orders", async () => {
    const orders = await readJson<Order[]>(FILES.orders, []);
    const now = new Date().toISOString();
    const newOrder: Order = {
      ...input,
      id: randomUUID(),
      status: "pending",
      createdAt: now,
      updatedAt: now,
    };
    await atomicWrite(FILES.orders, [...orders, newOrder]);
    return newOrder;
  });
}

export async function updateOrderStatus(
  id: string,
  status: Order["status"]
): Promise<Order | undefined> {
  return queueWrite("orders", async () => {
    const orders = await readJson<Order[]>(FILES.orders, []);
    const idx = orders.findIndex((o) => o.id === id);
    if (idx === -1) return undefined;
    const updated: Order = {
      ...orders[idx],
      status,
      updatedAt: new Date().toISOString(),
    };
    orders[idx] = updated;
    await atomicWrite(FILES.orders, orders);
    return updated;
  });
}

export const SEEDED_SUPER_ADMIN_CREDENTIALS = {
  username: DEFAULT_SUPER_ADMIN_USERNAME,
  password: DEFAULT_SUPER_ADMIN_PASSWORD,
};
