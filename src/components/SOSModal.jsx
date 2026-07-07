import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useUser } from '../context/UserContext';
import { useStreak } from '../hooks/useStreak';

// Fluxo de recaída (UX v1.0 §3.3): acolhimento, sem penalização.
// CVV 188 hardcoded (decisão PO — Conceito v1.2 §11c); demais recursos como links externos.
export default function SOSModal({ open, onClose }) {
  const { t } = useTranslation();
  const { registerRelapse } = useUser();
  const { diasSobriedade } = useStreak();
  const [step, setStep] = useState('menu'); // menu | when | farewell
  const [when, setWhen] = useState(new Date().toISOString().slice(0, 16));
  const [prevDays, setPrevDays] = useState(0);

  if (!open) return null;

  const close = () => {
    setStep('menu');
    onClose();
  };

  const confirmRestart = () => {
    setPrevDays(diasSobriedade);
    registerRelapse(new Date(when).toISOString(), diasSobriedade);
    setStep('farewell');
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 flex items-end sm:items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={t('relapse.title')}
    >
      <div className="w-full max-w-md rounded-card bg-white dark:bg-slate-800 p-6">
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
          </>
        )}
        {step === 'when' && (
          <>
            <h2 className="text-xl font-bold text-ink dark:text-white mb-3">
              {t('relapse.whenTitle')}
            </h2>
            <input
              type="datetime-local"
              value={when}
              max={new Date().toISOString().slice(0, 16)}
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
