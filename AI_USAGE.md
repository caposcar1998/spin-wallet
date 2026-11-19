# AI Usage

## 1. Qué herramientas usé y en qué partes del proyecto

- **Claude Code** — única herramienta de IA utilizada, como asistente durante el desarrollo.
- **Auditoría contra la rúbrica** — corroborar sección por sección que los puntos del challenge estuvieran cubiertos en su totalidad.
- **Componentes TS** — apoyo con el diseño.
- **WireMock** — definición y configuración de los stubs, y creación de los usuarios de prueba.
- **Home** — buscador de la tabla de movimientos.
- **`lib/format.ts`** — `roundMoney` y `formatCurrency`.
- **Componentes reutilizables** — refactor de `CustomInput` para corregir el bug de decimales.
- **Confirmación** — map de `errors` para los escenarios de la transacción.
- **README** — arquitectura, diagrama, env vars, comandos y usuarios demo.
- **E2E** — molde e instalación de Playwright.
- **Makefile** — únicamente corrección de errores; el archivo lo escribí yo.
- **Debugging** — darme cuenta de que tenía comportamientos diferentes en el guardado de contactos y usuarios.

## 2. Qué acepté directamente y qué corregí o rechacé

### Aceptado directamente

- Login con lookup real del usuario en `getUsers()`.
- Stubs por usuario en WireMock (`urlPath` + `priority`) — cada login muestra datos distintos.
- `lib/format.ts` con `roundMoney` y `formatCurrency` — arreglo del bug de los 10 decimales del balance.
- Flags de error y slow user como variables de entorno (sugerencia de la IA).
- Molde e instalación de Playwright para E2E.

### Corregido sobre código que ya tenía

- Refactor de `CustomInput` para aceptar cualquier atributo nativo.
- El map de `errors` en la confirmación reemplazó la cadena de ternarios que yo tenía.
- Corrección de un error en el Makefile sobre contenedores.
- Corrección de archivos que podian optimizarce en client and server components.

### Rechazado / no adoptado

- Implementar una librería de estado (Zustand/Redux/Context)
- Implementar diseños de otra librería
- Implementación de e2e en pipeline
- Implementar types por archivo

## 3. Qué decisiones tomé yo y no la IA

- Estructura del proyecto.
- Estructura de los componentes.
- Estructura de los archivos.
- Librerías a utilizar.
- Lógica de negocio a seguir.
- Creación de componentes servidor y cliente.
- Validaciones en niveles frontend y backend.
- Creación de componentes reutilizables.
- No implementar Zustand/Redux/Context.
- Creación del Makefile con comandos para e2e, dev y producción.
- Estados vacios, error y pagina no encontrada.
