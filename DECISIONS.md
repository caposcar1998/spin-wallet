# Decisiones varias

## Arquitectura

```
app/             rutas + route handlers (la "API" del proyecto)
components/      UI, agrupada por dominio
lib/             http, stores, session, format
types/           modelos de dominio
wiremock/        el backend mockeado, vive fuera del código de la app
tests/           e2e separado; los unit tests van colocalizados junto al archivo
```

- `app/` Cada ruta delega su UI a `components/` y su lógica a `lib/` + server actions — las pages no cargan lógica de negocio.
- `components/` por dominio y generales para uso en todo el proyecto
- `lib/` es el boundary: nada de React ahí. Si mañana cambio WireMock por un backend real, solo toco `lib/` — los componentes no necesitan cambio.
- `types/` modelos de dominio
- `wiremock/` el backend mockeado, vive fuera del código de la app
- `tests/` e2e separado; los unit tests van colocalizados junto al archivo

## Validaciones frontend y backend

- Se realizan validaciones en el frontend para mejorar la experiencia del usuario, pero la validación real se realiza en el backend para garantizar la integridad de los datos.
- No se agregó una librería de validación (zod u otra): el scope es acotado (formato de login, monto, motivo, contacto y saldo) y las validaciones nativas en las Server Actions lo cubren; una dependencia extra no se justifica para este challenge.

## Cookies

- Se utilizan las cookies para almacenar la información del usuario y la sesión.
- Con ellas se puede mantener la sesión del usuario, redireccionar usuarios no registrados y hacer queries con el permiso del usuario.

## Estados de la aplicación

No uso Context/Zustand/Redux. Esto por:

- El estado de UI es local por pantalla. No se necesita compartir entre componentes ya que la información se pasa por props, rutas o server actions.
- El estado "compartido" (sesión, movimientos, contactos) vive server-side: cookie httpOnly + stores de `lib/`, leído por Server Components y mutado por Server Actions.
- Meter una lib de estado global no resuelve ningún problema real aquí, implementarlo causaría sobre ingeniería.

## Componentes

- Server Components por default; `"use client"` solo en islas interactivas (forms, modales, alert).
- Las páginas de datos (`home`, detalle, confirmación) son server y fetchean directo del backend.
- Los modales reciben todo por props y notifican por callbacks (`onClose`, `onSave`), solo se encargan de la UI.

## Componentes reutilizables

`components/general/` tiene lo generico: `CustomButton`, `CustomInput`, `Title`, `SubTitle`, `DetailTable`, `Alert`, `BackButton`, `CloseButton`, `GeneralText`.
- La condición es: se reutiliza solo si ya se usa en más de 2 lugares diferentes. 
- Se realizó esto para lograr tener homogeneidad en el proyecto.

## Uso de server side components y client side components combinados

Frontend encargado de la presentación y lógica de usuario, backend encargado de la lógica de negocio y la persistencia de datos.
Con eso no se comparten secretos al cliente, pero mantiene una UI amigable con reactividad.
- **Server**: `layout`, `home/page` + `UserData` + `Movements` + `TableMovements`, `transactions/[id]`, `confirmation/[status]/[id]` — fetchean server-side, cero JS al cliente.
- **Client**: `login/page`, `transactions/page`, `modalContact`, `modalConfirmTransaction`, `actionTransaction`, `alert`, `backButton`, `button`, `input` — interacción pura, al fondo del árbol.
- La línea divisoria: server = qué mostrar y de dónde viene la data; client = cómo se captura y se interactúa.

Ejemplo real de cómo ayudó — el home:

```tsx
// app/home/page.tsx (server, sin "use client")
<Suspense fallback="Cargando…"><UserData /></Suspense>    // server: fetch getUser
<Suspense fallback="Cargando…"><Movements /></Suspense>  // server: fetch getMovements
```

`UserData` y `Movements` fetchean directo en el servidor — el HTML llega con el saldo y la tabla ya pintados, sin `useEffect`, sin estado de loading en el cliente.

## Uso de cache

- `getUser` y `getMovements` usan `"use cache"` con `cacheLife("minutes")` y `cacheTag("user")`. Forzar a usar lo que se tiene en cache.
- `sendTransaction` llama `updateTag("user")` tras registrar el movimiento — invalida balance y lista juntos. Sin esto el home información cacheada sin actualizar.

## Uso de suspense

- `home/page.tsx` envuelve `UserData` y `Movements` en `<Suspense>` separados . Esto para permitir cargar cada componente de manera independiente.
- `app/loading.tsx` cubre la carga inicial de ruta. Se realizó por practicidad.

## Uso de error boundaries

- `app/home/error.tsx` es el boundary del segmento, se realizo de esta manera ya que el home es el punto de entrada de la aplicación y es donde se espera que haya más errores.
- Solo `home` tiene `error.tsx` propio — el resto de rutas cae en la página de error raíz. Queda como mejora pendiente. Se realizó de esta manera para demostrar el uso de error boundaries.

## Layout general

- `app/layout.tsx` monta `Header` + `BackButton` + `Footer` compartidos por todas las rutas.
- `proxy.ts` es el guard de sesión antes del render: sin cookie `userId` → `/login`; con cookie en `/` o `/login` → `/home`. Las `/api/*` están excluidas del matcher para que los route handlers trabajen libres.
- El comprobante usa ruta dinámica `/confirmation/[status]/[id]` — el status es parte del path porque define qué tipo de recibo es, no es un filtro.

## Edge cases

- Punto flotante en dinero:
  - `100 - 33.33` da `66.67000000000001` → `roundMoney` en el cálculo del balance y `formatCurrency` (Intl es-MX/MXN) en todo lo que se renderiza.
- Decimales en el input: 
  - `type="number"` rechaza `12.5` en submit por el `step=1` implícito → `step="0.01"`.
- Revisar phone e email en el mismo input: 
  - Como en SBO , se permite ingresar ambos campos pero solo se valida uno.
- Movimiento inexistente: 
  - `/transactions/[id]` con id inválido muestra "Movimiento no encontrado" en vez de crashear.
- WireMock caído: 
  - `proxyToMock` responde 502 controlado, no un crash de fetch.
- Página not found: 
  - `/not-found` es la página por defecto para rutas no encontradas.

## Cambios que haría con mayor tiempo de implementación:

- Implementar demo con base de datos real, como sqlite
- Implementar autenticación con JWT, o al menos proteger el endpoint de login con un token
- Implementar endpoints con tokens
- Implementar un correcto CI/CD
- Revisión más profunda de edge cases, 12 horas no permiten ver todos los casos posibles
- Implementar casos de uso más interesantes, como idempotencia al enviar transacciones
- Eliminación de transacciones
- Actualización de transacciones
- Validaciones más robustas en el frontend y backend
- Refactorizar en componentes más pequeños y reutilizables

