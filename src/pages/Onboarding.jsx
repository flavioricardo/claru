import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { localDateValue } from '../utils/dateUtils';
import { auditCScore, auditRiskZone } from '../utils/audit';

// FE-1 (confirmado): slide horizontal entre telas, com fallback via
// prefers-reduced-motion (transição desativada em CSS — ver index.css).
// Fluxo de 8 telas do UX v1.0 §3.1 (as 3 últimas telas do "nível" viraram o
// AUDIT-C — mesmo instrumento OMS usado pelo Modera Brasil/Meu SUS Digital).
// Sem login (MVP client-side).
const STEPS = ['hero', 'name', 'date', 'goal', 'audit1', 'audit2', 'audit3', 'welcome'];
const PAUSA_BOAS_VINDAS = 1600;
// Cada pergunta tem 5 alternativas (0 a 4 pontos), na ordem oficial do AUDIT-C.
const AUDIT_QUESTIONS = ['audit1', 'audit2', 'audit3'];

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
  const [auditAnswers, setAuditAnswers] = useState([null, null, null]);
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
  // criar o usuário aqui apagaria a tela de boas-vindas antes de ela aparecer.
  // Mostramos as boas-vindas primeiro; o usuário só é criado quando ela já
  // foi vista.
  const finish = (score) => {
    next();
    timer.current = setTimeout(() => {
      createUser({
        name: name.trim() || 'Você',
        goal,
        auditScore: score,
        auditRiskZone: auditRiskZone(score),
        lastDrinkDate: new Date(date + 'T12:00:00').toISOString(),
        language: i18n.language,
      });
    }, PAUSA_BOAS_VINDAS);
  };

  // Responde a pergunta N do AUDIT-C (0-based); na última, soma tudo e fecha
  // o onboarding — não há tela própria de "confirmar", a resposta já avança.
  const answerAudit = (qIndex, value) => {
    const answers = auditAnswers.map((a, i) => (i === qIndex ? value : a));
    setAuditAnswers(answers);
    if (qIndex < AUDIT_QUESTIONS.length - 1) next();
    else finish(auditCScore(answers));
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

        {/* 5-7. AUDIT-C (OMS) — mesmo instrumento usado pelo Modera Brasil no
            Meu SUS Digital. 3 perguntas, uma por tela; a última já fecha o
            onboarding e calcula a zona de risco. */}
        {AUDIT_QUESTIONS.map((key, qIndex) => (
          <Slide key={key} ativo={step === 4 + qIndex} className="justify-center max-w-md mx-auto">
            <h2 className="text-2xl font-bold text-ink dark:text-white mb-1">
              {t(`onboarding.${key}Title`)}
            </h2>
            <p className="text-muted mb-4">{t(`onboarding.${key}Hint`)}</p>
            <div className="space-y-3">
              {[0, 1, 2, 3, 4].map((points) => (
                <Choice
                  key={points}
                  label={t(`onboarding.${key}Opt${points}`)}
                  selected={auditAnswers[qIndex] === points}
                  onClick={() => answerAudit(qIndex, points)}
                />
              ))}
            </div>
            <button onClick={back} className="min-h-[44px] text-muted mt-4">
              {t('onboarding.back')}
            </button>
            {qIndex === 0 && (
              <p className="text-xs text-muted mt-4">{t('onboarding.auditDisclaimer')}</p>
            )}
          </Slide>
        ))}

        {/* 8. Boas-vindas */}
        <Slide ativo={step === 7} className="items-center justify-center text-center">
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
