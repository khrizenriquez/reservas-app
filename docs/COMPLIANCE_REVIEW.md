# Compliance Review — Mobile Render Client

Audit date: 2026-08-21 (local). Scope: the mobile repository, the
`reservas-front` reference, the pinned Render contract, and the live Render
schema. This is an evidence report, not a declaration that an unexecuted device
test passed.

## Verdict

The application has functional parity with the supported front surfaces and
passes its local automated gates, but it **does not yet meet every documented
delivery, security, accessibility, and release requirement**. The P1 items
below must be resolved or explicitly accepted by the release owner before a
production release.

## Verified coverage

| Area | Result | Evidence |
|---|---|---|
| Front functional surfaces | PASS | Welcome/access, home, availability, reservations, profile, administration, users, and logs exist as native routes and feature screens. |
| Render operations | PASS | The front and mobile API clients expose the same 19 business operations. The live schema returned 20 operations, matching the 20 operations in the pinned schema; the extra operation is `GET /api/schema/`, a contract endpoint not consumed by the front. |
| Contract paths | PASS | `npm run contract` reports 15 Render paths. |
| Acceptance traceability | PASS | `npm run traceability` reports 9 scenarios and 21 mapped operations. |
| Quality gates | PASS | `npm run release:verify`: 13 suites, 63 tests, 90.93% statements, 81.31% branches, Expo Doctor 21/21, and successful iOS/Android exports. |
| Client data handling | PASS | Static review found the single `src/api/renderApi.js` transport boundary, `credentials: "omit"`, SecureStore-only normalized identity, and no Axios, AsyncStorage, raw `fetch` outside the API client, token, cookie, or local API substitute. |
| Visual/interaction direction | PASS with gaps below | Native tabs/cards/time rail, ES/EN, light/dark tokens, status text, and role-aware routes are implemented. |

## Required remediation

### P1 — release/security blockers

1. **There is no CI workflow enforcing required gates.**
   `AGENTS.md` requires green CI before merge, but the repository has no
   `.github/workflows/` pipeline. The current evidence is local-only, so a
   merge can bypass contract, lint, traceability, test coverage, Doctor, and
   native export checks.

   Status: resolved in increment 15 with `.github/workflows/release-gates.yml`.
   It runs Node 22.13, `npm ci`, and `npm run release:verify` on pull requests
   and pushes to `main`. The repository owner must still configure GitHub branch
   protection to require this check before merge.

2. **The app is not yet a distributable signed Android/iOS release.**
   `app.json` has no `android.package` or `ios.bundleIdentifier`; the current
   EAS handoff also has no organization account or signing credentials. The
   local exports prove JavaScript bundling, not an installable APK/AAB/IPA or
   store submission.

   Action: an authorized release owner must approve identifiers, configure EAS
   credentials, run signed preview builds for both platforms, and record the
   artifact URLs/checksums in `docs/RELEASE_EVIDENCE.md`.

3. **Manual Android/iOS smoke and assistive-technology validation are waived.**
   `docs/RELEASE_EVIDENCE.md` records the owner-requested waiver rather than
   real device evidence. This leaves login, session restore, every mutation,
   offline state, TalkBack/VoiceOver, and large-text behaviour unproven on
   physical Android and iOS.

   Action: execute the existing checklist on at least one supported Android and
   iOS version, including TalkBack/VoiceOver and large text, then replace the
   waiver with outcomes and non-sensitive artifact evidence.

4. **The published Render contract still does not provide enforceable client
   authorization.** The app deliberately sends no authorization header or
   cookie because none is published; UI role checks are explicitly not backend
   authorization. A malicious client can call anonymously exposed mutations if
   Render permits them.

   Action: backend owners must publish and enforce an authenticated contract
   with object-level role/ownership checks. Do not work around this in the
   mobile client with fabricated headers or local role checks.

5. **Dependency audit contains unresolved high-severity findings.**
   `npm audit --omit=dev --audit-level=high` reported 21 vulnerabilities
   (11 high, 10 moderate), principally the `image-size` denial-of-service path
   through Expo/Metro plus a `uuid` issue in Expo tooling. The offered audit
   fix changes Expo/React Native versions and is therefore breaking.

   Action: plan an Expo SDK/React Native dependency upgrade, regenerate the
   lockfile, run the full release verification and device smoke matrix, and do
   not use `npm audit fix --force` without that migration review.

### P2 — product/accessibility correctness gaps

6. **Offline status was duplicated and could be announced twice — resolved.**
   Prior evidence: `app/portal/_layout.js` renders `PortalHeader` for every portal screen;
   `src/components/PortalHeader.js` renders `StatusBanner` offline. Each data
   screen also renders its own `StatusBanner`. Because the banner has
   `accessibilityRole="alert"` and calls `announceForAccessibility`, one
   connectivity loss can create duplicated visual and screen-reader status.

   Resolution (increment 16): `PortalHeader` no longer renders a status banner;
   every data screen owns its contextual banner. The regression test composes a
   portal header with the administration screen and verifies one stale
   announcement after a connectivity loss.

7. **The 44-point target rule was not satisfied everywhere — resolved.**
   `src/features/administration/AdministrationScreen.js` defines the secondary
   edit control at `minHeight: 40`; `src/features/logs/LogsScreen.js` defines
   page-size controls at `minHeight: 40`. Both are interactive `Pressable`
   controls, while `design.md` requires 44-point minimum targets.

   Resolution (increment 17): both controls now use `minHeight: 44`; rendered
   regression tests verify the administration edit and logs page-size controls.

8. **The stale/offline distinction was not reliable after all state changes — resolved.**
   Prior evidence: `useUpcomingReservations` sets its state to `stale` when it retains records
   offline, but `HomeDashboard` derives `hasRead` from `status === "success"`.
   It therefore labels retained home records as offline, not stale. The
   reservations, administration, users, and logs screens similarly derive the
   stale decision from current status rather than a durable successful-read
   flag, so retained results after a failed refresh can also be labelled
   offline.

   Resolution (increment 16): read features now retain `hasRead` independently
   of transient request status (including empty successful results). Regression
   coverage verifies success → failed refresh → offline on the home dashboard
   and success → offline alongside the portal header/data-screen composition.

9. **Accessibility hints/focus were incomplete; physical-device validation remains open.**
   Static review found labels and roles, but no `accessibilityHint` in `app/` or
   `src/`, and the dialog only announces its title—it does not explicitly move
   focus to its first actionable element. Existing tests use the React Native
   renderer; they do not exercise TalkBack, VoiceOver, or dynamic type.

   Resolution (increment 17): concise localized hints now describe ambiguous
   icon outcomes, and dialogs request native focus for their title after
   opening. Unit and component tests cover the bridge and request. TalkBack,
   VoiceOver, and large-text evidence remain an external P1 device-smoke task;
   this repository does not infer that evidence from the renderer.

### P3 — contract/process hygiene

10. **The live schema hash differs from the pinned snapshot.**
    Live SHA-256 on 2026-08-21 was
    `ce0246ae123ebf8c769266363a493e2e60028895236d4acfc19c6e96ef1d65ac`;
    the pinned manifest records
    `cf06534e4de203c4b6c5490d4fe3501626601f4bfdd2e974d715fd66a6e68bc5`.
    Detailed comparison found no path, method, component, server, or payload
    change; only auto-generated example dates changed from `2026-08-08` to
    `2026-08-21` on conditions, availability, and reservation operations.

    Action: either refresh the snapshot/hash under a reviewed contract-update
    branch or change the contract-drift process to compare semantic operations
    without treating generated example dates as API changes.

11. **“Future reservation” uses UTC date only.**
    `reservationRules.js` and `useUpcomingReservations.js` compare a date
    string with `new Date().toISOString().slice(0, 10)`. A reservation earlier
    today can remain actionable/upcoming, and users west of UTC can see a
    date-boundary mismatch. This matches the front’s current behaviour, but it
    is weaker than the product wording “future”.

    Action: define the institutional timezone and compare the combined local
    date/time before exposing edit/cancel or upcoming actions.

## Recommended delivery order

The actionable increments are tracked in `todo-list.md` as 15 through 21:

1. CI release gates.
2. Durable/singular connectivity status.
3. Native accessibility controls.
4. Guatemala-time future reservation rules.
5. Expo dependency security upgrade.
6. Semantic Render contract drift verification.
7. External backend and signed-device prerequisites.

Items 15 through 20 are repository-owned; item 21 cannot close until the
backend and release owners provide the necessary authority and evidence.

Until P1 is cleared or explicitly accepted, describe the project as a
**verified native development candidate**, not as a production-ready mobile
release.
