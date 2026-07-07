import { useTranslation } from 'react-i18next';
import BenefitCard from './BenefitCard';

// Estados: desbloqueado / atual (você está aqui) / futuro (UX v1.0 §4.1D)
export default function TimelineMarker({ milestone, days, isCurrent }) {
  const { t } = useTranslation();
  const unlocked = days >= milestone.days;
  return (
    <li className="relative pl-8 pb-8 last:pb-0">
      <span
        aria-hidden="true"
        className={`absolute left-0 top-1 w-4 h-4 rounded-full border-2 ${
          isCurrent
            ? 'bg-primary border-primary motion-safe:animate-pulse'
            : unlocked
            ? 'bg-primary border-primary'
            : 'bg-white dark:bg-slate-800 border-divider dark:border-slate-600'
        }`}
      />
      <span className="absolute left-[7px] top-5 bottom-0 w-0.5 bg-divider dark:bg-slate-700" />
      <p className="text-xs font-semibold uppercase tracking-wide mb-1">
        {isCurrent ? (
          <span className="text-primary">● {t('timeline.youAreHere')}</span>
        ) : unlocked ? (
          <span className="text-primary">{t('timeline.unlocked')}</span>
        ) : (
          <span className="text-muted">{t('timeline.daysLeft', { count: milestone.days - days })}</span>
        )}
      </p>
      <BenefitCard milestone={milestone} unlocked={unlocked} />
    </li>
  );
}
