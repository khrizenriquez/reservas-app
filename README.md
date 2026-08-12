# Reservas UMG Mobile

Expo/React Native client for the UMG laboratory reservation platform. The application is written
in JavaScript, consumes the same versioned API as the web portal, and follows the shared visual
tokens maintained in `reservas-front`.

## Prerequisites

- Node.js 22.13 or newer.
- npm 11 or a current pnpm release.
- Expo Go for local UI work, or a development build on Android/iOS. Remote push notifications
  require a development build and a configured EAS project.
- The API/Kong stack reachable from the device. `localhost` must be replaced with the host LAN IP
  when using a physical device.

## Local setup

1. Copy `.env.example` to `.env` and set `EXPO_PUBLIC_API_BASE_URL`.
2. Install dependencies with `npm install`.
3. Run `npm run check`.
4. Start the app with `npm start`.

The bottom navigation exposes Home, Availability, Reservations, Notifications, and Profile. Dense
administration, audit, and report builders intentionally remain in the web client.

`EXPO_PUBLIC_EAS_PROJECT_ID` is required only for obtaining an Expo Push token. It is a public
project identifier, not a secret. Credentials, access tokens, signing keys, and service-account
files must never be committed.

## Quality gates

- `npm run contract` verifies the 18 consumed OpenAPI operations and shared design-token snapshot.
- `npm run lint` applies the Expo ESLint configuration.
- `npm test` runs session, API, push, offline, role, UI-state, and architecture tests.
- `npm run test:e2e:ios` runs the seeded teacher journey on a booted iOS Simulator with Maestro.
  It reads the password from `RESERVAS_E2E_DEMO_PASSWORD_FILE` (default:
  `../reservas-api/.secrets/demo-user-password`) and never stores it in the flow or repository.
- `npx expo-doctor` validates Expo SDK and native-package compatibility.

## Branching

Use short-lived `feature/{change-name}` branches and integrate frequently into `main`. Commit
messages are concise, imperative, and written in native English.
