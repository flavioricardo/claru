import { BrowserRouter, Routes, Route, NavLink, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { UserProvider, useUser } from './context/UserContext';
import Onboarding from './pages/Onboarding';
import Dashboard from './pages/Dashboard';
import Timeline from './pages/Timeline';
import History from './pages/History';
import Settings from './pages/Settings';
import Privacy from './pages/Privacy';
import Landing from './pages/Landing';
import { initAnalytics } from './analytics/analytics';

initAnalytics(); // inerte sem consentimento + chave (G3)

function Icon({ name }) {
  // Ícones lineares próprios (substituem emojis genéricos na nav)
  const paths = {
    home: <path d="M3 11.5 12 4l9 7.5M5.5 10.5V20h13v-9.5" />,
    timeline: <path d="M3 17c3-1 4.5-6 7-6s4 4 7 3 4-6 4-6M3 21h18" />,
    history: <path d="M4 6h16v14H4zM4 10h16M8 4v4M16 4v4" />,
    settings: (
      <>
        <circle cx="12" cy="12" r="3.2" />
        <path d="M12 2.8v2.6M12 18.6v2.6M2.8 12h2.6M18.6 12h2.6M5.4 5.4l1.9 1.9M16.7 16.7l1.9 1.9M18.6 5.4l-1.9 1.9M7.3 16.7l-1.9 1.9" />
      </>
    ),
  };
  return (
    <svg
      viewBox="0 0 24 24"
      className="w-6 h-6"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
}

function Nav() {
  const { t } = useTranslation();
  const items = [
    ['/app', 'home', t('nav.home')],
    ['/app/timeline', 'timeline', t('nav.timeline')],
    ['/app/history', 'history', t('nav.history')],
    ['/app/settings', 'settings', t('nav.settings')],
  ];
  return (
    <nav className="fixed bottom-0 inset-x-0 z-30 bg-white/90 dark:bg-night-hi/90 backdrop-blur border-t border-divider dark:border-white/10">
      <ul className="max-w-md mx-auto flex">
        {items.map(([to, icon, label]) => (
          <li key={to} className="flex-1">
            <NavLink
              to={to}
              end={to === '/app'}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center gap-0.5 min-h-[58px] text-[11px] ${
                  isActive
                    ? 'text-primary dark:text-primary-bright font-semibold'
                    : 'text-muted dark:text-slate-400'
                }`
              }
            >
              <Icon name={icon} />
              {label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}

function AppRoutes() {
  const { user } = useUser();
  // Dentro de /app: onboarding se novo, dashboard se já iniciado
  if (!user)
    return (
      <Routes>
        <Route path="privacy" element={<Privacy />} />
        <Route path="*" element={<Onboarding />} />
      </Routes>
    );
  return (
    <>
      <Routes>
        <Route path="" element={<Dashboard />} />
        <Route path="timeline" element={<Timeline />} />
        <Route path="history" element={<History />} />
        <Route path="privacy" element={<Privacy />} />
        <Route path="settings" element={<Settings />} />
        <Route path="*" element={<Navigate to="/app" replace />} />
      </Routes>
      <Nav />
    </>
  );
}

function Shell() {
  return (
    <Routes>
      {/* Raiz = landing page */}
      <Route path="/" element={<Landing />} />
      {/* Rota /privacy acessível sem app (link no footer da landing) */}
      <Route path="/app/privacy" element={<Privacy />} />
      {/* Tudo dentro de /app */}
      <Route path="/app/*" element={<AppRoutes />} />
      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <UserProvider>
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <Shell />
      </BrowserRouter>
    </UserProvider>
  );
}
