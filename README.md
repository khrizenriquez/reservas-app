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
