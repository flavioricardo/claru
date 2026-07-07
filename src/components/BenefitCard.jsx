import { useTranslation } from 'react-i18next';

export default function BenefitCard({ milestone, unlocked = true }) {
  const { t } = useTranslation();
  if (!milestone) return null;
  return (
    <article
      className={`rounded-card p-4 bg-white dark:bg-night-hi shadow-card border ${
        unlocked ? 'border-primary/25' : 'border-divider dark:border-white/10 opacity-70'
      }`}
    >
      <header className="flex items-center gap-2 mb-2">
        <span aria-hidden="true" className="text-2xl">{milestone.icon}</span>
        <h3 className="font-display font-semibold text-ink dark:text-white leading-snug">
          {unlocked && <span className="text-primary mr-1">✓</span>}
          {t(`tl.${milestone.id}.label`)} — {t(`tl.${milestone.id}.title`)}
        </h3>
      </header>
      <p className="text-sm text-ink/80 dark:text-slate-300">
        {t(`tl.${milestone.id}.body`)}
      </p>
      <p className="text-xs text-muted mt-2">{t('tl.sources')}</p>
    </article>
  );
}
