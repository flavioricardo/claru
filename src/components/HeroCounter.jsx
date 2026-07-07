import { useTranslation } from 'react-i18next';

/**
 * Assinatura visual do Claru: "o céu que clareia".
 * --clarity (0..1) deriva dos dias REAIS de sobriedade (escala log até 1 ano):
 * a névoa se dissipa conforme o corpo se recupera. O sol percorre o arco
 * até o próximo marco — substitui a barra de progresso genérica.
 * Contador automático por data (Orquestração §6). aria-live p/ screen readers.
 */
export default function HeroCounter({ days, hours, next, prevDays = 0 }) {
  const { t } = useTranslation();
  const showHours = days < 1;

  // Clareza: log para dar sensação de progresso já nos primeiros dias
  const clarity = Math.min(1, Math.log1p(days) / Math.log1p(365));

  // Progresso até o próximo marco (posição do sol no arco)
  const span = next ? next.days - prevDays : 1;
  const p = next ? Math.min(1, Math.max(0, (days - prevDays) / span)) : 1;
  const angle = Math.PI * (1 - p); // esquerda (0%) → direita (100%)
  const cx = 180, cy = 132, r = 128;
  const sunX = cx + r * Math.cos(angle);
  const sunY = cy - r * Math.sin(angle);
  const remaining = next ? next.days - days : 0;

  return (
    <section
      className="sky-panel relative overflow-hidden rounded-b-[28px] -mx-4 px-4 pt-10 pb-6 text-center"
      style={{ '--clarity': clarity }}
      aria-live="polite"
    >
      {/* Arco do horizonte + sol (decorativo; progresso anunciado em texto abaixo) */}
      <svg
        viewBox="0 0 360 140"
        className="absolute inset-x-0 bottom-0 w-full"
        aria-hidden="true"
      >
        <path
          d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
          fill="none"
          stroke="currentColor"
          className="text-ink/15 dark:text-white/15"
          strokeWidth="2"
          strokeDasharray="1 7"
          strokeLinecap="round"
        />
        <circle cx={sunX} cy={sunY} r="13" fill="#FFC24B" opacity="0.35" />
        <circle cx={sunX} cy={sunY} r="8" fill="#FFC24B" />
      </svg>
      <div className="sky-mist absolute inset-0 pointer-events-none" aria-hidden="true" />

      <div className="relative">
        <p className="text-muted dark:text-slate-300 text-xs uppercase tracking-[0.25em] mb-2">
          {t('app.tagline')}
        </p>
        <h1 className="font-display font-bold leading-none">
          <span className="block text-7xl text-primary dark:text-primary-bright tabular-nums tracking-tight">
            {showHours ? hours : days}
          </span>
          <span className="block text-lg mt-2 text-ink dark:text-white font-semibold">
            {showHours
              ? t('dashboard.hours', { count: hours })
              : t('dashboard.day', { count: days })}
          </span>
        </h1>
        <p className="text-sm text-muted dark:text-slate-300 mt-1">
          {t('dashboard.youAreDoing')}
        </p>
        {next && (
          <p className="text-sm font-medium text-secondary dark:text-sky-hi mt-5">
            {remaining === 0
              ? t('dashboard.milestoneToday')
              : t('dashboard.nextMilestone', {
                  count: remaining,
                  label: t(`tl.${next.id}.label`),
                })}
          </p>
        )}
      </div>
    </section>
  );
}
