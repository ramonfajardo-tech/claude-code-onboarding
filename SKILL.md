---
name: claude-code-onboarding
description: Guía a un developer (especialmente junior) a incorporar Claude Code a su flujo de trabajo, ya sea arrancando un proyecto desde cero (greenfield) o introduciendo IA a un proyecto existente (brownfield). Úsalo cuando el dev esté empezando a usar Claude Code, pida armar un CLAUDE.md desde cero o revisar el existente, necesite configurar .claudeignore, quiera entender buenas prácticas de seguridad al delegar tareas a la IA, o diga frases como "estoy arrancando con Claude", "primera vez con IA para programar", "no sé cómo empezar", "cómo uso Claude Code con seguridad", "onboarding con IA", "arranco un proyecto nuevo con Claude", "quiero sumar Claude a mi repo existente". Disparalo aunque el dev no nombre explícitamente la skill. NO lo uses para tareas de desarrollo rutinarias cuando el dev ya tiene un CLAUDE.md validado y sabe operar el flujo.
---

# Onboarding a Claude Code

Esta skill guía a un developer — con foco especial en juniors — para que empiece a usar Claude Code con seguridad y buenas prácticas. Sirve tanto para arrancar un proyecto desde cero como para introducir IA a un proyecto existente. No asume empresa, stack, ni siquiera que haya un repo git todavía.

El objetivo al terminar: el dev tiene claridad de cómo delegar a la IA sin romper cosas, un `CLAUDE.md` honesto con el contexto del proyecto, un `.claudeignore` y `.gitignore` razonables, y entiende las trampas típicas para no caer en ellas.

## Principios rectores

1. **No inventes nada.** Un `CLAUDE.md` con datos falsos es peor que no tener `CLAUDE.md`. Si el dev no sabe un dato, anotalo como `TODO: confirmar` y seguí. Si hay archivos en el repo que permiten verificar algo (manifiestos, configs, docs), leelos antes de afirmar.

2. **Seguridad antes que velocidad.** Mejor 10 minutos aprendiendo a cuidar secrets que arrastrar un leak. La Fase 1 (seguridad) va siempre, sin excepción.

3. **Tratá al dev como junior hasta que demuestre lo contrario.** Explicá el porqué con ejemplos concretos de cosas que salen mal. No asumas jerga conocida. Un senior se autodetecta y adapta el tono; un junior necesita la guía.

4. **Stack-neutral.** No asumas Python, Node, ni ningún lenguaje o framework. La skill debe funcionar igual para un backend, un frontend web (Angular/React/Vue), una app desktop con Electron o Tauri, una app mobile (nativa o híbrida con Capacitor/Ionic/React Native/Flutter), una librería, un CLI.

5. **Greenfield ≠ Brownfield.** La entrevista cambia según venga. En greenfield las respuestas son decisiones a tomar; en brownfield son hechos a extraer del código existente.

6. **No inventes stack, repo, ni convenciones.** Si el dev no tiene git inicializado, ayudalo a decidir si corresponde. No asumas que siempre hay que `git init`.

## Supuestos previos

Asumí que cuando invocan esta skill:

- El dev tiene Claude Code instalado y funcionando.
- Está parado en un directorio (vacío, con código suelto, o un repo existente).
- Tiene permisos de escritura en ese directorio.

Si algo de esto no se cumple, pausá y aclará. No es función de esta skill instalar Claude Code ni pedir permisos.

## Flujo general

Siete fases. Al empezar, creá un TodoWrite con las 7 entradas y marcá cada una como completada a medida que avanzás.

0. **Triage** — entender el contexto.
1. **Seguridad (pilar)** — fundamentos antes de cualquier otra cosa.
2. **Setup del proyecto** — ajustado a greenfield o brownfield.
3. **Entrevista + `CLAUDE.md`**.
4. **`.claudeignore`**.
5. **Buenas prácticas de flujo**.
6. **Trampas típicas de juniors**.
7. **Primera tarea de práctica** (opcional).

A lo largo de todo el flujo: explicaciones breves, pausas para preguntas, ejemplos concretos. No sermonees.

---

## Fase 0 — Triage

Saludá corto. Algo del estilo:

> "Arrancamos el onboarding a Claude Code. Te voy a hacer algunas preguntas para entender tu contexto, después vamos a cubrir seguridad (sin saltarla), después armamos un `CLAUDE.md` y un `.claudeignore`, y cerramos con buenas prácticas de flujo. Entre 15 y 30 minutos. No voy a inventar datos — si no sabés algo, lo marcamos pendiente y seguimos."

### Preguntas de triage

Preguntá estos 4 ejes, agrupados:

1. **Tipo de proyecto:** ¿estás arrancando algo nuevo desde cero, o tenés un proyecto existente al que querés sumar Claude?
2. **Tipo de software:** ¿backend (API/servicio)? ¿frontend web? ¿desktop (Electron/Tauri)? ¿mobile (nativo o híbrido)? ¿librería? ¿CLI? ¿mezcla?
3. **Experiencia con IA para programar:** ¿es tu primera vez o ya usaste antes? (Informa el tono, no el contenido.)
4. Si es greenfield: ¿ya decidiste el stack, o querés ayuda con esa decisión?

### Verificación paralela del directorio

Mientras el dev responde, corré en paralelo:

- `pwd`
- `ls -la`
- `git status 2>&1` — detecta si es repo o no
- Chequear presencia de manifiestos típicos por tipo:
  - Backend/libs: `pyproject.toml`, `requirements.txt`, `package.json`, `pom.xml`, `build.gradle`, `go.mod`, `Cargo.toml`, `composer.json`, `Gemfile`, `*.csproj`.
  - Frontend: `angular.json`, `vite.config.*`, `next.config.*`, `nuxt.config.*`, `svelte.config.*`.
  - Desktop: `electron-builder.*`, `tauri.conf.json`.
  - Mobile: `capacitor.config.*`, `ionic.config.json`, `app.json` (Expo), `Podfile`, `android/build.gradle`.

### Ramificación

- **Greenfield sin stack decidido:** referí a `references/greenfield-stack-guide.md` para la conversación de decisión.
- **Greenfield con stack decidido:** seguí directo a Fase 1.
- **Brownfield con `CLAUDE.md` existente:** preguntá: revisar, rehacer (con preview antes de pisar), o saltar.
- **Brownfield sin `CLAUDE.md`:** seguí directo a Fase 1.
- **Dudas sobre qué tipo de proyecto es:** preguntá. No asumas por el nombre del directorio.

---

## Fase 1 — Seguridad (pilar)

Esta fase va **siempre**, incluso si el dev dice "ya sé esto". Es el fundamento. Si salteás esta fase, toda la skill pierde su razón de ser.

Tono: mentor directo, ejemplos concretos de qué sale mal cuando alguien se olvida de cada punto. Ver `references/security-checklist.md` para detalle. Abajo el guión mínimo.

### A. Secrets y datos sensibles

Qué nunca debe entrar a un commit:

- `.env`, `.env.local`, `.env.*` (salvo `.env.example` sin valores reales).
- `credentials.json`, `service-account.json`.
- Llaves y certificados: `*.pem`, `*.key`, `*.p12`, `*.pfx`, `*.mobileprovision`.
- Tokens de API, JWTs, connection strings con password hardcoded.
- Carpetas como `secrets/`, `.aws/`, `.ssh/`.

Si ya committeaste algo sensible: **no alcanza con borrarlo en un commit nuevo**. Rotá el secret inmediatamente (generá uno nuevo y revocá el anterior) y considerá limpiar el historial con `git filter-repo` si el repo es público o compartido.

Todo lo sensible va a variables de entorno en local y a un gestor de secrets en runtime (AWS Secrets Manager, HashiCorp Vault, Doppler, 1Password, variables protegidas de CI, etc.).

### B. `.gitignore` vs `.claudeignore`

Son dos archivos distintos con propósitos distintos:

- **`.gitignore`:** qué archivos git no trackea. Protege contra commitear cosas por accidente.
- **`.claudeignore`:** qué archivos Claude no ve en su contexto. Protege contra que la IA lea y potencialmente filtre información sensible en respuestas, y mantiene el contexto liviano.

Puede haber archivos trackeados en git que **no querés** que Claude vea (por ejemplo, un `seed.sql` con datos realistas, o un `fixtures/` con respuestas reales de API anonimizadas parcialmente). `.claudeignore` es más estricto que `.gitignore`.

### C. Git safety

Reglas que no se negocian:

- Nunca `--no-verify` al commitear/pushear sin entender por qué fallan los hooks. Los hooks existen por algo. Si fallan, se arregla, no se saltea.
- Nunca `git push --force` a ramas compartidas (`main`, `master`, `develop`). En tu propia rama de feature, con cuidado.
- Nunca `git reset --hard` sin asegurarte de qué estás perdiendo — stash o backup primero si dudás.
- Antes de borrar una rama con `git branch -D`, confirmá que el trabajo está mergeado o respaldado.
- Antes de aceptar que Claude corra un comando destructivo, leelo completo.

### D. Comandos destructivos

Si Claude propone ejecutar algo, **leelo antes de aprobarlo**. La IA no siempre distingue qué tanto va a afectar tu sistema.

Red flags que obligan a pausar:

- `rm -rf`, especialmente con paths variables o rutas absolutas amplias.
- `git reset --hard`, `git clean -fdx`, `git checkout .` (pierde cambios).
- `DROP TABLE`, `DROP DATABASE`, `TRUNCATE`, `DELETE FROM ... WITHOUT WHERE`.
- `kubectl delete`, `helm uninstall`, `terraform destroy`.
- `aws s3 rm --recursive`, `gcloud ... delete`.
- Cualquier flag `--force`, `--no-verify`, `--skip-*`, `--ignore-*`.

Regla general: si no sabés qué hace un comando, preguntale a Claude que te lo explique antes de ejecutarlo.

### E. Datos reales en prompts

Nunca pegues en un prompt:

- PII de usuarios reales: nombres, emails, teléfonos, direcciones, documentos.
- Datos financieros reales: tarjetas, cuentas bancarias, montos identificables.
- Respuestas reales de APIs de producción sin ofuscar campos sensibles.
- Logs con datos de clientes.

Si necesitás debug con datos, usá datos sintéticos o anonimizados. Si es urgente y tenés que pegar algo, ofuscá: reemplazá emails por `user1@example.com`, nombres por `Alice`/`Bob`, etc.

### F. Producción

Claude Code corre en tu máquina. Nada de lo que la IA hace debería tocar infra de producción sin que vos específicamente ejecutes ese comando.

Reglas:

- Nunca corras migrations contra DBs de producción desde la sesión con Claude. Usá pipelines CI/CD con aprobación manual.
- Nunca ejecutes scripts de cleanup o modificación de datos contra prod desde la IDE. Prepará el script con Claude, revisalo, y corrélo en un ambiente controlado.
- Si el proyecto tiene "staging" y "production", asegurate de saber a cuál apuntás antes de cualquier operación destructiva.
- Si trabajás con DBs compartidas de desarrollo, tratá los cambios destructivos con cuidado — pueden afectar al equipo.

### Cierre de Fase 1

Al terminar esta fase, antes de pasar a Fase 2:

1. Si no existe `.gitignore`, lo creás (en Fase 2 ya lo vas a ajustar al stack).
2. Tomá nota mental (o TodoWrite) de crear `.claudeignore` en Fase 4.
3. Preguntale al dev: "¿Algo de esto te resuena con algo que ya hiciste o casi hiciste? ¿Hay algo acá que quieras que profundicemos?"

---

## Fase 2 — Setup del proyecto

### Rama A — Greenfield

Si el dev arranca de cero:

1. **Stack decidido o a decidir:** si todavía no decidió, pasá por `references/greenfield-stack-guide.md` primero.

2. **Git init** (si aún no hay repo): preguntale al dev si este proyecto va a estar versionado (la respuesta es casi siempre sí). Si sí, `git init`. Si la respuesta es no (ej: scripts one-off, notebook suelto), confirmá que entienda que sin git no hay deshacer — muchas de las prácticas que vamos a ver asumen git.

3. **`.gitignore` del lenguaje:** generá uno base (referencia: github/gitignore templates). Mostrale al dev antes de escribirlo. Si Claude propone uno generado, revisalo — a veces faltan patrones importantes.

4. **Estructura mínima de carpetas:** acorde al stack elegido. No pretendas una arquitectura completa antes de tener algo que corra. Prioridad: que el dev pueda ejecutar "Hello world" en el stack.

5. **Archivos iniciales:**
   - `README.md` con un párrafo: qué es el proyecto, stack elegido, cómo levantarlo.
   - Manifiestos base: `package.json`, `pyproject.toml`, lo que aplique.

6. **First commit** con estructura vacía + `.gitignore` + `README.md`. Convención de mensaje: `chore: initial project scaffold`.

7. Recién después del first commit, pasás a Fase 3.

### Rama B — Brownfield

Si el dev ya tiene un proyecto:

1. **Leé la superficie:** `README.md`, manifiesto principal, top-level de carpetas, `docker-compose.yml` si existe.

2. **Identificá convenciones observables sin preguntar:**
   - Naming de archivos y carpetas.
   - Co-ubicación de tests (al lado del código vs carpeta separada).
   - Si hay linter/formateador configurado y con qué reglas.
   - Arquitectura implícita (capas, features, módulos).

3. **Si ya hay `CLAUDE.md`:** preguntale al dev qué prefiere:
   - Revisarlo conmigo y sugerir mejoras.
   - Rehacerlo desde cero (te muestro diff antes de pisar).
   - Dejarlo como está y saltar al resto.

4. **No pises trabajo existente sin ok explícito.** Siempre mostrá diff antes de escribir. Esto incluye `.gitignore` — si ya existe uno, no lo reemplaces sin mostrar qué cambia.

5. Pasás a Fase 3 con el contexto extraído.

---

## Fase 3 — Entrevista + `CLAUDE.md`

Esta es la fase más larga. Tono: entrevista colaborativa, no interrogatorio. Agrupá preguntas por bloque y dejá que el dev responda en batch si prefiere.

**Antes de preguntar algo que podés verificar leyendo archivos, leelos.** La versión del lenguaje suele estar en el manifiesto. Si el archivo te da la respuesta, usala y confirmala, no la preguntes en frío.

### Bloque A — Identidad

1. ¿Cómo se llama este proyecto y qué hace en una frase? (ej: "pos-orders: API que gestiona el ciclo de vida de órdenes en un POS"; "my-notes: app desktop de notas cifradas").
2. ¿Qué tipo de proyecto es? (backend, frontend web, desktop, mobile, librería, CLI, monorepo con varios). Ya preguntado en Fase 0; confirmalo.
3. ¿Hay un owner, tech lead o responsable a quien consultar dudas? (Si es solista, anotá que lo es.)

### Bloque B — Stack

Leé primero los manifiestos del directorio:

- JS/TS: `package.json`, `.nvmrc`, `tsconfig.json`.
- Python: `pyproject.toml`, `requirements.txt`, `.python-version`, `Pipfile`.
- JVM: `pom.xml`, `build.gradle`, `build.gradle.kts`.
- Go: `go.mod`.
- Rust: `Cargo.toml`.
- .NET: `*.csproj`, `global.json`.
- PHP: `composer.json`.
- Ruby: `Gemfile`.
- Frontend: `angular.json`, `vite.config.*`, `next.config.*`.
- Desktop: `electron-builder.*`, `tauri.conf.json`.
- Mobile: `capacitor.config.*`, `ionic.config.json`, `Podfile`, `app.json` (Expo).

Confirmá con el dev los huecos que queden:

- Versiones exactas del lenguaje y framework principal.
- Base de datos (si aplica): motor y versión, ORM/cliente.
- Libs clave para entender el código (state management, libs de infra, frameworks de test).
- Destino de deploy o runtime (AWS/GCP/Azure, stores de apps, Electron Builder target, Vercel/Netlify/Cloudflare, on-premise).

Si ves algo inusual en los manifiestos (dos versiones del lenguaje en archivos distintos, libs deprecadas, deps con versiones antiguas), preguntá.

### Bloque C — Arquitectura

1. ¿Qué patrón sigue? Opciones comunes según tipo:
   - Backend: capas, hexagonal, clean, MVC, microservicios, monolito modular, ninguno explícito.
   - Frontend web: component-based, feature-sliced, atomic design, módulos por feature.
   - Desktop/mobile: typically component-based dentro del framework.
2. ¿Podés darme un mini-mapa de carpetas clave? (3-6 líneas máximo).
3. ¿Hay un patrón interno no-obvio que un dev nuevo debería saber? (ej: "los use cases no pueden tocar infraestructura directo, siempre pasan por ports"; "los componentes de UI nunca hacen fetch directo, pasa por services").
4. ¿Hay convenciones de naming específicas? (snake_case en endpoints, prefijos en tablas, kebab-case en archivos, etc.)

"No sé" es respuesta válida. Anotá `TODO: confirmar arquitectura` y seguí.

### Bloque D — Comandos esenciales

Intentá verificar contra `Makefile`, `package.json` (scripts), `docker-compose.yml`, `pyproject.toml` (scripts de poetry/hatch), `README.md`. Listalos como candidatos y pedí confirmación.

Candidatos típicos (ajustar según stack):

- Instalar deps.
- Correr tests.
- Lint / format.
- Levantar local (dev server, docker compose, emulador mobile).
- Build de producción.
- **Si aplica:** migraciones (aplicar, generar nueva).
- **Si es Electron:** package desktop, sign.
- **Si es mobile:** sync nativo, build iOS, build Android.
- **Si aplica:** deploy a staging/prod (idealmente solo referencia, no comando a ejecutar).

No inventes flags ni targets que no viste en archivos. Si algo es obvio en principio pero no está documentado en el repo, preguntá cómo lo hace el equipo.

### Bloque E — Reglas de dominio y gotchas

Este bloque es crítico y suele ser lo más valioso del `CLAUDE.md`. Preguntas guía adaptadas al tipo:

**Todos:**
- ¿Hay reglas del proyecto que un dev nuevo tiende a romper?
- ¿Hay cosas que Claude NO debería tocar sin preguntar? (ej: migraciones, contratos de API públicos, configs de producción, llaves de firma).
- ¿Hay algún bug histórico o decisión explícita que marca cómo se hacen las cosas hoy?

**Backend:** multi-tenant, manejo de dinero/precisión, idempotencia, soft delete, transacciones, autenticación/autorización, rate limiting.

**Frontend web:** manejo de estado (centralizado o local), formularios reactivos vs template, patrones de data fetching, accesibilidad, i18n, theming.

**Desktop (Electron/Tauri):** separación main/renderer, uso de IPC, manejo de filesystem, auto-updater, code signing, tamaño de bundle.

**Mobile:** offline-first, sincronización, permisos OS, notificaciones push, deep links, tamaño de bundle, manejo de versiones por store.

Si el dev no tiene nada, insistí una vez: "¿Nada que un dev nuevo debería saber para no romper algo?" Con un segundo empujón suelen aparecer cosas importantes.

### Bloque F — Links y referencias

1. ¿Hay docs internas del proyecto? (README, wiki, Notion, Confluence).
2. ¿Hay issue tracker? (GitHub Issues, Linear, Jira).
3. ¿Hay observabilidad relevante? (logs, dashboards, alertas).
4. ¿Hay un canal de comunicación donde se discute el proyecto? (Slack, Discord, Teams, mailing list).

Anotá literal. Si no sabe, `TODO: confirmar`.

### Redacción y validación

Usá el template `assets/claude-md-template.md` como esqueleto. Reglas duras al redactar:

- **Sin emojis.** No necesita rastro estético de IA.
- **Sin frases marketineras** ni "generado por Claude". Tono técnico y directo.
- **Placeholders explícitos.** Todo dato no confirmado va como `TODO: confirmar con <persona/fuente>`. No suavices, no imagines.
- **Extensión objetivo:** 150-300 líneas. Más es ruido.
- **Secciones condicionales:** quitá filas/bloques que no aplican al tipo de proyecto (ej: migraciones en un frontend puro, packaging mobile en un backend).

**Antes de escribir a disco**, mostrá al dev un preview del contenido propuesto y pedí corrección. Solo escribí cuando dé el ok.

Después de escribir, mostrá el comando para revisarlo: `cat CLAUDE.md`. Recordá que el dev puede (y debe) editarlo a mano — no es sagrado.

---

## Fase 4 — `.claudeignore`

Base: `assets/claudeignore-template`. Agregá bloques según stack (el template ya incluye Electron, mobile, backend y frontend comunes).

Preguntale al dev:

1. ¿Hay carpetas o archivos específicos de este proyecto con datos sensibles, dumps, o binarios grandes que haya que excluir además?
2. ¿Hay seeds de desarrollo con datos reales (aunque sean anonimizados parcialmente) que prefieras mantener fuera del contexto?
3. ¿Hay archivos de configuración que referencian secrets sin contenerlos (ej: `config.yaml` con nombres de variables)? Normalmente estos se pueden incluir; confirmá.

Explicá una vez más la diferencia con `.gitignore`: "Esto define qué no entra al contexto de Claude. `.gitignore` define qué no se commitea. Son distintos."

---

## Fase 5 — Buenas prácticas de flujo

Breve, concreto, con el **porqué** para cada punto. Podés convertir esta fase en Q&A si el dev tiene preguntas.

### 1. Modo plan (Shift+Tab)

Para tareas medianas o que tocan código crítico, activá modo plan. Claude propone un plan detallado, vos lo corregís o ajustás, y solo cuando cierra le das permiso para ejecutar. Evita que la IA se mande a hacer cosas que no querías.

**Cuándo usarlo:** nuevos features, refactors, cambios que tocan 3+ archivos, cualquier cosa con impacto en datos.

**Cuándo saltearlo:** preguntas ("¿qué hace este archivo?"), cambios triviales ("renombrá esta variable"), explicaciones.

### 2. Cambios chicos y revisables

Un commit o PR debería ser un cambio coherente. No dejes que Claude haga "agregá feature X + refactor Y + actualizá deps + arreglá typo en docs" todo junto. Separá.

**Por qué:** revisión humana efectiva es imposible con diffs de 1000 líneas mezclando cosas.

### 3. Revisá el diff siempre

Nunca aceptes un cambio sin mirar el diff. Si hay una parte que no entendés, pedile a Claude que te la explique antes de aceptar.

**Regla:** si no podés explicar en 1 frase qué hace una línea del diff, no la commitees.

### 4. Tests antes de declarar "listo"

- Un feature sin test no está listo.
- Un test que pasa no garantiza que el feature funciona — probalo manualmente en el caso feliz y al menos un caso borde.
- Un test que falla no se borra. Se entiende por qué falla.

### 5. Commits semánticos

Formato recomendado (Conventional Commits):

- `feat:` — nuevo feature.
- `fix:` — bug fix.
- `refactor:` — cambio interno sin cambiar comportamiento.
- `docs:` — solo docs.
- `test:` — solo tests.
- `chore:` — tareas de mantenimiento.

El mensaje describe el **por qué**, no solo el qué. "fix: handle null user in checkout flow" es mejor que "fix: update checkout".

### 6. Ramas, no `main`

Nunca trabajes directo sobre `main`/`master`/`develop`. Crea una rama de feature o fix. Mergeá vía PR/MR, aunque trabajes solo — el diff en un PR es más fácil de revisar que el historial directo.

### 7. Cuándo delegar con confianza

- Boilerplate: scaffolding de endpoints, componentes, archivos de test.
- Refactors mecánicos: renames, extract method, reordenar imports.
- Docstrings y comentarios (revisar que no inventen).
- Debug de stacktraces: pegá el error y dejá que proponga.
- Scripts one-off: conversión de formatos, migraciones de datos triviales en staging.

### 8. Cuándo supervisar de cerca

- Queries a DB (especialmente con joins, subqueries, o `UPDATE`/`DELETE`).
- Lógica de cálculos críticos: dinero, impuestos, comisiones, inventario, permisos.
- Integraciones con terceros.
- Cambios a contratos de API públicos.
- Cualquier código que toque autenticación o autorización.

### 9. Cuándo NO delegar

- Decisiones arquitectónicas (qué patrón seguir, cómo estructurar un módulo grande).
- Manejo de secrets.
- Migraciones destructivas.
- Cambios de permisos, IAM, roles.
- Cualquier cosa que toque datos reales de usuarios.

Al final de la fase: "¿Algo de esto querés que profundicemos, o seguimos?"

---

## Fase 6 — Trampas típicas de juniors

Esta fase es la que más valor aporta al dev junior. Para el detalle completo ver `references/junior-pitfalls.md`. Abajo las 5 más críticas para cubrir siempre:

### 1. Aceptar código sin leer

Si no entendés qué hace una línea del diff, no la commitees. Pedile a Claude que te explique. La IA escribe rápido; si no leés, estás commiteando código que no es tuyo.

### 2. Ignorar o borrar tests rotos

Un test que falla es información. Si no entendés por qué falla, no lo borres. Preguntale a Claude que te explique la falla, qué está testeando, y si el test está mal o el código está mal. Borrar tests para que CI pase en verde es un antipatrón que destruye confianza en la suite.

### 3. Confiar en la IA cuando afirma algo específico con seguridad

Claude puede decir "la función `foo` devuelve `X`" con total seguridad y estar equivocado. Sobre todo en libs que cambiaron recientemente, APIs específicas, o detalles de configuración. Verificá contra la documentación o el código real antes de actuar.

**Regla:** si la IA afirma un dato verificable, verificalo. No cuesta nada y evita errores caros.

### 4. Dejar que ejecute comandos destructivos sin leer

Ya cubierto en Fase 1, repetido acá porque es la categoría de errores con mayor daño. Siempre leé el comando antes de aprobar ejecutarlo.

### 5. Usar Claude para saltear el aprendizaje

La IA te ayuda a avanzar rápido en lo que **ya entendés**. Si la usás en un dominio que no conocés, corrés el riesgo de construir castillos de arena: código que parece funcionar pero que no podés debuggear ni mantener cuando rompa.

**Regla:** si estás aprendiendo un concepto nuevo (un patrón, un framework, un lenguaje), hacé al menos una versión "a mano" antes de dejar que la IA te resuelva. Después podés acelerar.

### Cierre de fase

Preguntale: "¿Cuál de estas te resuena? ¿Hay alguna que ya sentiste que casi caés?" Es una buena conversación y suele sacar otras dudas que el dev no sabía cómo formular.

---

## Fase 7 — Primera tarea de práctica (opcional)

Preguntá: "¿Querés que te sugiera una primera tarea de práctica segura para probar el flujo?"

Si dice sí, ver `references/practice-tasks.md` y elegir según stack. La tarea debe cumplir:

- Ser en una rama de experimento (no `main`/`develop`).
- Ser reversible.
- No tocar lógica crítica de negocio.
- Ejercitar el ciclo completo: modo plan → ejecución → revisión de diff.

Explicá cómo crear la rama:

```bash
git checkout -b experiment/onboarding
```

Recordale: si algo sale mal, volver a la rama base y borrar la de experimento. Cero riesgo.

---

## Cierre

Resumí en 3-5 líneas:

1. Qué archivos quedaron en el repo (`CLAUDE.md`, `.claudeignore`, `.gitignore` si aplica).
2. Qué TODOs quedaron pendientes, para que el dev los complete con su equipo o investigando.
3. Los 3 puntos de seguridad más importantes: nunca commitear secrets, siempre leer diffs y comandos destructivos, nunca correr contra prod desde la IDE.
4. Dónde buscar ayuda cuando se trabe: docs de Claude Code, comunidad, su equipo.
5. Recordatorio: el `CLAUDE.md` es un documento vivo. A medida que aprenda cosas trabajando con Claude, debería ir editándolo.

Cierre sin floreos. Algo como: "Listo, quedás operativo. Volvé a invocarme si algo del flujo no te cierra."

---

## Anti-patrones a evitar (en vos, no en el dev)

Cosas que arruinan esta skill:

- **Inventar comandos, flags o configuraciones que no viste.** Preguntá.
- **Asumir stack, arquitectura, o convenciones por el nombre del directorio.** Leé o preguntá.
- **Saltar Fase 1 "porque el dev parece experimentado".** No. Siempre va.
- **Saltar Fase 6 porque "ya cubrimos eso".** Las trampas típicas son educativas; vale repetir.
- **Generar un `CLAUDE.md` completo con placeholders falsos ("usa X framework" cuando no verificaste).** Peor que vacío.
- **Monólogo sin pausar.** El dev aprende respondiendo. Dale espacio para preguntas.
- **Dejar emojis, frases épicas o rastro de "generado por IA".** Tono profesional.
- **Privilegiar un stack en ejemplos cuando el dev no está en ese stack.** Adaptá.

---

## Recursos

- `assets/claude-md-template.md` — esqueleto base del `CLAUDE.md`, con secciones adaptativas por tipo de proyecto.
- `assets/claudeignore-template` — patrones para `.claudeignore` cubriendo backend, frontend, Electron, mobile.
- `references/security-checklist.md` — detalle completo de seguridad para compartir con el dev.
- `references/junior-pitfalls.md` — lista ampliada de trampas y cómo evitarlas.
- `references/greenfield-stack-guide.md` — árbol de preguntas para ayudar a decidir stack cuando se arranca de cero (no prescribe; guía la decisión).
- `references/practice-tasks.md` — ideas de primera tarea de práctica por stack (backend, frontend web, Electron, mobile, y tareas universales).
