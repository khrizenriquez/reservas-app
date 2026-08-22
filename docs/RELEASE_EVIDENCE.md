# Mobile Release Evidence

## Scope and decision

This record closes `HU-019-S09` and the automated Android/iOS release gate for
the native Render v1 client. It contains only reproducible evidence. No device
session, account, secret, identifier, signing credential, or production data is
stored in this repository.

The owner explicitly declined an interactive preview/device trial on
2026-08-21. Therefore the manual smoke checklist below is recorded as waived,
not as passed. This is a residual release risk that a future release owner must
accept again or replace with real device evidence.

## Automated evidence

Run from the repository root with Node `22.13.x`:

```bash
npm run release:verify
```

On 2026-08-21, this verifies the pinned Render contract, traceability, lint,
58 Jest tests with global branch coverage above 80%, Expo Doctor, and native
exports for both platforms. `npm run build:ios` exports the iOS bundle and
`npm run build:android` exports the Android bundle; neither command uploads,
signs, or submits an application.

## EAS handoff

`eas.json` provides an internal `preview` profile (APK on Android) and an empty
`production` profile for store archives. Before the first cloud build, an
authorized release owner must authenticate with the organization Expo account,
run the initialization command, and approve the Android package name, iOS
bundle identifier, and signing credentials when prompted. Do not add those
values or credentials to this repository without an approved change.

```bash
npm exec --package=eas-cli@latest -- eas login
npm exec --package=eas-cli@latest -- eas build:configure
npm exec --package=eas-cli@latest -- eas build --platform android --profile preview
npm exec --package=eas-cli@latest -- eas build --platform ios --profile preview
npm exec --package=eas-cli@latest -- eas build --platform all --profile production
```

The preview profile is for internal distribution only. The production command
creates build artifacts; submission remains a separate, explicitly authorized
operation. Expo documents the profile format and first-build identifier prompt
in its [EAS build configuration guide](https://docs.expo.dev/build-reference/build-configuration/).
The local EAS configuration check reached the expected account-authentication
boundary; no account was used for this repository.

## Manual smoke checklist (waived for this release)

| Platform | Required path | Evidence status |
|---|---|---|
| Android | Launch; login; restore session; search availability; create, edit, and cancel a reservation; password; administration; users; logs; offline and large-text/screen-reader checks | Waived by owner on 2026-08-21 |
| iOS | Launch; login; restore session; search availability; create, edit, and cancel a reservation; password; administration; users; logs; offline and large-text/screen-reader checks | Waived by owner on 2026-08-21 |

When this checklist is executed, append the device/OS version, build URL or
artifact checksum, tester, date, and result here. Never record credentials,
passwords, tokens, cookies, or personal data.
