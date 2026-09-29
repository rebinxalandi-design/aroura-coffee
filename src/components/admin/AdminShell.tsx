"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useLocale } from "@/lib/i18n/LocaleProvider";
import ThemeToggle from "@/components/ThemeToggle";
import LocaleSwitcher from "@/components/LocaleSwitcher";
import type { CurrentUser } from "@/lib/auth";

export default function AdminShell({
  user,
  children,
}: {
  user: CurrentUser | null;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { t } = useLocale();

  // Bare canvas for the login page: no nav chrome to expose.
  if (!user || pathname === "/admin/login") {
    return (
      <div className="min-h-screen bg-cream text-ink">
        <div className="absolute right-6 top-6 flex items-center gap-2 md:right-10 md:top-8">
          <LocaleSwitcher />
          <ThemeToggle />
        </div>
        {children}
      </div>
    );
  }

  const links = [
    { href: "/admin/dashboard", label: t.admin.dashboard, superOnly: true },
    { href: "/admin/orders", label: t.admin.orders, superOnly: false },
    { href: "/admin/menu", label: t.admin.menuManagement, superOnly: true },
    { href: "/admin/accounts", label: t.admin.adminAccounts, superOnly: true },
  ];

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-cream text-ink">
      <header className="sticky top-0 z-40 border-b border-white/20 bg-cream/70 px-6 py-4 backdrop-blur-2xl backdrop-saturate-150 md:px-10">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/admin/orders" className="font-display text-lg italic text-espresso">
              Aroura <span className="text-xs not-italic tracking-widest text-wood">ADMIN</span>
            </Link>
            <nav className="hidden items-center gap-6 md:flex">
              {links
                .filter((l) => !l.superOnly || user.role === "super_admin")
                .map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    className={`text-sm tracking-wide transition-colors ${
                      pathname?.startsWith(l.href)
                        ? "text-espresso"
                        : "text-espresso/60 hover:text-espresso"
                    }`}
                  >
                    {l.label}
                  </Link>
                ))}
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden text-xs text-espresso/50 sm:inline">
              {user.username} ·{" "}
              {user.role === "super_admin" ? t.admin.superAdmin : t.admin.admin}
            </span>
            <LocaleSwitcher />
            <ThemeToggle />
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-full border border-espresso/20 px-4 py-2 text-xs uppercase tracking-[0.12em] text-espresso transition-colors hover:bg-espresso hover:text-cream"
            >
              {t.admin.logout}
            </button>
          </div>
        </div>
        <nav className="mt-3 flex items-center gap-5 overflow-x-auto md:hidden">
          {links
            .filter((l) => !l.superOnly || user.role === "super_admin")
            .map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`whitespace-nowrap text-sm ${
                  pathname?.startsWith(l.href) ? "text-espresso" : "text-espresso/60"
                }`}
              >
                {l.label}
              </Link>
            ))}
        </nav>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-10 md:px-10 md:py-14">
        {children}
      </main>
    </div>
  );
}
