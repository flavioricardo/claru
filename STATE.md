# STATE.md — Claru

> Fonte canônica de verdade do projeto. Ler no início de toda sessão. Histórico de chat NÃO é estado.

## O que é

**Claru — "Cada dia mais claro".** App web mobile-first para redução e cessação do consumo de álcool. MVP v1.0.

## Stack

- **Front:** React 19 + Vite. Tailwind CSS 3. `react-router-dom` v7. `react-i18next` (PT/EN). `react-day-picker` para calendário.
- **Dados:** 100% client-side — `localStorage` (sem backend). Schema `User`/`CheckIn`/`Relapse`, UUID v4, datas em ISO 8601 (migração futura para IndexedDB/PostgreSQL já prevista sem refactor).
- **Analytics:** PostHog, atrás de consentimento explícito (toggle em Ajustes, default **desligado**). Camada `track()` minimiza PII automaticamente. `VITE_POSTHOG_KEY` configurada em `.env.production` (versionada — chave `phc_` é pública/client-side por design do PostHog).
- **Testes:** Vitest (`npm test`). Cobre a lógica sensível: contador de sobriedade, reset por recaída, streak de check-in e o gate de consentimento do analytics.
- **Deploy:** automático via `.github/workflows/deploy.yml` — todo push na `main` builda, testa e publica na branch `gh-pages`. **live:** https://flavioricardo.github.io/claru/
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
| Inputs `date`/`datetime-local` usam hora LOCAL (`localDateValue`/`localDateTimeValue`) — `toISOString()` joga o campo pro futuro a oeste de Greenwich | `utils/dateUtils.js` |
| Recaída reinicia a sobriedade na data INFORMADA, não na do registro | `context/UserContext.jsx` (`registerRelapse`) |
| Telas do onboarding fora de quadro ficam `inert` — sem isso o teclado tabula para campos invisíveis | `pages/Onboarding.jsx` (`Slide`) |
| Rotas do app carregam sob demanda; só a landing vai no bundle inicial | `App.jsx` (`lazy`/`Suspense`) |

## Preparado para v1.1 (sem refactor previsto)

- `userId` já reservado no schema (para auth magic link + JWT)
- `localStorage` abstraído em hook próprio (facilita migração p/ IndexedDB)
- Datas 100% ISO 8601 (migração limpa p/ PostgreSQL)

## Deploy — routing SPA no GitHub Pages

Corrigido em 2026-07-09: 404.html redirect + restore no `index.html` (padrão spa-github-pages v2), incluindo fix de barra dupla `/claru//app`.

**Automatizado desde 2026-08-02:** `.github/workflows/deploy.yml` roda em todo push na `main` — `npm test` → `npm run build` → publica `dist/` na branch `gh-pages` via `peaceiris/actions-gh-pages`. Deliberadamente NÃO usa `actions/deploy-pages` (que exigiria trocar a origem do Pages para "GitHub Actions" nas configurações do repo); publica direto na `gh-pages`, a mesma branch que o Pages já serve, então não houve nenhuma mudança de configuração no GitHub. Merge na `main` agora atualiza o site sozinho — não precisa mais de build/publish manual.

## QA — auditoria de 2026-08-01

Auditoria de bugs, fluxo, usabilidade, acessibilidade, performance e segurança (Chromium 390×844, fuso America/Sao_Paulo, axe-core WCAG 2.1 A/AA). Corrigidos: tela 6/6 do onboarding que nunca aparecia; links `/privacy` e "voltar" da Timeline que expulsavam o usuário do app; fuso UTC em `date`/`datetime-local` (campo abria 3h no futuro); recaída que ignorava a data informada; plurais com `count=1`; modal SOS sem foco/Escape/trap; slides do onboarding tabuláveis fora de quadro; contraste abaixo de AA nos marcos bloqueados.

Resultado: **0 violações axe** nas 7 telas + modal (antes: 14 de contraste + 1 crítica de label). Bundle inicial 125 kB → **101 kB gzip** com code splitting.

**Decisão consciente:** `npm audit` aponta GHSA-qwww-vcr4-c8h2 (high) em react-router 7.18.1. É CSRF em **modo RSC com server actions**; este app é SPA client-side sem servidor, então não é explorável. O range do advisory é `>=7.12.0 <8.3.0` — 7.18.2 continua afetado, e só um major (8.3.0+) sairia dele. Não vale o risco agora; reavaliar quando houver outro motivo para subir de major.

## Pendências

Nenhuma no momento.

### Resolvidas

- [x] ~~**Deploy não é automático**~~ — resolvido em 2026-08-02: `.github/workflows/deploy.yml` publica a `main` na `gh-pages` a cada push, sem exigir troca de configuração no Pages (ver seção "Deploy — routing SPA" acima). Aberta em 2026-07-30. `docs-ci/deploy-workflow.yml.example` foi removido — o workflow real está instalado.
- [x] ~~**Revogar o fine-grained PAT do GitHub**~~ — encerrada em 2026-07-30 por decisão do dono do repo: todos os tokens estão próximos da data de expiração. Aberta em 2026-07-28. Nota para quem reler: expiração próxima não é revogação — o token segue válido e utilizável até a data. Reabrir se ele aparecer em arquivo versionado, log de CI ou issue.
- [x] ~~**PostHog não configurado em produção**~~ — resolvido em 2026-07-30: `VITE_POSTHOG_KEY` está em `.env.production` (versionada) e verificada dentro do bundle publicado em `gh-pages`. Aberta em 2026-07-28. Nota: eventos só fluem quando o usuário liga o consentimento (default desligado) — ausência de eventos não é regressão de config.
- [x] ~~**Sem testes automatizados**~~ — resolvido em 2026-07-30: Vitest + 35 testes em `src/utils/dateUtils.test.js` e `src/analytics/analytics.test.js`, validados por mutação (quebrar o reset por recaída derruba 3 testes; remover o `delete safe.name` derruba 1). Aberta em 2026-07-28.
