import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

// G2 — Política de privacidade (rascunho; revisão jurídica humana requerida — D4/G5).
// Acessível ANTES do onboarding (consentimento informado precede o uso).
export default function Privacy() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const S = ({ k }) => (
    <section className="mb-5">
      <h2 className="font-display font-semibold text-ink dark:text-white mb-1">{t(`privacy.${k}t`)}</h2>
      <p className="text-sm text-ink/80 dark:text-slate-300 leading-relaxed">{t(`privacy.${k}b`)}</p>
    </section>
  );
  return (
    <main className="max-w-md mx-auto px-4 pb-24">
      <header className="flex items-center gap-3 py-4">
        <button onClick={() => navigate(-1)} aria-label={t('privacy.back')} className="text-secondary text-xl">←</button>
        <h1 className="text-2xl font-display font-bold text-ink dark:text-white">{t('privacy.title')}</h1>
      </header>
      <p className="text-xs text-muted mb-5">{t('privacy.updated')}</p>
      <S k="s1" /><S k="s2" /><S k="s3" /><S k="s4" />
    </main>
  );
}
