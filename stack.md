# Mobile Stack and Architecture

## Locked stack

- React Native with Expo and Expo Router
- JavaScript
- Jest with global coverage above 80%
- Native `fetch` with `async`/`await`; no Axios
- React local state and Context by default; Zustand only when a documented
  cross-route state need cannot remain simple
- Expo SecureStore for normalized UI identity only
- Expo SDK 57, React Native 0.86.2, and React 19.2.8; the React-only Expo
  validator exclusion is documented because the Router dependency tree requires
  the compatible 19.2.8 patch

## Contract boundary

The sole profile is **Render v1**, using the published `/api/*` schema captured
in `specs/contracts/legacy-openapi.yaml`. Browser CORS is not a mobile-client
concern. The app must not use the local v2 profile, JWT/refresh assumptions,
Kong-only endpoints, notification APIs, reports, or a proxy.

## Architecture

`Expo Router screen -> feature hook/use case -> src/api/renderApi.js -> mapper -> UI`

The API client creates the 19 published operation-level requests, maps records
to UI models, and normalizes network, 4xx, and 5xx failures to localized stable
error codes. It sends no authorization header and keeps credentials out of the
transport. The session context restores only normalized identity from SecureStore
and controls UI navigation; it is not backend authorization.

## Quality and delivery

Every branch starts from updated `main`, maps its change to acceptance and
traceability, and passes `npm run contract`, `npm run traceability`,
`npm run lint`, and `npm test -- --coverage` before it is pushed for manual
merge. Run `npm run doctor` and the affected `build:ios`/`build:android` export
when native configuration changes. Podman may run Node tooling only; iOS
Simulator and Android Emulator remain host-driven.
