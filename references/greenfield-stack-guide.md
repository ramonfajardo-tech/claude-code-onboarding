# Guía de decisión de stack para greenfield

El dev está arrancando un proyecto desde cero y todavía no decidió qué usar. Esta guía **no prescribe** un stack; guía una conversación estructurada para que el dev llegue a una decisión informada.

La IA no debe elegir el stack por el dev. La IA puede listar opciones, explicar tradeoffs, y evitar que el dev caiga en combinaciones conocidas problemáticas.

---

## Principios antes de empezar la conversación

1. **No hay "mejor stack" universal.** Cada decisión tiene tradeoffs. "React vs Angular" no tiene respuesta absoluta; depende del equipo, del dominio, del horizonte.

2. **El stack que el dev conoce es casi siempre la respuesta correcta para greenfield serio.** Un proyecto en producción hecho con un stack desconocido se convierte en una pesadilla de mantenimiento.

3. **Hype ≠ valor.** El framework "del momento" puede no tener la madurez que tu proyecto necesita.

4. **Boring es bueno.** Stacks maduros con comunidad grande tienen más respuestas a preguntas en Stack Overflow, Google, o su IA favorita.

5. **Si es un proyecto experimental / aprendizaje,** las reglas cambian — podés priorizar aprender algo nuevo sobre el óptimo para producción.

---

## Árbol de preguntas

### Paso 1 — ¿Qué tipo de software vas a hacer?

1. **Backend** (API, servicio que expone endpoints, worker, job scheduler).
2. **Frontend web** (SPA, sitio marketing, dashboard, tool interno).
3. **Full-stack web** (web app con backend propio).
4. **Desktop** (aplicación que corre local en Windows/Mac/Linux).
5. **Mobile** (iOS, Android, o ambos).
6. **Librería** (código para que otros devs consuman).
7. **CLI** (herramienta de línea de comandos).
8. **Otro** (scripts, notebooks, bots, etc.).

Algunas decisiones atan tipos entre sí (ej: mobile híbrido con Capacitor/Ionic combina frontend web + wrapper mobile). Preguntá por el caso principal, luego por los secundarios.

### Paso 2 — Contexto del dev y proyecto

1. **¿Con qué lenguajes/stacks tenés experiencia real?** (No "leí un tutorial" — "hice un proyecto de >1 mes").
2. **¿Es proyecto personal, MVP de startup, herramienta interna, o producto de producción a largo plazo?**
3. **¿Trabajás solo o con equipo? Si hay equipo, qué stacks manejan ellos?**
4. **¿Hay restricciones del entorno de deploy?** (solo on-premise, sin Docker, plataformas cloud específicas, etc.).
5. **¿Hay alguna integración forzosa que restrinja el stack?** (SDK oficial solo en un lenguaje, BD forzada por el cliente, etc.).

### Paso 3 — Según tipo, las preguntas clave

---

## Si es backend

**Preguntas decisivas:**

1. ¿Tipado estricto o flexible? (Go/Java/Rust/C# vs Python/Ruby/JS).
2. ¿Cuánto throughput esperás? (cientos vs miles vs decenas de miles de req/s).
3. ¿El dominio requiere lógica compleja (bancario, seguros, ERP) o es principalmente CRUD?
4. ¿Cuán importante es startup rápido y footprint chico? (serverless, containers).
5. ¿Tenés experiencia de equipo con algún lenguaje backend?

**Opciones maduras y sus tradeoffs:**

- **Python (FastAPI / Django / Flask):** curva baja, ecosistema enorme (especialmente ML, data). Throughput medio. Tipado opcional. Bueno para la mayoría de casos.
- **Node.js / TypeScript (Express / NestJS / Fastify / Hono):** mismo lenguaje que frontend si hay uno, async nativo, deploy simple. Ecosistema npm tiene riesgos de supply chain.
- **Java / Kotlin (Spring Boot / Quarkus / Ktor):** muy maduro para dominio complejo, tipado fuerte. Startup lento con Spring "clásico"; Quarkus/Spring Native mejoran. Equipo necesita experiencia JVM.
- **Go:** simple, muy rápido, binarios estáticos. Ideal para CLI, workers, APIs simples. Menos productivo que Python/Node para dominios con lógica rica.
- **Rust (Axum / Actix):** performance tope, seguridad de memoria, muy maduro para sistemas. Curva alta; lento de desarrollar al principio.
- **C# / .NET (ASP.NET Core):** excelente productividad y performance, muy maduro. Excelente en Windows y ahora multiplataforma. Comunidad menor fuera de empresas.
- **Ruby on Rails:** productividad alta en MVPs CRUD. Menor performance, comunidad en declive relativo.
- **PHP (Laravel / Symfony):** subestimado, ecosistema maduro. Sigue siendo razonable para muchos proyectos web.

**Base de datos:**

- **PostgreSQL** es default sensato para casi todo.
- **MySQL/MariaDB** si ya hay expertise o integraciones.
- **SQLite** para apps single-user, embedded, desktop, mobile local.
- **NoSQL (MongoDB, DynamoDB)** si tu modelo de datos realmente no es relacional (raro).
- **Redis/KeyDB** como cache/queue complementario, no como DB primaria.

---

## Si es frontend web

**Preguntas decisivas:**

1. ¿Es SPA compleja, sitio marketing, o dashboard interno?
2. ¿Requiere SEO? (sitio marketing, blog).
3. ¿Equipo grande o solo? (frameworks "opinados" ayudan en equipo).
4. ¿Experiencia previa del dev?
5. ¿Performance y tamaño de bundle son críticos?

**Opciones maduras:**

- **React (Vite / Next.js / Remix):** default popular. Flexibilidad alta = muchas decisiones a tomar (state, routing, data fetching). Next.js resuelve muchas.
- **Angular:** opinado, bueno para equipos grandes y apps empresariales. Curva alta. Default en muchas empresas tradicionales.
- **Vue (Vite / Nuxt):** curva más baja que React/Angular, excelente DX, comunidad activa.
- **Svelte / SvelteKit:** menos overhead, muy productivo, comunidad más chica.
- **Solid:** similar a React API-wise, performance superior, ecosistema más chico.
- **Qwik:** foco en performance inicial (resumable), joven.
- **Vanilla + Web Components:** para librerías reutilizables o sitios simples.

**Build / bundler:**

- **Vite** es default razonable para la mayoría.
- **Webpack** si la toolchain del framework lo impone (Angular CLI ya no).
- **Esbuild/SWC** bajo el capó de muchas opciones modernas.

**CSS:**

- **Tailwind CSS:** muy popular, curva inicial, productividad alta una vez aprendido.
- **CSS Modules / vanilla-extract:** tipado y scope, sin DSL nuevo.
- **Styled Components / Emotion:** CSS-in-JS con JS bundle cost.
- **Librería de componentes (shadcn/ui, Material, Ant Design, Radix):** acelera mucho.

---

## Si es full-stack web

Sumá a lo anterior decisión de separación vs integración:

- **Monolito full-stack (Rails, Django con templates, Laravel, Elixir/Phoenix):** menos ceremonia, deploy único. Ideal para equipos chicos y MVPs.
- **Full-stack JS (Next.js, Remix, Nuxt, SvelteKit):** mismo lenguaje, ecosistema unificado, pero desafíos de escalabilidad según crezcas.
- **Backend separado + frontend SPA:** clara separación de responsabilidades, equipos independientes. Más overhead inicial.

---

## Si es desktop

**Preguntas decisivas:**

1. ¿Una plataforma o multi-plataforma? (Windows/Mac/Linux).
2. ¿Performance nativa crítica o web-view aceptable?
3. ¿Tenés experiencia web que querés aprovechar?
4. ¿Vas a necesitar acceso profundo al sistema (filesystem, serial, drivers)?

**Opciones:**

- **Electron + (React/Angular/Vue/Svelte):** madura, amplia comunidad, cualquier developer web puede producir. Desventajas: tamaño de bundle (>100MB), uso de RAM alto, overhead de Chromium.
- **Tauri:** binaries mucho más chicos y menor RAM que Electron, usa WebView del OS + backend Rust. Curva: necesitás saber (o aprender) Rust para extender el backend. Madura.
- **.NET MAUI / WPF / WinForms:** excelente en Windows, multiplataforma mejorando. Para apps enterprise Windows.
- **Qt (C++ / Python con PySide):** nativo, cross-platform, muy maduro. Curva alta.
- **SwiftUI / AppKit** (solo Mac): nativo óptimo.
- **Flutter desktop:** opción si ya usás Flutter en mobile y querés reutilizar.

---

## Si es mobile

**Preguntas decisivas:**

1. ¿iOS, Android, o ambos?
2. ¿Performance nativa tope o experiencia "buena" alcanza?
3. ¿Equipo tiene experiencia nativa (Swift/Kotlin) o viene de web?
4. ¿Funcionalidades dependen de integraciones con hardware (cámara avanzada, sensores) o son UI + red?

**Opciones:**

- **React Native:** equipo web con experiencia React. Performance cercana a nativo. Ecosistema grande. Requiere conocer algo de nativo para casos avanzados.
- **Flutter:** excelente performance, UI consistente entre plataformas, lenguaje Dart. Ecosistema creciente, comunidad activa.
- **Capacitor + Ionic (+ Angular/React/Vue):** para equipos con stack frontend web que querés wrapear. Performance inferior a RN/Flutter en UIs complejas; buena para apps que son mayormente contenido.
- **Expo** (sobre React Native): acelera mucho para MVPs, ecosistema de librerías curado.
- **Nativo puro (Swift + Kotlin):** máxima performance y acceso a plataforma. Costo: mantener dos codebases.
- **.NET MAUI / Xamarin:** opción para equipos .NET.
- **Kotlin Multiplatform Mobile:** comparte lógica Kotlin entre plataformas, UI nativa.

---

## Si es librería

**Preguntas decisivas:**

1. ¿Quién va a consumirla? (un lenguaje específico, o quiere ser multi-lenguaje).
2. ¿Se distribuye como package (pip, npm, Maven, crates.io) o como fork?
3. ¿Hay restricciones de runtime? (no deps, tamaño mínimo).

Elegí el lenguaje del target. Para multi-lenguaje considerá:
- **Rust** con bindings a otros lenguajes (PyO3, napi-rs, JNI).
- **C/C++** con bindings clásicos.
- **WebAssembly** si los consumidores son browsers o runtimes wasm.

---

## Si es CLI

**Opciones razonables:**

- **Go:** binarios estáticos, single-file distribution, excelente para CLIs.
- **Rust:** binarios chicos y rápidos, muy buen DX con libs como `clap`.
- **Node / TS:** si tus consumidores ya tienen Node, distribución vía npm.
- **Python:** con `pipx` o binarios con PyInstaller. Más lento de startup.
- **Shell / Bash:** solo si es muy simple.

---

## Defaults sensatos si el dev "no sabe y quiere arrancar"

El dev no tiene experiencia fuerte en nada y pide "lo que sea más fácil". Opciones razonables por caso:

- **API simple + frontend:** Next.js (full-stack TS) o SvelteKit.
- **API backend standalone:** FastAPI (Python) o NestJS (TS).
- **Desktop cross-platform:** Tauri + un framework frontend que te atraiga.
- **Mobile cross-platform:** Flutter o React Native + Expo.
- **CLI:** Go.
- **Librería JS:** TypeScript + Vite library mode.
- **Notebook / análisis:** Python + Jupyter.
- **App web interna rápida:** Django + HTMX (sorprendentemente productivo), o Rails 7 con Hotwire.

---

## Señales de que la decisión está mal

Si durante la conversación aparecen estas señales, parate y reevalúa:

- El dev elige el stack "porque es lo que usan en X empresa famosa" pero no tiene esa escala ni ese equipo.
- El dev mezcla tecnologías que se solapan ("React + Angular + Vue") sin una razón clara.
- El dev quiere aprender 3 cosas nuevas al mismo tiempo en un proyecto con deadline.
- El dev elige la tecnología más nueva sin evaluar madurez/comunidad/tooling.
- El dev no considera cómo se va a deployar lo que va a construir.

---

## Después de la decisión

Una vez elegido:

1. Escribí en el `CLAUDE.md` **qué** se eligió y **por qué** en 2-3 líneas. Esto evita discutirlo de nuevo en 6 meses.
2. Setup mínimo: instalar el toolchain, crear el scaffolding, verificar que el "hello world" corra.
3. Linter y formatter configurados desde el primer día.
4. Estructura de carpetas básica.
5. `.gitignore` del stack.
6. Primer commit: `chore: initial scaffold for <stack>`.

Recién después de esto, Fase 3 del onboarding.
