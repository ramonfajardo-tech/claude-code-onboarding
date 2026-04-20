# Checklist de seguridad para trabajar con Claude Code

Este documento expande la Fase 1 del onboarding. Está pensado para leer **con el dev**, no para soltárselo y seguir. Cada sección tiene el **qué**, el **por qué** con un ejemplo concreto de qué sale mal, y el **cómo** cuidarse.

Ninguno de estos puntos es teórico. Todos son formas reales en las que devs juniors (y no tan juniors) se quemaron.

---

## 1. Secrets nunca van al repo

### Qué

Estos archivos/valores no se commitean, jamás:

- `.env`, `.env.local`, `.env.production`, `.env.*` con valores reales.
- `credentials.json`, `service-account*.json`, `client_secret*.json`.
- Certificados y llaves privadas: `*.pem`, `*.key`, `*.p12`, `*.pfx`, `*.mobileprovision`, `*.p8`.
- Connection strings con password embebida.
- Tokens JWT, API keys, tokens de OAuth, hardcodeados en código.
- Archivos `.aws/credentials`, `~/.ssh/`, `~/.gnupg/`.

### Por qué importa

Una API key de AWS commiteada en un repo público se encuentra en minutos por bots que scrapean GitHub. Casos reales: devs que cobraron facturas de miles de dólares en horas porque alguien usó sus credenciales para minar cripto.

Un `.env` con password de producción commiteado en un repo privado sigue siendo un problema: cualquiera con acceso al repo lo ve (pasado, presente, futuro), está en clones locales, en backups, en CI logs.

### Cómo cuidarse

- `.gitignore` bien armado **desde el primer commit**.
- Usá `git status` antes de cada commit — mirá la lista de archivos que entran.
- Si ves un `.env` en `git status`, parate, agregalo al `.gitignore`, y `git rm --cached .env`.
- Para pre-commit checks, herramientas como `git-secrets`, `gitleaks`, `trufflehog` detectan secrets antes de que salgan.
- En GitHub: activá secret scanning (gratis en repos públicos y con plan pagado en privados).

### Qué hacer si ya committeaste un secret

1. **Rotá el secret inmediatamente.** Generá uno nuevo, revocá el viejo. No importa si el repo es privado.
2. Solo después: considerá limpiar el historial con `git filter-repo` o BFG Repo-Cleaner. Esto reescribe historia — coordiná con el equipo si es un repo compartido.
3. Si el repo es público y el secret ya estuvo expuesto, asumí que ya fue robado. La rotación no es opcional.

---

## 2. `.claudeignore` ≠ `.gitignore`

### Qué

Dos archivos distintos con propósitos distintos:

- **`.gitignore`** le dice a git qué no trackear.
- **`.claudeignore`** le dice a Claude qué no leer como contexto.

Hay archivos que están en git pero no deberían entrar al contexto del modelo. Ejemplos:

- `seeds/dev.sql` con datos anonimizados pero realistas.
- `fixtures/sample-responses.json` con respuestas reales de API ofuscadas.
- Dumps históricos para testing.
- Documentación interna con nombres de clientes.

### Por qué importa

Si Claude lee esos archivos, puede referenciarlos, citarlos, o incluirlos en sus respuestas. Eso puede terminar en:

- Logs de la conversación (si se guardan).
- Ventanas compartidas (si pegás un screenshot en un ticket).
- Otros devs viéndolos sin necesidad de acceso al archivo.

### Cómo cuidarse

- Mantené `.claudeignore` estricto — más vale excluir de más y pedirle al modelo que lea un archivo específico cuando lo necesite.
- Revisalo cada vez que agregues un archivo con datos que dudes.

---

## 3. Git safety — reglas que no se negocian

### `--no-verify`

**Qué hace:** saltea los hooks de pre-commit y pre-push.

**Por qué existen los hooks:** normalmente corren linter, tests rápidos, validaciones de formato, detección de secrets, firmas de commits. Si fallan, están diciendo algo.

**Cuándo se justifica:** casi nunca. Si los hooks fallan, el camino es arreglar la causa, no saltear el hook. Excepciones raras: hook roto localmente (no el tuyo), commit de emergencia con un fix al hook.

**Regla:** si Claude te sugiere `--no-verify`, pedile la justificación antes de aceptar.

### `git push --force`

**Qué hace:** sobreescribe la historia remota con la tuya local.

**Dónde es catastrófico:** ramas compartidas (`main`, `master`, `develop`, ramas de otros).

**Dónde es aceptable:** tu propia rama de feature, con `--force-with-lease` (que falla si alguien más pusheó mientras tanto).

**Regla:** nunca a ramas compartidas. En tu rama, preferí `--force-with-lease` sobre `--force`.

### `git reset --hard`

**Qué hace:** descarta cambios locales (staged, unstaged, y working tree) y mueve HEAD.

**Qué perdés:** todo lo que no esté commiteado o stasheado.

**Regla:** antes de ejecutar, correr `git status` y `git stash` si hay algo en working tree. Confirmá dos veces el target.

### `git checkout .` / `git restore .`

**Qué hace:** descarta todos los cambios unstaged en working tree.

**Regla:** misma que reset --hard pero más silenciosa — es fácil perder una hora de trabajo sin darse cuenta.

### `git clean -fdx`

**Qué hace:** borra archivos untracked, incluyendo los ignorados.

**Regla:** correr primero con `-n` (dry run) para ver qué borra.

---

## 4. Comandos destructivos — leer antes de aprobar

### La regla general

**Antes de aprobar que Claude ejecute un comando, leelo.** Si no entendés cada flag, pedile que te explique antes de ejecutar.

Claude puede proponer comandos correctos para su objetivo pero peligrosos para tu sistema. No es malicia — es que no tiene el contexto completo de qué es crítico en tu máquina.

### Red flags que obligan a pausar

| Comando | Riesgo |
|---------|--------|
| `rm -rf <path>` | Borra irreversiblemente. Peligroso con paths variables o absolutos. |
| `rm -rf /` o `rm -rf ~/` | Catastrófico. Si ves esto, stop. |
| `git reset --hard` | Pierde trabajo local no commiteado. |
| `git clean -fdx` | Borra archivos untracked e ignorados. |
| `DROP TABLE`, `DROP DATABASE`, `TRUNCATE` | Destrucción de datos. |
| `DELETE FROM ...` sin `WHERE` | Borra toda la tabla. |
| `UPDATE ... SET ...` sin `WHERE` | Actualiza todos los registros. |
| `kubectl delete ns <x>` | Borra un namespace y todo dentro. |
| `helm uninstall` | Desinstala una release y sus recursos. |
| `terraform destroy` | Destruye toda la infra managed por ese state. |
| `aws s3 rm --recursive` | Borra recursivo en S3. |
| `gcloud ... delete` | Borra recurso cloud. |
| `docker system prune -a` | Borra imágenes, containers, volúmenes. |
| Cualquiera con `--force`, `--no-verify`, `--skip-*`, `--ignore-*`, `--yes` | Saltea verificaciones. |

### Antes de ejecutar

1. ¿Sabés exactamente qué hace cada parte del comando?
2. ¿Apunta a tu ambiente local, o a staging/prod?
3. ¿Tenés backup o forma de revertir?
4. ¿Hay alternativa menos destructiva? (ej: `git stash` en lugar de `git checkout .`).

Si dudás en cualquiera, no ejecutes.

---

## 5. Datos reales en prompts

### Qué no pegar en un prompt

- PII: nombres, emails, teléfonos, direcciones, documentos de identidad.
- Datos financieros: números de tarjeta, cuentas bancarias, montos identificables.
- Información médica, legal, o protegida por regulaciones (GDPR, HIPAA, etc.).
- Secrets (ya cubierto).
- Respuestas reales de APIs de producción con información de usuarios.
- Logs con identificadores de usuarios reales.
- Extractos de DBs con datos de clientes.

### Por qué importa

- Las conversaciones pueden quedar logueadas (por el proveedor, por tu org, por vos mismo en screenshots).
- Estás exponiendo datos a un sistema externo sobre el cual no tenés control total.
- Dependiendo del marco regulatorio, puede ser una violación de compliance.
- Si el prompt termina en un screenshot o ticket, la exposición se multiplica.

### Cómo cuidarse

Si necesitás debug con un dato real:

1. **Ofuscá** antes de pegar. Reemplazá `juan.perez@empresa.com` → `user1@example.com`; `4532-1234-5678-9010` → `4111-1111-1111-1111`; nombres reales → `Alice`, `Bob`.
2. **Usá datos sintéticos** si podés reproducir el caso sin data real.
3. **Reducí el alcance.** Si el bug se reproduce con 1 registro, no pegues 100.
4. **Describí el shape.** A veces no hace falta pegar data — alcanza con describir qué campos tiene y de qué tipos.

---

## 6. No correr contra producción desde la IDE

### La regla

Claude Code corre en tu máquina. Nada de lo que hace debería tocar infra de producción **salvo que vos explícitamente ejecutes un comando** que lo haga. Y aún así, mejor que no.

### Casos típicos a evitar

- Correr migraciones de DB contra producción desde la conversación.
- Ejecutar scripts de cleanup/modificación de datos contra prod.
- Ejecutar `terraform apply` contra workspace de prod.
- Deploy manual desde local.
- `kubectl` contra cluster de prod sin doble verificación de contexto.

### Cómo se hacen estas cosas bien

- **Migraciones:** corren en el pipeline de deploy, con aprobación manual si el esquema cambia.
- **Scripts de data:** se preparan con Claude, se revisan en PR, se ejecutan en staging primero, después en prod por alguien con autoridad y con backup previo.
- **Deploys:** vía CI/CD con gates de aprobación.
- **Infra:** vía `terraform plan` revisado y `terraform apply` en pipelines, nunca desde laptop.

### Si trabajás con DBs compartidas de desarrollo

- Tratá los cambios destructivos con cuidado — pueden afectar al equipo.
- Comunicá antes de ejecutar migraciones o resets.
- Considerá tener tu DB local propia y usar compartidas solo para integración.

---

## 7. Revisión de diffs — no hay excepciones

### La regla

Antes de commitear algo que Claude escribió, leelo. Si hay una parte que no entendés, pedile que te explique. Si después de la explicación tampoco entendés, no la commitees — pedile una alternativa más simple.

### Por qué es crítico

- **Vos sos responsable** del código que commiteás. "La IA lo escribió" no funciona como excusa si causa un incidente.
- Los errores sutiles de la IA (off-by-one, lógica invertida, edge case ignorado, import incorrecto, uso de función deprecada) solo se detectan leyendo.
- Los tests no atrapan todo. Un test que pasa con código incorrecto existe.
- La IA puede introducir dependencias no intencionadas, cambiar comportamiento de funciones relacionadas, o tocar cosas fuera de lo que pediste.

### Cómo revisar bien

1. Leé el diff entero, no solo las partes "importantes".
2. Entendé qué cambia en cada archivo.
3. Para cada línea nueva: ¿entiendo qué hace? ¿Por qué se agregó?
4. Para cada línea borrada: ¿entiendo por qué se borró? ¿No se pierde algo importante?
5. Para cada archivo modificado que no esperabas: ¿por qué se tocó?
6. Si hay imports nuevos: ¿son libs que querés agregar? ¿ya están en deps?
7. Si hay tests nuevos: ¿cubren lo que dicen cubrir? ¿pasarían con una implementación rota?

---

## 8. Checklist rápido al cerrar una sesión

Antes de hacer push o cerrar Claude Code, revisá:

- [ ] ¿Hay archivos nuevos en `git status` que no deberían entrar? (`.env`, dumps, artefactos de build).
- [ ] ¿Se modificó algún archivo sensible sin querer? (configs de CI, deps principales, migrations antiguas).
- [ ] ¿Los tests pasan?
- [ ] ¿El linter no se queja?
- [ ] ¿Revisé el diff entero antes de commitear?
- [ ] ¿El mensaje de commit refleja el cambio real?
- [ ] ¿Estoy pusheando a la rama correcta?
- [ ] ¿No estoy haciendo `--force-push` a una rama compartida?

Este checklist toma 2 minutos. Evita 2 horas de daño.
