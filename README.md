# Reservas App

This repository is intentionally kept as a baseline workspace to start the mobile client from scratch using governance-first delivery.

## What exists in this baseline

- Root governance files: `README.md`, `SECURITY.md`, `AGENTS.md`.
- Design and governance guides under `docs/`.
- Product and contract specifications under `specs/`.

No runtime application code is expected in this stage.

## How the project works

The build process is spec-driven and trunk-based.

1. Define or refine behavior in specs.
2. Keep ADR and governance aligned.
3. Implement in short-lived branches.
4. Validate against contract, tests, and traceability.
5. Merge small batches back to `main` only when gates are green.

Primary API source of truth:

- `https://umg-api-django.onrender.com/api/docs/`

## Stack decision

- Mobile framework: React Native with Expo.
- Language: JavaScript.
- Flutter and Dart are out of scope unless a new ADR approves a stack change.

## Trunk-based rules

- `main` stays stable and releasable.
- Branches are short-lived.
- Changes are merged in small batches.
- Branches are deleted after merge.
- CI gates must be green before merge.

Branch naming:

- `feature/<short-topic>`
- `fix/<short-topic>`

Examples:

- `feature/login`
- `feature/backend-connectivity`
- `fix/get-main-dashboard-info`

Commit messages:

- Short, native English, action-oriented.
- Examples: `add login flow`, `connect labs endpoint`, `fix reservation filter`.

## Quality gates

- Contract verification passes.
- Lint passes.
- Jest test suite passes.
- Jest coverage stays above 80%.

## Podman and containers

Container usage is possible and recommended for reproducible developer tooling, with these limits:

- Applies now: documentation and spec workflow standardization.
- Applies after scaffold: run Node tooling (lint, tests, contract checks) in Podman containers.
- Not applicable: iOS Simulator and Android Emulator execution cannot be fully containerized for normal mobile development.

For this baseline phase, do not over-engineer container files yet. Add Podman startup assets when the first runnable app scaffold is introduced.

## API endpoint inventory

Current endpoints from Render schema:

1. `POST /api/auth/cambiar-contrasena/`
2. `POST /api/auth/login/`
3. `GET /api/condiciones/`
4. `POST /api/condiciones/`
5. `PUT /api/condiciones/{id}/`
6. `GET /api/labs/`
7. `POST /api/labs/`
8. `PUT /api/labs/{id}/`
9. `GET /api/labs/disponibles/`
10. `GET /api/logs/`
11. `GET /api/reservas/`
12. `POST /api/reservas/`
13. `GET /api/reservas/{id}/`
14. `PATCH /api/reservas/{id}/cancelar/`
15. `PUT /api/reservas/{id}/modificar/`
16. `GET /api/schema/`
17. `GET /api/usuarios/`
18. `POST /api/usuarios/`
19. `PATCH /api/usuarios/{id}/inactivar/`
20. `PATCH /api/usuarios/{id}/resetear-contrasena/`

Mobile-critical subset:

1. `POST /api/auth/login/`
2. `POST /api/auth/cambiar-contrasena/`
3. `GET /api/labs/`
4. `GET /api/labs/disponibles/`
5. `GET /api/reservas/`
6. `POST /api/reservas/`
7. `GET /api/reservas/{id}/`
8. `PUT /api/reservas/{id}/modificar/`
9. `PATCH /api/reservas/{id}/cancelar/`

## Required docs

- `docs/README.md`
- `docs/PROJECT_SPEC.md`
- `docs/ADR_REGISTER.md`
- `docs/SDD_GOVERNANCE.md`
- `docs/RPI_TRACEABILITY.md`
- `docs/AI_HARNESS_PLAYBOOK.md`
- `docs/COMMIT_START_CHECKLIST.md`
- `docs/ARCHITECTURE_FLOWS.md`
- `docs/templates/PR_AI_RECORD_TEMPLATE.md`

## Root planning files

- `todo-list.md`
- `stack.md`
