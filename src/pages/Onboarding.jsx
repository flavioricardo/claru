import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { localDateValue } from '../utils/dateUtils';

// FE-1 (confirmado): slide horizontal entre telas, com fallback via
// prefers-reduced-motion (transição desativada em CSS — ver index.css).
// Fluxo de 6 telas do UX v1.0 §3.1. Sem login (MVP client-side).
const STEPS = ['hero', 'name', 'date', 'goal', 'level', 'welcome'];
const PAUSA_BOAS_VINDAS = 1600;

function Choice({ label, onClick, selected }) {
  return (
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
}

/**
 * As 6 telas coexistem no DOM e deslizam por transform. Sem `inert`, as telas
 * fora de quadro continuam tabuláveis e legíveis por leitor de tela — o usuário
 * de teclado cai em campos invisíveis e o SR lê as 6 telas como uma só.
 */
function Slide({ ativo, children, className = '' }) {
  return (
    <section
      inert={!ativo}
      aria-hidden={!ativo}
      className={`w-full shrink-0 min-h-dvh flex flex-col p-6 ${className}`}
    >
      {children}
    </section>
  );
}

export default function Onboarding() {
  const { t, i18n } = useTranslation();
  const { createUser } = useUser();
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [date, setDate] = useState(localDateValue());
  const [goal, setGoal] = useState(null);
  const nomeRef = useRef(null);
  const timer = useRef(null);

  const next = () => setStep((s) => Math.min(s + 1, STEPS.length - 1));
  const back = () => setStep((s) => Math.max(s - 1, 0));

  // autoFocus só age na montagem, e todas as telas montam no passo 0 — por isso
  // o foco precisa ser movido quando a tela do nome entra em quadro.
  useEffect(() => {
    if (step === 1) nomeRef.current?.focus({ preventScroll: true });
  }, [step]);

  useEffect(() => () => clearTimeout(timer.current), []);

  // createUser troca a rota para o Dashboard no mesmo ciclo de render, então
  // criar o usuário aqui apagaria a tela 6 antes de ela aparecer. Mostramos as
  // boas-vindas primeiro; o usuário só é criado quando ela já foi vista.
  const finish = (drinkingLevel) => {
    next();
    timer.current = setTimeout(() => {
      createUser({
        name: name.trim() || 'Você',
        goal,
        drinkingLevel,
        lastDrinkDate: new Date(date + 'T12:00:00').toISOString(),
        language: i18n.language,
      });
    }, PAUSA_BOAS_VINDAS);
  };

  return (
    <main className="min-h-dvh overflow-hidden bg-sky-lo dark:bg-night-lo">
      <div
        className="flex w-full onboarding-track"
        style={{ transform: `translateX(-${step * 100}%)` }}
      >
        {/* 1. Hero */}
        <Slide ativo={step === 0} className="items-center justify-center text-center sky-panel">
          <h1 className="text-6xl font-display font-bold text-primary dark:text-primary-bright tracking-tight">{t('app.name')}</h1>
          <p className="text-xl text-muted mt-3 mb-10">{t('app.tagline')}</p>
          <button
            onClick={next}
            className="w-full max-w-xs min-h-[52px] rounded-card bg-primary text-white font-semibold"
          >
            {t('onboarding.start')}
          </button>
          <p className="text-xs text-muted mt-8 max-w-xs">{t('disclaimer.short')}</p>
          <Link to="/app/privacy" className="text-xs text-secondary underline mt-2">
            {t('disclaimer.link')}
          </Link>
        </Slide>

        {/* 2. Nome */}
        <Slide ativo={step === 1} className="justify-center max-w-md mx-auto">
          <h2 className="text-2xl font-bold text-ink dark:text-white mb-4">
            <label htmlFor="onb-name">{t('onboarding.nameTitle')}</label>
          </h2>
          <input
            id="onb-name"
            ref={nomeRef}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t('onboarding.namePlaceholder')}
            className="w-full min-h-[52px] rounded-card border border-divider dark:border-slate-600 dark:bg-slate-800 dark:text-white px-4 mb-4"
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
        </Slide>

        {/* 3. Momento zero */}
        <Slide ativo={step === 2} className="justify-center max-w-md mx-auto">
          <h2 className="text-2xl font-bold text-ink dark:text-white mb-4">
            <label htmlFor="onb-date">{t('onboarding.dateTitle')}</label>
          </h2>
          <input
            id="onb-date"
            type="date"
            value={date}
            max={localDateValue()}
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
        </Slide>

        {/* 4. Objetivo */}
        <Slide ativo={step === 3} className="justify-center max-w-md mx-auto">
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
        </Slide>

        {/* 5. Nível anterior (opcional) */}
        <Slide ativo={step === 4} className="justify-center max-w-md mx-auto">
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
        </Slide>

        {/* 6. Boas-vindas */}
        <Slide ativo={step === 5} className="items-center justify-center text-center">
          <p className="text-4xl mb-3" aria-hidden="true">🌱</p>
          <h2 className="text-2xl font-bold text-ink dark:text-white">
            {t('onboarding.welcome', { name: name.trim() || '' })}
          </h2>
          <p className="text-muted mt-2">{t('onboarding.day1')}</p>
        </Slide>
      </div>
    </main>
  );
}
