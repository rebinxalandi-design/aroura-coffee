"use client";

import { useState, type FormEvent } from "react";
import { useLocale } from "@/lib/i18n/LocaleProvider";
import { useToast } from "@/lib/toast/ToastProvider";
import { translateApiError } from "@/lib/i18n/dictionary";
import type { Role } from "@/lib/types";

interface SafeAdmin {
  id: string;
  username: string;
  role: Role;
  createdAt: string;
}

type EditMode = "password" | "username" | null;

export default function AccountsManager({
  initialAdmins,
  currentUserId,
}: {
  initialAdmins: SafeAdmin[];
  currentUserId: string;
}) {
  const { locale, t } = useLocale();
  const { showToast } = useToast();
  const [admins, setAdmins] = useState(initialAdmins);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>("admin");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [editId, setEditId] = useState<string | null>(null);
  const [editMode, setEditMode] = useState<EditMode>(null);
  const [editValue, setEditValue] = useState("");
  const [editSubmitting, setEditSubmitting] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

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
        setError(translateApiError(locale, data.error));
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

  const startEdit = (id: string, mode: EditMode) => {
    setEditId(id);
    setEditMode(mode);
    setEditValue("");
    setEditError(null);
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditMode(null);
  };

  const handleEditSubmit = async (e: FormEvent, id: string) => {
    e.preventDefault();
    setEditSubmitting(true);
    setEditError(null);
    try {
      const payload =
        editMode === "username" ? { username: editValue } : { password: editValue };
      const res = await fetch(`/api/admins/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        setEditError(translateApiError(locale, data?.error));
        return;
      }
      if (editMode === "username") {
        setAdmins((prev) =>
          prev.map((a) => (a.id === id ? { ...a, username: editValue.trim() } : a))
        );
        showToast(t.admin.usernameChanged, "success");
      } else {
        showToast(t.admin.passwordChanged, "success");
      }
      cancelEdit();
    } finally {
      setEditSubmitting(false);
    }
  };

  return (
    <div>
      <h1 className="font-display text-3xl italic text-espresso">
        {t.admin.adminAccounts}
      </h1>

      <form
        onSubmit={handleCreate}
        className="mt-8 flex flex-col gap-4 rounded-2xl border border-white/25 bg-cream-soft/60 p-6 shadow-[0_8px_30px_-14px_rgba(44,25,18,0.25)] backdrop-blur-xl backdrop-saturate-150 sm:flex-row sm:items-end sm:flex-wrap"
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
      {error && <p className="mt-2 text-sm text-danger">{error}</p>}

      <div className="mt-8 flex flex-col gap-2">
        {admins.map((a) => (
          <div
            key={a.id}
            className="rounded-2xl border border-white/20 bg-cream-soft/50 px-5 py-3.5 backdrop-blur-md"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm text-espresso">{a.username}</p>
                <p className="text-xs text-espresso/50">
                  {a.role === "super_admin" ? t.admin.superAdmin : t.admin.admin}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => startEdit(a.id, "username")}
                  className="text-xs uppercase tracking-[0.1em] text-espresso underline decoration-espresso/30 underline-offset-4 hover:decoration-espresso"
                >
                  {t.admin.changeUsername}
                </button>
                <button
                  onClick={() => startEdit(a.id, "password")}
                  className="text-xs uppercase tracking-[0.1em] text-espresso underline decoration-espresso/30 underline-offset-4 hover:decoration-espresso"
                >
                  {t.admin.changePassword}
                </button>
                {a.id !== currentUserId && (
                  <button
                    onClick={() => handleDelete(a.id)}
                    className="text-xs uppercase tracking-[0.1em] text-danger underline decoration-danger/30 underline-offset-4 hover:decoration-danger"
                  >
                    {t.admin.deleteItem}
                  </button>
                )}
              </div>
            </div>

            {editId === a.id && (
              <form
                onSubmit={(e) => handleEditSubmit(e, a.id)}
                className="mt-3 flex flex-wrap items-end gap-3 border-t border-espresso/10 pt-3"
              >
                <label className="flex flex-1 min-w-[160px] flex-col gap-1.5 text-sm text-espresso/80">
                  {editMode === "username" ? t.admin.newUsername : t.admin.newPassword}
                  <input
                    type={editMode === "username" ? "text" : "password"}
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    minLength={editMode === "username" ? 3 : 6}
                    autoFocus
                    className="rounded-[3px] border border-espresso/20 bg-cream px-3.5 py-2.5 text-sm text-espresso outline-none focus:border-espresso/50"
                    required
                  />
                </label>
                <button
                  type="submit"
                  disabled={editSubmitting}
                  className="rounded-full bg-espresso px-5 py-2 text-xs text-cream transition-colors hover:bg-espresso-deep disabled:opacity-60"
                >
                  {editSubmitting ? t.admin.saving : t.admin.save}
                </button>
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="rounded-full border border-espresso/20 px-5 py-2 text-xs text-espresso transition-colors hover:bg-espresso/5"
                >
                  {t.admin.cancel}
                </button>
                {editError && <p className="w-full text-sm text-danger">{editError}</p>}
              </form>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
