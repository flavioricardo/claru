// AUDIT-C decide o conteúdo que o usuário vê no Dashboard (card de risco) e o
// que é enviado ao analytics — um corte errado muda a jornada de alguém.

import { describe, it, expect } from 'vitest';
import { auditCScore, auditRiskZone } from './audit';

describe('auditCScore', () => {
  it('soma as 3 respostas', () => {
    expect(auditCScore([0, 0, 0])).toBe(0);
    expect(auditCScore([4, 4, 4])).toBe(12);
    expect(auditCScore([1, 2, 3])).toBe(6);
  });
});

describe('auditRiskZone', () => {
  it('0–3 é risco baixo', () => {
    expect(auditRiskZone(0)).toBe('low');
    expect(auditRiskZone(3)).toBe('low');
  });

  it('4–7 é risco moderado', () => {
    expect(auditRiskZone(4)).toBe('moderate');
    expect(auditRiskZone(7)).toBe('moderate');
  });

  it('8+ é uso problemático', () => {
    expect(auditRiskZone(8)).toBe('problematic');
    expect(auditRiskZone(12)).toBe('problematic');
  });
});
