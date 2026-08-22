# Reservas UMG Mobile Product Specification

## Intent

Deliver a visually rich but dependable academic operations app for Android and iOS. It mirrors every supported front capability using original native UI, not a web wrapper: welcome/login, summary, availability, reservations, profile, administration, users, and audit logs.

## Navigation and role rules

The authenticated app has Home, Availability, Reservations, Administration, and Profile tabs. Logs and Users are Administration stack routes. Professors may read published resources and manage only own future reservations; administrators can also manage labs, conditions, users, and all future reservations. UI role rules are experience controls only because Render v1 must enforce real authorization.

## Design and interaction contract

Use the navy/paper/blue/teal/amber/danger system in design.md, light and dark themes, 44-point targets, original accessible charts, and the laboratory time rail. Mobile uses cards and compact lists in place of dense desktop tables. All static copy and feedback is Spanish-default and English-selectable. Loading, empty, success, error, stale, and offline states are required per data screen.

## Integration and privacy

The only contract is Render v1 /api/*. Native fetch calls login, password, labs, conditions, availability, reservations, users, and logs using documented methods, payloads, and query keys. Persist only normalized UI identity in SecureStore. Do not store passwords, tokens, cookies, or full API responses; do not add v2, notifications, reports, proxies, or substitute data.

## Offline and accessibility

Read-only values can remain visible as stale. Every mutation is disabled offline and never queued. Screen-reader labels, meaningful roles and concise hints for ambiguous icon actions, dynamic text, reduced motion, non-colour status reinforcement, and native dialog-title focus are acceptance requirements.
