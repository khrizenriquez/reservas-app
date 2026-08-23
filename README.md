# Reservas UMG Mobile

A native mobile client for UMG laboratory reservations. It is built from scratch with React Native, Expo, and Expo Router for Android and iOS; it does not wrap or convert `reservas-front`. That repository is only the product's functional and visual reference.

The app exclusively consumes Render v1 through the repository's versioned contract, documented at [`/api/docs/`](https://umg-api-django.onrender.com/api/docs/).

## App screens

<p align="center">
  <img src="assets/screenshots/administration-ios.png" alt="Administration screen on iOS" width="30%" />
  <img src="assets/screenshots/reservation-detail-ios.png" alt="Reservation detail dialog on iOS" width="30%" />
  <img src="assets/screenshots/audit-logs-ios.png" alt="Audit log dashboard on iOS" width="30%" />
</p>

| Administration | Reservations | Audit logs |
| --- | --- | --- |
| Laboratories, conditions, and administrative workflows. | Browsing, details, creation, updates, and cancellation. | Weekly activity, metrics, filters, and local pagination. |

## What’s included

- Welcome, institutional sign-in, and securely persisted UI session data with Expo SecureStore.
- A role-aware home screen with upcoming reservations, availability by date and time range, and a complete reservation workflow.
- Profile and password changes; UI administration for laboratories, conditions, users, and logs for the administrative role.
- Spanish by default, optional English, light/dark theme support, native navigation, loading/error/empty/stale/offline states, and mutations blocked while offline.
- Native accessibility: at least 44 pt touch targets, labels and hints for ambiguous icon controls, dialog focus management, and reduced-motion support.

## API and security boundaries

- Render v1 is the only permitted backend. The client does not use v2 endpoints, a proxy, JWT/refresh flows, notifications, reports, or mock data.
- [`src/api/renderApi.js`](src/api/renderApi.js) is the only network boundary. It uses published endpoints for login, password changes, users, laboratories, conditions, availability, reservations, and logs.
- Only `{ id, name, email, role }` is retained as UI identity data in SecureStore. Passwords, tokens, cookies, and complete API responses are never persisted.
- Mobile role-based visibility is an experience aid; Render must enforce authorization and object ownership on the backend.

## Run locally

### Requirements

- Node.js **22.13.x** (the version used by this project).
- npm, included with Node.js.
- For iOS: macOS, Xcode, and an iOS simulator compatible with Expo Go.
- For Android: Android Studio, a running emulator, or a physical Android device with Expo Go.
- Network access to `https://umg-api-django.onrender.com` to consume Render.

### 1. Clone, install, and configure

```bash
git clone https://github.com/khrizenriquez/reservas-app.git
cd reservas-app
cp .env.example .env
npm ci
```

The `.env` file contains public configuration only. Do not add credentials, passwords, tokens, or personal data.

### 2. Start the Expo development server

```bash
npm start
```

With Metro running, you can use its shortcuts:

- Press `i` to open iOS in a simulator.
- Press `a` to open Android in an available emulator or device.
- Scan the QR code with Expo Go to open the app on a physical device connected to the same network.

You can also launch a platform directly:

```bash
# Launch the iOS simulator
npm run ios

# Launch Android emulator or a connected Android device
npm run android
```

You can also scan the QR code shown by Expo Go on a physical device connected to the same network.

This is a native mobile client. `npm run web` is provided by Expo, but web is not configured or supported in this repository.

### 3. Verify the project before contributing

```bash
npm run contract
npm run lint
npm test -- --coverage
```

To run every gate, Expo Doctor, and the exports for both targets:

```bash
npm run release:verify
```

## Quick architecture

```text
app/                 Expo Router routes
src/api/             Render v1 client and mappers
src/features/        Product workflows by screen
src/session/         UI identity and SecureStore
src/connectivity/    Native connectivity state
src/components/      Shared controls and states
specs/               Contract, acceptance criteria, and traceability
docs/                Architecture, governance, and delivery evidence
```

## Development and delivery

The project uses trunk-based development: `main` must remain stable; every increment lives in a short-lived `feature/*` or `fix/*` branch, passes the quality gates, and is integrated through a manual pull request. Review [todo-list.md](todo-list.md) for current progress, [design.md](design.md) for visual rules, and [docs/COMPLIANCE_REVIEW.md](docs/COMPLIANCE_REVIEW.md) for findings and outstanding external requirements.

## Key documentation

| Document | Contents |
| --- | --- |
| [docs/PROJECT_SPEC.md](docs/PROJECT_SPEC.md) | Screens, roles, contract, and product rules. |
| [docs/ARCHITECTURE_FLOWS.md](docs/ARCHITECTURE_FLOWS.md) | App flows and integration boundaries. |
| [specs/acceptance/HU-019-mobile-client.feature](specs/acceptance/HU-019-mobile-client.feature) | User stories and acceptance criteria. |
| [specs/traceability.yaml](specs/traceability.yaml) | Relationship between scenarios, implementation, and tests. |
| [docs/RELEASE_EVIDENCE.md](docs/RELEASE_EVIDENCE.md) | Evidence for bundles and release tasks. |

## Security

Do not commit secrets or personal data in commits, screenshots, logs, or environment files. Review [SECURITY.md](SECURITY.md) before reporting a risk.
