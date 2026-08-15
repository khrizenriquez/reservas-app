# Project Stack and Architecture Inventory

## 1. Primary stack (approved)

- Mobile framework: React Native with Expo.
- Language: JavaScript.
- Routing: Expo Router.
- Test framework: Jest.
- API style: REST over HTTP.
- API source of truth: `https://umg-api-django.onrender.com/api/docs/`.

## 2. Tooling and workflow stack

- Version control workflow: trunk-based development.
- Branch naming: `feature/<short-topic>` and `fix/<short-topic>`.
- Commit style: short, native English, action-oriented.
- Quality gates: contract verification, lint, Jest pass, coverage > 80%.
- Optional container tooling: Podman for reproducible Node tooling workflows.

## 3. Container scope (Podman)

- Supported scope: lint, tests, and contract checks once scaffold exists.
- Not primary container scope: iOS Simulator and Android Emulator runtime.
- Containerization should be incremental and introduced with runnable source scaffold.

## 4. Architecture currently defined

- Client-server mobile architecture.
- Mobile client consumes the Render-hosted API contract.
- Contract-first integration using versioned OpenAPI artifacts in `specs/`.
- Governance-first delivery: docs/specs define behavior before implementation.

## 5. Patterns currently defined

- Spec-Driven Development (SDD).
- Trunk-based development with short-lived branches.
- Requirement-to-implementation traceability (RPI/traceability model).
- API contract verification as a merge gate.
- Security baseline and explicit out-of-scope declarations.

## 6. Important consistency check

The current repository includes two different behavioral baselines between docs/specs:

- Baseline A (legacy-only style): emphasizes pseudo-session and no secure auth.
- Baseline B (token/refresh style): includes in-memory access token and refresh handling, plus notifications.

Before implementation starts, select one authoritative baseline and align all docs/specs to it.
