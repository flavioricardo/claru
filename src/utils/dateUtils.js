// Todas as datas em ISO 8601 (handshake FE<->BE — DevBE v1.1 §7)

export const nowISO = () => new Date().toISOString();
export const todayISO = () => new Date().toISOString().slice(0, 10); // YYYY-MM-DD

/**
 * Valores para <input type="date"> e <input type="datetime-local">.
 * Esses inputs falam HORA LOCAL — usar toISOString() (UTC) joga o campo pro
 * futuro em qualquer fuso a oeste de Greenwich: às 21h em São Paulo (UTC-3),
 * toISOString() já virou o dia. Daí um `max` que aceita data futura.
 */
const pad = (n) => String(n).padStart(2, '0');

export function localDateValue(d = new Date()) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function localDateTimeValue(d = new Date()) {
  return `${localDateValue(d)}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function uuidv4() {
  if (crypto?.randomUUID) return crypto.randomUUID();
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
}

/**
 * Dias de sobriedade (Hero Counter) — AUTOMÁTICO por data.
 * hoje − max(lastDrinkDate, newStartDate mais recente). Não depende de abrir o app.
 * (Conceito v1.3 §11d.2 / Orquestração v1.0 §6 / DevBE v1.1 §5.4)
 */
export function sobrietyStart(user, relapses = []) {
  const dates = [user?.lastDrinkDate, ...relapses.map((r) => r.newStartDate)]
    .filter(Boolean)
    .map((d) => new Date(d).getTime());
  return dates.length ? new Date(Math.max(...dates)) : new Date();
}

// `at` permite medir a sobriedade num instante passado — usado ao registrar uma
// recaída retroativa, pra saber quantos dias o usuário realmente tinha na época.
export function sobrietyDays(user, relapses = [], at = Date.now()) {
  const start = sobrietyStart(user, relapses);
  const ms = at - start.getTime();
  return Math.max(0, Math.floor(ms / 86400000));
}

export function sobrietyHours(user, relapses = [], at = Date.now()) {
  const start = sobrietyStart(user, relapses);
  return Math.max(0, Math.floor((at - start.getTime()) / 3600000));
}

/**
 * Streak de check-in (engajamento) — dias consecutivos com registro CheckIn,
 * contando para trás a partir de hoje (ou ontem, se hoje ainda não houve check-in).
 */
export function checkinStreak(checkIns = []) {
  const days = new Set(checkIns.map((c) => c.date));
  if (days.size === 0) return 0;
  let cursor = new Date();
  if (!days.has(cursor.toISOString().slice(0, 10))) cursor.setDate(cursor.getDate() - 1);
  let streak = 0;
  while (days.has(cursor.toISOString().slice(0, 10))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

export function bestCheckinStreak(checkIns = []) {
  const sorted = [...new Set(checkIns.map((c) => c.date))].sort();
  let best = 0;
  let run = 0;
  let prev = null;
  for (const d of sorted) {
    if (prev) {
      const diff = (new Date(d) - new Date(prev)) / 86400000;
      run = diff === 1 ? run + 1 : 1;
    } else run = 1;
    best = Math.max(best, run);
    prev = d;
  }
  return best;
}

/** Próximo marco da timeline a partir dos dias atuais */
export function nextMilestone(days, milestones) {
  return milestones.find((m) => m.days > days) || null;
}
export function currentMilestone(days, milestones) {
  const unlocked = milestones.filter((m) => m.days <= days);
  return unlocked.length ? unlocked[unlocked.length - 1] : null;
}
