# spin-wallet

## 1. Propósito general

Mini wallet web construida con **Next.js 16 + TypeScript + Tailwind CSS 4** que simula el flujo básico de una wallet financiera:

```
Login → Home → Nueva Transacción → Confirmación / Comprobante
```

La app **no se conecta a servicios reales**: los datos provienen de **WireMock** (contenedor Docker en `:8080`), que sirve usuarios, saldo, movimientos y contactos guardados. Los Route Handlers propios (`app/api/`) actúan como proxy hacia WireMock, y dos stores en memoria del proceso del servidor (`lib/movements.ts`, `lib/contacts.ts`) simulan la persistencia de datos creados, ya que WireMock es stateless.

Funcionalidades principales:

- Login con validación de formato (email o teléfono), lookup del usuario contra el mock y sesión por cookie.
- Home con saldo disponible, nombre de usuario y lista de movimientos — por usuario (4 usuarios demo con datos propios).
- Envío de dinero: monto (con decimales), motivo, selección de contacto favorito o alta de contacto nuevo (persistido server-side).
- Resumen de confirmación antes de enviar.
- Comprobante con escenarios aleatorios: éxito, fondos insuficientes, error de red, timeout y error desconocido, con opción de reintento.
- Reglas de negocio en el servidor: monto > 0, saldo suficiente (contra el balance real) y destinatario obligatorio.
- Testing en dos capas: unitario (Vitest + Testing Library) y E2E del flujo completo (Playwright, headed con `slowMo` para demo visible).

## 2. Cómo correrlo

### Instalación

```bash
cp .env.example .env   # variables locales (ver tabla abajo)
npm install
```

Package manager: **npm** (`package-lock.json`).

### Variables de entorno

| Variable | Requerida | Default | Exposición | Descripción |
|---|---|---|---|---|
| `USERS_API_BASE_URL` | No | `http://localhost:3000/api` | Servidor | Base URL de los Route Handlers propios que consumen `apiGet`/`apiPost` |
| `MOCK_API_URL` | No | `http://localhost:8080` | Servidor | Upstream al que los Route Handlers proxifican (WireMock). En docker-compose apunta a `http://wiremock:8080` |
| `API_CHAOS` | No | `true` | Servidor | `"false"` desactiva la inyección de errores aleatorios en `POST /api/user/:id/movements`. Lo usa Playwright vía `webServer` |
| `FAKE_ERROR_LOGIN` | No | `false` | Servidor | `"true"` hace que `getUsers` devuelva `[]` (→ "Usuario no registrado") y agrega 2s de latencia en `getUser` |

Ver `.env.example` para la plantilla; copiar a `.env` para overrides locales. No hay variables `NEXT_PUBLIC_*` ni secretos en el código.

⚠️ `docker-compose.yml` referencia `env_file: .env`, que está gitignored — en un clone fresco hay que crear `.env` desde `.env.example` antes de `docker compose up`.

### Desarrollo

```bash
make dev          # docker compose up -d wiremock + npm run dev
# o manualmente:
docker compose up -d wiremock
npm run dev       # http://localhost:3000
```

### Usuarios demo

Cualquier password ≥ 8 caracteres. Cada usuario tiene datos propios:

| Email | Teléfono | Datos |
|---|---|---|
| `oscar@gmail.com` | `5512345678` | $100, 4 movimientos |
| `hector@gmail.com` | `5523456789` | $200, 2 movimientos |
| `salmay@gmail.com` | `5534567890` | $300, 1 movimiento |
| `pepe@gmail.com` | `5545678901` | $500, 0 movimientos (estado vacío) |

### Build y producción

Dos opciones (una u otra, no ambas — usan el mismo puerto):

```bash
# Producción local (requiere wiremock corriendo):
npm run build && npm start

# Todo containerizado (web + wiremock en Docker):
make up           # docker compose up -d --build → http://localhost:3000
```

### Pruebas

```bash
make test        # Vitest — 50 tests: acciones, validaciones y componentes críticos
make e2e         # Playwright headed — recorre el flujo completo en el navegador
make e2e-ui      # Playwright UI mode (watch, time-travel, re-run)
make e2e-debug   # Playwright Inspector — pausa antes de cada acción
```

- `npm run test` / `npm run test:watch` — Vitest 4 + jsdom + Testing Library. Suites colocalizadas (`*.test.ts(x)`): server actions (`loginUser`, `sendTransaction`), modales, tabla de movimientos, retry del comprobante.
- `npm run test:e2e` — Playwright (chromium headed + `--slow-mo`). `playwright.config.ts` levanta `npm run dev` con `API_CHAOS=false` vía `webServer`; `tests/wallet-flow.spec.ts` recorre Login → Home → Transacción → Comprobante con `test.step`.
- ⚠️ Los targets `make e2e*` liberan el puerto 3000 primero (`e2e-prepare`): Playwright reutiliza un server existente con el env que tenga (caos activo → test flaky), así que los targets matan cualquier proceso en :3000 para que arranque su propio server determinista.
- `npm run lint` — ESLint 9 + eslint-config-next
- `npx tsc --noEmit` — type checking
- `npm run format` — Prettier

### Docker y despliegue

- `docker-compose.yml`: servicio `wiremock` (stubs de `wiremock/mappings/` montados como volumen) y `web` (build del Dockerfile, env vars vía `env_file: .env` con `MOCK_API_URL=http://wiremock:8080`).
- `Dockerfile` presente; `output: "standalone"` en `next.config.ts` optimiza la imagen.
- `make up` levanta todo containerizado; `make down`/`logs`/`restart`/`clean` gestionan el stack.

## 3. Diseño de arquitectura (flujo en terminal)

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
│  │ ROUTE HANDLERS (app/api/) — API propia             │  │
│  │ Proxy a WireMock + inyección de caos en POST       │  │
│  │ /user/{id}/movements                               │  │
│  └───────────────────────┬────────────────────────────┘  │
│                          │                               │
│                          ▼                               │
│  ┌────────────────────────────────────────────────────┐  │
│  │ DATA ACCESS                                        │  │
│  │ lib/api.ts (fetch) / lib/mock-api.ts (proxy)       │  │
│  │ lib/movements.ts + lib/contacts.ts (stores)        │  │
│  │ lib/session.ts (cookies) / "use cache" + updateTag │  │
│  └───────────────────────┬────────────────────────────┘  │
└──────────────────────────┼───────────────────────────────┘
                           │
                           ▼
┌──────────────────────────────────────────────────────────┐
│                    EXTERNAL SYSTEMS                      │
│      WireMock (Docker :8080) — API mockeada              │
│      GET /users · GET /user/{id} · GET /saved-contacts   │
│      GET|POST /user/{id}/movements                       │
└──────────────────────────────────────────────────────────┘
```

### 3.1 Flujo de renderizado

La app usa **App Router con una mezcla deliberada de Server y Client Components** (SSR + CSR):

- **Server Components** (default): `app/layout.tsx`, `app/home/page.tsx`, `userData`, `movements`, `tableMovements`, `DetailTable`, `Header`, página de confirmación y detalle de transacción. Hacen fetch server-side sin waterfalls en el cliente.
- **Client Components** (`"use client"`): `login/page.tsx`, `transactions/page.tsx`, `modalContact`, `modalConfirmTransaction`, `actionTransaction`, `alert`, `backButton`, `button`, `input`. Son las "islas" interactivas al final del árbol.
- **Suspense + streaming**: `home/page.tsx` envuelve `UserData` y `Movements` en `<Suspense>` para renderizar el shell al instante mientras los datos cargan.
- **`"use cache"`**: `getUser(id)` y `getMovements(id)` cachean las respuestas con `cacheLife("minutes")` y `cacheTag("user")`; `sendTransaction` invalida ambos con `updateTag("user")` tras cada intento de transacción (read-your-own-writes).
- **`export const instant = false`**: las páginas que dependen por completo de `params`/`searchParams` (`transactions/[id]`, `confirmation/[status]/[id]`) optan por render bloqueante en lugar de shell con Suspense.

```
Browser → proxy.ts (guard por cookie) → Layout (Header/Footer)
  → Page
    ├── Server Components → lib/users.ts → Route Handlers → WireMock
    │     ("use cache" + cacheTag por función)
    └── Client Components → useActionState → Server Actions
          → validaciones → apiPost → addMovement → redirect / {error}
  → HTML + RSC payload → Hydration → UI interactiva
```

### 3.2 Flujo de navegación y routing

`proxy.ts` actúa como guard de sesión: sin cookie `userId` redirige a `/login`; con cookie y estando en `/` o `/login` redirige a `/home`. Las rutas `/api/*` están excluidas del matcher.

```
/                                    Landing pública → link a /login
/login                               Formulario de login (client)
/home                                Saldo + movimientos (server, protegida)
/transactions                        Nueva transacción (client, protegida)
/transactions/[id]                   Detalle de un movimiento (server)
/transactions/confirmation/[status]/[id]   Comprobante; status y datos por URL
/api/users                           GET → proxy /users
/api/user/[id]                       GET → proxy /user/{id}
/api/user/[id]/movements             GET → proxy · POST → caos + proxy
/api/saved-contacts                  GET → proxy /saved-contacts
```

- **Rutas dinámicas**: `[id]` en detalle; `[status]` + `[id]` anidados en confirmación.
- **Datos del comprobante por query string**: `?cantidad=&motivo=&contacto=` leídos vía `searchParams` (limitación conocida — ver §7).
- **Navegación**: `Link` en tabla de movimientos, landing y header; `router.push`/`router.back()` en botones client; `redirect()` dentro de Server Actions.
- **`app/loading.tsx`**, **`app/not-found.tsx`** y **`app/home/error.tsx`** presentes; el resto de rutas no tiene `error.tsx` propio.

### 3.3 Flujo de consumo de APIs y datos

Arquitectura de dos capas HTTP, todo server-side:

```
Server Component / Action
   → lib/api.ts        (cliente HTTP "tonto": apiGet / apiPost, sin lógica)
     → app/api/*       (Route Handlers propios — la "API mockeada")
       → lib/mock-api.ts (proxyToMock: reenvía request/response, 502 si cae)
         → WireMock :8080
```

**Route Handlers** (`app/api/`): proxifican a WireMock vía `proxyToMock`. El `POST /user/{id}/movements` además inyecta **caos por request**: 25% proxifica real a WireMock, 15% `500`, 20% `400` (fondos insuficientes), 20% `408` (con delay de 5s simulando timeout), 20% `520`. Es el motor de los escenarios aleatorios del comprobante. El kill-switch `API_CHAOS=false` lo desactiva (lo usan los tests E2E para un happy path determinista). El caos vive en la capa de API — `apiPost` es transporte puro que cualquier consumidor puede usar sin heredar fallos aleatorios.

**Server Actions** (`"use server"`):

| Action | Archivo | Rol |
|---|---|---|
| `loginUser` | `app/login/actions.ts` | Valida formato y contraseña → lookup del usuario en `getUsers()` (email o teléfono) → cookie `userId` con su id → delay de 2s → redirect a `/home` |
| `sendTransaction` | `app/transactions/actions.ts` | Valida monto/motivo/contacto/saldo → `apiPost` → `addMovement` (completed/failed) → `updateTag` → redirect a confirmación con el `transactionId` real |
| `getSavedContacts` | `app/transactions/actions.ts` | GET `/saved-contacts` fusionado con contactos creados |
| `logout` | `components/actions.ts` | Borra sesión, redirect a `/` |

**Persistencia mockeada** (en memoria del proceso Node, keyed por userId donde aplica):

- `lib/movements.ts` — `Map<userId, Movement[]>`: `sendTransaction` registra cada intento (`status: "completed" | "failed"`). `getMovements` los antepone a los stubs de WireMock; `getUser` descuenta del saldo solo los `completed` (con `roundMoney` contra errores de punto flotante).
- `lib/contacts.ts` — `SavedContact[]`: contactos creados en la demo, fusionados en `getSavedContacts`.

**Datos por usuario**: WireMock tiene stubs con `urlPath` exacto + `priority: 1` para `/user/2|3|4` y `movement-list-2|3|4` (el patrón `/user/[0-9]+` queda como fallback del id 1). Cada login muestra datos distintos; `pepe@gmail.com` tiene 0 movimientos — hace demostrable el estado vacío.

**Flags de demo**: `FAKE_ERROR_LOGIN=true` hace que `getUsers` devuelva `[]` (→ "Usuario no registrado") y agrega 2s de latencia en `getUser` — simula error/carga en login.

Las llamadas son **100% server-side**; ninguna URL ni respuesta de WireMock llega al navegador.

### 3.4 Procesos en segundo plano

No hay polling, WebSockets, timers ni cron jobs. Lo más cercano: el delay de 5s en la rama `408` del route handler (simula timeout) y el delay de 2s en `loginUser`/`getUser` (simula latencia).

### 3.5 Árbol de módulos

```
app/
├── layout.tsx                    # Layout raíz: Header + BackButton + Footer
├── page.tsx                      # Landing → link a /login
├── loading.tsx / not-found.tsx   # Estados de ruta
├── globals.css                   # Tailwind 4 + @theme (colores custom)
├── api/                          # Route Handlers — API mockeada propia
│   ├── users/route.ts            # GET → proxy /users
│   ├── user/[id]/route.ts        # GET → proxy /user/{id}
│   ├── user/[id]/movements/      # GET → proxy · POST → caos + proxy
│   └── saved-contacts/route.ts   # GET → proxy /saved-contacts
├── login/
│   ├── page.tsx                  # Formulario (client) + useActionState
│   └── actions.ts                # loginUser (server action)
├── home/
│   ├── page.tsx                  # Suspense: UserData + Movements (server)
│   └── error.tsx                 # Error boundary del segmento (client)
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
├── api.ts                        # Cliente HTTP base (apiGet/apiPost, sin lógica)
├── mock-api.ts                   # proxyToMock — boundary hacia WireMock
├── users.ts                      # getUser / getMovements ("use cache") / getUsers
├── movements.ts                  # Store de movimientos creados (por usuario)
├── contacts.ts                   # Store de contactos creados
├── session.ts                    # getSession / setSession / clearSession
└── format.ts                     # roundMoney / formatCurrency (MXN)
types/types.tsx                   # AlertProps, errors, User, Movement, SavedContact
wiremock/mappings/                # Stubs: users, user, user-{2,3,4},
                                  #   movement-list{-2,-3,-4}, movement-create,
                                  #   saved-contacts
proxy.ts                          # Guard de rutas por cookie
tests/wallet-flow.spec.ts         # Playwright E2E del flujo completo
**/*.test.ts(x)                   # Suites Vitest colocalizadas (50 tests)
vitest.config.ts / vitest.setup.ts
playwright.config.ts              # webServer: API_CHAOS=false npm run dev
Dockerfile / docker-compose.yml / Makefile
.env.example                      # Plantilla de variables (commiteada)
```

## 4. Estrategia de renderizado y rendimiento

| Estrategia | Estado |
|---|---|
| Server Components (menos JS en cliente) | ✅ Implementado — páginas de datos son server; client solo en islas interactivas |
| Suspense + Streaming | ✅ `home` envuelve `UserData` y `Movements` |
| `"use cache"` + tags | ✅ `getUser` y `getMovements` con `cacheTag("user")`, invalidados por `updateTag` en mutaciones |
| Cache Components / Partial Prefetching | ✅ Habilitados en `next.config.ts` |
| Route guard (`proxy.ts`) | ✅ Redirects antes de render |
| `next/image` | ✅ Logo en `Header`, icono en `BackButton` |
| Progressive enhancement | ✅ Formularios y confirmación usan `form action` nativo |
| Formato de moneda | ✅ `Intl.NumberFormat` es-MX/MXN + `roundMoney` contra artefactos de punto flotante |
| ISR / SSG | ❌ No aplica — todo el contenido es dinámico por sesión |
| Dynamic imports / lazy loading | ❌ No identificado — bundle pequeño, no justificado |
| Error boundaries por ruta | ⚠️ Parcial — `error.tsx` en `home` (cubre fallos con Reintentar via `reset()`); el resto de rutas no tiene boundary propio |

## 5. Seguridad y manejo de información

- **Sesión**: cookie `userId` con `httpOnly`, `secure`, `sameSite: "lax"`, `maxAge` 5 min. Es mockeada (no hay autenticación real, a propósito del challenge).
- **Guard de rutas**: `proxy.ts` verifica la cookie antes de renderizar rutas protegidas; excluye `/api/*` del matcher.
- **Validación de inputs**: formato de usuario y contraseña en `loginUser`; monto > 0 (incl. `NaN`/`Infinity`), motivo, contacto y saldo contra balance real en `sendTransaction` — todas server-side, no solo en la UI.
- **Secretos**: ninguno en el código; las variables son URLs públicas del mock.
- **Acciones expuestas**: los módulos `"use server"` son endpoints RPC públicos; las validaciones viven ahí precisamente porque la UI es bypasseable.
- **Riesgos conocidos (demo)**: los datos del comprobante viajan en la URL (visibles y editables), y la cookie `secure: true` depende de que el navegador trate `localhost` como contexto seguro (Chromium sí; Safari no).

## 6. Áreas de mejora

### Arquitectura
- El comprobante podría resolverse por `transactionId` contra `lib/movements` en lugar de confiar en query params (eliminaría la edición por URL); hoy los params son necesarios porque la rama de error de red (520) no llega a registrar el movimiento.
- `getSavedContacts` podría cargarse server-side en la página y pasarse como prop, convirtiendo el formulario en isla client pura.

### Next.js
- `getUsers` devuelve `body.data` sin validar — si la API cae devuelve `undefined` y el `.find` en `loginUser` revienta con `TypeError` en lugar de un error controlado.
- El delay de 5s del timeout simulado no es abortable ni configurable.

### Performance
- Sin code splitting ni dynamic imports — aceptable por tamaño, revisar al crecer.
- `getUser` y `getMovements` hacen dos fetches separados a WireMock por render de home — trade-off aceptado por la simetría REST.

### Calidad
- El E2E cubre el happy path; los escenarios de error del comprobante solo se ejercen en tests unitarios y manualmente (pendiente: specs de retry/500/timeout, posible con WireMock scenarios).
- El patrón de reset de alert en `login/page.tsx` y `transactions/page.tsx` está duplicado — candidato a custom hook (`useAutoResetAlert`).


## 8. Tiempo invertido

12 horas invertidas
