# Trampas típicas al empezar con IA para programar

Esta lista no es teórica. Cada entrada describe un error que devs juniors (y muchos seniors) cometen cuando arrancan a usar Claude Code u otra IA de coding. Para cada una: **qué es, por qué pasa, cómo detectarla, cómo corregirte**.

Leé con el dev las 5 primeras — son críticas. El resto sirven como referencia para cuando se topen.

---

## 1. Aceptar código sin leer

**Qué es:** Claude escribe 50 líneas, vos mirás por arriba, das ok, commiteás.

**Por qué pasa:** la IA escribe rápido y con confianza. Se siente improductivo leer cada línea cuando ya "funciona".

**Por qué es un problema:** en ese diff que no leíste puede haber:
- Una línea que borra una validación que sí era importante.
- Un cambio sutil de comportamiento en una función que otros llaman.
- Un `import` de una lib que no querías agregar.
- Código que duplica lógica que ya existía.
- Errores que los tests no atrapan.

**Cómo detectarla en vos:**
- Si alguien te pregunta "¿qué hace esta línea?" y no sabés → la escribió la IA y vos no la leíste.
- Si el commit que hiciste "hace varias cosas" que no podés listar → no la leíste.

**Cómo corregirte:**
- Antes de commitear, leé el diff entero.
- Para cada línea, andá chequeando si entendés qué hace y por qué está ahí.
- Si hay una parte que no entendés, pedile a Claude que te explique esa parte específica.
- Si después de explicarla sigue sin cerrarte, pedí una alternativa más simple.

**Frase que te debería dar la alarma:** "No sé exactamente qué hace, pero los tests pasan".

---

## 2. Ignorar o borrar tests rotos

**Qué es:** un test falla. Intentás entender por qué. No lo lográs rápido. Lo borrás, o lo marcás `@skip`, o le cambiás la aserción para que pase.

**Por qué pasa:** el test molesta. CI está rojo. Querés mergear el feature.

**Por qué es un problema:**
- El test fallando está diciendo algo. Pudo haber detectado una regresión real que vos introdujiste sin querer.
- Cada test borrado reduce la confianza en la suite. Cuando la suite pierde confianza, nadie la mira, y los bugs llegan a prod.
- Es un camino de una sola dirección: nadie agrega tests que ya no existen.

**Cómo detectarla en vos:**
- Cambiaste el test para que pase sin entender por qué fallaba.
- Borraste un test sin un razonamiento que puedas explicar.
- Pusiste `@skip` "por ahora" y no hay issue para volver a activarlo.

**Cómo corregirte:**
- Cuando un test falla, la primera pregunta no es "¿cómo lo hago pasar?", es "¿qué está testeando y por qué falla ahora?".
- Pedile a Claude: "Este test falla con este error. Explicame qué está testeando, qué cambió en el código que podría haberlo roto, y cuál es la corrección correcta — puede ser en el test o en el código."
- Si la conclusión es "el test está obsoleto porque el comportamiento cambió intencionalmente", actualizá el test con el nuevo contrato claro, no solo "hacelo pasar".

---

## 3. Confiar en la IA cuando afirma algo específico con seguridad

**Qué es:** Claude dice "la función `X` de la librería `Y` versión `Z` acepta estos parámetros", vos le creés, y está mal.

**Por qué pasa:** la IA puede estar confiadamente equivocada, especialmente en:
- Libs o APIs que cambiaron recientemente.
- Versiones específicas (puede mezclar features entre versiones).
- Detalles de configuración (nombres exactos de campos, defaults).
- Comportamiento en casos borde.

**Por qué es un problema:** terminás con código que parece razonable, se escribe sin friction, y no funciona. O peor: "funciona" por coincidencia y rompe en casos que no testeaste.

**Cómo detectarla:**
- Claude afirma algo muy específico que te resulta útil. Si suena "demasiado perfecto", probablemente necesita verificación.
- Estás por usar una función/config/flag que nunca usaste antes y que Claude te propuso.
- Claude te cita el nombre de un método con parámetros específicos.

**Cómo corregirte:**
- Si la IA afirma un dato verificable, verificalo contra la documentación oficial o el código real.
- Para libs: revisar la doc de la versión que estás usando.
- Para APIs externas: probá el endpoint con curl o un request mínimo antes de integrar.
- Para funciones de frameworks: revisar el archivo de tipos o la doc inline.
- Si el editor soporta "go to definition" / "peek", úsalo para ver la firma real.

**Frase que te debería dar la alarma:** "Claude me dijo que esto funciona así, entonces..."

---

## 4. Ejecutar comandos destructivos sin leer

Ya cubierto en `security-checklist.md`. Se repite acá porque es la clase de errores con mayor daño por ocurrencia.

**Regla corta:** antes de aprobar cualquier comando de Claude, leelo. Si tiene `rm`, `delete`, `drop`, `truncate`, `reset`, `force`, `prune`, o apunta a producción, pausá y pensá.

---

## 5. Usar Claude para saltear el aprendizaje

**Qué es:** estás aprendiendo un concepto nuevo (un patrón, un framework, un lenguaje). En vez de aprenderlo, le pedís a Claude que te resuelva el ejercicio o el feature.

**Por qué pasa:** la IA entrega rápido. El aprendizaje es lento, frustrante, incómodo. Es tentador saltearlo.

**Por qué es un problema:**
- Construís código que parece funcionar pero que no podés mantener cuando rompa.
- Cuando el código falle (y va a fallar), no tenés las bases para debuggearlo.
- Tu valor como dev es entender; si delegás el entender a la IA, te quedás con las partes fáciles.
- A largo plazo, te volvés dependiente de la herramienta sin las skills para corregirla cuando se equivoca.

**Cómo detectarla:**
- Estás trabajando con una tecnología/concepto que no usaste antes, y todas las decisiones las tomó Claude.
- No podrías rehacer el código a mano si te lo pidieran.
- Cuando algo falla, tu primer reflejo es pedir a Claude que arregle, no leer el error.

**Cómo corregirte:**
- Si estás aprendiendo algo, hacelo a mano al menos una vez. Entendelo. Después acelerá con IA.
- Usá Claude para explicar, no solo para generar. "Explicame qué es un hook en React" es mejor que "escribime este componente con hooks".
- Cuando Claude genere algo que no entendés, pedile que te explique el concepto primero, después el código.
- Leé la doc oficial del framework/lib. La IA es complemento, no reemplazo.

---

## 6. Copiar arquitecturas que no entendés

**Qué es:** le pedís a Claude que estructure el proyecto, y te genera una arquitectura con "hexagonal + CQRS + event sourcing + repository pattern" que suena impresionante pero no sabés usar.

**Por qué pasa:** los patrones suenan bien. La IA tiende a sobre-diseñar. Es fácil aceptar complejidad que no entendés cuando viene con nombres técnicos.

**Por qué es un problema:**
- No vas a poder extender el código sin quebrarlo.
- Cada cambio va a requerir que Claude "recuerde" la arquitectura que vos no entendés.
- Los patrones existen para resolver problemas específicos. Si no tenés ese problema, el patrón es overhead.

**Cómo corregirte:**
- Empezá con la arquitectura más simple que funcione. "Un archivo por feature" está bien hasta que duela.
- Introducí patrones cuando el problema lo demande, no antes.
- Si Claude propone un patrón, preguntale: "¿qué problema resuelve este patrón? ¿mi proyecto tiene ese problema hoy?"
- Regla de Kent Beck: "make it work, make it right, make it fast" — en ese orden.

---

## 7. Sobre-abstracción prematura

**Qué es:** Claude genera interfaces, clases abstractas, factories, adapters, para código que se usa una sola vez.

**Por qué pasa:** la IA fue entrenada con código de proyectos maduros y tiende a replicar esos patrones. Y al junior le da la sensación de "código profesional".

**Por qué es un problema:**
- Más código = más superficie para bugs.
- Abstracciones que no necesitás dificultan cambios.
- La "regla de tres" existe por algo: hasta que no tengas tres casos similares, la abstracción es conjetura.

**Cómo corregirte:**
- Tres líneas de código duplicadas son preferibles a una abstracción prematura.
- Cuando veas una interface, preguntate: ¿hay más de una implementación hoy?
- Cuando veas un factory, preguntate: ¿hay más de un tipo a construir?
- Si Claude te propone abstracciones, pedile primero el código sin abstracción y abstraé solo cuando haya necesidad real.

---

## 8. Pegar secrets o datos reales en el prompt

Ya cubierto en `security-checklist.md`. Resumen:

- Nunca `.env`, credentials, tokens, connection strings.
- Nunca PII, datos financieros, info médica real.
- Ofuscá o sintetizá antes de pegar.

---

## 9. Dejar que la IA tome decisiones de producto

**Qué es:** cuando Claude te pregunta "¿querés que haga X o Y?" decís "vos decidí". Cuando una ambigüedad aparece, la IA infiere y vos seguís.

**Por qué pasa:** es más fácil no decidir.

**Por qué es un problema:**
- Las decisiones de producto las toma el producto (o vos, si sos producto). No la IA.
- La IA optimiza por plausibilidad, no por lo que tus usuarios necesitan.
- Acumulás decisiones implícitas que nadie recuerda haber tomado.

**Cómo corregirte:**
- Cuando la IA te pregunta algo de producto, pausá y pensá la respuesta vos mismo (o pedila al PM).
- Cuando la IA infiera una decisión sin preguntar, detectala en el diff y confirmala.
- Si no sabés la respuesta, no decidas ahora: marcá TODO y preguntale al equipo.

---

## 10. Commits enormes y desordenados

**Qué es:** trabajás 2 horas, hacés 15 cosas, todo se commitea junto con mensaje "wip".

**Por qué pasa:** modo plan no se usó, o se usó y después se fue agregando cosas sobre la marcha.

**Por qué es un problema:**
- Imposible hacer code review efectivo.
- Imposible hacer revert quirúrgico si algo rompe.
- El historial de git deja de ser documentación.

**Cómo corregirte:**
- Un commit = un cambio coherente describible en 1 frase.
- Usá `git add -p` para commits selectivos.
- Si ya tenés un mega-commit, podés separarlo con `git reset HEAD~` y agrupar de nuevo.
- Mensaje de commit: `tipo: qué + por qué corto`.

---

## 11. Ignorar warnings y red flags del linter/compilador

**Qué es:** el linter se queja, el compilador tira warnings. Los ignorás porque "funciona igual".

**Por qué pasa:** fix rápido del lint parece tiempo perdido.

**Por qué es un problema:** los warnings son bugs en potencia. Cuando el ruido crece, el warning real se pierde entre los 400 existentes.

**Cómo corregirte:**
- Mantené el linter con 0 warnings en main/develop.
- Si hay que ignorar algo, que sea explícito (comment-disable línea por línea con razón), no masivo.
- Los warnings del compilador/typechecker se arreglan en el commit que los introduce.

---

## 12. No probar manualmente lo que la IA generó

**Qué es:** "los tests pasan, está listo". Nunca abriste la app a ver el cambio.

**Por qué pasa:** la fe en los tests, o la flojera de levantar el ambiente.

**Por qué es un problema:** los tests unitarios cubren lógica, no experiencia. Cosas que solo se detectan corriendo:
- UI rota (texto cortado, botón invisible, responsive roto).
- Latencia absurda.
- Errores en consola del navegador que los tests no miran.
- Flujos rotos aunque cada paso individual pase su test.

**Cómo corregirte:**
- Feature nuevo = lo probás a mano. Golden path mínimo.
- Bug fix = reproducís el bug antes de arreglar, verificás que se fue después.
- Si la feature es backend, probás con curl/Postman el endpoint real.

---

## 13. Acumular deps innecesarias

**Qué es:** Claude sugiere `npm install lodash` para hacer un `map`. Lo aceptás.

**Por qué pasa:** es el reflejo del ecosistema JS de "hay una lib para esto".

**Por qué es un problema:**
- Cada dep es superficie de ataque (supply chain attacks).
- Cada dep es mantenimiento futuro (updates, vulnerabilidades).
- Cada dep es peso en el bundle.
- Muchas libs tienen alternativas nativas hoy.

**Cómo corregirte:**
- Antes de aceptar una nueva dep, preguntate: ¿el lenguaje/stdlib ya tiene esto?
- Para libs pequeñas, escribí la función vos.
- Para libs grandes, leé el CHANGELOG reciente, issues abiertos, nivel de mantenimiento.

---

## 14. No actualizar `CLAUDE.md` cuando cambiás el proyecto

**Qué es:** cambiás el stack, la arquitectura, o una convención. No actualizás `CLAUDE.md`.

**Por qué pasa:** el archivo es "ceremonia inicial", se olvida.

**Por qué es un problema:** el `CLAUDE.md` se vuelve mentiroso. Las sesiones futuras con Claude van a estar basadas en información falsa.

**Cómo corregirte:**
- Cambio que toca stack/arquitectura/convenciones → actualizar `CLAUDE.md` en el mismo PR.
- Revisión trimestral (o cuando se sume alguien al proyecto): ¿sigue siendo cierto?

---

## 15. Usar modo plan solo "cuando sentís que lo necesitás"

**Qué es:** vas a hacer un refactor chico, no activás modo plan, Claude hace cambios en 8 archivos que no esperabas.

**Por qué pasa:** modo plan se siente como "ceremonia" para cambios chicos.

**Por qué es un problema:** los cambios chicos que la IA "infiere" son los que más fácil se descontrolan, porque no los pensás antes.

**Cómo corregirte:**
- Default a modo plan para cualquier cosa que toque código existente.
- Salteá modo plan solo para preguntas explícitas ("explicame qué hace X") y cambios triviales nombrados con precisión ("renombrá la variable `userId` a `customerId` solo en `src/orders/`").
