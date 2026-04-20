# claude-code-onboarding

Skill de [Claude Code](https://docs.claude.com/en/docs/claude-code) que guía a un developer — con foco especial en juniors — a incorporar IA a su flujo de trabajo, con énfasis en seguridad y buenas prácticas.

Sirve tanto para arrancar un proyecto desde cero (greenfield) como para introducir IA a un proyecto existente (brownfield). No asume empresa, stack, ni siquiera que haya un repo git todavía.

---

## Instalación

Requiere Node.js 18+.

**Global (recomendado — instala en `~/.claude/skills/`):**

```bash
npx github:ramonfajardo-tech/claude-code-onboarding
```

**Local al repo actual (instala en `<repo>/.claude/skills/`):**

```bash
npx github:ramonfajardo-tech/claude-code-onboarding --local
```

**Pinear a un tag o rama específica:**

```bash
npx github:ramonfajardo-tech/claude-code-onboarding#v0.1.0
npx github:ramonfajardo-tech/claude-code-onboarding#develop
```

**Desinstalar:**

```bash
npx github:ramonfajardo-tech/claude-code-onboarding --uninstall
```

Opciones disponibles con `--help`.

Una vez instalada, Claude Code la reconoce automáticamente en tu próxima sesión. Disparala diciendo frases como "estoy arrancando con Claude" o "primera vez con IA para programar" (ver [Cómo se dispara](#cómo-se-dispara)).

---

## Qué hace

Cuando la skill se dispara, acompaña al dev durante 15 a 30 minutos por 7 fases:

| Fase | Objetivo |
|---|---|
| 0 — Triage | Entender contexto: greenfield/brownfield, tipo de stack, estado del repo, experiencia del dev. |
| 1 — Seguridad (pilar) | Fundamentos que van siempre: secrets, `.gitignore`/`.claudeignore`, git safety, comandos destructivos, PII en prompts, producción. |
| 2 — Setup del proyecto | Greenfield: `git init`, scaffolding, primer commit. Brownfield: lectura y respeto de lo existente. |
| 3 — Entrevista + `CLAUDE.md` | Bloques A-F (identidad, stack, arquitectura, comandos, reglas de dominio, referencias). |
| 4 — `.claudeignore` | Template ajustado al stack (backend, frontend, Electron, mobile). |
| 5 — Buenas prácticas de flujo | Modo plan, cambios chicos, diff review, tests, commits semánticos, ramas. |
| 6 — Trampas típicas de juniors | 5 errores críticos y cómo detectarlos. |
| 7 — Primera tarea de práctica (opcional) | Tarea segura en rama de experimento para ejercitar el ciclo. |

La skill **no inventa datos**. Si el dev no sabe algo, se marca como `TODO: confirmar` y se sigue.

---

## Para quién es

- Devs que usan Claude Code por primera vez.
- Devs con experiencia que quieren introducir IA a un repo existente.
- Tech leads que quieren estandarizar el onboarding a IA en su equipo.
- Cualquiera arrancando un proyecto greenfield con ayuda de IA.

El tono es de mentor a junior, con explicaciones breves del porqué detrás de cada práctica. Un senior se autodetecta y adapta; un junior necesita la guía.

---

## Cómo se dispara

La skill se activa cuando el dev dice frases como:

- "estoy arrancando con Claude"
- "primera vez con IA para programar"
- "no sé cómo empezar"
- "cómo uso Claude Code con seguridad"
- "onboarding con IA"
- "arranco un proyecto nuevo con Claude"
- "quiero sumar Claude a mi repo existente"

Claude Code la dispara automáticamente aunque el dev no la nombre explícitamente. También puede invocarse manualmente.

**No usarla** para tareas de desarrollo rutinarias cuando el dev ya tiene un `CLAUDE.md` validado y opera el flujo.

---

## Estructura del repo

```
.
├── SKILL.md                               # Definición principal de la skill (7 fases)
├── assets/
│   ├── claude-md-template.md              # Template stack-neutral para CLAUDE.md
│   └── claudeignore-template              # Template de .claudeignore (backend/frontend/desktop/mobile)
└── references/
    ├── security-checklist.md              # Detalle completo de la Fase 1
    ├── junior-pitfalls.md                 # 15 trampas típicas al empezar con IA
    ├── greenfield-stack-guide.md          # Árbol de decisión de stack para proyectos nuevos
    └── practice-tasks.md                  # Tareas de práctica por stack
```

---

## Principios rectores

1. **No inventar nada.** Un `CLAUDE.md` con datos falsos es peor que no tener `CLAUDE.md`.
2. **Seguridad antes que velocidad.** La Fase 1 va siempre, sin excepción.
3. **Tratar al dev como junior hasta que demuestre lo contrario.** Explicar el porqué con ejemplos concretos.
4. **Stack-neutral.** Sirve igual para backend, frontend web, desktop (Electron/Tauri), mobile (nativo o híbrido), librerías, CLI.
5. **Greenfield ≠ Brownfield.** La entrevista cambia según el origen.

---

## Contribuir

Esta skill es un documento vivo. Contribuciones bienvenidas vía PR:

- Si encontrás una trampa no cubierta en `references/junior-pitfalls.md`.
- Si hay un stack mal representado o faltante en `references/practice-tasks.md`.
- Si detectás que la skill asume algo que no debería.
- Si algún ejemplo de seguridad quedó desactualizado.

**Flujo de ramas:**

- `main` — rama estable, reflejo del estado productivo.
- `staging` — rama de integración pre-merge a `main`.
- `develop` — rama de trabajo diario. Las features se arrancan desde acá.

**Flujo de PR:** `feature/<slug>` → `develop` → `staging` → `main`.

Commits siguen [Conventional Commits](https://www.conventionalcommits.org/): `feat`, `fix`, `docs`, `refactor`, `test`, `chore`.

---

## Feedback

Si usaste esta skill y tenés feedback para mejorar cualquiera de los 7 pasos, abrí un issue describiendo:

1. Contexto (greenfield/brownfield, tipo de proyecto, nivel del dev).
2. Qué funcionó bien.
3. Qué faltó o no encajó.
4. Qué propondrías cambiar.
