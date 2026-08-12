# Reservas UMG Mobile Product Specification

## Product intent

The mobile application gives teachers a focused companion for time-sensitive laboratory work:
check availability, create or manage an owned reservation, read notifications, and control their
profile. It shares the visual identity and API contract of the web client without copying dense
desktop administration tables onto a small screen.

## Technical baseline

- Expo SDK 57, React Native 0.86, React 19.2, and the New Architecture.
- Expo Router with JavaScript modules only; TypeScript is intentionally excluded.
- Minimum Node.js version 22.13.0.
- REST access through Kong using the versioned OpenAPI contract.
- The access token remains in process memory. Only the rotating mobile refresh token is persisted
  with Expo SecureStore using device-only keychain accessibility.
- The application never stores credentials, access tokens, or API responses in AsyncStorage.

## Information architecture

The authenticated application uses five bottom tabs:

| Route | Purpose |
|---|---|
| `/(app)/(tabs)` | Upcoming reservation, unread count, and quick actions |
| `/(app)/(tabs)/availability` | Search an interval and create a reservation |
| `/(app)/(tabs)/reservations` | List, filter, modify, and cancel owned reservations |
| `/(app)/(tabs)/notifications` | Persistent inbox and deep-link targets |
| `/(app)/(tabs)/profile` | Identity, active sessions, and remote logout |

Administrators receive compact urgent indicators on Home. Users and teachers do not see dense
configuration, audit, or report builders; those remain web-first.

## Visual system

The canonical design-token source is `reservas-front/packages/design-tokens`. The mobile project
keeps a generated JavaScript snapshot whose source hash is recorded in
`specs/design-token-contract.json`.

- Navy navigation and security surfaces.
- Paper background, white work surfaces, blue primary actions, teal availability, and amber
  attention states.
- Serif display typography where native fonts support it, system sans-serif for controls and data.
- One-pixel borders and restrained elevation; no gradients.
- The signature laboratory time rail appears in availability and reservation summaries.
- Touch targets are at least 44 points and state never relies on color alone.

## Session and API behavior

1. Login sends `clientType: MOBILE`.
2. The API returns access and refresh credentials; the refresh credential is written to
   SecureStore and immediately removed from component state.
3. Authenticated requests use the in-memory access credential.
4. One `401` triggers a single-flight refresh and one retry.
5. Refresh rotation replaces the stored credential atomically. Reuse or failure clears the local
   session and returns to login.
6. Logout and remote session revocation clear SecureStore even when the network request fails.
7. API errors are resolved by stable `code` values and never by comparing localized prose.

## Offline policy

Previously rendered read-only data may remain visible with a clear stale banner. Availability,
creation, modification, cancellation, notification acknowledgement, push registration, and session
revocation require connectivity. No mutation is queued for later delivery.

## Notifications and deep links

- Expo Notifications obtains a project-scoped push token only after the user grants permission.
- Registration is sent through `upsertExpoPushSubscription` and removed on logout when possible.
- Notification data may deep-link only to allowlisted routes and validated numeric/string IDs.
- A tap on a reservation notification opens the matching owned reservation context.
- Push delivery failure never removes the persistent inbox record.

## Accessibility and quality

- Screen-reader labels, roles, hints, and live announcements cover every core action.
- Dynamic text and safe areas are supported; essential controls are not positioned absolutely.
- Destructive cancellation requires an explicit confirmation dialog.
- Unit and component tests cover session storage, API retry, role-aware routes, offline mutation
  guards, and core UI states. Contract verification checks OpenAPI and design-token hashes.
