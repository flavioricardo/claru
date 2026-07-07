import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';

// FE-1 (confirmado): slide horizontal entre telas, com fallback via
// prefers-reduced-motion (transição desativada em CSS — ver index.css).
// Fluxo de 6 telas do UX v1.0 §3.1. Sem login (MVP client-side).
const STEPS = ['hero', 'name', 'date', 'goal', 'level', 'welcome'];

export default function Onboarding() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { createUser } = useUser();
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [goal, setGoal] = useState(null);

  const next = () => setStep((s) => Math.min(s + 1, STEPS.length - 1));
  const back = () => setStep((s) => Math.max(s - 1, 0));

  const finish = (drinkingLevel) => {
    createUser({
      name: name.trim() || 'Você',
      goal,
      drinkingLevel,
      lastDrinkDate: new Date(date + 'T12:00:00').toISOString(),
      language: i18n.language,
    });
    next();
    setTimeout(() => navigate('/'), 1600);
  };

  const Choice = ({ label, onClick, selected }) => (
    <button
      onClick={onClick}
      className={`w-full min-h-[52px] rounded-card border font-semibold ${
        selected
          ? 'bg-primary text-white border-primary'
          : 'border-divider dark:border-slate-600 text-ink dark:text-white hover:border-primary'
      }`}
    >
      {label}
    </button>
  );

  return (
    <main className="min-h-dvh overflow-hidden bg-white dark:bg-slate-900">
      <div
        className="flex w-full onboarding-track"
        style={{ transform: `translateX(-${step * 100}%)` }}
      >
        {/* 1. Hero */}
        <section className="w-full shrink-0 min-h-dvh flex flex-col items-center justify-center p-6 text-center">
          <h1 className="text-5xl font-bold text-primary">{t('app.name')}</h1>
          <p className="text-xl text-muted mt-3 mb-10">{t('app.tagline')}</p>
          <button
            onClick={next}
            className="w-full max-w-xs min-h-[52px] rounded-card bg-primary text-white font-semibold"
          >
            {t('onboarding.start')}
          </button>
        </section>

        {/* 2. Nome */}
        <section className="w-full shrink-0 min-h-dvh flex flex-col justify-center p-6 max-w-md mx-auto">
          <h2 className="text-2xl font-bold text-ink dark:text-white mb-4">
            {t('onboarding.nameTitle')}
          </h2>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t('onboarding.namePlaceholder')}
            className="w-full min-h-[52px] rounded-card border border-divider dark:border-slate-600 dark:bg-slate-800 dark:text-white px-4 mb-4"
            autoFocus={step === 1}
          />
          <button
            onClick={next}
            disabled={!name.trim()}
            className="w-full min-h-[52px] rounded-card bg-primary text-white font-semibold disabled:opacity-40"
          >
            {t('onboarding.next')}
          </button>
          <button onClick={back} className="min-h-[44px] text-muted mt-2">
            {t('onboarding.back')}
          </button>
        </section>

        {/* 3. Momento zero */}
        <section className="w-full shrink-0 min-h-dvh flex flex-col justify-center p-6 max-w-md mx-auto">
          <h2 className="text-2xl font-bold text-ink dark:text-white mb-4">
            {t('onboarding.dateTitle')}
          </h2>
          <input
            type="date"
            value={date}
            max={new Date().toISOString().slice(0, 10)}
            onChange={(e) => setDate(e.target.value)}
            className="w-full min-h-[52px] rounded-card border border-divider dark:border-slate-600 dark:bg-slate-800 dark:text-white px-4 mb-4"
          />
          <button
            onClick={next}
            className="w-full min-h-[52px] rounded-card bg-primary text-white font-semibold"
          >
            {t('onboarding.next')}
          </button>
          <button onClick={back} className="min-h-[44px] text-muted mt-2">
            {t('onboarding.back')}
          </button>
        </section>

        {/* 4. Objetivo */}
        <section className="w-full shrink-0 min-h-dvh flex flex-col justify-center p-6 max-w-md mx-auto">
          <h2 className="text-2xl font-bold text-ink dark:text-white mb-4">
            {t('onboarding.goalTitle')}
          </h2>
          <div className="space-y-3">
            <Choice
              label={t('onboarding.goalReduce')}
              selected={goal === 'reduce'}
              onClick={() => { setGoal('reduce'); next(); }}
            />
            <Choice
              label={t('onboarding.goalStop')}
              selected={goal === 'stop'}
              onClick={() => { setGoal('stop'); next(); }}
            />
          </div>
          <button onClick={back} className="min-h-[44px] text-muted mt-4">
            {t('onboarding.back')}
          </button>
        </section>

        {/* 5. Nível anterior (opcional) */}
        <section className="w-full shrink-0 min-h-dvh flex flex-col justify-center p-6 max-w-md mx-auto">
          <h2 className="text-2xl font-bold text-ink dark:text-white mb-1">
            {t('onboarding.levelTitle')}
          </h2>
          <p className="text-muted mb-4">{t('onboarding.levelHint')}</p>
          <div className="space-y-3">
            <Choice label={t('onboarding.levelLight')} onClick={() => finish('light')} />
            <Choice label={t('onboarding.levelModerate')} onClick={() => finish('moderate')} />
            <Choice label={t('onboarding.levelHeavy')} onClick={() => finish('heavy')} />
            <Choice label={t('onboarding.levelSkip')} onClick={() => finish('prefer_not')} />
          </div>
          <button onClick={back} className="min-h-[44px] text-muted mt-4">
            {t('onboarding.back')}
          </button>
        </section>

        {/* 6. Boas-vindas */}
        <section className="w-full shrink-0 min-h-dvh flex flex-col items-center justify-center p-6 text-center">
          <p className="text-4xl mb-3" aria-hidden="true">🌱</p>
          <h2 className="text-2xl font-bold text-ink dark:text-white">
            {t('onboarding.welcome', { name: name.trim() || '' })}
          </h2>
          <p className="text-muted mt-2">{t('onboarding.day1')}</p>
        </section>
      </div>
    </main>
  );
}
