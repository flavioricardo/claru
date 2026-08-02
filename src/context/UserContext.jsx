import { createContext, useContext, useMemo } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { uuidv4, nowISO, todayISO } from '../utils/dateUtils';
import { track } from '../analytics/analytics';

// Shape do UserContext espelha o schema User do BE (DevBE v1.1 §5.1) — BE-6 CONFIRMADO.
// userId reservado para auth v1.1 (magic link + JWT — D1).
// Persistência 100% client-side no MVP (Conceito v1.2 §11c).

const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [user, setUser] = useLocalStorage('claru.user', null);
  const [checkIns, setCheckIns] = useLocalStorage('claru.checkIns', []);
  const [relapses, setRelapses] = useLocalStorage('claru.relapses', []);

  const api = useMemo(
    () => ({
      user,
      checkIns,
      relapses,

      createUser({ name, goal, drinkingLevel, lastDrinkDate, language }) {
        const u = {
          id: uuidv4(), // UUID v4 — BE-5 CONFIRMADO
          userId: null, // reservado p/ auth v1.1
          name,
          goal, // "reduce" | "stop"
          drinkingLevel, // "light" | "moderate" | "heavy" | "prefer_not"
          language,
          createdAt: nowISO(), // ISO 8601 em todos os campos
          lastDrinkDate,
        };
        setUser(u);
        track('onboarding_completed', { goal, drinkingLevel });
        return u;
      },

      updateUser(patch) {
        setUser((prev) => ({ ...prev, ...patch }));
      },

      // Check-in incrementa APENAS o streak de engajamento —
      // NÃO incrementa dias de sobriedade (Orquestração §6 / UX §3.2 corrigido).
      checkInToday() {
        const date = todayISO();
        // O track() fica FORA do updater: React pode reexecutar um updater
        // (StrictMode), e evento de analytics não é idempotente.
        if (checkIns.some((c) => c.date === date)) return;
        setCheckIns((prev) =>
          prev.some((c) => c.date === date)
            ? prev
            : [...prev, { id: uuidv4(), userId: user?.id ?? null, date, createdAt: nowISO() }]
        );
        track('checkin', { date });
      },

      hasCheckedInToday() {
        return checkIns.some((c) => c.date === todayISO());
      },

      // Recaída: histórico invisível ao usuário, retido para analytics
      // (Conceito v1.2 §11c). Nenhum dado é apagado.
      // A sobriedade recomeça QUANDO a recaída aconteceu, não quando o usuário
      // teve coragem de registrar. Quem recaiu anteontem e registra hoje já tem
      // dois dias — o contador precisa refletir isso, senão o passo "Quando foi?"
      // é decorativo.
      registerRelapse(relapseDateISO, previousStreakDays) {
        const rec = {
          id: uuidv4(),
          userId: user?.id ?? null,
          relapseDate: relapseDateISO,
          previousStreakDays,
          newStartDate: relapseDateISO,
          createdAt: nowISO(),
        };
        setRelapses((prev) => [...prev, rec]);
        track('relapse_logged', { previousStreakDays });
        return rec;
      },
    }),
    [user, checkIns, relapses, setUser, setCheckIns, setRelapses]
  );

  return <UserContext.Provider value={api}>{children}</UserContext.Provider>;
}

export const useUser = () => useContext(UserContext);
