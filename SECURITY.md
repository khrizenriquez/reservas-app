# Security Policy

## Sensitive data

Never commit `.env` files, credentials, passwords, tokens, cookies, signing
keys, certificates, personal data, or production API responses. Test fixtures
must use synthetic data only.

## Mobile session boundary

Render v1 is the only permitted backend. The mobile app may persist only its
normalized UI identity in Expo SecureStore. It must never persist passwords,
tokens, cookies, or complete login/API responses. As Render v1 does not publish
a secure mobile token contract, UI role checks are not authorization and must not
be represented as a backend security control.

## Network and mutation safety

Use only published Render v1 operations with native `fetch`. Do not introduce a
proxy, v2 endpoint, request header, cookie flow, or API substitute. Mutations are
disabled offline and are never queued. API errors must not expose raw backend or
personal details.

## Reporting and merge rules

Report vulnerabilities privately to the maintainer. Security-sensitive changes
need documented risk assessment, human review, and passing contract/lint/tests.
Unresolved critical findings block merge.
