"use client";

import { useState, type FormEvent } from "react";
import Image from "next/image";
import { useLocale } from "@/lib/i18n/LocaleProvider";
import type { MenuCategory, MenuItem } from "@/lib/types";

const CATEGORIES: MenuCategory[] = ["coffee", "espresso", "cake", "pastry", "other"];

export interface MenuItemFormValues {
  nameEn: string;
  nameFa: string;
  descEn: string;
  descFa: string;
  priceToman: number;
  tagEn: string;
  tagFa: string;
  category: MenuCategory;
  imageSrc: string;
  imageAlt: string;
}

export default function MenuItemForm({
  existing,
  onSubmit,
  onCancel,
  submitting,
}: {
  existing?: MenuItem;
  onSubmit: (values: MenuItemFormValues) => Promise<void>;
  onCancel: () => void;
  submitting: boolean;
}) {
  const { t } = useLocale();
  const [nameEn, setNameEn] = useState(existing?.name.en ?? "");
  const [nameFa, setNameFa] = useState(existing?.name.fa ?? "");
  const [descEn, setDescEn] = useState(existing?.description.en ?? "");
  const [descFa, setDescFa] = useState(existing?.description.fa ?? "");
  const [price, setPrice] = useState(existing?.priceToman?.toString() ?? "");
  const [tagEn, setTagEn] = useState(existing?.tag.en ?? "");
  const [tagFa, setTagFa] = useState(existing?.tag.fa ?? "");
  const [category, setCategory] = useState<MenuCategory>(
    existing?.category ?? "coffee"
  );
  const [imageSrc, setImageSrc] = useState(existing?.image.src ?? "");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? t.admin.uploadFailed);
        return;
      }
      setImageSrc(data.src);
    } catch {
      setError(t.admin.uploadFailed);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    const priceNum = Number(price);
    if (!nameEn.trim() || !nameFa.trim()) {
      setError(t.admin.nameRequired);
      return;
    }
    if (!priceNum || priceNum <= 0) {
      setError(t.admin.priceInvalid);
      return;
    }
    if (!imageSrc) {
      setError(t.admin.photoRequired);
      return;
    }

    await onSubmit({
      nameEn: nameEn.trim(),
      nameFa: nameFa.trim(),
      descEn: descEn.trim(),
      descFa: descFa.trim(),
      priceToman: priceNum,
      tagEn: tagEn.trim(),
      tagFa: tagFa.trim(),
      category,
      imageSrc,
      imageAlt: nameEn.trim(),
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 rounded-2xl border border-white/25 bg-cream-soft/60 p-6 shadow-[0_8px_30px_-14px_rgba(44,25,18,0.25)] backdrop-blur-xl backdrop-saturate-150"
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1.5 text-sm text-espresso/80">
          {t.admin.itemNameEn}
          <input
            value={nameEn}
            onChange={(e) => setNameEn(e.target.value)}
            className="rounded-[3px] border border-espresso/20 bg-cream px-3.5 py-2.5 text-sm text-espresso outline-none focus:border-espresso/50"
          />
        </label>
        <label className="flex flex-col gap-1.5 text-sm text-espresso/80">
          {t.admin.itemNameFa}
          <input
            value={nameFa}
            onChange={(e) => setNameFa(e.target.value)}
            dir="rtl"
            className="rounded-[3px] border border-espresso/20 bg-cream px-3.5 py-2.5 text-sm text-espresso outline-none focus:border-espresso/50"
          />
        </label>
        <label className="flex flex-col gap-1.5 text-sm text-espresso/80">
          {t.admin.itemDescEn}
          <textarea
            value={descEn}
            onChange={(e) => setDescEn(e.target.value)}
            rows={2}
            className="resize-none rounded-[3px] border border-espresso/20 bg-cream px-3.5 py-2.5 text-sm text-espresso outline-none focus:border-espresso/50"
          />
        </label>
        <label className="flex flex-col gap-1.5 text-sm text-espresso/80">
          {t.admin.itemDescFa}
          <textarea
            value={descFa}
            onChange={(e) => setDescFa(e.target.value)}
            dir="rtl"
            rows={2}
            className="resize-none rounded-[3px] border border-espresso/20 bg-cream px-3.5 py-2.5 text-sm text-espresso outline-none focus:border-espresso/50"
          />
        </label>
        <label className="flex flex-col gap-1.5 text-sm text-espresso/80">
          {t.admin.itemPrice}
          <input
            type="number"
            min={1}
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="rounded-[3px] border border-espresso/20 bg-cream px-3.5 py-2.5 text-sm text-espresso outline-none focus:border-espresso/50"
          />
        </label>
        <label className="flex flex-col gap-1.5 text-sm text-espresso/80">
          {t.admin.itemCategory}
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as MenuCategory)}
            className="rounded-[3px] border border-espresso/20 bg-cream px-3.5 py-2.5 text-sm text-espresso outline-none focus:border-espresso/50"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {t.admin.categories[c]}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1.5 text-sm text-espresso/80">
          {t.admin.itemTagEn}
          <input
            value={tagEn}
            onChange={(e) => setTagEn(e.target.value)}
            className="rounded-[3px] border border-espresso/20 bg-cream px-3.5 py-2.5 text-sm text-espresso outline-none focus:border-espresso/50"
          />
        </label>
        <label className="flex flex-col gap-1.5 text-sm text-espresso/80">
          {t.admin.itemTagFa}
          <input
            value={tagFa}
            onChange={(e) => setTagFa(e.target.value)}
            dir="rtl"
            className="rounded-[3px] border border-espresso/20 bg-cream px-3.5 py-2.5 text-sm text-espresso outline-none focus:border-espresso/50"
          />
        </label>
      </div>

      <div className="flex flex-col gap-2 text-sm text-espresso/80">
        {t.admin.itemPhoto}
        <div className="flex items-center gap-4">
          {imageSrc && (
            <div className="relative h-16 w-20 overflow-hidden rounded-[3px] border border-espresso/15">
              <Image src={imageSrc} alt="" fill className="object-cover" />
            </div>
          )}
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFileChange}
            className="text-xs text-espresso/70"
          />
          {uploading && <span className="text-xs text-espresso/50">…</span>}
        </div>
      </div>

      {error && <p className="text-sm text-red-700">{error}</p>}

      <div className="mt-2 flex items-center gap-3">
        <button
          type="submit"
          disabled={submitting || uploading}
          className="rounded-full bg-espresso px-6 py-2.5 text-sm text-cream transition-colors hover:bg-espresso-deep disabled:opacity-60"
        >
          {submitting ? t.admin.saving : t.admin.save}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-full border border-espresso/20 px-6 py-2.5 text-sm text-espresso transition-colors hover:bg-espresso/5"
        >
          {t.admin.cancel}
        </button>
      </div>
    </form>
  );
}
