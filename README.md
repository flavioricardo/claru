# Claru — MVP v1.0

**Cada dia mais claro.** App web responsivo (mobile-first) para redução e cessação do consumo de álcool.

**Live:** https://flavioricardo.github.io/claru/

## Stack
React 19 + Vite · Tailwind CSS · react-i18next (PT/EN) · react-router · react-day-picker

## Rodar
```bash
npm install
npm run dev      # desenvolvimento
npm run build    # produção (dist/ — hospedagem estática, decisão D3)
npm run preview  # testar o build
npm test         # Vitest — lógica de sobriedade, streak e consentimento
npm run lint     # oxlint
```

## Decisões implementadas (rastreabilidade)
| Decisão | Fonte | Onde no código |
|---|---|---|
| 100% client-side, localStorage | Conceito v1.2 §11c | `hooks/useLocalStorage.js`, `context/UserContext.jsx` |
| Schema User/CheckIn/Relapse, UUID v4, ISO 8601 | DevBE v1.1 §5 (BE-5/6) | `context/UserContext.jsx`, `utils/dateUtils.js` |
| Sobriedade AUTOMÁTICA por data ≠ streak de check-in | Orquestração §6 | `hooks/useStreak.js`, `utils/dateUtils.js` |
| Recaída: histórico invisível, retido p/ analytics | Conceito v1.2 §11c | `SOSModal.jsx` + `registerRelapse()` |
| CVV 188 hardcoded + links externos | Conceito v1.2 §11c | `components/SOSModal.jsx` |
| Notificação fixa 09h | Conceito v1.2 §11c | `hooks/useNotifications.js` |
| Onboarding slide horizontal + prefers-reduced-motion | FE-1 | `pages/Onboarding.jsx`, `index.css` |
| Timeline como rota separada full-screen | FE-2 | `pages/Timeline.jsx` |
| Calendário react-day-picker + tokens Tailwind | FE-3 | `pages/History.jsx`, `index.css` |
| Timeline 100% estática (D5) | Orquestração §5 | `data/timeline.js` + chaves `tl.*` no i18n |
| PostHog atrás de consentimento explícito (D2/D4) | Orquestração §5 | `analytics/analytics.js`, toggle em `Settings.jsx` |
| Tokens visuais do UX (paleta, Inter, 8px grid, WCAG AA) | UX v1.0 §6–7 | `tailwind.config.js`, `index.css` |

## Analytics (LGPD)
Nenhum dado sai do dispositivo sem consentimento (toggle em Ajustes, default **desligado**).
PostHog já está ativo em produção via `VITE_POSTHOG_KEY` em `.env.production` (a chave `phc_` é pública/client-side por design — só permite enviar eventos, não ler). A camada `track()` minimiza PII automaticamente: remove `name` antes de qualquer envio, e nada é enviado sem consentimento. Ambas as garantias são cobertas por teste em `src/analytics/analytics.test.js`.

## Preparado para v1.1 (sem refactor)
- `userId` reservado no schema do usuário (auth magic link + JWT — D1)
- localStorage abstraído em hook (migração p/ IndexedDB)
- Datas 100% ISO 8601 (migração limpa p/ PostgreSQL)

## Estado do projeto

Estado atual e pendências: [STATE.md](./STATE.md)
