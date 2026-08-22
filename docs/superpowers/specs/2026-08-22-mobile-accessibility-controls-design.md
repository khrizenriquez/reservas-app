# Native Accessibility Controls Design

## Scope

This increment closes compliance item 17 without changing navigation, Render
operations, stored data, or the visual direction. It addresses the two
sub-44-point controls, opaque icon actions, and dialog focus in the existing
native Android and iOS client.

## Chosen approach

Use targeted native improvements rather than a new control system:

1. Raise the administration secondary edit control and the logs page-size
   choice control from 40 to 44 points.
2. Add concise `accessibilityHint` text only where an existing label states an
   icon/control name but not its outcome: theme toggle, language toggle,
   sign-out, and dashboard refresh.
3. On opening `AccessibleDialog`, keep its title announcement and move native
   accessibility focus to the dialog title with a stable host ref and
   `AccessibilityInfo.setAccessibilityFocus` when a native handle is present.

This keeps visible labels and the academic visual system unchanged, avoids
repeating hints for self-describing text buttons, and uses React Native's
native accessibility APIs on both target platforms.

## Alternatives considered

- Add hints to every button: rejected because it duplicates clear labels and
  makes screen-reader navigation verbose.
- Replace dialogs with a new navigation/modal abstraction: rejected because
  it broadens scope without improving the documented focus defect.

## Behaviour and failure handling

- A dialog continues to close through its existing close and platform-back
  paths. If React Native cannot provide a native node handle (such as a test
  renderer), the dialog still announces its title and remains usable; focus
  transfer is safely skipped.
- No hint exposes identity, reservation, or password data.
- No mutation or Render request behaviour changes.

## Verification

Regression tests will prove that affected rendered controls have a 44-point
minimum, outcome hints are exposed, and an opened dialog announces its title
then requests native focus when a host handle is available. Existing dialog,
screen, contract, traceability, lint, coverage, Doctor, and iOS/Android export
gates remain required before merge.
