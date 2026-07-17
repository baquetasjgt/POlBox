# POLEBOX — Roadmap integral de evolución

> Análisis crítico del prototipo actual y propuestas de evolución en 4 dimensiones:
> funcionalidades, UX/UI, puesta en valor y calidad técnica.
> Cada propuesta incluye **beneficio esperado**, **Prioridad** (Alta / Media / Baja) y
> **Esfuerzo** (⚡ Quick Win / ⏳ Medio / 🏔 Largo plazo).
> Todas las referencias `archivo:línea` han sido verificadas contra el código actual.

---

## Diagnóstico de partida

**Qué es hoy:** un prototipo de alta fidelidad muy por encima de la media — 24 pantallas,
flujo completo invitada → reserva → pago → llave digital, tres pilares de monetización
(bonos, cursos, tienda) y gamificación diseñada al detalle. Hay lógica real notable: el
algoritmo anti-huecos de slots (`Screen3Book.jsx:48-75`), la detección de bono compatible
en checkout, la validación de tarjeta con BIN, y el patrón (correcto) de muro de
autenticación tardío justo antes de pagar.

**Su talón de Aquiles:** casi todos los *loops* están sin cerrar. Se compra un bono pero
nunca se consume; se ve una lección pero nunca se completa; hay economía de XP diseñada
pero ninguna acción la alimenta; la sede elegida se pierde por el camino; la reserva
pagada desaparece del dashboard. El prototipo *enseña* pantallas pero no *demuestra* mecánicas.

**La decisión que ordena todo lo demás** — hay que elegir qué es este artefacto:

| Objetivo | Qué priorizar |
|---|---|
| **(a) Demo de portfolio** | Fase 0 + Fase 1: credibilidad, deploy público, tour guiado, case study |
| **(b) Validación con usuarias reales** | + Fase 2: loops cerrados, onboarding, analítica, PWA |
| **(c) Semilla del producto real** | + Fase 3: Vite/TS/tests, services/, backend, líneas rojas de seguridad |

Las prioridades de abajo asumen (a) como mínimo y marcan qué escala hacia (b) y (c).

---

## 1 · Funcionalidades adicionales

### 1.1 Ciclo de vida completo del bono: consumo, agotamiento y recompra — **Alta · ⚡ Quick Win**
Al confirmar una reserva con `method:'bono'`, incrementar `usados`, pasar a `exhausted`
al agotarse y recalcular `daysLeft` contra la fecha real. Extensión (⏳): con el bono al
80% o a <14 días, CTA de recompra en dashboard y Mis bonos con salto directo a `bono-resumen`.
La sección "Anteriores" y el semáforo de urgencia ya existen pero son inalcanzables hoy.
- **Beneficio:** cierra el bug más visible del prototipo y crea el motor de ingresos
  recurrentes — la recompra proactiva es la palanca nº1 de LTV en modelos prepago.
- **Evidencia:** `App.jsx:208` (único `setUserBonos`, solo en compra), `ScreenCheckout.jsx:7-9`
  (detección de bono ya funciona), `ScreenMisBonos.jsx:119-136` (sección inalcanzable).

### 1.2 Mis reservas: agenda con cancelación y modificación — **Alta · ⏳ Medio**
Guardar el booking confirmado en `userBookings` (persistido) y crear la pantalla
"Mis reservas": próximas sesiones, acceso a la llave desde cada una, y cancelación
aplicando la política que la propia FAQ ya documenta (gratis hasta 4 h antes, 50% después),
devolviendo el acceso al bono si procede.
- **Beneficio:** cierra el hueco más grave del ciclo de vida (hoy la reserva pagada
  desaparece) y habilita cancelaciones, imprescindibles antes de cualquier piloto real.
- **Evidencia:** `App.jsx:111` (onSuccess navega a `key` sin guardar), `ProfileSubScreens.jsx:279-285`
  (botón "Cancelar reserva" sin onClick), `Screen2Dashboard.jsx:55-59` (sesión hardcodeada).

### 1.3 Gamificación viva: XP, badges y rachas alimentados por acciones reales — **Alta · ⏳ Medio**
Un pequeño bus de eventos (`awardXp` / `unlockBadge` / `registerSession`) para que reservar,
comprar un bono, completar una lección o referir otorguen XP y desbloqueen badges en tiempo
real, con toast "+50 XP". Toda la UI existe (niveles, 16 badges con XP definido, racha,
sesión gratis cada 20): solo faltan las mutaciones. Persistir `gameData` en localStorage.
- **Beneficio:** el pilar de retención pasa de póster estático a mecánica demostrable;
  valida la economía de XP ya diseñada sin necesidad de backend.
- **Evidencia:** `App.jsx:28` (`const [gameData]` sin setter), `ScreenGamificacion.jsx:14-31`
  (BADGES define recompensas que nada otorga).

### 1.4 Loop curso→box: completar lecciones y "practícala en tu próxima sesión" — **Alta · ⚡ Quick Win**
"Marcar como vista" en el reproductor (o auto-completar al cerrar), convertir `userCurso`
en array (hoy comprar un 2º curso destruye el anterior, contradiciendo el "acceso de por
vida") y CTA inverso: al completar una lección, "Practica la Ayesha en un box · desde 12 €".
- **Beneficio:** une los dos productos (contenido + espacio) en un hábito que se
  retroalimenta — el diferenciador que ni las apps de cursos ni las de reservas pueden copiar.
- **Evidencia:** `ScreenCursos.jsx:341-345` ("Cerrar clase" no marca nada), `App.jsx:141`
  (sobrescribe `userCurso`), `Screen3Book.jsx:90-99` (la sugerencia de clase ya existe).

### 1.5 Referidos funcionales: compartir real + canje en el registro — **Alta · ⚡ Quick Win**
Dar handler al botón "Compartir código de invitación" (`navigator.share` con fallback a
portapapeles + toast), mover `PB-LAURA-042` a estado, y añadir campo de canje en el
AuthWall de registro que simule la recompensa (+1 acceso, +100 XP) vía el bus de gamificación.
- **Beneficio:** activa el único canal de adquisición orgánica del producto, cuyo CTA
  principal hoy está muerto; permite contar el loop completo invitar → registrarse → recompensa.
- **Evidencia:** `ScreenGamificacion.jsx:236` (botón sin onClick), `AuthWall.jsx:101-114`
  (registro sin campo de código).

### 1.6 Botón de emergencia real y protocolo SOS — **Alta · ⚡ Quick Win (demo) / 🏔 Largo plazo (real)**
El botón "Emergencia · Contactar soporte" de la llave digital está muerto
(`Screen4Key.jsx:245-250`, sin onClick) y la FAQ promete "soporte te abre remotamente"
sin que exista ese concepto. En demo: sheet de emergencia con llamada, apertura remota
simulada y contacto de emergencia del perfil. En producto real: flujo SOS completo,
waiver de responsabilidad y seguro de accidentes.
- **Beneficio:** pole dance es actividad de riesgo practicada en solitario de madrugada en
  sedes sin personal — esto es condición de viabilidad del modelo, no un nice-to-have.

### 1.7 Motor de promociones: aplicar de verdad el "-50% primera sesión" — **Media · ⚡ Quick Win**
El hero de la home anuncia el descuento pero el funnel nunca lo aplica. Capa de promos en
checkout: descuento automático de primera reserva (detectable con `userBookings` vacío),
campo de código promo, línea de descuento reutilizando el patrón visual del descuento por bono.
- **Beneficio:** palanca directa de conversión invitada→primera reserva; sin ella la
  promesa del home es publicidad engañosa incluso en demo.
- **Evidencia:** `Screen1Home.jsx:67` (promo huérfana), `ScreenCheckout.jsx:70-78`
  (desglose con línea de descuento ya construida).

### 1.8 Onboarding post-registro: nivel, objetivos y sede habitual — **Media · ⏳ Medio**
Tras el AuthWall (hoy autentica al instante sin capturar nada), 3 pantallas: nivel de pole,
objetivo (fuerza / coreografía / competir) y sede habitual — que precargan favorita,
recomiendan curso del catálogo (campo `level` ya existe) y fijan nivel inicial de gamificación.
- **Beneficio:** acelera la activación (la primera reserva llega antes si la app ya sabe tu
  sede y nivel) y hace creíble el registro en demos, que hoy es un tap vacío.

### 1.9 Reserva recurrente: "tu hueco de los jueves" — **Media · ⏳ Medio**
Al confirmar, ofrecer "Repetir cada semana" (misma franja/box/sede N semanas, cobrando por
sesión con bono o tarjeta) y dar onClick real a los botones de quick-rebook del dashboard,
hoy muertos (`Screen2Dashboard.jsx:192-208`). El anti-gap ya valida disponibilidad.
- **Beneficio:** el hábito semanal fijo es el mayor predictor de retención en fitness y
  encaja con el modelo de bonos (bono de 10 = 10 semanas aseguradas).

### 1.10 Valoración post-sesión y reseñas reales de sede — **Media · ⏳ Medio**
Al salir de la llave (momento natural de fin de sesión), sheet de valoración: estrellas,
chips de motivo (limpieza, barra, sonido) y comentario, recompensado con XP. Alimenta el
rating de las tarjetas de sede, hoy cifras inventadas e inconsistentes. Añadir un canal
separado de **reporte de incidencias** (una barra floja es un riesgo físico, no una reseña).
- **Beneficio:** prueba social auténtica para conversión + señal operativa por box,
  crítica en un modelo sin personal en sede.

### 1.11 Centro de notificaciones — **Media · ⏳ Medio** *(demo-only sin PWA)*
Campana en dashboard (icono `bell` ya existe en Atoms) con: recordatorio 1 h antes, código
de locker pendiente (hoy irrecuperable tras la confirmación), bono a punto de caducar,
racha en peligro, y "se liberó tu hora favorita" como lista de espera ligera.
- **Beneficio:** las notificaciones son el mecanismo de retención nº1 en fitness — pero
  **sin PWA/push (ver 4.13) no hay canal de entrega real**: declararlo demo-only o
  acompañarlo de PWA.

### 1.12 "Entrena con una amiga": el aforo 2 como loop de adquisición — **Media · ⏳ Medio**
Paso opcional "Invitar acompañante" en la reserva: link/QR; si la invitada se registra,
ambas ganan (+XP titular, descuento primera sesión invitada). Se apoya en el aforo 2 por
box ya documentado y los badges `referida-1/5` ya definidos. La llave dual y el pago
dividido (Bizum) son fase 2 con backend — no simularlos ahora.
- **Beneficio:** cada reserva se convierte en canal de adquisición con contexto perfecto;
  ningún competidor de reserva de salas lo trabaja.

### 1.13 Diario de progreso en vídeo (grabado por la usuaria) — **Media · 🏔 Largo plazo**
Galería "Mi progreso" en perfil: clips por fecha/sede/truco vinculados a lecciones, y
compartir a comunidad/ranking. **Importante:** la propia app promete "Sin cámaras dentro
de los boxes · Por tu privacidad" (`ProfileSubScreens.jsx:390`) — el enfoque correcto es
el *set de grabación* (trípode + ring light) para el móvil de la usuaria, nunca cámaras
del local en los boxes.
- **Beneficio:** el vídeo de progreso es el contenido más compartido del mundo pole
  (adquisición orgánica en Instagram/TikTok) y el motivo nº1 para volver a repetir el truco.

### 1.14 Clases dirigidas y eventos en sede — **Media · 🏔 Largo plazo**
Calendario de eventos por sede: masterclass presenciales, quedadas por nivel y la
exhibición anual que el ranking ya anuncia como premio (hoy un banner sin pantalla).
Plazas limitadas, pago con bono o único.
- **Beneficio:** rompe el techo del "solo alquiler de sala" con un segundo motivo de
  visita de mayor ticket y crea comunidad física — lo que más reduce churn en boutique fitness.

### 1.15 Gestión de cuenta completa — **Media · ⏳ Medio**
Recuperación de contraseña, cierre/borrado de cuenta (obligación RGPD), exportación de
datos y edición de credenciales. Hoy no existe ninguno de estos flujos.
- **Beneficio:** requisito legal (RGPD) y de confianza antes de cualquier usuario real.

### 1.16 Comunicaciones transaccionales y facturación conectada — **Media · ⏳ Medio**
La UI de facturas con IVA descargables ya existe en el perfil pero está hardcodeada.
Conectar las compras reales (bono, reserva, tienda) con la generación de recibo/factura
y emails de confirmación (simulados en demo).
- **Beneficio:** obligación legal en España; además el historial deja de contradecir lo
  que la usuaria acaba de comprar.

---

## 2 · Diseño y usabilidad (UX/UI)

### 2.1 Pase de credibilidad: los 4 bugs que rompen la ilusión — **Alta · ⚡ Quick Win**
Antes de enseñar la demo a nadie:
1. **Pagar con bono lleva a Stripe con el precio completo** y nunca descuenta accesos —
   bifurcar `onPay`: si `method==='bono'`, confirmación directa + `usados+1` + navegar a llave.
   Hoy el checkout dice "Total 0,00 €" y acto seguido la pasarela cobra 20 € (`App.jsx:101-105`,
   `ScreenStripe.jsx:51`).
2. **La sede elegida se pierde**: `onPickVenue` ignora el id (`App.jsx:66`), `selectedVenue`
   nunca llega a `Screen3Book`, y el checkout hardcodea "Madrid · Salamanca"
   (`ScreenCheckout.jsx:59`). Incluir `venueId/venueName` en el booking y derivar los boxes
   de la sede real (Malasaña tiene 3).
3. **La tarjeta añadida desaparece**: `App.jsx:158` descarta el payload de `onSaved` y la
   lista de métodos de pago es fija (`ProfileSubScreens.jsx:17-20`). Elevar `cards` a estado.
4. **El bono seed está caducado** (expira "30 ene 2026" con `daysLeft: 91` estático,
   `App.jsx:19-23`): calcular fechas relativas a hoy.
- **Beneficio:** el mayor ROI por hora invertida del repo — un reclutador o inversor que
  complete el flujo no encuentra contradicciones.

### 2.2 Formularios que pierden el foco y slider que rebota — **Alta · ⚡ Quick Win**
`Field`/`FInput` se definen **dentro del render** del padre: React crea un tipo nuevo por
render y desmonta el input en cada pulsación (una letra por tap en dirección de envío,
alta de tarjeta, editar perfil). Peor: `Slider` vive dentro de `Screen4Key`, cuyo countdown
hace setState cada segundo — el drag-to-unlock se resetea a mitad de gesto. Extraer todos
a nivel de módulo (~30 min, 4-5 archivos) y añadir alternativa accesible al slider
(mantener pulsado / teclado).
- **Beneficio:** elimina el bug de usabilidad más visible y estabiliza el gesto estrella
  del pitch (abrir el box), hoy una lotería de timing delante del público.
- **Evidencia:** `ScreenStoreAddress.jsx:15`, `ScreenAddPayment.jsx:108`,
  `ProfileSubScreens.jsx:1197`, `Screen4Key.jsx:109-121`.

### 2.3 Reflejar la reserva pagada en dashboard y llave digital — **Alta · ⏳ Medio**
Tras pagar, la reserva desaparece: `Screen4Key` no recibe el booking (countdown fijo
45:20/60 min, "BOX 1" hardcodeado) y el dashboard enseña una sesión ficticia de las 18:00.
Guardar en `userBookings`, pasar el booking a la llave (box, hora fin, duración reales) y
pintar la próxima sesión real con estado vacío "No tienes sesiones — reserva ahora".
*(Base de la funcionalidad 1.2.)*
- **Beneficio:** cierra el feedback loop más importante (pagué → tengo mi sesión y mi
  llave), el journey diferencial del producto.
- **Evidencia:** `App.jsx:114`, `Screen4Key.jsx:108-119, 208`, `Screen2Dashboard.jsx:4-11, 55-59`.

### 2.4 Guards de precondición + persistencia del estado de demo — **Alta · ⚡ Quick Win**
`pb_screen` persiste en localStorage pero booking/carrito/pendingBono son efímeros.
Síntomas reales verificados: recargar en `bono-resumen` deja el teléfono **en blanco**
(`ScreenBonos.jsx:230` devuelve null); recargar en `checkout` muestra **datos ficticios**
(fallback de `ScreenCheckout.jsx:4`); `store-order` muestra un pedido vacío de 0 €.
Solución doble: (1) mapa de precondiciones que redirija al inicio del flujo + default del
switch → dashboard/home; (2) extender el patrón `useScreen` a `userBonos`, `userCurso`,
`storeCart` y `gameData` con JSON, y botón "Reset demo" en la toolbar.
- **Beneficio:** prototipo a prueba de presentador — ninguna recarga o salto por toolbar
  deja una pantalla rota; las compras sobreviven entre sesiones de demo.

### 2.5 Tabs bloqueadas que explican por qué — **Media · ⚡ Quick Win**
El candado visual ya existe y **ya se usa** en la home de invitada
(`Screen1Home.jsx:344` bloquea reservas, tienda y perfil), pero tocar una tab bloqueada no
hace *nada* (`Atoms.jsx:105` hace return sin feedback). Añadir `onLockedTab` que abra el
AuthWall en modo registro con copy contextual ("Crea tu cuenta para reservar"),
reutilizando la continuación post-auth que ya existe (`App.jsx:327-333`).
- **Beneficio:** convierte un tap muerto en punto de conversión, alineado con el patrón de
  muro tardío que la app ya hace bien en checkout.

### 2.6 Una sola pasarela por compra — **Media · ⚡ Quick Win**
Comprar bono o curso encadena DOS pantallas de pago (`ScreenStorePayment` con un
"Paso 3 de 3" de un wizard que no existe en ese contexto + `ScreenStripe`). La tienda usa
una sola. Unificar e introducir prop `showSteps`.
- **Beneficio:** el flujo que genera el ingreso recurrente pasa de 5 a 4 pantallas y
  desaparece la sensación de "pagar dos veces".
- **Evidencia:** `App.jsx:130-138, 194-202`, `ScreenStorePayment.jsx:32-40`.

### 2.7 Button con estados reales: disabled, loading y semántica — **Media · ⚡ Quick Win**
El átomo `Button` no soporta `disabled` ni `loading`: los CTA "apagados" son opacity +
onClick undefined (parece un bug), y durante los pagos simulados el back sigue activo.
Añadir `disabled` (atributo real + aria), `loading` (spinner) y hint de qué falta
("Selecciona una hora para continuar").
- **Beneficio:** consistencia (hoy `ScreenStorePayment` usa disabled real y sus hermanas
  no), semántica de teclado/lector, y fin de los falsos CTA activos.
- **Evidencia:** `Atoms.jsx:168-187`, `Screen3Book.jsx:279-289`, `ScreenStoreAddress.jsx:93`.

### 2.8 Back predecible en todo el funnel — **Media · ⚡ Quick Win**
Tres backs teletransportan: en `Screen3Book` el back autenticada salta a dashboard en vez
de a select-sede; gamificación siempre vuelve a profile aunque entres desde dashboard; la
reserva con bono entra por dos rutas inconsistentes. Guardar `returnTo` o normalizar: back
siempre un paso atrás.
- **Evidencia:** `App.jsx:93, 118, 75 vs 180`.

### 2.9 Persistir el pedido de tienda: locker recuperable e historial vivo — **Media · ⏳ Medio**
Nº de pedido y código de locker se generan con `Math.random` al montar la confirmación y
son irrecuperables al salir ("Guárdalo en un lugar seguro" traslada el problema a la
usuaria). Crear entidad `Order` al pagar (con el total **cobrado**, no recalculado del
carrito vivo) y alimentarla al historial del perfil, hoy una lista fija desconectada.
- **Evidencia:** `ScreenStoreConfirm.jsx:4-12`, `ProfileSubScreens.jsx:669-682`, `App.jsx:272`.

### 2.10 Estados vacíos, de carga y de error como sistema — **Media · ⏳ Medio**
El prototipo no tiene rama de error en ningún pago (timers que siempre triunfan), ni
estados vacíos (dashboard sin reservas, Mis bonos sin bonos tras expirar, carrito vacío).
Diseñarlos como parte del design system.
- **Beneficio:** imprescindible para user testing; además los estados de error de pago son
  de los momentos de mayor abandono real.

---

## 3 · Puesta en valor del producto

### 3.1 Demo pública desplegada + modo "tour guiado" — **Alta · ⚡ Quick Win (deploy) / ⏳ Medio (tour)**
Sin build system, publicar en GitHub Pages / Cloudflare Pages es trivial (existe incluso el
standalone de un archivo). Después, sustituir la toolbar de 28 chips por un tour de
5 historias narradas con estado precargado: "Reserva tu box", "Compra un bono",
"Curso + casting en el box", "Tienda con locker", "Gamificación".
- **Beneficio:** un link compartible en CV/LinkedIn que cualquiera entiende sin
  instrucciones — la diferencia entre "un repo" y "un producto que se puede tocar".

### 3.2 Posicionamiento explícito: "tu box privado 24/7", no "clases de pole" — **Alta · ⚡ Quick Win**
Frente a Momence/Mindbody/ClassPass (clases colectivas con horario) y gimnasios (espacio
compartido), el activo diferencial es el **box privado autónomo**: llave digital, 24/7,
aforo 2, luces controlables, clase en la TV del box. Reescribir hero y "Cómo funciona"
alrededor de privacidad + autonomía + contenido, con comparativa directa ("sin horarios,
sin esperar barra libre, sin público"). **Coordinar el copy con 1.13/3.6**: la promesa
"sin cámaras en los boxes" ya escrita es compatible con el set de grabación para el móvil
de la usuaria — pero hay que contarlo con esa precisión.
- **Beneficio:** diferenciación defendible que ningún estudio con software genérico puede
  copiar sin reformar el local; tesis de negocio clara que también luce en portfolio.

### 3.3 Case study escrito: decisiones de producto + métricas simuladas — **Alta · ⏳ Medio**
Empaquetar como caso de producto: problema → solución → decisiones argumentadas. El
material ya está en el código: auth tardío pre-pago, algoritmo anti-huecos explicado a la
usuaria, semáforos de caducidad, condiciones del Bono Mañanas. Añadir funnel de métricas
**declaradas como simuladas** (visita→registro→primera reserva→bono, ocupación por franja,
LTV por tipo de bono) presentadas como hipótesis a validar.
- **Beneficio:** convierte un prototipo de UI en evidencia de pensamiento de producto —
  lo que distingue un portfolio senior. La honestidad sobre los datos evita el efecto contrario.

### 3.4 README y documentación del repo — **Alta · ⚡ Quick Win**
No existe README: cómo ejecutar el prototipo, qué es el standalone, cómo se organiza el
código, capturas y link a la demo desplegada.
- **Beneficio:** barato y obligatorio si el repo es pieza de portfolio — es la primera
  pantalla que ve un evaluador técnico.

### 3.5 Membresía por suscripción como evolución de los bonos — **Media · ⏳ Medio**
El catálogo actual es 100% prepago con caducidad. Añadir tier "POLEBOX Unlimited" (cuota
mensual, X accesos/mes con rollover limitado, prioridad de reserva, descuento en tienda,
cursos incluidos) en el mismo catálogo de tarjetas holográficas (`type:'subscription'`).
- **Beneficio:** MRR predecible y LTV muy superior (la membresía retiene 3-4× más que el
  bono suelto); demuestra que entiendes la escalera de monetización completa.

### 3.6 B2B y eventos: el box como plató y espacio privado — **Media · ⏳ Medio**
El producto ya lo insinúa (ambiente LED "Grabación", FAQ sobre grabar con tu móvil).
Categoría de reserva "Sesión de grabación / evento" (2-4 h, ticket 80-200 € vs 12-15 €,
set trípode+ring light incluido) para instructoras-creadoras, shootings y celebraciones.
- **Beneficio:** ticket alto sobre capacidad ociosa ya pagada, dirigida a un segmento
  (creadoras de pole en Instagram/TikTok) que además genera marketing orgánico.

### 3.7 Precios dinámicos off-peak: generalizar el Bono Mañanas — **Media · ⏳ Medio**
La semilla existe (Bono Mañanas: horas valle L-V con -40%). Siguiente paso: precio por
franja en la reserva suelta — el selector anti-gap ya conoce la ocupación por slot, puede
pintar "17:00 · 12 €" vs "19:00 · 15 €".
- **Beneficio:** llenar horas valle con coste hundido es margen casi puro — la métrica que
  decide la viabilidad de un negocio de espacio por horas. Gran historia de pricing para el case study.

### 3.8 Panel "operadora": el otro lado del negocio — **Media · ⏳ Medio**
Dashboard de la dueña del estudio (pantalla extra fuera del teléfono): mapa de calor de
ocupación por box/franja, revenue por sede, % bono vs suelta, huecos muertos evitados por
el anti-gap. Datos extrapolables del modelo ya existente (`existingByBox`, tarifas, OPEN/CLOSE).
- **Beneficio:** eleva el portfolio de "app de consumidor bonita" a "sistema de negocio
  completo" — exactamente lo que Momence/Mindbody venden al estudio.

### 3.9 Analítica de producto: instrumentación de eventos — **Media · ⏳ Medio**
El bus de eventos de gamificación (1.3) es el lugar natural para emitir también eventos de
analítica (screen views, funnel de reserva, abandono de checkout). En demo basta un logger
+ un panel simple; en piloto, un Amplitude/PostHog gratuito.
- **Beneficio:** sin esto, la fase "validación con usuarias reales" que varias propuestas
  invocan no puede medir nada.

### 3.10 Marketplace de instructoras — **Baja · 🏔 Largo plazo**
Instructoras verificadas (el flujo KYC ya diseñado es reutilizable) publican disponibilidad
para clases particulares en los boxes; POLEBOX cobra el box + take rate. Para el prototipo,
solo un teaser de catálogo; el negocio real exige pagos split, agenda y confianza.
- **Beneficio:** efecto red (instructoras traen alumnas) y diferenciación definitiva:
  de vender espacio a orquestar la oferta.

---

## 4 · Mejoras técnicas y calidad del código

> **Criterio transversal de seguridad (aplicar YA, no en el futuro):** no seguir
> invirtiendo en formularios propios de tarjeta. `ScreenStripe.jsx:65-80` precarga un PAN
> editable y `ScreenAddPayment.jsx:42-81` recoge número/CVC en cliente: en producto real
> eso mete a la empresa en alcance PCI DSS. Cualquier evolución debe ir hacia Stripe
> Elements/Checkout. Lo mismo con el KYC (DNI/selfie → proveedor tipo Stripe Identity, nunca
> almacenamiento propio) y la llave digital (token firmado de corta vida validado por
> servidor, no estado local).

### 4.1 Migrar a Vite: eliminar Babel standalone y React dev por CDN — **Alta · ⏳ Medio**
Hoy el navegador descarga React development + Babel de unpkg y compila ~700 KB de JSX en
runtime, con 23 `<script type="text/babel">` en orden frágil y `Object.assign(window, …)`
como sistema de módulos. Migración mecánica: imports ES por archivo, `package.json`,
`vite.config`. Es la propuesta *puerta*: habilita todo lo demás (TS, tests, CI, singlefile).
- **Beneficio:** arranque en milisegundos, errores en build y no en la consola del cliente,
  HMR para iterar.
- **Evidencia:** `index.html:14-16, 20-44`, `Atoms.jsx:189`.

### 4.2 Generar el standalone desde el build y borrar el duplicado de 674 KB — **Alta · ⚡ Quick Win (tras 4.1)**
`POLEBOX-standalone.html` duplica íntegramente el código (el objeto PB en su línea 179,
`__pbTabNav` en 282 y 7197, 25 bloques text/babel) y diverge en cuanto se toca
`/components`. Con Vite instalado, `vite-plugin-singlefile` produce ese artefacto en cada
build. **Nota:** requiere 4.1 primero — hoy no hay package.json ni tooling alguno.
- **Beneficio:** elimina el mayor pasivo de mantenimiento del repo; una sola fuente de verdad.

### 4.3 Extraer los componentes definidos dentro del render — **Alta · ⚡ Quick Win**
La causa raíz de 2.2 (foco perdido, slider que rebota). Regla `react-hooks` de ESLint la
habría detectado. Tarea mecánica en 4-5 archivos, sin cambio visual.

### 4.4 Capa de datos canónica: unificar datasets y catálogos en `/data` — **Alta · ⚡ Quick Win**
Existen **tres definiciones contradictorias de sede** (`Screen1Home.jsx:10-15` con
3 boxes y mad-chamberi; `ScreenVenue.jsx:7-12` con "C/ Velázquez 42"; `ScreenSelectSede.jsx:3-112`
canónica con "C/ Jorge Juan, 24") más una cuarta lista en la tienda. Los catálogos
(`BONO_CATALOG`, `COURSE_CATALOG`, `STORE_PRODUCTS`) son window globals dependientes del
orden de carga. Crear `data/venues.js`, `bonos.js`, `courses.js`, `products.js` con campos
derivados calculados (perAcceso, saving) y **borrar `ScreenVenue.jsx`, código muerto sin
case en el router**.
- **Beneficio:** coherencia visible en demo (misma dirección/boxes/rating en todas las
  pantallas), un solo lugar para editar contenido, y la forma de dato que devolverá la API real.

### 4.5 Bus de eventos ligero ahora; store centralizado solo si escala — **Media · ⏳ Medio**
`App.jsx` mantiene 15+ `useState` con prop drilling, la lógica de dominio vive en callbacks
del router (crear bono con fechas en `App.jsx:203-222`), y `window.__pbTabNav` se reasigna
en cada render duplicando la navegación de TabBar. Para la fase demo, un dispatcher ligero
de acciones nombradas (RESERVA_PAGADA, BONO_COMPRADO, LECCION_COMPLETADA) que alimente
gamificación y analítica logra el 90% del valor con el 10% del esfuerzo. El store completo
(useReducer+Context o Zustand) y la eliminación de `__pbTabNav` quedan condicionados a que
el prototipo sea semilla del producto (fase c).
- **Evidencia:** `App.jsx:12-48, 53-58`, `Atoms.jsx:104-108`.

### 4.6 Unificar tokens de diseño: PB derivado de las custom properties CSS — **Media · ⚡ Quick Win**
Los tokens viven por triplicado (`colors_and_type.css:13-103`, objeto `PB` de
`Atoms.jsx:4-15`, y la copia del standalone) y hay **cero usos de `var(--pb-*)` en
components/**. PB además omite espaciado/radios/sombras/motion (literales `borderRadius:14`
y `cubic-bezier(.2,.7,.2,1)` repetidos por doquier) y existen typos con fallback silencioso
(`PB.info_bg`, `PB.menta_deep` — inexistentes). Generar PB desde el CSS o viceversa, y
completar los tokens que faltan.
- **Beneficio:** cambiar un color de marca pasa de editar 3 archivos a 1; los tokens de
  espaciado dejan de ser letra muerta.

### 4.7 Utilidades de dominio compartidas — **Media · ⚡ Quick Win**
El cálculo de subtotal del carrito está copiado en 4 pantallas, el formateador de moneda
en 5, la constante de envío 4,99 triplicada, y el formateador de fechas vive dentro de un
callback de `App.jsx:207`. Extraer `utils/money.js` (Intl.NumberFormat es-ES),
`utils/dates.js`, `domain/cart.js` con `SHIPPING_COST`; la confirmación debe usar el total
**cobrado** (`storeTotal`) en vez de recalcular.
- **Evidencia:** `ScreenStore.jsx:30`, `ScreenStoreCart.jsx:9,13`, `ScreenStoreOrder.jsx:4,8`,
  `ScreenStoreConfirm.jsx:9-12`.

### 4.8 API mock asíncrona con contrato estable (`services/`) — **Media · ⏳ Medio**
Envolver el acceso a datos en servicios async (`api.getVenues()`, `api.getAvailability()`,
`api.createBooking()`…) que devuelven fixtures con latencia simulada. La disponibilidad
hardcodeada (3 reservas idénticas los 10 días, ignorando día y sede —
`Screen3Book.jsx:33-40`) pasa a mock parametrizado por sede+día.
- **Beneficio:** cuando exista backend se sustituye la implementación sin tocar pantallas;
  obliga a diseñar hoy los estados de carga/error; la demo gana credibilidad (la
  disponibilidad cambia al cambiar de día o sede).

### 4.9 Accesibilidad técnica — **Media · ⚡ Quick Win**
`aria-hidden` en los 31 SVG de `Icon` (con prop `label` opcional), `aria-current` en
TabBar, filas del perfil como `<button>` en vez de `<div onClick>` (`Screen5Profile.jsx:5`),
`tel:`/`mailto:` en soporte, alternativa de teclado en el Slider, y revisar el ocultado
global de scrollbars (`index.html:12`).
- **Beneficio:** navegable por teclado y lector de pantalla — relevante para user testing
  y para no arrastrar deuda estructural a la app real.

### 4.10 PWA: manifest, service worker e instalabilidad — **Media · ⏳ Medio**
Es una app móvil que solo existe en un navegador desktop con marco de teléfono. Con
manifest + SW se instala en el móvil real y habilita push — el canal de entrega que
necesitan las notificaciones (1.11) para ser reales incluso en piloto.

### 4.11 Tests de la lógica pura + CI mínimo — **Media (si fase b/c) · ⏳ Medio**
Hay lógica real que merece regresión: el anti-gap de slots (puro, reglas no triviales),
la validación de tarjeta (BIN, caducidad — y añadir Luhn, que falta), compatibilidad de
bonos, caducidades. Vitest + ESLint (con `react-hooks/rules-of-hooks`, que habría cazado
los componentes-dentro-del-render) + GitHub Actions. Condicionado a Vite (4.1).

### 4.12 TypeScript progresivo — **Baja (condicional a fase c) · 🏔 Largo plazo**
Tipar primero el dominio (Venue, Booking, Bono, Curso, GameData). Los tipos habrían
atrapado los defectos actuales: booking sin venueId, `ScreenStripe` recibiendo tanto un
Booking real como el objeto sintético `{price, label}`, y `venueId/selectedVenue`
asignados pero jamás leídos.

### 4.13 Router real con guards — **Baja (condicional a fase c) · ⏳ Medio**
El switch de ~34 strings sin historial ni deep links se tolera en demo si 2.4 (guards
baratos) está hecho. react-router/wouter con loaders y URLs compartibles solo si el
prototipo evoluciona a producto.

### 4.14 i18n: extraer strings — **Baja · ⏳ Medio**
Todo el copy está hardcodeado en JSX en español. Para Madrid/Barcelona (catalán cooficial,
clientela internacional de pole), extraer a estructura de strings — que además abarata el
A/B de copy del posicionamiento (3.2).

### 4.15 Hoja de ruta hacia backend real — **Alta (dirección) · 🏔 Largo plazo (ejecución)**
Camino incremental sobre `services/` (4.8): (1) auth real (Supabase/Firebase u OAuth
propio — hoy el AuthWall autentica con campos vacíos); (2) reservas con disponibilidad
server-side moviendo el anti-gap al servidor con bloqueo transaccional de slots; (3) pagos
con Stripe Checkout/PaymentIntents + webhooks; (4) llave digital como token firmado de
corta vida contra el hardware de acceso (Salto/Nuki/TTLock), con fallback operativo sin
cobertura y protocolo si falla a las 3 AM; (5) el código de locker deja de ser un
`Math.random` irrecuperable.
- **Beneficio:** convierte el prototipo en producto sin rehacer la UI, y evita los dos
  errores más caros del sector: entrar en alcance PCI y custodiar documentos de identidad.

---

## Huecos transversales (ninguna dimensión los cubría)

| Tema | Por qué importa | Prioridad |
|---|---|---|
| **Legal/RGPD visible** | Consentimiento real en registro, derechos RGPD (borrado/exportación), edad mínima, tratamiento de imagen si hay vídeo | Alta antes de piloto |
| **Seguridad física / SOS** | Botón de emergencia muerto (`Screen4Key.jsx:245-250`); waiver + seguro en actividad de riesgo sin personal | Alta (ver 1.6) |
| **Modelo operativo multi-sede** | Limpieza/turnover entre reservas (¿buffers en el anti-gap?), mantenimiento, incidencias, reposición de lockers | Media (fase b/c) |
| **Hardware IoT de acceso** | El componente más crítico y diferencial del negocio no tiene ítem propio de roadmap | Alta en fase c (ver 4.15) |

---

## Secuencia recomendada

**Fase 0 — Credibilidad (días):** 2.1 (pase de credibilidad) · 2.2/4.3 (componentes en
render) · 2.4 (guards + persistencia) · 3.4 (README) · 1.6 versión demo (botón SOS).

**Fase 1 — Demo pro / portfolio (1-2 semanas):** 3.1 (deploy + tour) · 1.1 (ciclo del
bono) · 1.4 (loop curso→box) · 1.5 (referidos) · 1.3 (gamificación viva) · 4.4 (datos
canónicos) · 4.7 (utils) · 3.2 (posicionamiento) · 3.3 (case study) · 2.5-2.8 (fricciones UX).

**Fase 2 — Validación con usuarias (3-6 semanas):** 1.2 (mis reservas + cancelación) ·
2.3 (reserva viva en dashboard/llave) · 1.8 (onboarding) · 1.7 (promos) · 2.9-2.10
(pedidos y estados) · 3.9 (analítica) · 4.10 (PWA) · 1.11 (notificaciones) · 4.1-4.2
(Vite + standalone generado) · legal/RGPD básico.

**Fase 3 — Semilla de producto (meses):** 4.15 (backend + llave IoT) · 4.5 (store) ·
4.11-4.13 (tests/TS/router) · 3.5 (suscripción) · 3.7 (pricing dinámico) · 3.8 (panel
operadora) · 1.9/1.10/1.12-1.14 · 3.10 (marketplace).

---

*Documento generado a partir de un análisis multi-agente del código con verificación
adversarial de cada hallazgo contra el repositorio (referencias archivo:línea comprobadas).*
