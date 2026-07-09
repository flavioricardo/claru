import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { useNotifications } from '../hooks/useNotifications';
import { hasConsent, setConsent } from '../analytics/analytics';

export default function Settings() {
  const { t, i18n } = useTranslation();
  const { user, updateUser } = useUser();
  const { permission, request } = useNotifications(t('app.tagline'));
  const [name, setName] = useState(user?.name ?? '');
  const [consent, setConsentState] = useState(hasConsent());

  const toggleConsent = () => {
    const next = !consent;
    setConsent(next);
    setConsentState(next);
  };

  const changeLang = (lng) => {
    i18n.changeLanguage(lng);
    updateUser({ language: lng });
  };

  return (
    <main className="max-w-md mx-auto p-4 pb-24 space-y-6">
      <h1 className="text-2xl font-display font-bold text-ink dark:text-white py-3">{t('settings.title')}</h1>

      <section>
        <label className="block text-sm text-muted mb-1" htmlFor="name">{t('settings.name')}</label>
        <div className="flex gap-2">
          <input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="flex-1 min-h-[48px] rounded-card border border-divider dark:border-slate-600 dark:bg-slate-800 dark:text-white px-3"
          />
          <button
            onClick={() => updateUser({ name: name.trim() || user?.name })}
            className="min-h-[48px] px-4 rounded-card bg-secondary text-white font-semibold"
          >
            {t('settings.save')}
          </button>
        </div>
      </section>

      <section>
        <p className="text-sm text-muted mb-1">{t('settings.goal')}</p>
        <div className="flex gap-2">
          {['reduce', 'stop'].map((g) => (
            <button
              key={g}
              onClick={() => updateUser({ goal: g })}
              className={`flex-1 min-h-[48px] rounded-card border font-semibold ${
                user?.goal === g
                  ? 'bg-primary text-white border-primary'
                  : 'border-divider dark:border-slate-600 text-ink dark:text-white'
              }`}
            >
              {g === 'reduce' ? t('onboarding.goalReduce') : t('onboarding.goalStop')}
            </button>
          ))}
        </div>
      </section>

      <section>
        <p className="text-sm text-muted mb-1">{t('settings.language')}</p>
        <div className="flex gap-2">
          {[
            ['pt', 'Português'],
            ['en', 'English'],
          ].map(([lng, label]) => (
            <button
              key={lng}
              onClick={() => changeLang(lng)}
              className={`flex-1 min-h-[48px] rounded-card border font-semibold ${
                i18n.language === lng
                  ? 'bg-secondary text-white border-secondary'
                  : 'border-divider dark:border-slate-600 text-ink dark:text-white'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </section>

      <section className="flex items-center justify-between">
        <p className="text-ink dark:text-white">{t('settings.notifications')}</p>
        {permission === 'granted' ? (
          <span className="text-primary font-semibold">{t('settings.notifGranted')}</span>
        ) : (
          <button
            onClick={request}
            className="min-h-[44px] px-4 rounded-card border border-secondary text-secondary font-semibold"
          >
            {t('settings.notifAsk')}
          </button>
        )}
      </section>

      {/* Consentimento LGPD (D4): opt-in explícito, default DESLIGADO, reversível */}
      <section className="rounded-card border border-divider dark:border-slate-700 p-4">
        <h2 className="font-semibold text-ink dark:text-white">{t('settings.consentTitle')}</h2>
        <p className="text-sm text-muted mt-1 mb-3">{t('settings.consentBody')}</p>
        <button
          onClick={toggleConsent}
          role="switch"
          aria-checked={consent}
          className={`w-full min-h-[48px] rounded-card font-semibold ${
            consent ? 'bg-primary text-white' : 'border border-divider dark:border-slate-600 text-muted'
          }`}
        >
          {consent ? t('settings.consentOn') : t('settings.consentOff')}
        </button>
        <p className="text-xs text-muted mt-3">{t('settings.privacy')}</p>
        <Link to="/app/privacy" className="block text-sm text-secondary underline mt-2">
          {t('settings.privacyLink')}
        </Link>
      </section>
    </main>
  );
}
