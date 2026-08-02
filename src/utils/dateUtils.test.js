// Lógica sensível do produto: o contador de sobriedade é o número que o usuário
// olha todo dia, e a recaída precisa zerá-lo pela DATA — nunca por check-in.
// Datas fixadas com fake timers: sem isso o teste passa hoje e quebra amanhã.

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  sobrietyStart,
  sobrietyDays,
  sobrietyHours,
  checkinStreak,
  bestCheckinStreak,
  nextMilestone,
  currentMilestone,
  uuidv4,
  todayISO,
  localDateValue,
  localDateTimeValue,
} from './dateUtils';

const NOW = '2026-07-30T12:00:00.000Z';

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date(NOW));
});
afterEach(() => vi.useRealTimers());

describe('sobrietyStart', () => {
  it('usa lastDrinkDate quando não há recaída', () => {
    const start = sobrietyStart({ lastDrinkDate: '2026-07-20T12:00:00.000Z' }, []);
    expect(start.toISOString()).toBe('2026-07-20T12:00:00.000Z');
  });

  it('a recaída mais recente vence o lastDrinkDate', () => {
    const start = sobrietyStart(
      { lastDrinkDate: '2026-07-20T12:00:00.000Z' },
      [
        { newStartDate: '2026-07-24T12:00:00.000Z' },
        { newStartDate: '2026-07-28T12:00:00.000Z' },
      ]
    );
    expect(start.toISOString()).toBe('2026-07-28T12:00:00.000Z');
  });

  it('ignora recaída anterior ao último gole', () => {
    const start = sobrietyStart(
      { lastDrinkDate: '2026-07-25T12:00:00.000Z' },
      [{ newStartDate: '2026-07-10T12:00:00.000Z' }]
    );
    expect(start.toISOString()).toBe('2026-07-25T12:00:00.000Z');
  });

  it('sem nenhuma data, começa agora (contador zerado, não negativo)', () => {
    expect(sobrietyStart(undefined, []).toISOString()).toBe(NOW);
  });
});

describe('sobrietyDays', () => {
  it('conta dias inteiros desde o último gole', () => {
    expect(sobrietyDays({ lastDrinkDate: '2026-07-20T12:00:00.000Z' })).toBe(10);
  });

  it('recaída zera a contagem para a nova data de início', () => {
    const user = { lastDrinkDate: '2026-07-01T12:00:00.000Z' };
    expect(sobrietyDays(user, [{ newStartDate: '2026-07-28T12:00:00.000Z' }])).toBe(2);
  });

  it('arredonda para baixo — 23h ainda é dia 0', () => {
    expect(sobrietyDays({ lastDrinkDate: '2026-07-29T13:00:00.000Z' })).toBe(0);
  });

  it('nunca retorna negativo com data no futuro', () => {
    expect(sobrietyDays({ lastDrinkDate: '2026-08-15T12:00:00.000Z' })).toBe(0);
  });
});

describe('sobrietyHours', () => {
  it('conta horas inteiras desde o início', () => {
    expect(sobrietyHours({ lastDrinkDate: '2026-07-30T00:00:00.000Z' })).toBe(12);
  });

  it('nunca retorna negativo', () => {
    expect(sobrietyHours({ lastDrinkDate: '2026-08-01T12:00:00.000Z' })).toBe(0);
  });
});

describe('checkinStreak', () => {
  it('conta dias consecutivos incluindo hoje', () => {
    const checkIns = [
      { date: '2026-07-30' },
      { date: '2026-07-29' },
      { date: '2026-07-28' },
    ];
    expect(checkinStreak(checkIns)).toBe(3);
  });

  it('mantém a streak viva quando hoje ainda não houve check-in', () => {
    expect(checkinStreak([{ date: '2026-07-29' }, { date: '2026-07-28' }])).toBe(2);
  });

  it('quebra a streak no primeiro dia vazio', () => {
    expect(checkinStreak([{ date: '2026-07-30' }, { date: '2026-07-28' }])).toBe(1);
  });

  it('zera quando o último check-in é antigo demais', () => {
    expect(checkinStreak([{ date: '2026-07-25' }])).toBe(0);
  });

  it('ignora check-ins duplicados no mesmo dia', () => {
    expect(checkinStreak([{ date: '2026-07-30' }, { date: '2026-07-30' }])).toBe(1);
  });

  it('lista vazia é 0', () => {
    expect(checkinStreak([])).toBe(0);
    expect(checkinStreak()).toBe(0);
  });
});

describe('bestCheckinStreak', () => {
  it('acha a maior sequência, não a atual', () => {
    const checkIns = [
      { date: '2026-07-01' },
      { date: '2026-07-02' },
      { date: '2026-07-03' },
      { date: '2026-07-10' },
    ].map((c) => c);
    expect(bestCheckinStreak(checkIns)).toBe(3);
  });

  it('não depende da ordem de entrada', () => {
    const checkIns = [
      { date: '2026-07-03' },
      { date: '2026-07-01' },
      { date: '2026-07-02' },
    ];
    expect(bestCheckinStreak(checkIns)).toBe(3);
  });

  it('dias isolados valem 1', () => {
    expect(bestCheckinStreak([{ date: '2026-07-01' }, { date: '2026-07-20' }])).toBe(1);
  });

  it('lista vazia é 0', () => {
    expect(bestCheckinStreak([])).toBe(0);
  });
});

describe('marcos da timeline', () => {
  const milestones = [{ days: 1 }, { days: 7 }, { days: 30 }];

  it('nextMilestone pega o próximo ainda não alcançado', () => {
    expect(nextMilestone(5, milestones)).toEqual({ days: 7 });
  });

  it('nextMilestone é null depois do último marco', () => {
    expect(nextMilestone(365, milestones)).toBeNull();
  });

  it('currentMilestone pega o último já alcançado', () => {
    expect(currentMilestone(5, milestones)).toEqual({ days: 1 });
  });

  it('marco exato do dia já conta como alcançado', () => {
    expect(currentMilestone(7, milestones)).toEqual({ days: 7 });
  });

  it('currentMilestone é null antes do primeiro marco', () => {
    expect(currentMilestone(0, milestones)).toBeNull();
  });
});

describe('valores para inputs date / datetime-local', () => {
  // Regressão: usar toISOString() nesses campos jogava o valor pro dia seguinte
  // à noite em qualquer fuso a oeste de Greenwich, e o `max` passava a aceitar
  // uma data futura. Os inputs falam hora LOCAL.
  it('localDateValue segue o calendário local, não o UTC', () => {
    // 21h em São Paulo (UTC-3) já é o dia seguinte em UTC
    const noite = new Date('2026-08-02T00:30:00.000Z'); // = 01/08 21:30 em UTC-3
    expect(noite.toISOString().slice(0, 10)).toBe('2026-08-02'); // o jeito antigo
    const esperado = `${noite.getFullYear()}-${String(noite.getMonth() + 1).padStart(2, '0')}-${String(noite.getDate()).padStart(2, '0')}`;
    expect(localDateValue(noite)).toBe(esperado);
  });

  it('localDateTimeValue casa com a hora do relógio do usuário', () => {
    const d = new Date('2026-08-02T00:30:00.000Z');
    expect(localDateTimeValue(d)).toBe(
      `${localDateValue(d)}T${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
    );
  });

  it('o valor default nunca está no futuro (serve de max do input)', () => {
    const agora = new Date(NOW);
    expect(new Date(localDateTimeValue(agora)).getTime()).toBeLessThanOrEqual(agora.getTime() + 60000);
  });

  it('formatos com zero à esquerda', () => {
    const d = new Date(2026, 0, 5, 7, 3); // 05/01/2026 07:03 local
    expect(localDateValue(d)).toBe('2026-01-05');
    expect(localDateTimeValue(d)).toBe('2026-01-05T07:03');
  });
});

describe('sobriedade medida num instante passado (recaída retroativa)', () => {
  // Regressão: quem recaiu anteontem e registra hoje já tem 2 dias de volta —
  // e os dias "perdidos" na despedida são os que tinha na época, não hoje.
  const user = { lastDrinkDate: '2026-07-20T12:00:00.000Z' };

  it('sem `at`, mede até agora', () => {
    expect(sobrietyDays(user)).toBe(10);
  });

  it('com `at`, mede até o instante informado', () => {
    const recaida = new Date('2026-07-27T12:00:00.000Z').getTime();
    expect(sobrietyDays(user, [], recaida)).toBe(7);
  });

  it('recomeço a partir da recaída informada rende os dias já cumpridos desde ela', () => {
    const relapses = [{ newStartDate: '2026-07-28T12:00:00.000Z' }];
    expect(sobrietyDays(user, relapses)).toBe(2);
  });

  it('sobrietyHours também aceita instante', () => {
    expect(sobrietyHours(user, [], new Date('2026-07-20T18:00:00.000Z').getTime())).toBe(6);
  });
});

describe('formatos do schema (handshake FE<->BE)', () => {
  it('todayISO devolve YYYY-MM-DD', () => {
    expect(todayISO()).toBe('2026-07-30');
  });

  it('uuidv4 devolve UUID v4 válido', () => {
    expect(uuidv4()).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    );
  });
});
