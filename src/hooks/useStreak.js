import { useUser } from '../context/UserContext';
import {
  sobrietyDays,
  sobrietyHours,
  checkinStreak,
  bestCheckinStreak,
} from '../utils/dateUtils';

/**
 * Duas métricas SEPARADAS (Orquestração v1.0 §6 / Conceito v1.3 §11d.2):
 * - diasSobriedade: AUTOMÁTICO por data (não depende de abrir o app)
 * - streakCheckin: engajamento — dias consecutivos de confirmação ativa
 */
export function useStreak() {
  const { user, checkIns, relapses } = useUser();
  return {
    diasSobriedade: sobrietyDays(user, relapses),
    horasSobriedade: sobrietyHours(user, relapses),
    streakCheckin: checkinStreak(checkIns),
    recordeCheckin: bestCheckinStreak(checkIns),
  };
}
