import { useTranslation } from 'react-i18next';

export default function BenefitCard({ milestone, unlocked = true }) {
  const { t } = useTranslation();
  if (!milestone) return null;
  return (
    <article
      className={`rounded-card border p-4 bg-white dark:bg-slate-800 ${
        unlocked ? 'border-primary/40' : 'border-divider dark:border-slate-700 opacity-70'
      }`}
    >
      <header className="flex items-center gap-2 mb-2">
        <span aria-hidden="true" className="text-2xl">{milestone.icon}</span>
        <h3 className="font-semibold text-ink dark:text-white">
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
