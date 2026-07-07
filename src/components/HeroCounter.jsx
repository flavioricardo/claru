import { useTranslation } from 'react-i18next';

// Contador AUTOMÁTICO por data (Orquestração §6). aria-live p/ screen readers (DevFE §6.2).
export default function HeroCounter({ days, hours }) {
  const { t } = useTranslation();
  const showHours = days < 1;
  return (
    <section className="text-center py-8" aria-live="polite">
      <p className="text-muted text-sm uppercase tracking-widest mb-1">
        {t('app.tagline')}
      </p>
      <h1 className="font-bold text-ink dark:text-white leading-none">
        <span className="block text-6xl sm:text-7xl text-primary tabular-nums">
          {showHours ? hours : days}
        </span>
        <span className="block text-xl mt-2">
          {showHours
            ? t('dashboard.hours', { count: hours })
            : t('dashboard.day', { count: days })}
        </span>
      </h1>
      <p className="text-muted mt-2">{t('dashboard.youAreDoing')}</p>
    </section>
  );
}
