# Primera tarea de práctica

Sugerencias por tipo de proyecto para que el dev ejercite el flujo completo (modo plan → ejecución → revisión de diff) en una rama de experimento, sin riesgo.

## Criterios que cumplen todas las tareas

- Reversibles (viven en una rama de experimento que se puede borrar).
- No tocan lógica crítica de negocio.
- Ejercitan leer código + proponer cambio + ejecutar + revisar diff.
- Terminan en menos de 30 minutos.
- No requieren acceso a infra de producción.

## Cómo encuadrar la tarea con el dev

Presentala así:

> "Te propongo esta tarea de práctica: {{descripción}}. Creala en una rama de experimento con `git checkout -b experiment/onboarding`. Usá modo plan (Shift+Tab) para que Claude te proponga el cambio antes de ejecutar, corregí el plan si algo no te cierra, y recién después dale permiso para escribir. Al final revisá el diff con `git diff` y contame cómo fue. Si sale mal, volvés a la rama base y `git branch -D experiment/onboarding` — cero riesgo."

Después de que complete la tarea, preguntale:

1. ¿Qué funcionó bien?
2. ¿Qué hizo Claude que no esperabas?
3. ¿Dónde tuviste que corregirlo?
4. ¿Hubo algún momento donde dudaste si aceptar?

Las respuestas son insumo para mejorar el `CLAUDE.md` y para calibrar la confianza del dev.

---

## Backend (API/servicio)

Aplicable a Python/FastAPI, Node/Express/NestJS, Java/Spring, Go, Rust, etc.

1. **Health check enriquecido.** Agregar un endpoint `/health/detailed` que devuelva versión del servicio (leída del manifiesto), timestamp UTC, y estado de conexión a DB si aplica. Con test unitario.

2. **Docstrings o JSDoc/TSDoc faltantes.** Elegir un módulo chico y pedir que complete documentación en estilo del lenguaje (Google style para Python, TSDoc para TS, Javadoc para Java). **Importante:** revisar que no invente lo que hace la función — debe leer el código real.

3. **Refactor de imports.** Ordenar imports con la herramienta del stack (`ruff`/`isort` en Python, `eslint-plugin-import` en TS, etc.) en un módulo específico. Revisar diff.

4. **Test de un caso borde.** Elegir una función existente y pedir un test para un caso borde que probablemente no esté cubierto (ej: input vacío, valor null, tipo inesperado).

---

## Frontend web (SPA)

Aplicable a Angular, React, Vue, Svelte, Solid.

1. **Componente trivial aislado.** Un componente `<empty-state>` con input de texto y un botón opcional. Sin conectar a nada — solo para ver cómo Claude genera estructura, estilos, y test.

2. **Mejorar un README de una feature folder.** Pedir que lea una feature folder y mejore su README (si no hay, crear) con descripción basada en el código real. **Importante:** revisar que no invente features inexistentes.

3. **Accesibilidad básica.** Elegir un formulario existente y pedir que agregue labels, `aria-*`, navegación por teclado faltantes. Revisar diff y probar en el navegador con teclado.

4. **Test de componente.** Elegir un componente existente sin test y pedirle uno que cubra al menos render inicial + una interacción. Ejecutar.

---

## Desktop (Electron / Tauri)

1. **Handler IPC tipado.** Agregar un handler IPC trivial — ej: `app:get-version` que devuelva la versión desde `package.json`. Tipar el canal y su respuesta. Invocarlo desde el renderer y mostrar en UI.

2. **Menú de aplicación.** Agregar una entrada de menú "Ayuda → Documentación" que abra una URL externa en el navegador por defecto (no dentro de Electron). Probar.

3. **Atajo de teclado.** Registrar un shortcut global o local para una acción inofensiva (ej: reset del estado local). Probar que funciona y se desregistra al cerrar.

4. **Script de build.** Agregar al `package.json`/config de empaquetado un target "debug" que genere un build sin firmar para testing rápido.

---

## Mobile (híbrida: Capacitor/Ionic, Expo, React Native)

1. **Pantalla de "Acerca de".** Agregar una pantalla nueva con versión de la app, links, y crédito. Sin navegación compleja — solo probar scaffolding de pantalla + routing.

2. **Uso de un plugin trivial.** Integrar un plugin nativo simple (ej: `Device`, `Haptics` de Capacitor; `Vibration` de Expo) en un botón. Probar en emulador/dispositivo.

3. **Almacenamiento seguro de una preferencia.** Guardar y recuperar una preferencia del usuario usando el storage seguro del framework (Keychain/Keystore vía plugin). NO usar storage plano para probar — es una buena oportunidad de practicar la regla.

4. **Manejo de permiso.** Pedir un permiso OS simple (ej: notificaciones, cámara) con flujo completo: justificar al usuario, pedir, manejar denegación gracefully.

---

## Mobile (nativa: iOS Swift, Android Kotlin)

1. **Nueva pantalla estática.** Crear una pantalla con lista de items hardcodeados + navegación desde la pantalla principal.

2. **Strings a recursos.** Elegir una pantalla con strings hardcodeados y moverlos a recursos (`strings.xml` / `Localizable.strings`). Confirmar que compila y se ve igual.

3. **Dark mode para una pantalla.** Asegurar que una pantalla existente responda correctamente al cambio de tema claro/oscuro. Probar.

---

## Librería / CLI

1. **README con ejemplos.** Mejorar el README con 3 ejemplos de uso basados en los tests existentes. **Importante:** los ejemplos deben ejecutarse y funcionar — probalos.

2. **Comando de ayuda enriquecido.** Si es CLI, mejorar `--help` con ejemplos de uso. Si es librería, exportar un ejemplo ejecutable.

3. **Test de contract para la API pública.** Agregar un test que ejercite los símbolos públicos exportados, asegurando que no cambien accidentalmente en refactors futuros.

---

## Tarea universal (cualquier stack)

**Explicación de un flujo existente.** Elegir un endpoint/feature/flujo ya implementado y pedir a Claude:

> "Explicame en 15 líneas cómo funciona el flujo de {{X}}, desde el punto de entrada hasta el retorno. Quiero entender qué archivos se tocan y en qué orden."

Esto no modifica nada, pero enseña al dev a usar Claude para onboardearse sobre código existente — una de las utilidades más altas de la herramienta. Después: preguntale al dev que explique con sus palabras, para verificar que entendió (y que Claude no inventó).

**Variante:** pedir el mismo flujo pero como diagrama Mermaid (`sequenceDiagram` o `flowchart`). Útil para visualizar y detectar si la IA "inventó" pasos inexistentes.

---

## Si el proyecto todavía no tiene nada

(Greenfield recién inicializado.)

1. **Hola mundo.** Hacer que un "Hello world" del stack corra. Suena obvio, pero es una buena prueba de flujo: plan → ejecución → verificar que arranca.

2. **Test de smoke.** Agregar un único test que pase, con la herramienta del stack configurada. El objetivo: dejar la infraestructura de testing operativa.

3. **Script de format y lint.** Configurar linter + formatter del stack con defaults razonables. Agregar un script npm/make/poetry para correrlos.
