import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/style.css';
import { useUser } from '../context/UserContext';
import { useStreak } from '../hooks/useStreak';
import StreakBadge from '../components/StreakBadge';
import SOSModal from '../components/SOSModal';

// FE-3 (confirmado): react-day-picker headless, tematizado com tokens Tailwind.
export default function History() {
  const { t } = useTranslation();
  const { checkIns } = useUser();
  const { streakCheckin, recordeCheckin } = useStreak();
  const [sosOpen, setSosOpen] = useState(false);

  const checkinDays = checkIns.map((c) => new Date(c.date + 'T12:00:00'));

  return (
    <main className="max-w-md mx-auto p-4 pb-24">
      <h1 className="text-2xl font-display font-bold text-ink dark:text-white py-3">{t('history.title')}</h1>

      <div className="rounded-card border border-divider dark:border-white/10 bg-white dark:bg-night-hi shadow-card p-3 mb-4 flex justify-center">
        <DayPicker
          mode="multiple"
          selected={checkinDays}
          onSelect={() => {}}
          disabled
          modifiersClassNames={{ selected: 'claru-day-checked' }}
        />
      </div>
      <p className="text-sm text-muted mb-4">
        <span className="inline-block w-3 h-3 rounded-full bg-primary mr-2 align-middle" />
        {t('history.legend')}
      </p>

      <div className="mb-4">
        <StreakBadge streak={streakCheckin} record={recordeCheckin} />
      </div>

      <button
        onClick={() => setSosOpen(true)}
        className="w-full min-h-[48px] rounded-card border border-care text-care font-semibold"
      >
        {t('history.registerRelapse')}
      </button>
      <SOSModal open={sosOpen} onClose={() => setSosOpen(false)} />
    </main>
  );
}
