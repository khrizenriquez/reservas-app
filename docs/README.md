# Project Docs Bootstrap (Spec-Driven + ADR + AI Harness)

This folder is a clean-start documentation pack to replicate the current project operating model in a new repository.

## Goal

Use these docs as the first commit in a new project so implementation starts with:

- clear product scope;
- executable acceptance criteria;
- architecture decisions and status;
- spec-driven development controls;
- traceability from requirements to code and tests;
- AI-assisted development guardrails.

## Recommended commit order

1. Commit this `docs/` folder.
2. Add `specs/` contracts and acceptance assets.
3. Add CI checks for contract, lint, tests, and build.
4. Start feature commits mapped to requirement IDs.

## Canonical source mapping

These docs are derived from the current repository governance/spec assets:

- `specs/product-design.md`
- `specs/acceptance/HU-019-mobile-client.feature`
- `specs/traceability.yaml`
- `specs/api-contract.json`
- `specs/contracts/legacy-openapi.yaml`
- `specs/governance/ADR_DEPENDENCIAS_Y_VIGENCIA.md`
- `specs/governance/SDD_ADR_IA_CIERRE_100.md`
- `specs/governance/AI_DEVELOPMENT_PLAYBOOK.md`

## Files in this folder

- `PROJECT_SPEC.md`: product and technical baseline.
- `ADR_REGISTER.md`: ADR inventory and active status.
- `SDD_GOVERNANCE.md`: spec-driven workflow and gates.
- `RPI_TRACEABILITY.md`: requirement-policy-implementation trace model.
- `AI_HARNESS_PLAYBOOK.md`: AI process, review, and evidence checklist.
- `COMMIT_START_CHECKLIST.md`: first-commit readiness and branch flow.
- `templates/PR_AI_RECORD_TEMPLATE.md`: PR template for AI-assisted changes.

## Usage in a new repo

1. Copy `docs/` as-is.
2. Replace backend/repository identifiers in `PROJECT_SPEC.md`.
3. Import or recreate contract and acceptance assets referenced by this pack.
4. Keep requirement IDs stable; never reuse IDs for different behavior.
5. Enforce gates before merge.

## Trunk-based rules

Reference model: Atlassian trunk-based development.

- Keep `main` always green and releasable.
- Use short-lived branches only.
- Merge small batches at least daily when ready.
- Delete branches immediately after merge.

## Branch and commit conventions

Branch patterns:

- `feature/<short-topic>`
- `fix/<short-topic>`

Examples:

- `feature/login`
- `feature/backend-connectivity`
- `fix/get-main-dashboard-info`

Commit message style:

- Short, native English, action-oriented.
- Examples: `add login flow`, `connect dashboard api`, `fix reservation filter`.

## API source of truth

Primary runtime source: `https://umg-api-django.onrender.com/api/docs/`

For deterministic contract checks in-repo, use pinned artifacts under `specs/`.

## Testing gate

Local Jest coverage target must stay above 80% before merge.
