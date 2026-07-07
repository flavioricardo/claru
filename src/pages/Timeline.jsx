import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useStreak } from '../hooks/useStreak';
import { MILESTONES } from '../data/timeline';
import { currentMilestone } from '../utils/dateUtils';
import TimelineMarker from '../components/TimelineMarker';

// FE-2 (confirmado): rota separada full-screen em scroll vertical (React Router).
export default function Timeline() {
  const { t } = useTranslation();
  const { diasSobriedade } = useStreak();
  const current = currentMilestone(diasSobriedade, MILESTONES);

  return (
    <main className="max-w-md mx-auto p-4 pb-24">
      <header className="flex items-center gap-3 py-3">
        <Link to="/" aria-label={t('timeline.back')} className="text-secondary text-xl">←</Link>
        <h1 className="text-2xl font-display font-bold text-ink dark:text-white">{t('timeline.title')}</h1>
      </header>
      <ol className="mt-4">
        {MILESTONES.map((m) => (
          <TimelineMarker
            key={m.id}
            milestone={m}
            days={diasSobriedade}
            isCurrent={current?.id === m.id}
          />
        ))}
      </ol>
    </main>
  );
}
