import { useTranslation } from 'react-i18next';

const MODERA_BRASIL_URL = 'https://meususdigital.saude.gov.br/';

/**
 * Card de reforço para quem respondeu o AUDIT-C no onboarding com risco
 * moderado ou problemático. Não aparece para riskZone "low" — a ideia é
 * complementar o disclaimer geral do app com uma ação concreta, sem alarmar
 * quem está fora dessas duas zonas.
 */
export default function RiskZoneCard({ riskZone }) {
  const { t } = useTranslation();
  if (riskZone !== 'moderate' && riskZone !== 'problematic') return null;

  return (
    <section className="rounded-card p-4 bg-white dark:bg-night-hi shadow-card border border-care/40 mb-4">
      <h2 className="font-display font-semibold text-ink dark:text-white mb-1">
        {t(`risk.${riskZone}Title`)}
      </h2>
      <p className="text-sm text-ink/80 dark:text-slate-300 mb-3">
        {t(`risk.${riskZone}Body`)}
      </p>
      <div className="flex flex-col gap-2">
        <a
          href="tel:136"
          className="block w-full min-h-[44px] rounded-card bg-care text-white font-semibold text-center leading-[44px]"
        >
          📞 {t('risk.callSus')}
        </a>
        <a
          href={MODERA_BRASIL_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full min-h-[44px] rounded-card border border-care text-care font-semibold text-center leading-[44px]"
        >
          {t('risk.moderaBrasil')} ↗
        </a>
      </div>
    </section>
  );
}
