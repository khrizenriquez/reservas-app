# Mobile Render v1 parity design

## Goal

Build a clean Expo/React Native app for Android and iOS that functionally and visually parallels reservas-front. The web repository is a reference, never a runtime dependency or web wrapper.

## Decided boundaries

- Render v1 and its published /api/* operations are the sole integration contract.
- The native client covers welcome/access, home, availability, reservations, profile, administration, users, and logs.
- There are no v2 endpoints, JWT/refresh mechanics, Kong dependency, notifications, reports, proxy, or invented API capability.
- A normalized UI identity persists across relaunch in Expo SecureStore. Passwords, tokens, cookies, and full responses never persist. Role UI is not backend authorization.

## Architecture

Expo Router owns navigation. A narrow session context restores identity and exposes role UI state. Feature hooks call one operation-level Render API client using native fetch and async/await. Mappers turn raw Render records into stable UI models and map network/4xx/5xx outcomes to localized error codes.

The primary tab bar contains Home, Availability, Reservations, Administration, and Profile. Users and Logs are Administration stack screens. Native cards and compact lists replace desktop tables; all charts are original native views derived from returned log records.

## Native UX and resilience

The navy/paper/blue/teal/amber institutional system, laboratory time rail, light/dark theme, Spanish-default/English-selectable copy, 44-point targets, and non-colour status treatment are required. Each data surface has loading, empty, success, error, stale, and offline states. Read data may remain visible as stale; all mutation controls are disabled offline and never queued.

## Delivery and verification

Every todo item becomes one focused feature branch. The first runnable scaffold adds the contract, lint, Jest, coverage, and traceability validators. Each later branch updates its HU-019 trace rows and passes contract, lint, and Jest coverage above 80% before push. The owner manually merges; the next branch begins only from updated main.

## Non-goals

This increment does not write runtime code. It only establishes the authoritative mobile product, contract, security, traceability, and branch plan needed before the Expo scaffold.
