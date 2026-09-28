"use client";

import { useCallback, useEffect, useState } from "react";
import { useLocale } from "@/lib/i18n/LocaleProvider";
import { useToast } from "@/lib/toast/ToastProvider";
import { formatToman } from "@/lib/currency";
import type { Order, OrderStatus } from "@/lib/types";

const POLL_INTERVAL_MS = 5000;

const STATUS_STYLES: Record<OrderStatus, string> = {
  pending: "bg-gold/15 text-wood border-gold/30",
  accepted: "bg-success-soft text-success border-success-border",
  rejected: "bg-danger-soft text-danger border-danger-border",
  completed: "bg-espresso/10 text-espresso border-espresso/25",
};

export default function OrdersBoard() {
  const { locale, t } = useLocale();
  const { showToast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    try {
      const res = await fetch("/api/orders", { cache: "no-store" });
      if (!res.ok) return;
      const data = await res.json();
      setOrders(data.orders ?? []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
    // Polling refetch keeps this simple (no websockets); good enough for a
    // single small cafe's order volume.
    const interval = setInterval(fetchOrders, POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [fetchOrders]);

  const updateStatus = async (id: string, status: OrderStatus) => {
    setUpdatingId(id);
    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("failed");
      const data = await res.json();
      setOrders((prev) => prev.map((o) => (o.id === id ? data.order : o)));
      showToast(
        status === "accepted"
          ? t.admin.accept
          : status === "rejected"
          ? t.admin.reject
          : t.admin.complete,
        "success"
      );
    } catch {
      showToast(t.orderModal.error, "error");
    } finally {
      setUpdatingId(null);
    }
  };

  const statusLabel: Record<OrderStatus, string> = {
    pending: t.admin.pending,
    accepted: t.admin.accepted,
    rejected: t.admin.rejected,
    completed: t.admin.completed,
  };

  return (
    <div>
      <h1 className="font-display text-3xl italic text-espresso">
        {t.admin.orders}
      </h1>

      {loading ? (
        <p className="mt-8 text-sm text-espresso/50">…</p>
      ) : orders.length === 0 ? (
        <p className="mt-8 text-sm text-espresso/50">{t.admin.noOrders}</p>
      ) : (
        <div className="mt-8 flex flex-col gap-3">
          {orders.map((order) => (
            <div
              key={order.id}
              className="flex flex-col gap-4 rounded-2xl border border-white/25 bg-cream-soft/60 p-5 shadow-[0_8px_30px_-14px_rgba(44,25,18,0.25)] backdrop-blur-xl backdrop-saturate-150 md:flex-row md:items-center md:justify-between"
            >
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="font-display text-lg italic text-espresso">
                    {order.itemName[locale]}
                  </h3>
                  <span
                    className={`rounded-full border px-3 py-0.5 text-[11px] uppercase tracking-[0.1em] ${STATUS_STYLES[order.status]}`}
                  >
                    {statusLabel[order.status]}
                  </span>
                </div>
                <p className="mt-1.5 text-sm text-espresso/70">
                  {order.customerName}
                  {order.tableOrLocation ? ` · ${order.tableOrLocation}` : ""}
                  {" · "}
                  <span className="text-wood">
                    {formatToman(order.priceToman, locale)}
                  </span>
                </p>
                {order.note && (
                  <p className="mt-1 text-sm italic text-espresso/50">
                    “{order.note}”
                  </p>
                )}
                <p className="mt-1 text-xs text-espresso/35">
                  {/* "fa-IR" switches to the Jalali calendar *and* Extended
                      Arabic-Indic digits, which trigger a font rendering bug
                      (see src/lib/currency.ts) -- force the Latin numbering
                      system so the calendar can localize without that. */}
                  {new Date(order.createdAt).toLocaleString(
                    locale === "fa" ? "fa-IR-u-nu-latn" : "en-US"
                  )}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {order.status === "pending" && (
                  <>
                    <button
                      onClick={() => updateStatus(order.id, "accepted")}
                      disabled={updatingId === order.id}
                      className="min-h-11 rounded-full bg-espresso px-4 text-xs text-cream transition-colors hover:bg-espresso-deep disabled:opacity-50"
                    >
                      {t.admin.accept}
                    </button>
                    <button
                      onClick={() => updateStatus(order.id, "rejected")}
                      disabled={updatingId === order.id}
                      className="min-h-11 rounded-full border border-danger/30 px-4 text-xs text-danger transition-colors hover:bg-danger-fill hover:text-white disabled:opacity-50"
                    >
                      {t.admin.reject}
                    </button>
                  </>
                )}
                {order.status === "accepted" && (
                  <button
                    onClick={() => updateStatus(order.id, "completed")}
                    disabled={updatingId === order.id}
                    className="min-h-11 rounded-full border border-espresso/25 px-4 text-xs text-espresso transition-colors hover:bg-espresso hover:text-cream disabled:opacity-50"
                  >
                    {t.admin.complete}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
