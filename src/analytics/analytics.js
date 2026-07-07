// Decisão D2 + D4 (PO): analytics client-side (PostHog) SOMENTE atrás de
// consentimento explícito. Eventos pseudonimizados, sem PII (nome/e-mail nunca
// entram em eventos). LGPD Art. 11 — dado sensível.
const CONSENT_KEY = 'claru.analyticsConsent';

export const hasConsent = () => localStorage.getItem(CONSENT_KEY) === 'true';
export const setConsent = (v) => localStorage.setItem(CONSENT_KEY, String(v));

// Integração PostHog é plugável: injetar VITE_POSTHOG_KEY no build.
// Sem chave ou sem consentimento, nenhum dado sai do dispositivo.
export function track(event, props = {}) {
  if (!hasConsent()) return;
  const safe = { ...props };
  delete safe.name; // minimização: nunca enviar PII
  if (import.meta.env.VITE_POSTHOG_KEY && window.posthog) {
    window.posthog.capture(event, safe);
  } else if (import.meta.env.DEV) {
    console.debug('[analytics:consented]', event, safe);
  }
}
