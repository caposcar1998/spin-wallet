---
name: doc-arquitectura-nextjs
description: Documenta la arquitectura de un repositorio Next.js en español directamente en README.md, incluyendo flujo de renderizado, routing, componentes, servicios, variables de entorno, comandos, pruebas y áreas de mejora.
argument-hint: "[ruta-del-repo]"
allowed-tools:
  - read
  - edit
  - grep
  - glob
  - exec
---

# Documentar arquitectura del repositorio Next.js

> **IMPORTANTE**: El ÚNICO archivo que se puede modificar o crear es `README.md` en la raíz del repositorio. **PROHIBIDO** crear `docs/arquitectura.md`, `ARCHITECTURE.md` ni cualquier otro archivo de documentación separado. Toda la documentación debe vivir dentro del README.

Genera o actualiza el `README.md` del repositorio actual con documentación de arquitectura en español, adaptada a las convenciones reales de Next.js y siguiendo la estructura definida a continuación.

## Paso 1 — Explorar el repositorio

Antes de escribir cualquier cosa, lee y entiende:

1. `README.md`: propósito del proyecto, documentación existente, instrucciones y convenciones.
2. `package.json`: dependencias, scripts disponibles, versiones de Next.js, React y TypeScript.
3. `next.config.js`, `next.config.ts` o `next.config.mjs`: configuración de Next.js, output, imágenes, redirects, rewrites, headers y optimizaciones.
4. `tsconfig.json`: aliases, configuración de TypeScript y paths.
5. Estructura de rutas:
   - `app/` o `src/app/` si utiliza App Router.
   - `pages/` o `src/pages/` si utiliza Pages Router.
   - Identificar layouts, pages, loading, error, not-found, route handlers y middleware.
6. Entry points y archivos globales:
   - `app/layout.tsx`
   - `app/page.tsx`
   - `app/globals.css`
   - `pages/_app.tsx`
   - `pages/_document.tsx`
   - `middleware.ts` o `proxy.ts`, según la versión de Next.js.
7. Componentes:
   - `components/`
   - Componentes compartidos, reutilizables y específicos de cada feature.
   - Identificar cuáles son Server Components y cuáles Client Components.
8. Lógica de negocio y acceso a datos:
   - `services/`, `lib/`, `hooks/`, `repositories/`, `utils/`, `context/` u otras carpetas existentes.
   - Identificar llamadas HTTP, SDKs externos, acceso a bases de datos y manejo de estado.
9. Variables de entorno:
   - `.env.example`, `.env.local.example` u otros archivos de referencia.
   - Lugares donde se utiliza `process.env`.
   - Validaciones de configuración y defaults.
10. Configuración de calidad:
    - ESLint, Prettier, Jest, Vitest, Playwright, Cypress, Testing Library y configuración de TypeScript.
11. Configuración de despliegue:
    - Dockerfile, docker-compose, GitHub Actions, pipelines, Vercel, AWS, S3, CloudFront u otros proveedores.
12. Assets y estilos:
    - `public/`, `styles/`, CSS Modules, Tailwind, MUI, Emotion u otras soluciones.

No asumas que todas estas carpetas o herramientas existen. Identifica la arquitectura real del repositorio.

## Paso 2 — Escribir el README.md

- **Si el README ya existe**: conserva su contenido útil (título, badges, links, instrucciones, estándares y contacto). Integra la documentación de arquitectura sin eliminar información válida.
- **Si no existe**: créalo desde cero.
- No inventes componentes, servicios, rutas, integraciones, variables ni comandos.
- Distingue claramente entre comportamiento confirmado en el código e inferencias arquitectónicas.

Utiliza la siguiente estructura, adaptando el contenido a lo que realmente existe en el repositorio.

# Estructura del README

```markdown
# <nombre-del-repo>

## 1. Propósito general

Describe:
- Qué problema resuelve la aplicación.
- Qué tipo de aplicación es.
- Quiénes son sus consumidores.
- Qué servicios o sistemas externos consume.
- Qué información produce o expone.
- Principales funcionalidades.

## 2. Diseño de arquitectura (flujo en terminal)

Representa la arquitectura utilizando diagramas ASCII.

Identifica las siguientes capas cuando existan:

┌──────────────────────────────────────────────────────┐
│                    CLIENT / BROWSER                  │
│                                                      │
│  Navegación / Interacciones / Formularios / Estado   │
└──────────────────────────┬───────────────────────────┘
                           │
                           ▼
┌──────────────────────────────────────────────────────┐
│                    NEXT.JS APP                       │
│                                                      │
│  ┌────────────────────────────────────────────────┐  │
│  │ ROUTING                                         │  │
│  │ App Router / Pages Router                      │  │
│  └───────────────────────┬────────────────────────┘  │
│                          │                           │
│                          ▼                           │
│  ┌────────────────────────────────────────────────┐  │
│  │ PRESENTATION                                   │  │
│  │ Pages / Layouts / Server Components            │  │
│  │ Client Components / Shared Components          │  │
│  └───────────────────────┬────────────────────────┘  │
│                          │                           │
│                          ▼                           │
│  ┌────────────────────────────────────────────────┐  │
│  │ APPLICATION                                    │  │
│  │ Hooks / Context / State / Use Cases             │  │
│  └───────────────────────┬────────────────────────┘  │
│                          │                           │
│                          ▼                           │
│  ┌────────────────────────────────────────────────┐  │
│  │ DATA ACCESS / SERVICES                          │  │
│  │ Fetch / API Clients / Repositories / SDKs       │  │
│  └───────────────────────┬────────────────────────┘  │
└──────────────────────────┼───────────────────────────┘
                           │
                           ▼
┌──────────────────────────────────────────────────────┐
│                 EXTERNAL SYSTEMS                     │
│                                                      │
│  APIs / Databases / Authentication / Analytics      │
└──────────────────────────────────────────────────────┘

Adapta el diagrama a la arquitectura real. No agregues capas que no existan.

### 2.1 Flujo de renderizado

Explica cómo se construye y renderiza una página.

Identifica si utiliza:

- Server Components.
- Client Components (`"use client"`).
- SSR (Server-Side Rendering).
- SSG (Static Site Generation).
- ISR (Incremental Static Regeneration).
- CSR (Client-Side Rendering).
- Static Export (`output: 'export'`).

Representa el flujo real:

Browser
  |
  ▼
Next.js Routing
  |
  ▼
Layout
  |
  ▼
Page
  |
  ├── Server Components
  |      |
  |      └── Fetch / Data Access
  |
  └── Client Components
         |
         ├── Hooks
         ├── Local State
         └── User Interactions
  |
  ▼
HTML / RSC Payload
  |
  ▼
Hydration (cuando aplica)
  |
  ▼
Interactive UI

Explica qué ocurre en el servidor y qué ocurre en el navegador. No asumas que todas las páginas utilizan el mismo mecanismo.

### 2.2 Flujo de navegación y routing

Documenta:

- Rutas públicas y privadas.
- Rutas dinámicas (`[id]`, `[slug]`).
- Route Groups (`(group)`).
- Layouts anidados.
- Loading y Error Boundaries.
- Route Handlers (`app/api/`).
- Middleware o Proxy, según corresponda.
- Navegación con `Link`, `useRouter` y redirecciones.

Incluye un árbol de rutas con las rutas reales del proyecto.

### 2.3 Flujo de consumo de APIs y datos

Explica cómo se consumen los servicios externos:

- `fetch`.
- Axios u otros clientes HTTP.
- Server Actions.
- Route Handlers.
- SDKs externos.
- Repositorios o servicios propios.
- Manejo de errores y respuestas.
- Autenticación y autorización, si existen.

Incluye un diagrama del flujo real desde el componente hasta el servicio externo.

Diferencia entre llamadas ejecutadas en servidor y llamadas ejecutadas desde el navegador.

### 2.4 Procesos en segundo plano

Identifica los procesos que realmente existan:

- Polling.
- Timers.
- WebSockets.
- Suscripciones.
- Eventos.
- Revalidaciones.
- Cron Jobs.
- Procesos externos.

Si no existen procesos en segundo plano, indícalo explícitamente.

### 2.5 Árbol de módulos

Genera un árbol de directorios con comentarios descriptivos.

Ejemplo:

src/
├── app/                    # Routing y páginas de Next.js
│   ├── layout.tsx          # Layout raíz
│   ├── page.tsx            # Página principal
│   ├── globals.css         # Estilos globales
│   └── api/                # Route Handlers
├── components/             # Componentes reutilizables
│   ├── ui/                 # Componentes visuales
│   └── shared/             # Componentes compartidos
├── hooks/                  # Custom hooks
├── services/               # Integraciones y servicios externos
├── lib/                    # Configuración y clientes compartidos
├── context/                # React Context
├── types/                  # Tipos e interfaces
├── utils/                  # Funciones utilitarias
└── public/                 # Assets estáticos

Este árbol es ilustrativo. Utiliza exclusivamente directorios y archivos existentes.

## 3. Variables de entorno

Genera una tabla con las variables identificadas en el código.

| Variable | Requerida | Default | Exposición | Descripción |
|---|---|---|---|---|
| API_URL | Sí/No | Valor real | Servidor/Cliente | Descripción |

Reglas:

- Identifica las variables mediante búsqueda de `process.env` y validaciones de configuración.
- Diferencia `NEXT_PUBLIC_*` de las variables privadas.
- Las variables `NEXT_PUBLIC_*` se exponen al navegador y no deben contener secretos.
- Identifica valores por defecto y validaciones reales.
- No marques como requerida una variable sin evidencia en el código.
- No documentes valores sensibles ni credenciales.
- Si existen archivos `.env.example`, documenta su contenido.

## 4. Ejecución local y pruebas

Obtén los comandos directamente de `package.json`, Makefile y configuración del proyecto.

Documenta:

### Instalación

Incluye el package manager detectado a partir del lockfile:
- npm
- yarn
- pnpm
- bun

### Desarrollo

Comandos reales para ejecutar el proyecto en local.

### Build y producción

Explica cómo generar y ejecutar el build de producción.

### Pruebas

Documenta los scripts y herramientas realmente disponibles:

- Unit Tests.
- Integration Tests.
- E2E Tests.
- Lint.
- Type Checking.
- Coverage.

### Docker y despliegue

Si existen, documenta:
- Build de imágenes.
- Ejecución de contenedores.
- Variables de entorno.
- Configuración de despliegue.
- Generación de artefactos.

Si el proyecto utiliza Static Export, documenta el comando para generar el directorio `out/` y cómo se publica (S3, CloudFront u otro proveedor), siempre que exista evidencia.

## 5. Estrategia de renderizado y rendimiento

Documenta las estrategias reales de optimización:

- Server Components y reducción de JavaScript en cliente.
- Dynamic Imports y Lazy Loading.
- Optimización de imágenes con `next/image`.
- Font Optimization.
- Caching de `fetch`.
- Revalidación y `revalidatePath` / `revalidateTag`.
- ISR.
- Code Splitting.
- Prefetching de navegación.
- Suspense y Streaming.
- Optimización de bundles.

Para cada punto, indica si está implementado, parcialmente implementado o no identificado.

No presentes funcionalidades de Next.js como si el proyecto ya las utilizara.

## 6. Seguridad y manejo de información

Documenta lo que realmente existe:

- Autenticación.
- Autorización.
- Manejo de sesiones.
- Protección de rutas.
- Validación de inputs.
- Sanitización de información.
- Gestión de secretos.
- CORS y CSP.
- Headers de seguridad.
- Protección de endpoints.
- Manejo de errores y exposición de información sensible.

Identifica posibles riesgos sin afirmar que existe una vulnerabilidad si no hay evidencia suficiente.

## 7. Áreas de mejora

Genera recomendaciones técnicas basadas en el análisis del código.

Organízalas por categoría:

### Arquitectura
- Separación de responsabilidades.
- Organización de componentes.
- Separación de lógica de negocio y presentación.
- Reutilización de servicios.

### Next.js
- Server Components vs Client Components.
- Estrategia de renderizado.
- Caching y revalidación.
- Route Handlers.
- Server Actions.
- Organización del App Router.

### Performance
- Bundle size.
- Lazy Loading.
- Imágenes y fuentes.
- Consultas redundantes.
- Waterfalls de requests.
- Core Web Vitals.

### Calidad
- Cobertura de pruebas.
- Type