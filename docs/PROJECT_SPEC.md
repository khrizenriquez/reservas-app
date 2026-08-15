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
