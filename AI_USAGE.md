# AI Usage

## Herramienta

Claude Code

## En qué me ayudó

- Auditar el proyecto contra el rubric, sección por sección — me fue diciendo qué cubría y qué faltaba
- Login con lookup real del usuario en `getUsers()` en vez de aceptar cualquier input válido
- Stubs por usuario en wiremock (`urlPath` + `priority`) — cada login muestra datos distintos
- `lib/format.ts` con `roundMoney` y `formatCurrency` — me arregló el bug de los 10 decimales del balance
- Refactor de `CustomInput` para aceptar cualquier atributo nativo (`step="0.01"` para decimales)
- El map de `errors` en la confirmación en vez de la cadena de ternarios que tenía
- README completo: arquitectura, diagrama, env vars, comandos, usuarios demo
- E2E: Molde e instalación de playwright
- Makefile: Creación de makefile con comandos e2e, dev y correr en producción
- Darme cuenta que tenía comportamiento diferente en el guardado de la información (contactos y usuarios)
- Aconsejar poner flags de error y slow user como variables de entorno
- Corroborar el no implementar Zustand/Redux/Context
