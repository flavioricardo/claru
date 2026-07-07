import { useState, useEffect } from 'react';

// MVP: notificação diária fixa às 09h (Conceito v1.2 §11c).
// Personalização de horário entra na v1.1.
// Limitação conhecida: agendamento com app fechado exige Web Push (VAPID)
// via servidor — entra na v1.1 (DevBE v1.1 §4). No MVP agendamos com o app aberto.
export function useNotifications(message) {
  const [permission, setPermission] = useState(
    typeof Notification !== 'undefined' ? Notification.permission : 'denied'
  );

  const request = async () => {
    if (typeof Notification === 'undefined') return;
    const p = await Notification.requestPermission();
    setPermission(p);
  };

  useEffect(() => {
    if (permission !== 'granted' || typeof Notification === 'undefined') return;
    const now = new Date();
    const next = new Date(now);
    next.setHours(9, 0, 0, 0); // fixo 09h (MVP)
    if (next <= now) next.setDate(next.getDate() + 1);
    const timer = setTimeout(() => {
      try {
        new Notification('Claru', { body: message });
      } catch (e) {
        console.debug('notification failed', e);
      }
    }, next - now);
    return () => clearTimeout(timer);
  }, [permission, message]);

  return { permission, request };
}
