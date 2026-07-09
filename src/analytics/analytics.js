// D2 + D4 (PO): analytics client-side (PostHog) SOMENTE atrás de consentimento
// explícito. Eventos pseudonimizados, sem PII. LGPD Art. 11 — dado sensível.
// G3: carregamento REAL do PostHog, dinâmico (fora do bundle inicial) e
// condicionado a: consentimento ligado E chave configurada (VITE_POSTHOG_KEY).
const CONSENT_KEY = 'claru.analyticsConsent';
let ph = null;
let loading = null;

export const hasConsent = () => localStorage.getItem(CONSENT_KEY) === 'true';

export function setConsent(v) {
  localStorage.setItem(CONSENT_KEY, String(v));
  if (v) initAnalytics();
  else if (ph) { ph.opt_out_capturing(); ph = null; }
}

export function initAnalytics() {
  const key = import.meta.env.VITE_POSTHOG_KEY;
  if (!key || !hasConsent() || ph || loading) return;
  loading = import('posthog-js').then(({ default: posthog }) => {
    posthog.init(key, {
      api_host: import.meta.env.VITE_POSTHOG_HOST || 'https://us.i.posthog.com',
      autocapture: false,        // minimização: só eventos explícitos
      capture_pageview: true,
      disable_session_recording: true, // dado de saúde sensível: nunca gravar sessão
      persistence: 'localStorage',
    });
    ph = posthog;
    loading = null;
  }).catch(() => { loading = null; });
}

export function track(event, props = {}) {
  if (!hasConsent()) return;
  const safe = { ...props };
  delete safe.name; // minimização: nunca enviar PII
  if (ph) ph.capture(event, safe);
  else if (import.meta.env.DEV) console.debug('[analytics:consented]', event, safe);
}
