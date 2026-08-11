// AUDIT-C (OMS) — versão curta de 3 perguntas do AUDIT (Alcohol Use Disorders
// Identification Test), a mesma família de instrumento usada pelo Modera
// Brasil (Meu SUS Digital, Ministério da Saúde/USP, ago/2026). Cada resposta
// vale 0–4; total 0–12.
export const AUDIT_C_MAX_SCORE = 12;

export function auditCScore(answers) {
  return answers.reduce((total, v) => total + v, 0);
}

/**
 * Zonas de risco aproximadas a partir dos cortes clínicos de referência do
 * AUDIT-C (Bush et al., 1998: ≥4 já indica consumo de risco). Uso apenas
 * como auto-triagem no Claru — não é diagnóstico nem substitui avaliação
 * clínica (ver disclaimer.short / onboarding.auditDisclaimer).
 */
export function auditRiskZone(score) {
  if (score <= 3) return 'low';
  if (score <= 7) return 'moderate';
  return 'problematic';
}
