"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "@/lib/i18n/LocaleProvider";
import { translateApiError } from "@/lib/i18n/dictionary";

export default function AdminLoginPage() {
  const { locale, t } = useLocale();
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (!res.ok) {
        if (res.status === 429) {
          const data = await res.json().catch(() => null);
          setError(translateApiError(locale, data?.error));
        } else {
          // Deliberately generic for any other failure -- doesn't reveal
          // whether the username exists, unlike the specific 429 case
          // above which is safe to surface since it isn't tied to a
          // particular account.
          setError(t.admin.loginError);
        }
        return;
      }
      router.push("/admin/orders");
      router.refresh();
    } catch {
      setError(t.admin.loginError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <div className="w-full max-w-sm rounded-[4px] border border-gold/20 bg-cream-soft p-8 shadow-xl md:p-10">
        <p className="mb-2 text-center text-xs uppercase tracking-[0.28em] text-wood">
          Aroura
        </p>
        <h1 className="text-center font-display text-2xl italic text-espresso md:text-3xl">
          {t.admin.loginTitle}
        </h1>

        <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
          <label className="flex flex-col gap-1.5 text-sm text-espresso/80">
            {t.admin.username}
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              className="rounded-[3px] border border-espresso/20 bg-cream px-3.5 py-2.5 text-sm text-espresso outline-none transition-colors focus:border-espresso/50"
              required
            />
          </label>
          <label className="flex flex-col gap-1.5 text-sm text-espresso/80">
            {t.admin.password}
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              className="rounded-[3px] border border-espresso/20 bg-cream px-3.5 py-2.5 text-sm text-espresso outline-none transition-colors focus:border-espresso/50"
              required
            />
          </label>

          {error && <p className="text-sm text-danger">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 rounded-full bg-espresso px-6 py-3 text-sm text-cream transition-colors hover:bg-espresso-deep disabled:opacity-60"
          >
            {loading ? t.admin.loggingIn : t.admin.login}
          </button>
        </form>
      </div>
    </div>
  );
}
