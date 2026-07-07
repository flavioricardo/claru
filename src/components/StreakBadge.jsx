import { useTranslation } from 'react-i18next';

// Streak de CHECK-IN (engajamento) — métrica separada da sobriedade.
export default function StreakBadge({ streak, record }) {
  const { t } = useTranslation();
  return (
    <div className="rounded-card border border-divider dark:border-white/10 bg-white dark:bg-night-hi shadow-card p-4 text-center min-w-[104px] flex flex-col justify-center">
      <span aria-hidden="true" className="text-2xl">🔥</span>
      <p className="font-display font-bold text-ink dark:text-white text-lg">
        {t('streak.days', { count: streak })}
      </p>
      <p className="text-xs text-muted">{t('streak.checkinStreak')}</p>
      <p className="text-xs text-muted mt-1">{t('streak.record', { count: record })}</p>
    </div>
  );
}
