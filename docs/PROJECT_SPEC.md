# Project Specification Baseline

## Scope

Mobile client for legacy laboratory reservations API.

Supported user journeys:

- login and forced password change;
- home with upcoming reservations;
- availability query and reservation creation;
- reservation list, detail, update, and cancellation;
- profile and local sign-out.

Out of scope:

- push notifications;
- JWT/refresh/session revocation;
- dense administration features;
- backend behavior changes.

## Technical baseline

- Expo SDK 57
- React Native 0.86
- React 19.2
- Expo Router
- JavaScript runtime (no TypeScript migration in this product cycle)
- REST HTTP contract, native async/await network calls, and fetch-based handling
- Lightweight state management strategy: local state + React Context, with Zustand allowed only for explicit shared-session or cross-screen store cases
- Optional runtime validation with Zod on form and API boundary inputs; not mandatory for every screen or endpoint

## Implementation constraints derived from user stories and acceptance criteria

### HTTP and API behavior

- The mobile app is REST-first and calls the backend through explicit endpoints and resource-oriented operations.
- The native client does not implement browser CORS logic. CORS governs server-side behavior for web origins and is not a client-side mobile concern.
- Requests are executed using native async/await patterns; the project should default to fetch-based requests and avoid adding Axios unless a genuine regression or convenience case justifies it.
- All network errors, retry conditions, and stale-state indicators must be handled explicitly at the API boundary.

### State and validation strategy

- Keep state management intentionally small and predictable. Prefer component state or a narrow context store for screen-local behavior.
- Use Zustand only when there is a clear shared state need such as auth/session or cross-screen reservation state.
- Use Zod for validation at meaningful input boundaries only; do not create a broad schema-heavy architecture that adds unnecessary complexity.

### Product and UX constraints

- Device and connectivity behavior is part of the UX contract: no offline mutation queue, no hidden stale-data state, and no lossy permission handling.
- Permission, refresh, and logout flows must be explicit and deterministic.
- All critical actions remain mobile-first and must not depend on a dense admin web experience.

## Containerization applicability

- Podman is approved for reproducible local tooling and CI-like checks.
- Containerized scope is lint, contract checks, and Jest once the runnable scaffold exists.
- Native mobile runtime stays host-driven: iOS Simulator and Android Emulator are not primary Podman targets for this project.
- Container assets should be introduced incrementally when source scaffold is added, not in docs-only baseline.

## API contract baseline

- Profile: `legacy`
- Contract manifest: `specs/api-contract.json`
- Canonical OpenAPI snapshot: `specs/contracts/legacy-openapi.yaml`
- Provenance snapshot: `specs/provenance/raw-upstream-openapi.yaml`

The API base URL must be explicit, absolute, and have no fallback.

## Security and identity constraints

- Legacy login validates credentials but does not provide secure auth identity.
- Client stores only normalized user data in local secure storage.
- UI ownership and role checks are UX safeguards only.
- No client claim of token authorization, session security, or server RBAC.

## Offline constraints

- Rendered data may remain visible as stale.
- Mutations require connectivity at action time.
- No offline mutation queue.

## Accessibility and quality baseline

- Meaningful accessibility labels on navigation and core actions.
- Minimum touch target size for key controls.
- Error/loading communication not based only on color.

## Contract-critical operations

The active mobile surface is pinned to nine operations:

1. login
2. changePassword
3. listLabs
4. getLabAvailability
5. listReservations
6. createReservation
7. getReservation
8. updateReservation
9. cancelReservation

Any change requires contract diff review, traceability update, and gate evidence.
