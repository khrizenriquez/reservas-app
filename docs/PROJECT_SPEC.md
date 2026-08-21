# Reservas UMG Mobile Project Specification

## Scope

Build a new native Android and iOS reservation client. It must match the
functional scope of `reservas-front` while adapting dense browser layouts to
mobile-native screens. The source of truth for runtime integration is Render v1:
`https://umg-api-django.onrender.com/api/docs/`.

The snapshot keeps its historical filename `legacy-openapi.yaml`, but its pinned
hash and active manifest profile are Render v1; it is not a second legacy API.

## Screens and role UI

| Mobile screen | Front reference | Render v1 operations |
|---|---|---|
| Welcome and Access | `/`, `/acceso` | login |
| Home | `/portal` | list reservations |
| Availability | `/portal/disponibilidad` | list available labs |
| Reservations | `/portal/reservas` | list/create/detail/update/cancel reservations |
| Profile | `/portal/perfil` | change password |
| Administration | `/portal/administracion` | list/create/update labs and conditions; list logs |
| Users (admin UI) | `/portal/usuarios` | list/create/inactivate/reset users |
| Logs | `/portal/logs` | list logs with `UMG_User_ID` |

Admin and professor visibility matches the front. This is UI guidance only: the
published Render contract still permits anonymous alternatives, therefore the
backend must enforce authorization.

## Technical and security rules

- Expo, React Native, Expo Router, JavaScript, native `fetch`, and Jest are required.
- The native foundation uses Expo SDK 57, React Native 0.86.2, and React 19.2.8.
  Expo's base manifest presently lists React 19.2.3, but the Router dependency
  tree requires the compatible 19.2.8 patch; the intentional React-only Expo
  validator exclusion must not hide `npm ls` or Expo Doctor failures.
- Persist only normalized `id`, `name`, `email`, and `role` in Expo SecureStore
  across relaunch. Never store a password, token, cookie, or full API response.
- Every call uses a Render v1 operation from the pinned contract; no v2, proxy,
  push, report, or invented endpoint may be used.
- `src/api/renderApi.js` is the only transport boundary. It maps all 19 published
  operations to native UI records, permits only documented availability,
  reservation, and log query parameters, and never sends an authorization
  header or stored credential.
- Map transport/4xx/5xx responses to localized ES/EN user messages.
- Read data may be stale offline with a clear banner; all mutations are disabled
  offline and never queued.

## Acceptance and quality

`HU-019` is the authoritative mobile acceptance feature. Every scenario maps to
`specs/traceability.yaml`, code, tests, and reproducible gate evidence. Global
Jest coverage must exceed 80% before merge.
