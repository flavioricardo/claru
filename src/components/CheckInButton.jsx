import { useState } from 'react';
import { useTranslation } from 'react-i18next';

// CTA primária — incrementa streak de ENGAJAMENTO, não dias de sobriedade.
export default function CheckInButton({ done, onCheckIn }) {
  const { t } = useTranslation();
  const [pulse, setPulse] = useState(false);
  const handle = () => {
    if (done) return;
    onCheckIn();
    setPulse(true);
    setTimeout(() => setPulse(false), 900);
  };
  return (
    <button
      onClick={handle}
      disabled={done}
      className={`w-full min-h-[54px] rounded-full font-display font-semibold text-white shadow-card transition-transform
        ${done ? 'bg-primary/50 cursor-default' : 'bg-primary hover:bg-primary/90 active:scale-[0.98]'}
        ${pulse ? 'motion-safe:animate-pulse' : ''}`}
    >
      {done ? t('dashboard.checkinDone') : `✅ ${t('dashboard.checkin')}`}
    </button>
  );
}
