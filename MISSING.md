# Pendientes antes de entregar

Checklist contra `ai/challenge.md`. Marcar con `x` lo resuelto.

## Entregables obligatorios

- [ ] **`DECISIONS.md`** — el archivo existe pero está **vacío**. Contenido esperado: por qué App Router/Server Components/Server Actions, por qué Route Handlers proxificando a WireMock, separación UI/lógica, por qué estado local + server state en vez de Context/Zustand, `"use cache"` + `updateTag`, edge cases, qué harías diferente con más tiempo.
- [ ] **`AI_USAGE.md`** — el archivo existe como **`AI_USSAGE.md`** (typo: doble S) y está **vacío**. Renombrar (`git mv AI_USSAGE.md AI_USAGE.md`) y llenar: herramientas usadas y en qué partes, qué se aceptó directo vs corregido/rechazado, decisiones tuyas vs de la IA.
- [x] **Horas reales invertidas** — `README.md` §9: 8 horas.

## Gaps del spec

- [x] **Estado de error en Home** — `app/home/error.tsx` creado; `getUser` lanza en respuesta no-ok → la boundary lo atrapa. Verificado con `docker compose stop wiremock`.
- [x] **Reintentar en error de red** — retry aparece en `408` (Timeout de red) y `500` (Error en red); oculto en `201` (éxito), `400` (fondos insuficientes) y `520` (error desconocido — no es error de red). Test actualizado.
- [x] **"API router con datos mockeados"** — `app/api/` restaurado: Route Handlers (`/api/users`, `/api/user/[id]`, `/api/user/[id]/movements`, `/api/saved-contacts`) proxifican a WireMock vía `lib/mock-api.ts`; `proxy.ts` excluye `/api` del session guard. Documentar la decisión en `DECISIONS.md`.
- [x] **Test del hook `useContacts`** — `useContacts.test.ts` completo.

## Docs desactualizadas

- [ ] **`README.md` §3 env table** — `USERS_API_BASE_URL` default ahora es `http://localhost:3000/api` (era `:8080`); falta fila `MOCK_API_URL` (default `http://localhost:8080`, `http://wiremock:8080` en compose).
- [ ] **`README.md` §2.x arquitectura** — el diagrama y §2.3 no muestran la capa `app/api/` (Route Handlers → proxy → WireMock); §"Calidad"/"áreas de mejora" aún dice "Sin `app/api/` route handlers" y que es desviación deliberada.
- [ ] **`README.md` §4 docker-compose** — env vars del servicio `web` cambiaron (`USERS_API_BASE_URL=http://localhost:3000/api`, `MOCK_API_URL=http://wiremock:8080`).

## Riesgos conocidos (evaluar si documentar o arreglar)

- [ ] Cookie `secure: true` sobre http — funciona en Chromium por localhost, pero Safari/Firefox la rechazan. Considerar `secure: process.env.NODE_ENV === "production"`.
- [x] Contactos nuevos viven solo en estado React — resuelto: `lib/contacts.ts` (store server-side) + `saveContact` server action; `getSavedContacts` mergea stubs + creados, mismo patrón que `lib/movements.ts`.
- [ ] Datos del comprobante viajan en la URL (visibles/editables) — justificar en `DECISIONS.md` o rediseñar con store server-side + refetch por id.
- [ ] `getSavedContacts` se llama client-side en `useContacts` — el propio README sugiere cargarlo server-side y pasarlo como prop.

## Verificación final

- [ ] `npm run build` pasa.
- [x] `npx tsc --noEmit` y `npm run lint` limpios.
- [x] `make test` (49 tests) y `make e2e` (playwright) verdes.
- [x] `git status` — commiteado hasta "remove storybook"; los cambios de estilos nuevos están sin commitear.
