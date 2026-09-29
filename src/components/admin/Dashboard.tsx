"use client";

import { useLocale } from "@/lib/i18n/LocaleProvider";
import { formatToman } from "@/lib/currency";

interface PeriodStat {
  count: number;
  revenue: number;
}

interface TopItem {
  name: { en: string; fa: string };
  count: number;
  revenue: number;
}

export interface DashboardStats {
  today: PeriodStat;
  week: PeriodStat;
  allTime: PeriodStat;
  pendingCount: number;
  menuItemCount: number;
  topItems: TopItem[];
}

function StatCard({
  label,
  count,
  revenue,
  ordersLabel,
}: {
  label: string;
  count: number;
  revenue: number;
  ordersLabel: string;
}) {
  const { locale } = useLocale();
  return (
    <div className="rounded-2xl border border-white/25 bg-cream-soft/60 p-6 shadow-[0_8px_30px_-14px_rgba(44,25,18,0.25)] backdrop-blur-xl backdrop-saturate-150">
      <p className="text-xs uppercase tracking-[0.15em] text-espresso/60">{label}</p>
      <p className="mt-3 font-display text-3xl italic text-espresso">
        {formatToman(revenue, locale)}
      </p>
      <p className="mt-1 text-sm text-espresso/50">
        {count} {ordersLabel}
      </p>
    </div>
  );
}

export default function Dashboard({ stats }: { stats: DashboardStats }) {
  const { locale, t } = useLocale();

  return (
    <div>
      <h1 className="font-display text-3xl italic text-espresso">
        {t.admin.dashboard}
      </h1>

      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-3">
        <StatCard
          label={t.admin.dashboardToday}
          count={stats.today.count}
          revenue={stats.today.revenue}
          ordersLabel={t.admin.dashboardOrders}
        />
        <StatCard
          label={t.admin.dashboardWeek}
          count={stats.week.count}
          revenue={stats.week.revenue}
          ordersLabel={t.admin.dashboardOrders}
        />
        <StatCard
          label={t.admin.dashboardAllTime}
          count={stats.allTime.count}
          revenue={stats.allTime.revenue}
          ordersLabel={t.admin.dashboardOrders}
        />
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="rounded-2xl border border-white/20 bg-cream-soft/50 px-5 py-4 backdrop-blur-md">
          <p className="text-xs uppercase tracking-[0.15em] text-espresso/60">
            {t.admin.dashboardPending}
          </p>
          <p className="mt-2 font-display text-2xl italic text-espresso">
            {stats.pendingCount}
          </p>
        </div>
        <div className="rounded-2xl border border-white/20 bg-cream-soft/50 px-5 py-4 backdrop-blur-md">
          <p className="text-xs uppercase tracking-[0.15em] text-espresso/60">
            {t.admin.dashboardMenuItems}
          </p>
          <p className="mt-2 font-display text-2xl italic text-espresso">
            {stats.menuItemCount}
          </p>
        </div>
      </div>

      <div className="mt-10">
        <h2 className="font-display text-xl italic text-espresso">
          {t.admin.dashboardTopItems}
        </h2>
        {stats.topItems.length === 0 ? (
          <p className="mt-4 text-sm text-espresso/50">{t.admin.dashboardNoSales}</p>
        ) : (
          <div className="mt-4 flex flex-col gap-2">
            {stats.topItems.map((item, i) => (
              <div
                key={i}
                className="flex items-center justify-between rounded-2xl border border-white/20 bg-cream-soft/50 px-5 py-3 backdrop-blur-md"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-espresso/10 text-xs text-espresso">
                    {i + 1}
                  </span>
                  <p className="text-sm text-espresso">{item.name[locale]}</p>
                </div>
                <p className="text-sm text-wood">
                  {item.count} {t.admin.dashboardSold} ·{" "}
                  {formatToman(item.revenue, locale)}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
