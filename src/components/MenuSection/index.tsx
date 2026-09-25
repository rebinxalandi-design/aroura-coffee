import { listMenuItems } from "@/lib/store";
import MenuSectionClient from "./MenuSectionClient";

export default async function MenuSection() {
  const items = await listMenuItems();
  return <MenuSectionClient items={items} />;
}
