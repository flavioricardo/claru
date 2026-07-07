import { useTranslation } from 'react-i18next';

// Streak de CHECK-IN (engajamento) — métrica separada da sobriedade.
export default function StreakBadge({ streak, record }) {
  const { t } = useTranslation();
  return (
    <div className="rounded-card border border-divider dark:border-slate-700 bg-white dark:bg-slate-800 p-4 text-center">
      <span aria-hidden="true" className="text-2xl">🔥</span>
      <p className="font-bold text-ink dark:text-white">
        {t('streak.days', { count: streak })}
      </p>
      <p className="text-xs text-muted">{t('streak.checkinStreak')}</p>
      <p className="text-xs text-muted mt-1">{t('streak.record', { count: record })}</p>
    </div>
  );
}
