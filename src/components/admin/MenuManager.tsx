"use client";

import { useState } from "react";
import Image from "next/image";
import { useLocale } from "@/lib/i18n/LocaleProvider";
import { useToast } from "@/lib/toast/ToastProvider";
import { formatToman } from "@/lib/currency";
import MenuItemForm, { type MenuItemFormValues } from "./MenuItemForm";
import type { MenuItem } from "@/lib/types";

export default function MenuManager({
  initialItems,
}: {
  initialItems: MenuItem[];
}) {
  const { locale, t } = useLocale();
  const { showToast } = useToast();
  const [items, setItems] = useState<MenuItem[]>(initialItems);
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleCreate = async (values: MenuItemFormValues) => {
    setSubmitting(true);
    try {
      const res = await fetch("/api/menu", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (!res.ok) {
        showToast(data.error ?? t.orderModal.error, "error");
        return;
      }
      setItems((prev) => [...prev, data.item]);
      setAdding(false);
      showToast(t.admin.save, "success");
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdate = async (id: string, values: MenuItemFormValues) => {
    setSubmitting(true);
    try {
      const res = await fetch(`/api/menu/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (!res.ok) {
        showToast(data.error ?? t.orderModal.error, "error");
        return;
      }
      setItems((prev) => prev.map((i) => (i.id === id ? data.item : i)));
      setEditingId(null);
      showToast(t.admin.save, "success");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm(t.admin.deleteConfirm)) return;
    const res = await fetch(`/api/menu/${id}`, { method: "DELETE" });
    if (res.ok) {
      setItems((prev) => prev.filter((i) => i.id !== id));
      showToast(t.admin.deleteItem, "success");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl italic text-espresso">
          {t.admin.menuManagement}
        </h1>
        {!adding && (
          <button
            onClick={() => {
              setAdding(true);
              setEditingId(null);
            }}
            className="rounded-full bg-espresso px-5 py-2.5 text-xs uppercase tracking-[0.12em] text-cream transition-colors hover:bg-espresso-deep"
          >
            {t.admin.addItem}
          </button>
        )}
      </div>

      {adding && (
        <div className="mt-6">
          <MenuItemForm
            onSubmit={handleCreate}
            onCancel={() => setAdding(false)}
            submitting={submitting}
          />
        </div>
      )}

      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) =>
          editingId === item.id ? (
            <div key={item.id} className="sm:col-span-2 lg:col-span-3">
              <MenuItemForm
                existing={item}
                onSubmit={(values) => handleUpdate(item.id, values)}
                onCancel={() => setEditingId(null)}
                submitting={submitting}
              />
            </div>
          ) : (
            <div
              key={item.id}
              className="flex flex-col overflow-hidden rounded-2xl border border-white/20 bg-cream-soft/50 shadow-[0_8px_30px_-14px_rgba(44,25,18,0.25)] backdrop-blur-xl backdrop-saturate-150"
            >
              <div className="relative aspect-[5/4] w-full bg-beige">
                <Image
                  src={item.image.src}
                  alt={item.image.alt}
                  fill
                  sizes="(max-width: 768px) 90vw, 30vw"
                  className="object-cover"
                />
                <span className="absolute left-3 top-3 rounded-full border border-white/30 bg-white/25 px-3 py-1 text-[10px] uppercase tracking-[0.12em] text-espresso backdrop-blur-md">
                  {t.admin.categories[item.category]}
                </span>
              </div>
              <div className="flex flex-1 flex-col justify-between p-5">
                <div>
                  <div className="flex items-baseline justify-between gap-3">
                    <h3 className="font-display text-lg italic text-espresso">
                      {item.name[locale]}
                    </h3>
                    <span className="whitespace-nowrap text-sm text-wood">
                      {formatToman(item.priceToman, locale)}
                    </span>
                  </div>
                  <p className="mt-1.5 text-sm text-espresso/60">
                    {item.description[locale]}
                  </p>
                </div>
                <div className="mt-4 flex items-center gap-3">
                  <button
                    onClick={() => {
                      setEditingId(item.id);
                      setAdding(false);
                    }}
                    className="text-xs uppercase tracking-[0.1em] text-espresso underline decoration-espresso/30 underline-offset-4 hover:decoration-espresso"
                  >
                    {t.admin.editItem}
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="text-xs uppercase tracking-[0.1em] text-danger underline decoration-danger/30 underline-offset-4 hover:decoration-danger"
                  >
                    {t.admin.deleteItem}
                  </button>
                </div>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}
