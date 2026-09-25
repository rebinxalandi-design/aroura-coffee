export type Role = "super_admin" | "admin";

export interface AdminUser {
  id: string;
  username: string;
  passwordHash: string;
  role: Role;
  createdAt: string;
}

export type MenuCategory = "coffee" | "espresso" | "cake" | "pastry" | "other";

export interface MenuItem {
  id: string;
  name: { en: string; fa: string };
  description: { en: string; fa: string };
  priceToman: number;
  tag: { en: string; fa: string };
  category: MenuCategory;
  image: { src: string; alt: string };
  createdAt: string;
  updatedAt: string;
}

export type OrderStatus = "pending" | "accepted" | "rejected" | "completed";

export interface Order {
  id: string;
  itemId: string;
  itemName: { en: string; fa: string };
  priceToman: number;
  customerName: string;
  note?: string;
  tableOrLocation?: string;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Session {
  token: string;
  userId: string;
  username: string;
  role: Role;
  expiresAt: string;
}
