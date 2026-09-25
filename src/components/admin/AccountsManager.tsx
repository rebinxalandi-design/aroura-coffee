"use client";

import { useState, type FormEvent } from "react";
import { useLocale } from "@/lib/i18n/LocaleProvider";
import { useToast } from "@/lib/toast/ToastProvider";
import type { Role } from "@/lib/types";

interface SafeAdmin {
  id: string;
  username: string;
  role: Role;
  createdAt: string;
}

export default function AccountsManager({
  initialAdmins,
  currentUserId,
}: {
  initialAdmins: SafeAdmin[];
  currentUserId: string;
}) {
  const { t } = useLocale();
  const { showToast } = useToast();
  const [admins, setAdmins] = useState(initialAdmins);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>("admin");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreate = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/admins", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, role }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Failed");
        return;
      }
      setAdmins((prev) => [...prev, data.admin]);
      setUsername("");
      setPassword("");
      setRole("admin");
      showToast(t.admin.createAdmin, "success");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm(t.admin.deleteConfirm)) return;
    const res = await fetch(`/api/admins/${id}`, { method: "DELETE" });
    if (res.ok) {
      setAdmins((prev) => prev.filter((a) => a.id !== id));
    }
  };

  return (
    <div>
      <h1 className="font-display text-3xl italic text-espresso">
        {t.admin.adminAccounts}
      </h1>

      <form
        onSubmit={handleCreate}
        className="mt-8 flex flex-col gap-4 rounded-[4px] border border-gold/20 bg-cream-soft p-6 sm:flex-row sm:items-end sm:flex-wrap"
      >
        <label className="flex flex-1 min-w-[160px] flex-col gap-1.5 text-sm text-espresso/80">
          {t.admin.newAdminUsername}
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="rounded-[3px] border border-espresso/20 bg-cream px-3.5 py-2.5 text-sm text-espresso outline-none focus:border-espresso/50"
            required
          />
        </label>
        <label className="flex flex-1 min-w-[160px] flex-col gap-1.5 text-sm text-espresso/80">
          {t.admin.newAdminPassword}
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={6}
            className="rounded-[3px] border border-espresso/20 bg-cream px-3.5 py-2.5 text-sm text-espresso outline-none focus:border-espresso/50"
            required
          />
        </label>
        <label className="flex flex-col gap-1.5 text-sm text-espresso/80">
          {t.admin.newAdminRole}
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as Role)}
            className="rounded-[3px] border border-espresso/20 bg-cream px-3.5 py-2.5 text-sm text-espresso outline-none focus:border-espresso/50"
          >
            <option value="admin">{t.admin.admin}</option>
            <option value="super_admin">{t.admin.superAdmin}</option>
          </select>
        </label>
        <button
          type="submit"
          disabled={submitting}
          className="rounded-full bg-espresso px-6 py-2.5 text-sm text-cream transition-colors hover:bg-espresso-deep disabled:opacity-60"
        >
          {submitting ? t.admin.saving : t.admin.createAdmin}
        </button>
      </form>
      {error && <p className="mt-2 text-sm text-red-700">{error}</p>}

      <div className="mt-8 flex flex-col gap-2">
        {admins.map((a) => (
          <div
            key={a.id}
            className="flex items-center justify-between rounded-[4px] border border-espresso/10 bg-cream-soft px-5 py-3.5"
          >
            <div>
              <p className="text-sm text-espresso">{a.username}</p>
              <p className="text-xs text-espresso/50">
                {a.role === "super_admin" ? t.admin.superAdmin : t.admin.admin}
              </p>
            </div>
            {a.id !== currentUserId && (
              <button
                onClick={() => handleDelete(a.id)}
                className="text-xs uppercase tracking-[0.1em] text-red-800 underline decoration-red-800/30 underline-offset-4 hover:decoration-red-800"
              >
                {t.admin.deleteItem}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
