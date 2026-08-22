# Reservas App

New Android and iOS reservation client built from zero with React Native, Expo, and JavaScript. reservas-front is a product reference only; this repository owns the native implementation.

## Product and API boundary

The app reproduces the front's supported mobile surfaces: welcome/access, home, availability, reservations, profile, administration, users, and audit logs. Its only backend is Render v1 at https://umg-api-django.onrender.com/api/docs/. Only the pinned /api/* contract in specs/contracts/legacy-openapi.yaml is valid. No v2, JWT/refresh, notifications, reports, proxy, or fabricated endpoint is in scope.

`src/api/renderApi.js` is the single Render boundary. It covers the published
login, password, users, labs, conditions, availability, reservations, and logs
operations; it sends no authorization header, excludes credentials, and maps
transport and HTTP failures to ES/EN-safe messages. Set only the public base
URL in `.env` from `.env.example`; do not place credentials in environment files.

## Session boundary

`src/session/SessionProvider.js` restores and stores only `{ id, name, email,
role }` under Expo SecureStore. The access route sends the password only to the
published login operation, then clears it from the form; it is never written to
storage. Administrative navigation is UI visibility only and does not grant
backend authorization.

## Shared mobile experience

The shell uses a paper-and-academic-ink token system with a recurring time-rail
edge on states, dialogs, and navigation. It follows the system appearance until
the user toggles light/dark mode, starts in Spanish with an English selector,
and uses native connectivity state to display offline guidance. Mutations must
remain disabled while offline; no operation is queued.

Completed read results remain visible as explicitly stale when connectivity is
lost; an unread surface instead reports offline. Status changes and dialogs
announce their meaningful text to assistive technology, screen text keeps the
system dynamic-type default, controls retain 44-point minimum targets, and
dialogs remove their transition when the device requests reduced motion.

The public root is a native institutional welcome: it presents the academic
planning journey, visual laboratory cards, and a direct access action. A
restored identity changes that action to Portal without exposing stored data.
The role-aware Home requests the documented reservations operation, shows at
most three upcoming records in its authorized UI scope, and provides the
availability action. It never invents counts, reservations, or availability.

Availability accepts only a real `YYYY-MM-DD` date and an increasing `HH:MM`
interval before calling the documented availability operation. Its native time
rail marks the returned laboratories as available, and its reservation handoff
contains only `labId`, date, start time, and end time.

Reservations consumes Render list/create/detail/update/cancel operations only.
Professor UI exposes mutations solely for own future records; cancellation uses
a native confirmation dialog and every mutation is disabled offline.

Profile exposes the restored UI identity read-only and sends a new password only
to the documented Render password operation for that identity. The password is
cleared after every request and never persisted.

Administration exposes Render laboratories and conditions to every signed-in UI
role. Only the normalized Administrator role can open the native create/edit
dialogs, which call the documented lab and condition operations. Those controls
are disabled offline; this visibility is guidance only and never substitutes
for Render authorization.

Users is an administrator-only direct route. It lists the published user
directory, creates users, resets another user's password with an ephemeral form
value, and confirms deactivation. The current administrator never receives an
inactivation action, and every user mutation is disabled offline.

Audit Logs is also an administrator-only direct route. It calls only the
published `UMG_User_ID` query, then derives weekly or local date-range activity,
metrics, module counts, and 10/20/50 pagination from the returned records. It
does not invent an analytics endpoint or server-side date filters.

## Locked stack

- React Native + Expo + Expo Router
- JavaScript, native fetch, Jest, and ESLint
- Expo SecureStore for normalized UI identity only
- Spanish by default, English selectable, light and dark themes

## Delivery

Read design.md, docs/PROJECT_SPEC.md, and todo-list.md. Each numbered todo item is one feature/* or fix/* branch. Run contract, traceability, lint, and Jest coverage gates before pushing; the owner performs manual PR merge, after which work restarts from updated main.

## Run the native scaffold

Use Node 22.13 or later (within Node 22), then install and start the Expo
development server:

```bash
npm install
npm start
```

Use `npm run ios` or `npm run android` on a machine with the corresponding
native tooling. The reproducible gates are `npm run check` and `npm run doctor`.
`npm run build:ios` and `npm run build:android` validate native bundles without
creating a release build.

Expo's SDK 57 manifest lists React 19.2.3, while the current Expo Router
dependency tree resolves React 19.2.8. The package intentionally excludes only
React from Expo's version validator; `npm ls` and Expo Doctor remain required to
detect actual peer conflicts.

## Security

Never commit secrets or personal data. The app persists only id, name, email, and role in SecureStore; password, token, cookie, and full API responses are forbidden. Role UI is not backend authorization.
