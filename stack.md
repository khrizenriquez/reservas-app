# Project Stack and Architecture Inventory

## 1. Primary stack (approved)

- Mobile framework: React Native with Expo.
- Language: JavaScript.
- Routing: Expo Router.
- Test framework: Jest.
- API style: REST over HTTP.
- HTTP client pattern: native async/await networking using fetch or Expo-native request helpers; no Axios dependency by default.
- State management: keep it minimal; use lightweight local state + React Context, and optionally Zustand for session and UI stores when shared state justifies it.
- Validation: optional Zod-based runtime validation at form and boundary layers; avoid introducing a large validation ecosystem unless the feature genuinely needs it.
- API source of truth: `https://umg-api-django.onrender.com/api/docs/`.

## 2. Implementation constraints derived from product and acceptance criteria

- Native app constraint: browser CORS is not a client concern; the application is a native mobile client, so it does not implement browser-side CORS handling. CORS is enforced by the backend on web origins, not by the mobile app.
- REST-first contract: each domain action is modeled as an HTTP request/response with explicit endpoints, methods, and error codes. No RPC-style abstraction is imposed unless required by a real backend contract.
- Async pattern: all API calls use async/await and native concurrency patterns. Background work is handled with explicit loading, retry, and stale states; no imperative request lib abstraction layer is required unless it clearly simplifies repeated flows.
- Minimal dependency posture: do not introduce a large app framework or heavy state management stack. Prefer the smallest dependency set needed for secure storage, session handling, and API contract checks.
- Security and session handling: the refresh token stays in Expo SecureStore; the access token remains in memory only. No token persistence in AsyncStorage.
- Offline policy: read-only stale data is allowed to remain visible with a banner, but create/update/cancel actions are blocked when offline and never queued.
- Notification and deep-link policy: allow list routes and IDs, and do not permit arbitrary deep links or object injection.
- UX and accessibility: minimum target sizes, screen-reader labels, and non-color-only status communication are product requirements, not optional enhancements.

## 3. Tooling and workflow stack

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
