/**
 * Landing page do Claru
 *
 * Design plan (frontend-design skill):
 * - Subject: app de saúde comportamental para redução de álcool; audiência brasileira,
 *   mobile-first, provavelmente em momento de reflexão ou vulnerabilidade.
 * - Job da página: uma única decisão — clicar "Começar". Tudo o mais é ruído.
 * - Paleta: sky-lo/sky-hi do app (continuidade), primary #0A7C55, ink #16323C.
 * - Tipografia: Sora (display, esparsa, peso variável) + Inter (corpo).
 * - Assinatura (risco estético): o hero É a timeline científica — os dados reais
 *   do corpo humano como argumento de venda, não um mockup ou screenshot.
 *   Scroll-reveal revela cada marco com a névoa que se dissipa (--clarity cresce).
 * - Restraint: um único acento verde, zero carrossel, zero ícone stock, zero CTA duplo.
 * - Critique: evitei (a) fundo creme + serif + terracota; (b) near-black + acid-green;
 *   (c) broadsheet colunar. A grid é de linha única centrada — serve a audiência mobile.
 */

import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

/* ─── dados científicos inline (mesmos do app — não duplicar fonte da verdade) ─── */
const SCIENCE = [
  { hours: 24,  icon: '💧', labelPt: '24 horas', labelEn: '24 hours',
    pt: 'O álcool sai do sangue. O fígado volta a regular o açúcar. Você começa a se reidratar.',
    en: 'Alcohol leaves your blood. Your liver regulates blood sugar again. Hydration starts.' },
  { hours: 168, icon: '😴', labelPt: '1 semana', labelEn: '1 week',
    pt: 'O ciclo REM volta. Menos dores de cabeça. Mais foco.',
    en: 'REM sleep returns. Fewer headaches. Sharper focus.' },
  { hours: 336, icon: '🧘', labelPt: '2 semanas', labelEn: '2 weeks',
    pt: 'Ácido estomacal normaliza. Refluxo diminui. Concentração melhora visivelmente.',
    en: 'Stomach acid normalizes. Reflux eases. Concentration improves noticeably.' },
  { hours: 720, icon: '🌿', labelPt: '1 mês', labelEn: '1 month',
    pt: 'Pressão arterial cai — efeito comparável a medicamentos. Bem-estar mental melhora.',
    en: 'Blood pressure drops — on par with medication. Mental wellbeing improves.' },
  { hours: 8760, icon: '🌟', labelPt: '1 ano', labelEn: '1 year',
    pt: 'Risco de câncer relacionado ao álcool cai até 9%. Órgãos se recuperam significativamente.',
    en: 'Alcohol-related cancer risk drops up to 9%. Organs recover significantly.' },
];

/* ─── hook: observar visibilidade (scroll-reveal sem lib) ─── */
function useVisible(threshold = 0.25) {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, vis];
}

/* ─── Componente: item da timeline científica ─── */
function ScienceCard({ item, index, lang }) {
  const [ref, vis] = useVisible(0.2);
  const label = lang === 'pt' ? item.labelPt : item.labelEn;
  const body  = lang === 'pt' ? item.pt      : item.en;
  return (
    <li
      ref={ref}
      className="relative pl-10 pb-10 last:pb-0"
      style={{
        opacity: vis ? 1 : 0,
        transform: vis ? 'none' : 'translateY(24px)',
        transition: `opacity 0.55s ease ${index * 0.1}s, transform 0.55s ease ${index * 0.1}s`,
      }}
    >
      {/* linha vertical */}
      <span
        aria-hidden="true"
        className="absolute left-[11px] top-6 bottom-0 w-px"
        style={{ background: 'linear-gradient(to bottom, #0A7C55 0%, #CBE7F6 100%)' }}
      />
      {/* ponto */}
      <span
        aria-hidden="true"
        className="absolute left-0 top-1 w-6 h-6 rounded-full bg-white border-2 border-primary flex items-center justify-center text-sm"
        style={{ boxShadow: '0 0 0 3px #0A7C5515' }}
      >
        {item.icon}
      </span>
      <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-1">{label}</p>
      <p className="text-base text-ink dark:text-slate-200 leading-relaxed">{body}</p>
    </li>
  );
}

/* ─── Componente: feature pill ─── */
function Pill({ icon, text }) {
  return (
    <div className="flex items-center gap-2 bg-white/70 dark:bg-white/5 border border-divider dark:border-white/10 rounded-full px-4 py-2 text-sm text-ink dark:text-slate-200 backdrop-blur-sm">
      <span aria-hidden="true">{icon}</span>
      {text}
    </div>
  );
}

/* ─── Componente: seção de confiança ─── */
function TrustRow({ icon, title, body }) {
  const [ref, vis] = useVisible(0.2);
  return (
    <div
      ref={ref}
      className="flex gap-4 items-start"
      style={{
        opacity: vis ? 1 : 0,
        transform: vis ? 'none' : 'translateY(16px)',
        transition: 'opacity 0.5s ease, transform 0.5s ease',
      }}
    >
      <span
        aria-hidden="true"
        className="shrink-0 w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center text-lg"
      >
        {icon}
      </span>
      <div>
        <p className="font-display font-semibold text-ink dark:text-white">{title}</p>
        <p className="text-sm text-muted dark:text-slate-400 mt-0.5 leading-relaxed">{body}</p>
      </div>
    </div>
  );
}

/* ─── Landing page principal ─── */
export default function Landing() {
  const { i18n } = useTranslation();
  const lang = i18n.language?.startsWith('pt') ? 'pt' : 'en';
  const isPt = lang === 'pt';

  /* Clareza do hero: cresce levemente enquanto o usuário lê (só estética) */
  const [clarity, setClarity] = useState(0.15);
  useEffect(() => {
    const t = setTimeout(() => setClarity(0.45), 300);
    return () => clearTimeout(t);
  }, []);

  const copy = {
    eyebrow:    isPt ? 'Gratuito · Privado · Baseado em ciência' : 'Free · Private · Science-based',
    headline:   isPt ? 'Cada dia\nmais claro.'                   : 'Clearer\nevery day.',
    sub:        isPt
      ? 'O Claru mostra, em tempo real, o que muda dentro do seu corpo ao reduzir ou parar de beber.'
      : 'Claru shows you, in real time, what changes inside your body as you reduce or quit drinking.',
    cta:        isPt ? 'Começar gratuitamente' : 'Start for free',
    sciTitle:   isPt ? 'O que acontece no seu corpo'  : 'What happens in your body',
    sciSub:     isPt ? 'Linha do tempo de recuperação baseada em pesquisas científicas revisadas.'
                     : 'Recovery timeline based on peer-reviewed research.',
    trustTitle: isPt ? 'Construído para confiar'      : 'Built to trust',
    privTitle:  isPt ? 'Seus dados ficam com você'    : 'Your data stays with you',
    privBody:   isPt ? 'Tudo no seu dispositivo. Sem servidor, sem nuvem, sem cadastro obrigatório.'
                     : 'Everything on your device. No server, no cloud, no mandatory sign-up.',
    sciTrust:   isPt ? 'Baseado em ciência real'      : 'Real science only',
    sciBody:    isPt ? 'Cada benefício exibido é referenciado a estudos científicos revisados.'
                     : 'Every benefit shown references peer-reviewed scientific studies.',
    freeTitle:  isPt ? '100% gratuito, para sempre'   : '100% free, always',
    freeBody:   isPt ? 'Os recursos que importam — contador, timeline, suporte — nunca entrarão atrás de paywall.'
                     : 'The features that matter — counter, timeline, support — will never go behind a paywall.',
    disclaimer: isPt
      ? 'O Claru é uma ferramenta de apoio motivacional e não substitui tratamento médico ou psicológico. Em casos de dependência severa, consulte um profissional antes de parar.'
      : 'Claru is a motivational support tool and does not replace medical or psychological care. In severe dependence, consult a professional before quitting.',
    privLink:   isPt ? 'Política de privacidade' : 'Privacy policy',
    betaBadge:  isPt ? 'Beta público' : 'Public beta',
  };

  return (
    <div className="min-h-dvh bg-sky-lo dark:bg-night-lo font-sans">

      {/* ── NAV ─────────────────────────────────────────── */}
      <nav className="max-w-2xl mx-auto px-5 py-4 flex items-center justify-between">
        <span className="font-display font-bold text-xl text-primary tracking-tight">Claru</span>
        <div className="flex items-center gap-3">
          <span className="text-xs border border-primary/30 text-primary rounded-full px-2 py-0.5 font-medium">
            {copy.betaBadge}
          </span>
          <Link
            to="/app"
            className="text-sm font-semibold text-ink dark:text-white hover:text-primary transition-colors"
          >
            {isPt ? 'Entrar' : 'Open app'}
          </Link>
        </div>
      </nav>

      {/* ── HERO ─────────────────────────────────────────── */}
      {/* Assinatura: painel-céu com névoa, mesma linguagem do app */}
      <header
        className="sky-panel relative overflow-hidden"
        style={{ '--clarity': clarity }}
      >
        <div className="sky-mist absolute inset-0 pointer-events-none" aria-hidden="true" />

        {/* Arco SVG idêntico ao do HeroCounter — consistência visual landing↔app */}
        <svg
          viewBox="0 0 360 90"
          className="absolute inset-x-0 bottom-0 w-full opacity-30"
          aria-hidden="true"
          preserveAspectRatio="none"
        >
          <path
            d="M 52 88 A 128 128 0 0 1 308 88"
            fill="none"
            stroke="#0A7C55"
            strokeWidth="1.5"
            strokeDasharray="2 8"
            strokeLinecap="round"
          />
        </svg>

        <div className="relative max-w-2xl mx-auto px-5 pt-16 pb-20 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary mb-5">
            {copy.eyebrow}
          </p>

          {/* Headline: Sora variável, whitespace pre-line para quebra intencional */}
          <h1
            className="font-display font-bold text-ink dark:text-white leading-[1.05] tracking-tight"
            style={{ fontSize: 'clamp(3rem, 12vw, 5.5rem)', whiteSpace: 'pre-line' }}
          >
            {copy.headline}
          </h1>

          <p className="mt-5 text-base text-muted dark:text-slate-300 max-w-sm mx-auto leading-relaxed">
            {copy.sub}
          </p>

          <Link
            to="/app"
            className="inline-block mt-8 px-8 py-4 rounded-full bg-primary text-white font-display font-semibold text-base leading-none hover:bg-primary/90 active:scale-[0.98] transition-all"
            style={{ boxShadow: '0 4px 24px rgba(10,124,85,0.30)' }}
          >
            {copy.cta} →
          </Link>

          {/* Pills: 3 atributos sem verbosidade */}
          <div className="mt-8 flex flex-wrap justify-center gap-2">
            <Pill icon="🔒" text={isPt ? 'Sem cadastro'     : 'No sign-up'}       />
            <Pill icon="🧪" text={isPt ? 'Ciência real'     : 'Real science'}      />
            <Pill icon="❤️" text={isPt ? 'Zero julgamentos' : 'No judgment'}       />
          </div>
        </div>
      </header>

      {/* ── TIMELINE CIENTÍFICA (ASSINATURA) ─────────────── */}
      <section className="max-w-2xl mx-auto px-5 py-20">
        <div className="mb-12 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-2">
            {copy.sciTitle}
          </p>
          <p className="text-sm text-muted dark:text-slate-400 max-w-xs mx-auto">
            {copy.sciSub}
          </p>
        </div>

        <ol className="max-w-md mx-auto" aria-label={copy.sciTitle}>
          {SCIENCE.map((item, i) => (
            <ScienceCard key={item.hours} item={item} index={i} lang={lang} />
          ))}
        </ol>

        <div className="mt-14 text-center">
          <Link
            to="/app"
            className="inline-block px-8 py-4 rounded-full bg-primary text-white font-display font-semibold text-base leading-none hover:bg-primary/90 transition-all"
            style={{ boxShadow: '0 4px 24px rgba(10,124,85,0.25)' }}
          >
            {copy.cta} →
          </Link>
        </div>
      </section>

      {/* ── TRUST ────────────────────────────────────────── */}
      <section className="max-w-2xl mx-auto px-5 pb-20">
        {/* Linha separadora */}
        <div className="border-t border-divider dark:border-white/10 mb-12" />

        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-8 text-center">
          {copy.trustTitle}
        </p>

        <div className="space-y-8 max-w-md mx-auto">
          <TrustRow icon="🔒" title={copy.privTitle} body={copy.privBody} />
          <TrustRow icon="🧪" title={copy.sciTrust}  body={copy.sciBody}  />
          <TrustRow icon="🌱" title={copy.freeTitle}  body={copy.freeBody} />
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────── */}
      <footer className="border-t border-divider dark:border-white/10 max-w-2xl mx-auto px-5 py-10">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted dark:text-slate-500">
          <div className="flex items-center gap-4">
            <span className="font-display font-bold text-primary">Claru</span>
            <span>© 2026</span>
            <Link to="/app/privacy" className="underline hover:text-primary">
              {copy.privLink}
            </Link>
            <a
              href="https://github.com/flavioricardo/claru"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-primary"
            >
              GitHub
            </a>
          </div>
          <a href="tel:188" className="text-care font-semibold">
            CVV 188
          </a>
        </div>
        <p className="text-xs text-muted dark:text-slate-500 mt-4 leading-relaxed max-w-xl">
          {copy.disclaimer}
        </p>
      </footer>
    </div>
  );
}
