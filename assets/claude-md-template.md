# CLAUDE.md — {{NOMBRE_DEL_PROYECTO}}

> Documento de contexto para Claude Code. Mantenelo actualizado a medida que el proyecto evoluciona. Si algo acá se vuelve falso, corregilo en el mismo commit que cambia el comportamiento.

## Identidad

**Qué es:** {{una frase que describe qué hace el proyecto}}

**Tipo:** {{backend API | frontend web | desktop (Electron/Tauri) | mobile (nativa/híbrida) | librería | CLI | monorepo | otro}}

**Owner / tech lead:** {{nombre o `TODO: confirmar`}}

<!-- Si el proyecto se comunica con otros sistemas, listar acá. Si es standalone, borrar esta sección. -->
**Se comunica con:** {{otros servicios, APIs externas, bases compartidas}}

## Stack

- **Lenguaje y versión:** {{ej: Python 3.11 | TypeScript 5.3 | Java 17 | Go 1.22 | Rust 1.76}}
- **Framework principal:** {{ej: FastAPI | Angular 17 | Spring Boot | Electron + Angular | Capacitor + Ionic + Angular | React Native + Expo | ninguno, código plano}}
- **Base de datos:** {{si aplica — ej: PostgreSQL 15 + SQLAlchemy 2.x + Alembic; si no aplica, escribir "no aplica"}}
- **Otras libs clave:** {{5-10 libs relevantes para entender el código; ej: Pydantic, RxJS, NgRx, Tailwind, Zod, Axios, Prisma, TypeORM}}
- **Infra / deployment target:** {{ej: AWS ECS | Vercel | Docker self-hosted | App Store + Play Store | Electron Builder + installer | no decidido}}

## Arquitectura

{{Describí el patrón: hexagonal, capas, clean, MVC, feature-sliced, atomic design, component-based, monolito modular, ninguno explícito. Si no hay patrón consciente, decilo.}}

### Mini-mapa de carpetas

{{Incluir 3-10 líneas. Ejemplos por tipo de proyecto — borrá los que no apliquen:}}

<!-- Ejemplo backend hexagonal
src/
├── domain/          # Entidades, value objects, reglas puras
├── application/     # Use cases, orquestación
├── infrastructure/  # Adaptadores: DB, HTTP externo, message brokers
└── api/             # Endpoints (controllers, routers)
-->

<!-- Ejemplo frontend Angular feature-based
src/
├── app/
│   ├── core/        # Servicios singleton, interceptors, guards
│   ├── shared/      # Componentes/pipes/directivas reutilizables
│   └── features/    # Un módulo por feature: orders/, users/, reports/
├── assets/
└── environments/
-->

<!-- Ejemplo Electron + framework frontend
electron/            # Proceso main y preload
├── main.ts
├── preload.ts
└── ipc/             # Handlers IPC organizados por dominio
src/                 # Proceso renderer (Angular/React/Vue/Svelte)
└── ...
build/               # Configs de electron-builder
-->

<!-- Ejemplo mobile con Capacitor + Ionic
src/                 # Código Angular/React/Vue (corre en WebView)
ios/                 # Proyecto Xcode (no editar a mano normalmente)
android/             # Proyecto Gradle (no editar a mano normalmente)
capacitor.config.ts  # Configuración del runtime nativo
-->

<!-- Ejemplo librería
src/
├── index.ts         # API pública
└── internal/        # Implementación privada
tests/
dist/                # Build output (no versionado)
-->

### Convenciones internas

- **Naming:** {{snake_case/camelCase/kebab-case y dónde aplica cada uno}}
- **Dependencias entre capas/módulos:** {{reglas; ej: "los use cases no importan de infrastructure directo"; "los componentes feature no importan entre sí, pasan por shared"}}
- **Patrones específicos del proyecto:** {{cosas no obvias que todo dev nuevo debería saber}}

## Comandos esenciales

Todos los comandos se corren desde la raíz del repo salvo que se indique otra cosa.

| Acción | Comando |
|--------|---------|
| Instalar dependencias | `{{ej: npm install | pnpm install | pip install -r requirements.txt | poetry install | go mod download | cargo fetch}}` |
| Tests | `{{ej: pytest | npm test | ng test | go test ./... | cargo test}}` |
| Tests con coverage | `{{si aplica}}` |
| Lint | `{{ej: ruff check . | npm run lint | eslint . | golangci-lint run}}` |
| Format | `{{ej: ruff format . | npm run format | prettier --write . | gofmt -w .}}` |
| Dev local | `{{ej: docker compose up | ng serve | npm run dev | uvicorn app:app --reload}}` |
| Build de producción | `{{ej: npm run build | ng build --configuration production | docker build . | cargo build --release}}` |

<!-- Si el proyecto tiene base de datos con migraciones, mantené estas filas. Si no, borralas. -->
| Aplicar migraciones | `{{ej: alembic upgrade head | knex migrate:latest | prisma migrate deploy}}` |
| Generar nueva migración | `{{ej: alembic revision --autogenerate -m "descripción"}}` |

<!-- Si es Electron/Tauri, mantené estas. Si no, borralas. -->
| Dev desktop | `{{ej: npm run electron:dev | cargo tauri dev}}` |
| Package desktop | `{{ej: npm run electron:package | cargo tauri build}}` |

<!-- Si es mobile con Capacitor/Expo/RN, mantené estas. Si no, borralas. -->
| Sincronizar nativo | `{{ej: npx cap sync | expo prebuild}}` |
| Abrir iOS | `{{ej: npx cap open ios}}` |
| Abrir Android | `{{ej: npx cap open android}}` |
| Build iOS (release) | `{{ej: xcodebuild ...}}` |
| Build Android (release) | `{{ej: ./gradlew assembleRelease}}` |

## Reglas de dominio y negocio

{{Reglas del proyecto que un dev nuevo tendería a romper. Organizar por categoría según tipo de proyecto. Borrar las categorías que no apliquen.}}

<!-- Ejemplos backend:
- **Multi-tenancy:** toda query a DB debe filtrar por `tenant_id`. Ver `infrastructure/tenancy.py`. Queries que no lo hacen pueden leer datos cruzados.
- **Dinero:** montos se persisten en `Decimal` con {{N}} dígitos; nunca `float`. Nunca redondear en capa de presentación.
- **Idempotencia:** endpoints que mutan requieren `Idempotency-Key` en header.
- **Soft delete:** no borrar registros, marcar `deleted_at`. Queries deben filtrar por `deleted_at IS NULL` por defecto.
- **Autenticación:** usar el decorator `@requires_auth`; no implementar auth ad-hoc en endpoints.
-->

<!-- Ejemplos frontend:
- **State:** estado centralizado en {{NgRx/Redux/Pinia/Zustand}}. Los componentes no manejan estado de dominio en local.
- **Formularios:** reactive forms, no template-driven. Validaciones en el service, no en el componente.
- **Data fetching:** pasa siempre por `services/`, nunca HTTP directo desde componentes.
- **i18n:** todo string mostrado al usuario pasa por {{lib}}. Nunca hardcodear strings en templates.
- **Accesibilidad:** componentes interactivos requieren roles ARIA y navegación por teclado.
-->

<!-- Ejemplos desktop (Electron):
- **Aislamiento main/renderer:** el renderer NO tiene acceso a Node directo. Todo filesystem/proceso pasa por IPC definido en `preload.ts`.
- **IPC tipado:** usar los handlers definidos en `electron/ipc/`; no emitir/escuchar canales ad-hoc.
- **Code signing:** los releases firmados con {{cert}}; no distribuir builds unsigned.
- **Auto-updater:** configurado con {{provider}}; los releases se publican en {{canal}}.
- **Tamaño de bundle:** mantener bajo {{N}} MB; evaluar antes de agregar libs pesadas.
-->

<!-- Ejemplos mobile:
- **Offline-first:** operaciones que requieren red encolan y sincronizan después; ver `sync/`.
- **Permisos OS:** pedir solo cuando se necesitan, con justificación al usuario.
- **Tamaño de bundle:** mantener bajo {{N}} MB; las stores penalizan apps grandes.
- **Versionado:** version code/bundle id se incrementan manualmente en el script de release.
- **Datos sensibles:** usar {{Keychain/Keystore}}, nunca `AsyncStorage`/`SharedPreferences` plano.
- **Deep links:** rutas registradas en `app.routes.ts` + configuración nativa en `AndroidManifest.xml`/`Info.plist`.
-->

## Cosas que Claude NO debe hacer sin pedir permiso explícito

<!-- Ajustar al proyecto. Estos son ejemplos; borrá los que no apliquen y agregá los propios. -->

- Modificar migraciones ya aplicadas.
- Cambiar contratos de API públicos (ver `{{openapi.yaml | graphql schema | ...}}`).
- Tocar archivos en `{{config/production/ | secrets/ | .github/workflows/}}` o equivalente.
- Commitear secrets, `.env*`, dumps, o datos reales de clientes.
- Correr scripts que modifiquen datos en ambientes de staging/prod.
- Hacer merge hacia `{{main | develop}}` (solo vía PR revisado).
- Modificar configuraciones de CI/CD sin entender el impacto.
- Cambiar dependencias principales (major upgrades) sin testeo explícito.

## Flujo de branches y commits

{{Describir convenciones del equipo: desde dónde se crean feature branches, cómo se nombran, hacia dónde se mergean, formato de commits.}}

Ejemplo común (Conventional Commits + Git Flow simplificado):

- Feature branches desde `{{develop | main}}`: `feature/<slug-corto>` o `fix/<slug-corto>`.
- Commits siguen Conventional Commits: `feat: ...`, `fix: ...`, `refactor: ...`, `docs: ...`, `test: ...`, `chore: ...`.
- Mensajes describen el **por qué**, no solo el qué.
- PRs a `{{develop | main}}` requieren review antes de merge.
- No force-push a ramas compartidas.

## Referencias externas

- **Docs internas:** {{link o `TODO: confirmar`}}
- **Issue tracker:** {{link o `TODO: confirmar`}}
- **Observabilidad:** {{dashboard/logs/alertas o `TODO: confirmar`}}
- **Canal de comunicación:** {{Slack/Discord/Teams o `TODO: confirmar`}}
- **Documentación de dependencias clave:** {{links a docs de frameworks/libs críticas}}

## Pendientes de completar

_Borrar esta sección una vez todos los TODO estén resueltos._

<!-- Listar acá los TODO dejados durante la entrevista, para que el dev los siga completando. -->

- [ ] {{TODO ejemplo 1}}
- [ ] {{TODO ejemplo 2}}
