import { useTranslation } from 'react-i18next';

export default function ProgressBar({ days, next, prevDays = 0 }) {
  const { t } = useTranslation();
  if (!next) return null;
  const span = next.days - prevDays;
  const pct = Math.min(100, Math.round(((days - prevDays) / span) * 100));
  const remaining = next.days - days;
  return (
    <div>
      <div
        className="h-2 rounded-full bg-divider dark:bg-slate-700 overflow-hidden"
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div className="h-full bg-secondary transition-all" style={{ width: `${pct}%` }} />
      </div>
      <p className="text-sm text-muted mt-1">
        {remaining === 0
          ? t('dashboard.milestoneToday')
          : t('dashboard.nextMilestone', {
              count: remaining,
              label: t(`tl.${next.id}.label`),
            })}
      </p>
    </div>
  );
}
