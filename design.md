# Reservas UMG Mobile Design

## Product direction

This is a new native Android and iOS client built with React Native and Expo. It
is not a conversion or wrapper of `reservas-front`; that repository is the
approved functional and visual reference. The mobile app reproduces its
published Render v1 capabilities with mobile-native navigation and controls.

## Visual language

- Academic navy `#17355F` anchors navigation and hierarchy.
- Reservation blue `#2376A8` is the primary action colour.
- Teal `#148A7B`, amber `#D9921E`, and danger `#B74343` communicate state with
  text and icons, never colour alone.
- Paper `#F4F1E8`, white surfaces, one-pixel borders, restrained elevation, and
  a scholarly display/sans interface pairing retain the institutional feel.
- Light and dark themes are both required. Controls have a minimum 44-point
  target; motion honours the device reduced-motion setting.

## Mobile interaction rules

- The laboratory time rail is the recurring signature in availability, booking
  summaries, details, and dashboard cards.
- Bottom tabs serve Home, Availability, Reservations, Administration, and
  Profile. Logs and Users are stack routes from Administration; their actions
  are visible only to the administrator UI role.
- Dense desktop tables become accessible cards or compact lists. Graphs are
  original native SVG/layout components derived only from returned audit data.
- Every data screen provides loading, empty, stale/offline, success, validation,
  and localized error states in Spanish and English.

## Security boundary

Render v1 is the only backend. The app persists only normalized UI identity
(`id`, `name`, `email`, `role`) in Expo SecureStore; it never stores a password,
token, cookie, or full API response. Role visibility is an experience guard, not
authorization: Render must enforce identity and permissions server-side.

## Contract and offline rules

- Use only the published Render v1 `/api/*` operations in
  `specs/contracts/legacy-openapi.yaml`.
- Use native `fetch` and `async`/`await`; no Axios, proxy, v2 endpoint,
  notification, report, or fabricated operation is allowed.
- Previously read data may remain visible with a stale banner. Create, modify,
cancel, password, user, lab, and condition mutations are disabled offline and
are never queued.
