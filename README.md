# spin-wallet

## 1. Propósito general

Mini wallet web construida con **Next.js 16 + TypeScript + Tailwind CSS 4** que simula el flujo básico de una wallet financiera:

```
Login → Home → Nueva Transacción → Confirmación / Comprobante
```

La app **no se conecta a servicios reales**: los datos provienen de **WireMock** (contenedor Docker en `:8080`), que sirve usuarios, saldo, movimientos y contactos guardados. Un store en memoria del lado del servidor (`lib/movements.ts`) simula la persistencia de movimientos creados, ya que WireMock es stateless.

Funcionalidades principales:

- Login con validación de formato (email o teléfono) y sesión por cookie.
- Home con saldo disponible, nombre de usuario y lista de movimientos.
- Envío de dinero: monto, motivo, selección de contacto favorito o alta de contacto nuevo (mockeado en estado).
- Resumen de confirmación antes de enviar.
- Comprobante con manejo de escenarios aleatorios: éxito, fondos insuficientes, error de red, timeout y error desconocido, con opción de reintento.
- Reglas de negocio en el servidor: monto > 0, saldo suficiente y destinatario obligatorio.

## 2. Diseño de arquitectura (flujo en terminal)

```
┌──────────────────────────────────────────────────────────┐
│                    CLIENT / BROWSER                      │
│   Formularios / Modales / useActionState / Estado local  │
└──────────────────────────┬───────────────────────────────┘
                           │
                           ▼
┌──────────────────────────────────────────────────────────┐
│                      NEXT.JS APP                         │
│                                                          │
│  ┌────────────────────────────────────────────────────┐  │
│  │ ROUTING + GUARD                                    │  │
│  │ App Router / proxy.ts (cookie userId)              │  │
│  └───────────────────────┬────────────────────────────┘  │
│                          │                               │
│                          ▼                               │
│  ┌────────────────────────────────────────────────────┐  │
│  │ PRESENTATION                                       │  │
│  │ Pages (server) / Suspense / Server Components       │  │
│  │ Client Components: login, transactions, modales    │  │
│  └───────────────────────┬────────────────────────────┘  │
│                          │                               │
│                          ▼                               │
│  ┌────────────────────────────────────────────────────┐  │
│  │ APPLICATION / BUSINESS RULES                        │  │
│  │ Server Actions: loginUser, sendTransaction,         │  │
│  │ getSavedContacts, logout                            │  │
│  │ Validaciones: formato, monto, saldo, destinatario  │  │
│  └───────────────────────┬────────────────────────────┘  │
│                          │                               │
│                          ▼                               │
│  ┌────────────────────────────────────────────────────┐  │
│  │ DATA ACCESS                                        │  │
│  │ lib/api.ts (fetch) / lib/movements.ts (store)      │  │
│  │ lib/session.ts (cookies) / "use cache" + updateTag │  │
│  └───────────────────────┬────────────────────────────┘  │
└──────────────────────────┼───────────────────────────────┘
                           │
                           ▼
┌──────────────────────────────────────────────────────────┐
│                    EXTERNAL SYSTEMS                      │
│      WireMock (Docker :8080) — API mockeada              │
│      GET /user/{id} · GET /users · GET /saved-contacts   │
│      POST /user/{id}/movements                           │
└──────────────────────────────────────────────────────────┘
```

### 2.1 Flujo de renderizado

La app usa **App Router con una mezcla deliberada de Server y Client Components** (SSR + CSR):

- **Server Components** (default): `app/layout.tsx`, `app/home/page.tsx`, `userData`, `movements`, `tableMovements`, `DetailTable`, `Header`, página de confirmación y detalle de transacción. Hacen fetch server-side sin waterfalls en el cliente.
- **Client Components** (`"use client"`): `login/page.tsx`, `transactions/page.tsx`, `modalContact`, `modalConfirmTransaction`, `actionTransaction`, `alert`, `backButton`, `button`. Son las "islas" interactivas al final del árbol.
- **Suspense + streaming**: `home/page.tsx` envuelve `UserData` y `Movements` en `<Suspense>` para renderizar el shell al instante mientras los datos cargan.
- **`"use cache"`**: `getUser(id)` cachea la respuesta de WireMock con `cacheLife("minutes")` y `cacheTag("user")`; `sendTransaction` la invalida con `updateTag("user")` tras cada intento de transacción (read-your-own-writes).
- **`export const instant = false`**: las páginas que dependen por completo de `params`/`searchParams` (`transactions/[id]`, `confirmation/[status]/[id]`) optan por render bloqueante en lugar de shell con Suspense.

```
Browser → proxy.ts (guard por cookie) → Layout (Header/Footer)
  → Page
    ├── Server Components → fetch a WireMock vía lib/api.ts
    │     (getUser cacheado con "use cache" + cacheTag)
    └── Client Components → useActionState → Server Actions
          → validaciones → apiPost → redirect / {error}
  → HTML + RSC payload → Hydration → UI interactiva
```

### 2.2 Flujo de navegación y routing

`proxy.ts` actúa como guard de sesión: sin cookie `userId` redirige a `/login`; con cookie y estando en `/` o `/login` redirige a `/home`.

```
/                                    Landing pública → link a /login
/login                               Formulario de login (client)
/home                                Saldo + movimientos (server, protegida)
/transactions                        Nueva transacción (client, protegida)
/transactions/[id]                   Detalle de un movimiento (server)
/transactions/confirmation/[status]/[id]   Comprobante; status y datos por URL
```

- **Rutas dinámicas**: `[id]` en detalle; `[status]` + `[id]` anidados en confirmación.
- **Datos del comprobante por query string**: `?cantidad=&motivo=&contacto=` leídos vía `searchParams` (decisión pragmática: WireMock es stateless y no permite refetch por id).
- **Navegación**: `Link` en tabla de movimientos y landing; `router.push`/`router.back()` en botones client; `redirect()` dentro de Server Actions.
- **`app/loading.tsx`** y **`app/not-found.tsx`** presentes; no hay `error.tsx` por ruta.

### 2.3 Flujo de consumo de APIs y datos

Todo el acceso a datos pasa por `lib/api.ts` (único boundary HTTP, server-side):

- `apiGet(path)` → `fetch` con `cache: "no-store"` (la cache la gestiona `"use cache"` a nivel función).
- `apiPost(path, body)` → POST real a WireMock **o** respuesta fabricada según un random por request: 25% éxito, 15% `500`, 20% `400`, 20% `408` (con delay de 5s), 20% `520`. Es el motor de los escenarios aleatorios del comprobante.

**Server Actions** (`"use server"`):

| Action | Archivo | Rol |
|---|---|---|
| `loginUser` | `app/login/actions.ts` | Valida formato y contraseña, escribe cookie `userId`, redirect a `/home` |
| `sendTransaction` | `app/transactions/actions.ts` | Valida monto/motivo/contacto/saldo → `apiPost` → registra movimiento → `updateTag` → redirect a confirmación |
| `getSavedContacts` | `app/transactions/actions.ts` | GET `/saved-contacts` |
| `logout` | `components/actions.ts` | Borra sesión, redirect a `/` |

**Persistencia mockeada** (`lib/movements.ts`): `Map<userId, Movement[]>` en memoria del proceso Node. `sendTransaction` registra cada intento (`status: "completed" | "failed"`); `getUser` lo fusiona sobre los movimientos de WireMock y descuenta del saldo solo los `completed`. Es el punto de intercambio para un backend real.

Las llamadas son **100% server-side**; ninguna URL ni respuesta de WireMock llega al navegador.

### 2.4 Procesos en segundo plano

No hay polling, WebSockets, timers ni cron jobs. Lo más cercano es el delay artificial de 5s en la rama `408` de `apiPost` (simula timeout) y el delay de 2s en `loginUser` (simula latencia).

### 2.5 Árbol de módulos

```
app/
├── layout.tsx                    # Layout raíz: Header + BackButton + Footer
├── page.tsx                      # Landing → link a /login
├── loading.tsx / not-found.tsx   # Estados de ruta
├── globals.css                   # Tailwind 4 + @theme (colores custom)
├── login/
│   ├── page.tsx                  # Formulario (client) + useActionState
│   └── actions.ts                # loginUser (server action)
├── home/
│   └── page.tsx                  # Suspense: UserData + Movements (server)
├── transactions/
│   ├── page.tsx                  # Formulario de envío (client)
│   ├── actions.ts                # sendTransaction / getSavedContacts
│   ├── [id]/page.tsx             # Detalle de movimiento (server)
│   └── confirmation/[status]/[id]/
│       ├── page.tsx              # Comprobante (server, params+searchParams)
│       └── actionTransaction.tsx # Reintentar (form action) + Regresar (client)
components/
├── actions.ts                    # logout (server action)
├── header.tsx / footer.tsx / alert.tsx
├── contacts/modalContact.tsx     # Alta de contacto (client, onSave prop)
├── home/                         # userData / movements / tableMovements
├── transactions/                 # modalConfirmTransaction, contactSelect, useContacts
└── general/                      # button, input, title, detailTable, backButton…
lib/
├── api.ts                        # Boundary HTTP + simulación de errores
├── users.ts                      # getUser ("use cache") / getUsers — acceso a datos compartido
├── movements.ts                  # Store en memoria (persistencia mockeada)
└── session.ts                    # getSession / setSession / clearSession
types/types.tsx                   # AlertProps, errors, User, Movement, SavedContact
wiremock/mappings/                # Stubs: user, users, saved-contacts, movement-create
proxy.ts                          # Guard de rutas por cookie
Dockerfile / docker-compose.yml / Makefile
```

## 3. Variables de entorno

| Variable | Requerida | Default | Exposición | Descripción |
|---|---|---|---|---|
| `USERS_API_BASE_URL` | No | `http://localhost:8080` | Servidor | Base URL del backend (WireMock). En docker-compose del servicio `web` apunta a `http://wiremock:8080` |

No existen archivos `.env*` en el repo; el default cubre el desarrollo local. No hay variables `NEXT_PUBLIC_*` ni secretos en el código.

## 4. Ejecución local y pruebas

### Instalación

```bash
npm install
```

### Desarrollo

```bash
make dev          # docker compose up -d wiremock + npm run dev
# o manualmente:
docker compose up -d wiremock
npm run dev       # http://localhost:3000
```

App completa en contenedores: `make up` (build del servicio `web` con `output: "standalone"`).

### Build y producción

```bash
npm run build && npm start
```

### Pruebas

- `npm run lint` — ESLint 9 + eslint-config-next
- `npx tsc --noEmit` — type checking
- `npm run format` — Prettier
- **Tests unitarios / E2E: no existen** (ver Áreas de mejora).

### Docker y despliegue

- `docker-compose.yml`: servicio `wiremock` (stubs de `wiremock/mappings/`) y `web` (build del Dockerfile, `USERS_API_BASE_URL=http://wiremock:8080`).
- `Dockerfile` presente; `output: "standalone"` en `next.config.ts` optimiza la imagen.

## 5. Estrategia de renderizado y rendimiento

| Estrategia | Estado |
|---|---|
| Server Components (menos JS en cliente) | ✅ Implementado — páginas de datos son server; client solo en islas interactivas |
| Suspense + Streaming | ✅ `home` envuelve `UserData` y `Movements` |
| `"use cache"` + tags | ✅ `getUser` con `cacheTag("user")`, invalidado por `updateTag` en mutaciones |
| Cache Components / Partial Prefetching | ✅ Habilitados en `next.config.ts` |
| Route guard en edge (`proxy.ts`) | ✅ Redirects antes de render |
| `next/image` | ✅ Logo en `Header`, icono en `BackButton` |
| Progressive enhancement | ✅ Formularios y confirmación usan `form action` nativo (funcionan sin JS) |
| ISR / SSG | ❌ No aplica — todo el contenido es dinámico por sesión |
| Dynamic imports / lazy loading | ❌ No identificado — bundle pequeño, no justificado |
| Error boundaries por ruta | ⚠️ Parcial — hay `loading.tsx`/`not-found.tsx`, falta `error.tsx` |

## 6. Seguridad y manejo de información

- **Sesión**: cookie `userId` con `httpOnly`, `secure`, `sameSite: "lax"`, `maxAge` 5 min. Es mockeada (no hay autenticación real, a propósito del challenge).
- **Guard de rutas**: `proxy.ts` verifica la cookie antes de renderizar rutas protegidas.
- **Validación de inputs**: formato de usuario y contraseña en `loginUser`; monto > 0, motivo, contacto y saldo en `sendTransaction` — todas server-side, no solo en la UI.
- **Secretos**: ninguno en el código; la única variable es la base URL pública del mock.
- **Acciones expuestas**: los módulos `"use server"` son endpoints RPC públicos; las validaciones viven ahí precisamente porque la UI es bypasseable.
- **Riesgos conocidos (demo)**: la cookie es predecible (`userId: "1"`), los datos del comprobante viajan en la URL (visibles y editables), y `apiPost` usa `body: any`.

## 7. Áreas de mejora

### Next.js
- `"use server"` mal aplicado en `app/home/page.tsx`, `userData.tsx` y `movements.tsx` — marca exports de componentes como acciones RPC; debe eliminarse (la directiva solo corresponde a `actions.ts`).
- Falta `error.tsx` en `home` — si `getUser` falla, el error cae fuera de los Suspense boundaries (el spec pide estado de error).
- `getSavedContacts` podría cargarse server-side en la página y pasarse como prop, convirtiendo el formulario en isla client pura.

### Performance
- La simulación de caos en `apiPost` corre por request — bien, pero el delay de 5s no es abortable ni configurable.
- Sin code splitting ni dynamic imports — aceptable por tamaño, revisar al crecer.

### Calidad
- **Sin tests**: ni runner ni suites. Prioridad: tests unitarios de `loginUser`/`sendTransaction` (validaciones) y un E2E del flujo feliz con Playwright.
- `body: any` en `apiPost` — tipar el payload de movements.
- `apiPost` sin `try/catch` en el caller: un fallo de red real (fetch reject) produce un 500 genérico en vez del comprobante estilizado.
- `label htmlFor="first_name"` no corresponde a ningún input id en `CustomInput`.

## 8. Limitaciones conocidas

- Los movimientos creados viven en memoria del proceso Node (`lib/movements.ts`): se pierden al reiniciar el servidor. Es deliberado — simula persistencia sin backend real.
- Los contactos nuevos viven en estado React: se pierden al recargar `/transactions`.
- El comprobante confía en datos de la URL (query params): no hay refetch por id porque WireMock no persiste.
- El resultado de `POST /movements` es aleatorio por diseño (caos controlado para demo de estados).
- El id del comprobante (`123456`) es hardcodeado — WireMock devuelve un id aleatorio de 2 dígitos que no se propaga.

## 9. Tiempo invertido

> **TODO: declarar horas reales invertidas en el challenge** (requerido por la rúbrica).
