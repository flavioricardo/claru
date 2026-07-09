import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { useStreak } from '../hooks/useStreak';
import { useNotifications } from '../hooks/useNotifications';
import { MILESTONES } from '../data/timeline';
import { nextMilestone, currentMilestone } from '../utils/dateUtils';
import HeroCounter from '../components/HeroCounter';
import BenefitCard from '../components/BenefitCard';
import CheckInButton from '../components/CheckInButton';
import StreakBadge from '../components/StreakBadge';
import SOSModal from '../components/SOSModal';

export default function Dashboard() {
  const { t } = useTranslation();
  const { checkInToday, hasCheckedInToday } = useUser();
  const { diasSobriedade, horasSobriedade, streakCheckin, recordeCheckin } = useStreak();
  const [sosOpen, setSosOpen] = useState(false);
  useNotifications(t('app.tagline'));

  const current = currentMilestone(diasSobriedade, MILESTONES);
  const next = nextMilestone(diasSobriedade, MILESTONES);

  return (
    <main className="max-w-md mx-auto px-4 pb-28">
      {/* Assinatura: céu que clareia + arco do sol (progresso integrado) */}
      <HeroCounter
        days={diasSobriedade}
        hours={horasSobriedade}
        next={next}
        prevDays={current?.days ?? 0}
      />

      <div className="mt-5 mb-4">
        <CheckInButton done={hasCheckedInToday()} onCheckIn={checkInToday} />
        {hasCheckedInToday() && streakCheckin > 1 && (
          <p className="text-sm text-primary dark:text-primary-bright text-center mt-2" aria-live="polite">
            {t('dashboard.checkinCelebrate', { count: streakCheckin })}
          </p>
        )}
      </div>

      <div className="grid grid-cols-[1fr_auto] gap-3 mb-4 items-stretch">
        <BenefitCard milestone={current ?? MILESTONES[0]} unlocked={!!current} />
        <StreakBadge streak={streakCheckin} record={recordeCheckin} />
      </div>

      <Link
        to="/app/timeline"
        className="block text-center min-h-[48px] leading-[48px] rounded-full border-2 border-secondary/50 text-secondary dark:text-sky-hi dark:border-sky-hi/40 font-semibold"
      >
        {t('dashboard.viewTimeline')} →
      </Link>

      {/* FAB SOS — sempre acessível, cor de cuidado (UX §4.1F) */}
      <button
        onClick={() => setSosOpen(true)}
        aria-label={t('dashboard.sos')}
        className="fixed bottom-20 right-4 z-40 w-14 h-14 rounded-full bg-care text-white shadow-fab flex items-center justify-center"
      >
        <svg viewBox="0 0 24 24" className="w-7 h-7" fill="currentColor" aria-hidden="true">
          <path d="M12 20.5s-7.5-4.7-9.3-9C1.5 8.6 3.2 5.5 6.2 5.1c1.9-.3 3.7.6 4.8 2.1a5.2 5.2 0 0 1 4.8-2.1c3 .4 4.7 3.5 3.5 6.4-1.8 4.3-9.3 9-9.3 9z" />
        </svg>
      </button>
      <SOSModal open={sosOpen} onClose={() => setSosOpen(false)} />
    </main>
  );
}
