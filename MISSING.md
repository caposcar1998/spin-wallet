# Pendientes antes de entregar

Checklist contra `ai/challenge.md`. Marcar con `x` lo resuelto.

## Entregables obligatorios

- [x] **`DECISIONS.md`** — decisiones de diseño: por qué App Router/Server Components/Server Actions, separación UI/lógica, por qué estado local + server state en vez de Context/Zustand, edge cases considerados, qué harías diferente con más tiempo.
- [x] **`AI_USAGE.md`** — herramientas usadas y en qué partes, qué se aceptó directo vs corregido/rechazado, qué decisiones fueron tuyas y no de la IA.
- [x] **Horas reales invertidas** — `README.md` §9 actualizado con 8 horas invertidas.

## Gaps del spec

- [x] **Estado de error en Home** — `app/home/error.tsx` creado (client boundary con `reset`); `getUser` ahora lanza en `!response.ok` → la boundary lo atrapa. Verificar visualmente con `docker compose stop wiremock` + `rm -rf .next`.
- [x] **Reintentar en error de red** — el retry solo aparece en `408`; el spec espera "error de red → opción de reintentar". Extender a `500`/`520` en `actionTransaction.tsx` (mantener fuera `201`/`400`) y actualizar `actionTransaction.test.tsx` (hoy afirma "solo 408").
- [ ] **"API router con datos mockeados"** — `app/api/` fue eliminado; WireMock cubre el rol pero el spec pide API routes literal. Decidir: restaurar una route mínima (`app/api/health` o proxy de contacts) o documentar la desviación deliberada en `DECISIONS.md`.
- [x] **Test del hook `useContacts`** — `useContacts.test.ts`: carga inicial, fallback a `[]` en error, `contact` derivado, id desconocido, `addContact` (append + selección).

## Docs desactualizadas

- [x] **`README.md` §7 "Calidad"** — afirma cosas ya resueltas, borrar:
  - "Sin tests: ni runner ni suites" → existen 44 unit tests + e2e + storybook.
  - "`body: any` en `apiPost`" → ya es `Record<string, unknown>`.
  - "`apiPost` sin `try/catch` en el caller" → ya cubierto (redirect a `520`).
  - "`label htmlFor='first_name'`" → ya es `htmlFor={name}` + `id={name}`.
- [x] **`README.md` §7 "Next.js"** — el bullet `"use server" mal aplicado` ya está resuelto; borrar.
- [x] **`README.md`** — documentar los comandos de tests nuevos: `make test`, `make e2e`, `make e2e-ui`, `make e2e-debug`, `npm run storybook`, `npm run test-storybook`, `API_CHAOS=false` para runs deterministas.

## Riesgos conocidos (evaluar si documentar o arreglar)

- [ ] Cookie `secure: true` sobre http — funciona en Chromium por localhost, pero Safari/Firefox la rechazan. Considerar `secure: process.env.NODE_ENV === "production"`.
- [ ] Contactos nuevos viven solo en estado React (se pierden al recargar) — está en Limitaciones, verificar que `DECISIONS.md` lo justifique.
- [ ] Datos del comprobante viajan en la URL (visibles/editables) — justificar en `DECISIONS.md` o rediseñar con store server-side + refetch por id.
- [ ] `getSavedContacts` se llama client-side en `useContacts` — el propio README sugiere cargarlo server-side y pasarlo como prop.

## Verificación final

- [x] `npm run build` pasa.
- [x] `npx tsc --noEmit` y `npm run lint` limpios.
- [x] `make test` (44 tests) y `make e2e` (playwright + storybook) verdes.
- [x] `git status` sin archivos sueltos (`ai/challenge.md` está untracked — decidir si entra al repo o a `.gitignore`).
- [x] `.storybook/` + `stories/` — confirmar que el material de Storybook que se va a entregar compile (`npm run build-storybook`).
