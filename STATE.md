# STATE.md — Claru

> Fonte canônica de verdade do projeto. Ler no início de toda sessão. Histórico de chat NÃO é estado.

## O que é

**Claru — "Cada dia mais claro".** App web mobile-first para redução e cessação do consumo de álcool. MVP v1.0.

## Stack

- **Front:** React 19 + Vite. Tailwind CSS 3. `react-router-dom` v7. `react-i18next` (PT/EN). `react-day-picker` para calendário.
- **Dados:** 100% client-side — `localStorage` (sem backend). Schema `User`/`CheckIn`/`Relapse`, UUID v4, datas em ISO 8601 (migração futura para IndexedDB/PostgreSQL já prevista sem refactor).
- **Analytics:** PostHog, atrás de consentimento explícito (toggle em Ajustes, default **desligado**). Camada `track()` minimiza PII automaticamente. Precisa de `VITE_POSTHOG_KEY` em produção pra ativar.
- **Deploy:** GitHub Pages, branch `gh-pages` — **live:** https://flavioricardo.github.io/claru/
- **Repo:** https://github.com/flavioricardo/claru (público, branch main)

## Decisões de produto/arquitetura (rastreadas no README)

| Decisão | Onde no código |
|---|---|
| 100% client-side, localStorage | `hooks/useLocalStorage.js`, `context/UserContext.jsx` |
| Sobriedade contada AUTOMATICAMENTE por data (≠ streak de check-in) | `hooks/useStreak.js`, `utils/dateUtils.js` |
| Recaída: histórico invisível ao usuário, retido só p/ analytics | `SOSModal.jsx` + `registerRelapse()` |
| CVV 188 hardcoded + links externos de ajuda | `components/SOSModal.jsx` |
| Notificação fixa às 09h | `hooks/useNotifications.js` |
| Onboarding slide horizontal, respeita `prefers-reduced-motion` | `pages/Onboarding.jsx` |
| Timeline em rota separada full-screen, 100% estática | `pages/Timeline.jsx`, `data/timeline.js` |
| Tokens visuais (paleta, Inter, 8px grid, WCAG AA) | `tailwind.config.js`, `index.css` |

## Preparado para v1.1 (sem refactor previsto)

- `userId` já reservado no schema (para auth magic link + JWT)
- `localStorage` abstraído em hook próprio (facilita migração p/ IndexedDB)
- Datas 100% ISO 8601 (migração limpa p/ PostgreSQL)

## Deploy — routing SPA no GitHub Pages

Corrigido em 2026-07-09: 404.html redirect + restore no `index.html` (padrão spa-github-pages v2), incluindo fix de barra dupla `/claru//app`.

## Pendências

1. **Revogar o fine-grained PAT do GitHub** usado nesta sessão (STATE.md criado via chat) — https://github.com/settings/tokens | Bloqueia: segurança da conta | Aberto desde: 2026-07-28
2. **PostHog não está configurado em produção** — falta `VITE_POSTHOG_KEY`; sem isso, zero analytics mesmo com consentimento do usuário — Vercel/GH Pages env vars | Bloqueia: visibilidade de uso real | Aberto desde: 2026-07-28
3. **Sem testes automatizados** — nenhum arquivo de teste no repo; risco em lógica sensível (streak, recaída, notificação) | Bloqueia: confiança em mudanças futuras | Aberto desde: 2026-07-28
