# AGENTS Operating Guide

This file defines how humans and AI agents must work in this repository.

## Product intent

Build the mobile reservation client using spec-driven development and trunk-based delivery.

Primary backend source:

- `https://umg-api-django.onrender.com/api/docs/`

All pages, dashboards, and data integrations must use this API surface.

## Delivery model

Use trunk-based development:

- `main` is always stable and releasable.
- Branches are short-lived.
- Changes are merged in small batches.
- Branches are deleted after merge.
- CI gates must be green before merge.

Reference: Atlassian trunk-based development.

## Branch naming policy

Allowed formats:

- `feature/<short-topic>`
- `fix/<short-topic>`

Examples:

- `feature/login`
- `feature/backend-connectivity`
- `fix/get-main-dashboard-info`

## Commit message policy

- Keep messages short.
- Use native English.
- Use action-oriented phrasing.

Examples:

- `add login screen`
- `connect labs endpoint`
- `fix dashboard load state`

## Required quality gates

Before merge into `main`:

1. Contract verification passes.
2. Lint passes.
3. Jest test suite passes.
4. Jest coverage is greater than 80%.

Suggested commands:

```bash
npm run contract
npm run lint
npm test -- --coverage
```

## Security policy

- Follow `SECURITY.md` for all security handling and disclosure.
- Never commit secrets, tokens, private keys, credentials, or personal data.
- Any security risk or vulnerability must be reported through the maintainer's private channel.
- Do not merge changes with unresolved critical security findings.

## API endpoint inventory

Current endpoint inventory from Render schema:

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

## Mobile-critical endpoint subset

1. `POST /api/auth/login/`
2. `POST /api/auth/cambiar-contrasena/`
3. `GET /api/labs/`
4. `GET /api/labs/disponibles/`
5. `GET /api/reservas/`
6. `POST /api/reservas/`
7. `GET /api/reservas/{id}/`
8. `PUT /api/reservas/{id}/modificar/`
9. `PATCH /api/reservas/{id}/cancelar/`

## Documentation baseline

Keep these files synchronized with implementation and API behavior:

- `README.md`
- `docs/README.md`
- `docs/PROJECT_SPEC.md`
- `docs/ADR_REGISTER.md`
- `docs/SDD_GOVERNANCE.md`
- `docs/RPI_TRACEABILITY.md`
- `docs/AI_HARNESS_PLAYBOOK.md`
- `docs/COMMIT_START_CHECKLIST.md`
- `docs/ARCHITECTURE_FLOWS.md`
- `docs/templates/PR_AI_RECORD_TEMPLATE.md`
- `stack.md`
- `todo-list.md`
- `SECURITY.md`
