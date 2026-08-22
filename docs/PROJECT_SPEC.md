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
| Administration | `/portal/administracion` | list/create/update labs and conditions |
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
- The root route is the public institutional Welcome screen. Its access action
  sends a restored identity to Portal and every other user to Access; Portal
  itself remains guarded while SecureStore restores. Login may consult the
  published users list only when its direct response omits an identity.
- Home uses only the documented reservations list operation and presents up to
  three future records in the current UI role's scope, plus a handoff to
  availability. It never derives fictitious dashboard metrics or records.
- Availability validates a real ISO date and increasing 24-hour interval before
  calling the documented available-labs operation. Returned labs use the
  laboratory time rail and hand off only `labId`, date, start time, and end time
  to the planned reservation form; it does not pre-create a reservation.
- Reservations consumes only the published list/create/detail/update/cancel
  operations. Its form accepts the availability handoff, validates future
  intervals locally, limits professor mutation controls to own future records,
  and requires native cancellation confirmation.
- Profile displays the normalized SecureStore identity as read-only and calls
  the published password route only for that identity. New passwords are cleared
  after success or failure and are never persisted.
- Administration reads the published laboratories and conditions for every
  signed-in UI role. Only the normalized Administrator role exposes native
  create/edit controls, which select create only for new records and update only
  for records with a Render identifier. Every such control is disabled offline.
- Users is an administrator-only direct route. It lists published Render users,
  creates users, resets another user's password with an ephemeral input, and
  confirms inactivation. The current user never receives an inactivation action
  and every user mutation is disabled offline.
- Logs is an administrator-only direct route. It starts with the restored user
  ID and permits only the published `UMG_User_ID` query. Weekly/range filters,
  metrics, module counts, accessible activity bars, and 10/20/50 pagination are
  local derivations of returned records; no analytics or date-filter endpoint is
  invented.
- Administrative destinations are derived from the normalized UI role and are
  navigation guidance only; they do not claim backend authorization.
- Every call uses a Render v1 operation from the pinned contract; no v2, proxy,
  push, report, or invented endpoint may be used.
- `src/api/renderApi.js` is the only transport boundary. It maps all 19 published
  operations to native UI records, permits only documented availability,
  reservation, and log query parameters, and never sends an authorization
  header or stored credential.
- Map transport/4xx/5xx responses to localized ES/EN user messages.
- The shared shell provides Spanish-default/English-selectable copy, light and
  dark token sets, native connectivity state, non-colour status banners,
  accessible dialogs, and 44-point navigation controls. It deliberately uses
  no decorative animation, which satisfies reduced-motion use cases.
- Read data may be stale offline with a clear banner; all mutations are disabled
  offline and never queued.
- A completed read is retained as stale after connectivity loss, including when
  a later refresh fails; a screen without a completed read reports offline.
  Each data screen owns one contextual status banner and the portal header
  renders none. Status and dialog changes announce their meaningful text, text
  uses the platform dynamic-type default, controls keep 44-point targets, and
  ambiguous icon actions include concise outcome hints. A dialog requests
  native focus for its title; modal transitions are removed for reduced motion.

## Acceptance and quality

`HU-019` is the authoritative mobile acceptance feature. Every scenario maps to
`specs/traceability.yaml`, code, tests, and reproducible gate evidence. Global
Jest coverage must exceed 80% before merge.
