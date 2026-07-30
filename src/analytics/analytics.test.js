// LGPD Art. 11 — consumo de álcool é dado sensível de saúde. Duas garantias que
// não podem regredir em silêncio: (1) nada sai sem consentimento explícito;
// (2) o nome do usuário nunca vai junto do evento.

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { hasConsent, setConsent, track } from './analytics';

const CONSENT_KEY = 'claru.analyticsConsent';

function memoryStorage() {
  const store = new Map();
  return {
    getItem: (k) => (store.has(k) ? store.get(k) : null),
    setItem: (k, v) => store.set(k, String(v)),
    removeItem: (k) => store.delete(k),
    clear: () => store.clear(),
  };
}

beforeEach(() => {
  vi.stubGlobal('localStorage', memoryStorage());
  vi.spyOn(console, 'debug').mockImplementation(() => {});
});
afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe('consentimento', () => {
  it('default é desligado — ausência de chave não é consentimento', () => {
    expect(hasConsent()).toBe(false);
  });

  it('só a string "true" liga o consentimento', () => {
    localStorage.setItem(CONSENT_KEY, 'false');
    expect(hasConsent()).toBe(false);
    localStorage.setItem(CONSENT_KEY, '1');
    expect(hasConsent()).toBe(false);
    localStorage.setItem(CONSENT_KEY, 'true');
    expect(hasConsent()).toBe(true);
  });

  it('setConsent persiste os dois estados', () => {
    setConsent(true);
    expect(hasConsent()).toBe(true);
    setConsent(false);
    expect(hasConsent()).toBe(false);
  });
});

describe('track', () => {
  it('não emite nada sem consentimento', () => {
    track('check_in', { goal: 'stop' });
    expect(console.debug).not.toHaveBeenCalled();
  });

  it('emite quando há consentimento', () => {
    setConsent(true);
    track('check_in', { goal: 'stop' });
    expect(console.debug).toHaveBeenCalled();
  });

  it('remove o nome do usuário antes de enviar (minimização de PII)', () => {
    setConsent(true);
    track('check_in', { name: 'Flávio', goal: 'stop', dias: 12 });
    const props = console.debug.mock.calls[0][2];
    expect(props).not.toHaveProperty('name');
    expect(props).toEqual({ goal: 'stop', dias: 12 });
  });

  it('não muta o objeto de props do chamador', () => {
    setConsent(true);
    const props = { name: 'Flávio', goal: 'stop' };
    track('check_in', props);
    expect(props.name).toBe('Flávio');
  });

  it('funciona sem props', () => {
    setConsent(true);
    expect(() => track('app_open')).not.toThrow();
  });
});
