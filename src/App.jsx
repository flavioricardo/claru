import { BrowserRouter, Routes, Route, NavLink, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { UserProvider, useUser } from './context/UserContext';
import Onboarding from './pages/Onboarding';
import Dashboard from './pages/Dashboard';
import Timeline from './pages/Timeline';
import History from './pages/History';
import Settings from './pages/Settings';

function Nav() {
  const { t } = useTranslation();
  const items = [
    ['/', '🏠', t('nav.home')],
    ['/timeline', '📈', t('nav.timeline')],
    ['/history', '📅', t('nav.history')],
    ['/settings', '⚙️', t('nav.settings')],
  ];
  return (
    <nav className="fixed bottom-0 inset-x-0 z-30 bg-white dark:bg-slate-900 border-t border-divider dark:border-slate-700">
      <ul className="max-w-md mx-auto flex">
        {items.map(([to, icon, label]) => (
          <li key={to} className="flex-1">
            <NavLink
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center min-h-[56px] text-xs ${
                  isActive ? 'text-primary font-semibold' : 'text-muted'
                }`
              }
            >
              <span aria-hidden="true" className="text-lg">{icon}</span>
              {label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}

function Shell() {
  const { user } = useUser();
  if (!user) return <Onboarding />;
  return (
    <>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/timeline" element={<Timeline />} />
        <Route path="/history" element={<History />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Nav />
    </>
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
