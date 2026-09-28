"use client";

import { useState, type FormEvent } from "react";
import { useLocale } from "@/lib/i18n/LocaleProvider";
import { useToast } from "@/lib/toast/ToastProvider";
import { formatToman } from "@/lib/currency";
import type { MenuItem } from "@/lib/types";

export default function OrderModal({
  item,
  onClose,
}: {
  item: MenuItem;
  onClose: () => void;
}) {
  const { locale, t } = useLocale();
  const { showToast } = useToast();
  const [name, setName] = useState("");
  const [note, setNote] = useState("");
  const [table, setTable] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError(t.orderModal.nameRequired);
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          itemId: item.id,
          customerName: name,
          note,
          tableOrLocation: table,
        }),
      });
      if (!res.ok) throw new Error("failed");
      showToast(t.orderModal.success, "success");
      onClose();
    } catch {
      setError(t.orderModal.error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-espresso-deep/70 px-6 py-10 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="max-h-full w-full max-w-md overflow-y-auto rounded-2xl border border-white/25 bg-cream/75 p-8 shadow-2xl backdrop-blur-2xl backdrop-saturate-150"
      >
        <h3 className="font-display text-2xl italic text-espresso">
          {t.orderModal.title}
        </h3>
        <p className="mt-2 text-sm text-espresso/60">
          {t.orderModal.itemLabel}: <span className="text-espresso">{item.name[locale]}</span>
          {" · "}
          <span className="text-wood">{formatToman(item.priceToman, locale)}</span>
        </p>

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
          <label className="flex flex-col gap-1.5 text-sm text-espresso/80">
            {t.orderModal.nameLabel}
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t.orderModal.namePlaceholder}
              className="rounded-[3px] border border-espresso/20 bg-cream-soft px-3.5 py-2.5 text-sm text-espresso outline-none transition-colors focus:border-espresso/50"
              maxLength={100}
            />
          </label>
          <label className="flex flex-col gap-1.5 text-sm text-espresso/80">
            {t.orderModal.tableLabel}
            <input
              value={table}
              onChange={(e) => setTable(e.target.value)}
              placeholder={t.orderModal.tablePlaceholder}
              className="rounded-[3px] border border-espresso/20 bg-cream-soft px-3.5 py-2.5 text-sm text-espresso outline-none transition-colors focus:border-espresso/50"
              maxLength={100}
            />
          </label>
          <label className="flex flex-col gap-1.5 text-sm text-espresso/80">
            {t.orderModal.noteLabel}
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder={t.orderModal.notePlaceholder}
              rows={3}
              className="resize-none rounded-[3px] border border-espresso/20 bg-cream-soft px-3.5 py-2.5 text-sm text-espresso outline-none transition-colors focus:border-espresso/50"
              maxLength={500}
            />
          </label>

          {error && <p className="text-sm text-danger">{error}</p>}

          <div className="mt-2 flex items-center gap-3">
            <button
              type="submit"
              disabled={submitting}
              data-cursor-hover
              className="flex-1 rounded-full bg-espresso px-6 py-3 text-sm text-cream transition-colors hover:bg-espresso-deep disabled:opacity-60"
            >
              {submitting ? t.orderModal.submitting : t.orderModal.submit}
            </button>
            <button
              type="button"
              onClick={onClose}
              data-cursor-hover
              className="rounded-full border border-espresso/20 px-6 py-3 text-sm text-espresso transition-colors hover:bg-espresso/5"
            >
              {t.orderModal.cancel}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
