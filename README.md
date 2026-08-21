# Reservas App

New Android and iOS reservation client built from zero with React Native, Expo, and JavaScript. reservas-front is a product reference only; this repository owns the native implementation.

## Product and API boundary

The app reproduces the front's supported mobile surfaces: welcome/access, home, availability, reservations, profile, administration, users, and audit logs. Its only backend is Render v1 at https://umg-api-django.onrender.com/api/docs/. Only the pinned /api/* contract in specs/contracts/legacy-openapi.yaml is valid. No v2, JWT/refresh, notifications, reports, proxy, or fabricated endpoint is in scope.

## Locked stack

- React Native + Expo + Expo Router
- JavaScript, native fetch, Jest, and ESLint
- Expo SecureStore for normalized UI identity only
- Spanish by default, English selectable, light and dark themes

## Delivery

Read design.md, docs/PROJECT_SPEC.md, and todo-list.md. Each numbered todo item is one feature/* or fix/* branch. Run contract, lint, and Jest coverage gates before pushing; the owner performs manual PR merge, after which work restarts from updated main.

## Security

Never commit secrets or personal data. The app persists only id, name, email, and role in SecureStore; password, token, cookie, and full API responses are forbidden. Role UI is not backend authorization.
