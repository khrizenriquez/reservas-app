# RPI Traceability

RPI maps each immutable HU-019 scenario to policy/contract, implementation, test, and evidence. The machine-readable canonical map is specs/traceability.yaml.

Every row must include:

- the scenario identifier;
- Render v1 operation identifiers or none for local-only UI;
- implementation and test paths;
- PLANNED, PASS, or formally approved EXCLUDED status; and
- reproducible evidence for PASS.

The scaffold's `npm run traceability` validation checks that scenario IDs map
one-to-one and that every listed Render operation exists in the pinned contract.
`__tests__/render-api.test.js` additionally invokes every published operation
against a mocked transport and verifies the documented path, method, payload,
query, mapping, and localized failure behavior.
`__tests__/session-provider.test.js` proves that SecureStore receives only the
normalized UI identity, restores it across relaunch, clears it on sign-out, and
uses the users endpoint only when login omits identity data.
`__tests__/shared-ux.test.js` verifies theme and language controls, connectivity
transitions, explicit stale/offline status, accessible dialog semantics, shared
screen states, and role-aware portal navigation.
`__tests__/home-welcome.test.js` verifies the public native welcome, its access
handoff, role-scoped upcoming records from the reservations operation, refresh
and availability actions, localized API failures, and a single offline status
announcement.
`__tests__/availability.test.js` verifies strict local date/interval validation,
the documented availability query, time-rail results, reservation handoff,
empty/API-error states, and the offline request guard.
`__tests__/reservations.test.js` verifies list filters, availability handoff,
create/detail/update/cancel operations, future/ownership UI rules, cancellation
confirmation, and offline mutation blocking.
