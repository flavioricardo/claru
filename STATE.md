# STATE.md — Claru

> Fonte canônica de verdade do projeto. Ler no início de toda sessão. Histórico de chat NÃO é estado.

## O que é

**Claru — "Cada dia mais claro".** App web mobile-first para redução e cessação do consumo de álcool. MVP v1.0.

## Stack

- **Front:** React 19 + Vite. Tailwind CSS 3. `react-router-dom` v7. `react-i18next` (PT/EN). `react-day-picker` para calendário.
- **Dados:** 100% client-side — `localStorage` (sem backend). Schema `User`/`CheckIn`/`Relapse`, UUID v4, datas em ISO 8601 (migração futura para IndexedDB/PostgreSQL já prevista sem refactor).
- **Analytics:** PostHog, atrás de consentimento explícito (toggle em Ajustes, default **desligado**). Camada `track()` minimiza PII automaticamente. `VITE_POSTHOG_KEY` configurada em `.env.production` (versionada — chave `phc_` é pública/client-side por design do PostHog).
- **Testes:** Vitest (`npm test`). Cobre a lógica sensível: contador de sobriedade, reset por recaída, streak de check-in e o gate de consentimento do analytics.
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
| Idioma escolhível na landing (não só em Ajustes) — persiste em `localStorage` e segue pro app | `pages/Landing.jsx` (`LangToggle`), `i18n/index.js` |

## Preparado para v1.1 (sem refactor previsto)

- `userId` já reservado no schema (para auth magic link + JWT)
- `localStorage` abstraído em hook próprio (facilita migração p/ IndexedDB)
- Datas 100% ISO 8601 (migração limpa p/ PostgreSQL)

## Deploy — routing SPA no GitHub Pages

Corrigido em 2026-07-09: 404.html redirect + restore no `index.html` (padrão spa-github-pages v2), incluindo fix de barra dupla `/claru//app`.

**Procedimento (manual, hoje):** merge na `main` → `npm run build` → publicar o conteúdo de `dist/` na branch `gh-pages`. O `404.html` vem de `public/`, então o build já o inclui. Não existe CI de deploy: `docs-ci/deploy-workflow.yml.example` é só exemplo, não está instalado em `.github/workflows/`. **Merge na `main` sozinho NÃO atualiza o site.**

## Pendências

1. **Deploy não é automático** — a `main` pode ficar à frente do que está no ar sem ninguém perceber. Instalar `docs-ci/deploy-workflow.yml.example` em `.github/workflows/` exige trocar a origem do Pages para "GitHub Actions" em https://github.com/flavioricardo/claru/settings/pages (ou adaptar o workflow pra continuar publicando na branch `gh-pages`) | Bloqueia: confiança de que produção reflete a `main` | Aberto desde: 2026-07-30

### Resolvidas

- [x] ~~**Revogar o fine-grained PAT do GitHub**~~ — encerrada em 2026-07-30 por decisão do dono do repo: todos os tokens estão próximos da data de expiração. Aberta em 2026-07-28. Nota para quem reler: expiração próxima não é revogação — o token segue válido e utilizável até a data. Reabrir se ele aparecer em arquivo versionado, log de CI ou issue.
- [x] ~~**PostHog não configurado em produção**~~ — resolvido em 2026-07-30: `VITE_POSTHOG_KEY` está em `.env.production` (versionada) e verificada dentro do bundle publicado em `gh-pages`. Aberta em 2026-07-28. Nota: eventos só fluem quando o usuário liga o consentimento (default desligado) — ausência de eventos não é regressão de config.
- [x] ~~**Sem testes automatizados**~~ — resolvido em 2026-07-30: Vitest + 35 testes em `src/utils/dateUtils.test.js` e `src/analytics/analytics.test.js`, validados por mutação (quebrar o reset por recaída derruba 3 testes; remover o `delete safe.name` derruba 1). Aberta em 2026-07-28.
