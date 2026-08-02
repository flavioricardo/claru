import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useUser } from '../context/UserContext';
import { sobrietyDays, localDateTimeValue } from '../utils/dateUtils';

const FOCAVEIS = 'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])';

// Fluxo de recaída (UX v1.0 §3.3): acolhimento, sem penalização.
// CVV 188 hardcoded (decisão PO — Conceito v1.2 §11c); demais recursos como links externos.
export default function SOSModal({ open, onClose }) {
  const { t } = useTranslation();
  const { user, relapses, registerRelapse } = useUser();
  const [step, setStep] = useState('menu'); // menu | when | farewell
  const [when, setWhen] = useState(localDateTimeValue());
  const [prevDays, setPrevDays] = useState(0);
  const dialogRef = useRef(null);
  const origemDoFoco = useRef(null);

  // Este é o fluxo de crise do app: quem chega aqui por teclado ou leitor de
  // tela não pode ficar preso. aria-modal="true" só é verdade se o foco
  // realmente estiver contido.
  useEffect(() => {
    if (!open) return;
    origemDoFoco.current = document.activeElement;
    const el = dialogRef.current;
    el?.querySelector(FOCAVEIS)?.focus();

    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose();
        return;
      }
      if (e.key !== 'Tab') return;
      const itens = [...(el?.querySelectorAll(FOCAVEIS) ?? [])];
      if (itens.length === 0) return;
      const primeiro = itens[0];
      const último = itens[itens.length - 1];
      if (e.shiftKey && document.activeElement === primeiro) {
        e.preventDefault();
        último.focus();
      } else if (!e.shiftKey && document.activeElement === último) {
        e.preventDefault();
        primeiro.focus();
      }
    };
    document.addEventListener('keydown', onKeyDown, true);
    return () => {
      document.removeEventListener('keydown', onKeyDown, true);
      origemDoFoco.current?.focus?.();
    };
  }, [open, onClose]);

  // Cada etapa troca o conteúdo inteiro do dialog; leva o foco junto.
  useEffect(() => {
    if (open) dialogRef.current?.querySelector(FOCAVEIS)?.focus();
  }, [step, open]);

  if (!open) return null;

  const close = () => {
    setStep('menu');
    onClose();
  };

  const confirmRestart = () => {
    const momento = new Date(when); // datetime-local é hora LOCAL
    // Dias que o usuário tinha QUANDO recaiu — não os que teria hoje.
    const diasNaÉpoca = sobrietyDays(user, relapses, momento.getTime());
    setPrevDays(diasNaÉpoca);
    registerRelapse(momento.toISOString(), diasNaÉpoca);
    setStep('farewell');
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 flex items-end sm:items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && close()}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={t('relapse.title')}
        className="w-full max-w-md rounded-card bg-white dark:bg-slate-800 p-6"
      >
        {step === 'menu' && (
          <>
            <h2 className="text-xl font-bold text-ink dark:text-white">{t('relapse.title')}</h2>
            <p className="text-muted mt-1 mb-4">{t('relapse.subtitle')}</p>
            <div className="space-y-3">
              <a
                href="tel:188"
                className="block w-full min-h-[48px] rounded-card bg-care text-white font-semibold text-center leading-[48px]"
              >
                📞 {t('relapse.cvv')}
              </a>
              <a
                href="https://cvv.org.br"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full min-h-[48px] rounded-card border border-care text-care font-semibold text-center leading-[48px]"
              >
                💬 {t('relapse.cvvChat')}
              </a>
              <button
                onClick={() => setStep('when')}
                className="w-full min-h-[48px] rounded-card border border-secondary text-secondary font-semibold"
              >
                {t('relapse.restart')}
              </button>
              <button onClick={close} className="w-full min-h-[44px] text-muted">
                {t('relapse.close')}
              </button>
            </div>
            <p className="text-xs text-muted mt-4 leading-relaxed">{t('disclaimer.sos')}</p>
          </>
        )}
        {step === 'when' && (
          <>
            <h2 className="text-xl font-bold text-ink dark:text-white mb-3" id="sos-when-title">
              {t('relapse.whenTitle')}
            </h2>
            <input
              type="datetime-local"
              aria-labelledby="sos-when-title"
              value={when}
              max={localDateTimeValue()}
              onChange={(e) => setWhen(e.target.value)}
              className="w-full min-h-[48px] rounded-card border border-divider dark:border-slate-600 dark:bg-slate-700 dark:text-white px-3 mb-4"
            />
            <button
              onClick={confirmRestart}
              className="w-full min-h-[48px] rounded-card bg-secondary text-white font-semibold"
            >
              {t('relapse.confirm')}
            </button>
            <button onClick={() => setStep('menu')} className="w-full min-h-[44px] text-muted mt-2">
              {t('onboarding.back')}
            </button>
          </>
        )}
        {step === 'farewell' && (
          <>
            <p className="text-lg text-ink dark:text-white">
              🌟 {t('relapse.farewell', { count: prevDays })}
            </p>
            <button
              onClick={close}
              className="w-full min-h-[48px] rounded-card bg-primary text-white font-semibold mt-4"
            >
              {t('dashboard.day', { count: 0 })} → 🌱
            </button>
          </>
        )}
      </div>
    </div>
  );
}
