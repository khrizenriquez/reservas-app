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
- [x] **05 — `feature/mobile-shell-theme-i18n`: build native shared UX.**
  Implement ES/EN copy, light/dark themes, loading/status components, accessible
  dialogs, connectivity state, and the mobile navigation shell.
- [x] **06 — `feature/mobile-welcome-home`: deliver the public welcome and dashboard.**
  Recreate the institutional overview, quick actions, upcoming reservations,
  and role-appropriate summary from real Render data.
- [x] **07 — `feature/mobile-availability`: deliver availability search.**
  Add date/interval validation, real `GET /api/labs/disponibles/` results,
  time-rail cards, and handoff to the reservation form.
- [x] **08 — `feature/mobile-reservations`: deliver the full reservation flow.**
  Implement list/filter, detail, create, edit, cancel confirmation, future and
  ownership UI rules, pagination/list behavior, and offline mutation blocking.
- [x] **09 — `feature/mobile-profile-password`: implement profile and password change.**
  Show restored identity and call the published change-password route.
- [x] **10 — `feature/mobile-administration`: deliver labs and conditions.**
  Provide read surfaces for every role and admin UI create/update flows for the
  published lab and condition endpoints.
- [x] **11 — `feature/mobile-users`: deliver administrator user management.**
  Implement users list, create, reset password, inactivate, self-inactivation
  protection, and direct-route role guard.
- [x] **12 — `feature/mobile-logs`: deliver audit analytics.** Query the published
  `UMG_User_ID` log operation and render original, accessible weekly activity,
  metrics, filters, and list pagination from returned records only.
- [x] **13 — `feature/mobile-offline-accessibility`: close resilience and a11y.**
  Preserve completed reads as stale without queuing mutations; verify
  screen-reader announcements, dynamic-type defaults, 44-point targets, and
  reduced-motion dialog transitions.
- [x] **14 — `feature/mobile-release-evidence`: produce Android and iOS evidence.**
  Add EAS/Expo profiles, run reproducible Android/iOS exports and release gates,
  record the owner-requested waiver of manual smoke, and close traceability.

## Post-release remediation identified by compliance audit

- [x] **15 — `feature/ci-release-gates`: enforce the mandatory gates in CI.**
  Add a GitHub Actions workflow with Node 22.13, `npm ci`, and
  `npm run release:verify`; protect against merges that only have local evidence.
  Verification: workflow syntax, `npm ci --dry-run`, and the full release
  command. Repository branch protection remains an owner setting.
- [x] **16 — `fix/connectivity-status`: make read-state status durable and singular.**
  Retain a successful-read marker through failed refreshes, display `stale` for
  retained records, and render/announce only one offline status per portal view.
  Verification: regression tests for success → offline and success → error →
  offline, including the portal header plus a data screen; `npm run
  release:verify` passed with 59 tests, 90.95% statements, 81.12% branches,
  21/21 Expo Doctor checks, and successful iOS/Android exports.
- [ ] **17 — `fix/mobile-accessibility-controls`: complete native accessibility controls.**
  Restore the 44-point minimum for every interactive target, add concise hints
  where a label does not describe the outcome, and move dialog focus to a useful
  native element. Verification: component tests and the manual device checklist.
- [ ] **18 — `fix/reservation-timezone`: define future reservations in Guatemala time.**
  Compare the combined date/time in `America/Guatemala` before exposing upcoming,
  edit, or cancel actions; cover today-before-now, today-after-now, and the
  UTC-date boundary. Verification: deterministic rule and dashboard tests.
- [ ] **19 — `fix/expo-security-upgrade`: resolve audited Expo/Metro vulnerabilities.**
  Upgrade through Expo-compatible versions, regenerate the lockfile, re-run all
  gates, and do not use `npm audit fix --force`. Verification: zero high runtime
  audit findings or a documented vendor exception approved by the maintainer.
- [ ] **20 — `fix/render-contract-drift`: automate semantic Render schema drift review.**
  Compare the live schema with the pinned contract while ignoring generated
  examples, then fail on path/method/request/response changes. Verification:
  deterministic fixture tests and a live read-only check.
- [ ] **21 — external release prerequisites: obtain backend authorization and signed-device evidence.**
  Render owners must enforce authentication/ownership; release owners must
  approve package identifiers and credentials, create signed Android/iOS builds,
  and replace the manual smoke waiver with device, TalkBack/VoiceOver, and
  large-text evidence. This is blocked outside this repository.

## Explicit exclusions

No v2 endpoints, JWT/refresh flow, push notifications, reports, fabricated
pagination parameters, API proxy, browser CORS workarounds, or local substitute
backend may be added until Render v1 publishes the relevant contract.
