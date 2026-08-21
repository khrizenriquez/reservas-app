# Mobile Delivery Todo List

## Fixed decisions

- Build a new Expo/React Native app for Android and iOS; do not wrap or convert
  the web client.
- `reservas-front` is the UI and functional reference. Render v1 is the only
  backend and only published `/api/*` operations may be consumed.
- Every numbered item is one short-lived branch. After its tests pass: commit,
  push, wait for the owner's manual merge, then delete the old local branch,
  pull `main`, and create the next branch from updated `main`.
- Persist only normalized UI identity in Expo SecureStore. Do not persist
  passwords, tokens, cookies, or full API responses.

## Required gates for every implementation item

1. `npm run contract`
2. `npm run traceability`
3. `npm run lint`
4. `npm test -- --coverage` with global coverage above 80%
5. Traceability and the affected docs/specs updated

## Ordered increments

- [x] **01 — `feature/mobile-parity-spec`: align the mobile specification.**
  Replace legacy/v2 conflicts with Render v1 parity; define screens, role UI,
  all supported operations, offline policy, and branch-by-branch traceability.
  Verification: document reference audit and `git diff --check`.
- [x] **02 — `feature/expo-scaffold`: create the runnable native foundation.**
  Add Expo Router, JavaScript project configuration, ESLint, Jest, coverage,
  scripts, theme tokens, safe-area root layout, and contract test harness.
- [x] **03 — `feature/render-contract-client`: bind the complete Render v1 contract.**
  Implement and test login, password, labs, conditions, availability,
  reservations, users, and logs with mappers and localized errors.
- [x] **04 — `feature/mobile-session-access`: implement persistent UI session.**
  Add SecureStore-backed normalized identity, login, sign-out, route guard, and
  role-aware navigation without claiming backend authorization.
- [ ] **05 — `feature/mobile-shell-theme-i18n`: build native shared UX.**
  Implement ES/EN copy, light/dark themes, loading/status components, accessible
  dialogs, connectivity state, and the mobile navigation shell.
- [ ] **06 — `feature/mobile-welcome-home`: deliver the public welcome and dashboard.**
  Recreate the institutional overview, quick actions, upcoming reservations,
  and role-appropriate summary from real Render data.
- [ ] **07 — `feature/mobile-availability`: deliver availability search.**
  Add date/interval validation, real `GET /api/labs/disponibles/` results,
  time-rail cards, and handoff to the reservation form.
- [ ] **08 — `feature/mobile-reservations`: deliver the full reservation flow.**
  Implement list/filter, detail, create, edit, cancel confirmation, future and
  ownership UI rules, pagination/list behavior, and offline mutation blocking.
- [ ] **09 — `feature/mobile-profile-password`: implement profile and password change.**
  Show restored identity and call the published change-password route.
- [ ] **10 — `feature/mobile-administration`: deliver labs and conditions.**
  Provide read surfaces for every role and admin UI create/update flows for the
  published lab and condition endpoints.
- [ ] **11 — `feature/mobile-users`: deliver administrator user management.**
  Implement users list, create, reset password, inactivate, self-inactivation
  protection, and direct-route role guard.
- [ ] **12 — `feature/mobile-logs`: deliver audit analytics.** Query the published
  `UMG_User_ID` log operation and render original, accessible weekly activity,
  metrics, filters, and list pagination from returned records only.
- [ ] **13 — `feature/mobile-offline-accessibility`: close resilience and a11y.**
  Verify stale read states, no queued mutations, screen-reader labels, dynamic
  type, 44-point targets, focus/announcements, and reduced motion.
- [ ] **14 — `feature/mobile-release-evidence`: produce Android and iOS evidence.**
  Add EAS/Expo build instructions, run Android and iOS smoke paths, record gates
  and manual evidence, and close traceability.

## Explicit exclusions

No v2 endpoints, JWT/refresh flow, push notifications, reports, fabricated
pagination parameters, API proxy, browser CORS workarounds, or local substitute
backend may be added until Render v1 publishes the relevant contract.
