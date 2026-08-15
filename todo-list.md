# Project TODO List

## 0. Alignment checkpoints (must finish first)

- [ ] Confirm final functional baseline between docs and specs (legacy-only vs token-refresh + notifications model).
- [ ] Confirm API source remains `https://umg-api-django.onrender.com/api/docs/`.
- [ ] Confirm mobile scope and endpoint subset in product and implementation docs.
- [ ] Confirm React Native + Expo + JavaScript as locked stack for this cycle.

## 1. Governance and architecture readiness

- [ ] Keep `README.md`, `AGENTS.md`, `SECURITY.md`, `stack.md`, and this file updated.
- [ ] Keep docs synchronized: ADR register, SDD governance, traceability, AI playbook.
- [ ] Review and approve architecture flow diagrams in `docs/ARCHITECTURE_FLOWS.md`.
- [ ] Define acceptance criteria freeze point for first implementation slice.

## 2. Repo scaffold from scratch

- [ ] Create app scaffold in a short-lived branch from `main`.
- [ ] Add package manager config and scripts for lint, tests, and contract checks.
- [ ] Add minimal project structure for API client, domain, UI routes, and session handling.
- [ ] Add test harness with Jest and coverage report output.

## 3. Contract and quality gates

- [ ] Implement contract verification script using canonical OpenAPI artifacts.
- [ ] Configure lint rules and CI checks.
- [ ] Enforce Jest coverage > 80% gate in local and CI execution.
- [ ] Add traceability validation check (requirement IDs, contract op mapping, file existence).

## 4. Podman enablement (applies when scaffold exists)

- [ ] Define Podman image for Node tooling only (lint, contract, tests).
- [ ] Add simple startup instructions for Podman workflow.
- [ ] Document explicit non-containerized scope: iOS simulator and Android emulator runtime.

## 5. First feature slices (trunk-based)

- [ ] `feature/login`: login + forced password-change flow baseline.
- [ ] `feature/backend-connectivity`: API client wiring and core endpoint adapters.
- [ ] `feature/reservation-core`: availability + create/update/cancel reservation flow.
- [ ] Keep commits short and action-oriented in native English.

## 6. Verification before each merge

- [ ] Contract check passes.
- [ ] Lint passes.
- [ ] Jest passes with coverage > 80%.
- [ ] Traceability updated for touched requirements.
- [ ] Docs/specs updated for behavioral or scope changes.

## 7. Open decisions to close now

- [ ] Choose one authoritative auth/session model across all docs.
- [ ] Decide whether notifications are in-scope for this cycle.
- [ ] Decide whether Kong is mandatory in local dev or optional.
