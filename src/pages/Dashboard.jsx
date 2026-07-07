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
import ProgressBar from '../components/ProgressBar';
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
    <main className="max-w-md mx-auto p-4 pb-28">
      <HeroCounter days={diasSobriedade} hours={horasSobriedade} />

      {next && (
        <div className="mb-4">
          <ProgressBar days={diasSobriedade} next={next} prevDays={current?.days ?? 0} />
        </div>
      )}

      <div className="mb-4">
        <CheckInButton done={hasCheckedInToday()} onCheckIn={checkInToday} />
        {hasCheckedInToday() && streakCheckin > 1 && (
          <p className="text-sm text-primary text-center mt-2" aria-live="polite">
            {t('dashboard.checkinCelebrate', { count: streakCheckin })}
          </p>
        )}
      </div>

      <div className="grid grid-cols-[1fr_auto] gap-3 mb-4 items-stretch">
        <BenefitCard milestone={current ?? MILESTONES[0]} unlocked={!!current} />
        <StreakBadge streak={streakCheckin} record={recordeCheckin} />
      </div>

      <Link
        to="/timeline"
        className="block text-center min-h-[48px] leading-[48px] rounded-card border border-secondary text-secondary font-semibold"
      >
        {t('dashboard.viewTimeline')} →
      </Link>

      {/* FAB SOS — sempre acessível, cor de cuidado (UX §4.1F) */}
      <button
        onClick={() => setSosOpen(true)}
        aria-label={t('dashboard.sos')}
        className="fixed bottom-20 right-4 z-40 w-14 h-14 rounded-full bg-care text-white text-2xl shadow-lg"
      >
        ❤️
      </button>
      <SOSModal open={sosOpen} onClose={() => setSosOpen(false)} />
    </main>
  );
}
