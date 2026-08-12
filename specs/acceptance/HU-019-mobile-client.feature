@HU-019 @RF-028 @RN-033
Feature: Manage laboratory reservations from a secure mobile client

  @HU-019-S01 @HU-011
  Scenario: Restore a secure mobile session
    Given an active institutional user signs in from the mobile client
    Then the rotating refresh token is stored only in Expo SecureStore
    And the access token remains only in process memory

  @HU-019-S02 @HU-003
  Scenario: Search availability from a small screen
    Given an authenticated user provides a valid date and interval
    When availability is requested
    Then free laboratories are shown with text status and a readable time summary

  @HU-019-S03 @HU-001
  Scenario: Create one reservation
    Given an available laboratory and valid reason
    When the user confirms the mobile summary
    Then one reservation is created with an idempotency key

  @HU-019-S04 @HU-007 @HU-008
  Scenario: Manage an owned future reservation
    Given an active future reservation owned by the user
    Then modification and cancellation actions are available
    And cancellation requires native confirmation

  @HU-019-S05 @HU-014
  Scenario: Open a persistent notification
    Given a notification contains an allowlisted reservation deep link
    When the user taps it
    Then the persistent inbox marks it as read
    And the owned reservation context opens

  @HU-019-S06 @HU-014
  Scenario: Register Expo Push safely
    Given the user grants notification permission on a physical device
    When Expo returns a project-scoped token
    Then the token is registered for the authenticated user
    And registration failure does not remove the persistent inbox

  @HU-019-S07
  Scenario: Prevent offline mutations
    Given the device loses connectivity
    Then previously rendered data is identified as stale
    And create modify cancel and acknowledgement actions are disabled and never queued

  @HU-019-S08 @HU-012 @HU-013 @HU-015 @HU-017
  Scenario: Keep dense administration web-first
    Given an administrator uses the mobile application
    Then urgent operational indicators are available from Home
    And dense users audit and report builders remain in the web portal

  @HU-019-S09
  Scenario: Use assistive technology
    Given a screen-reader or large-text user
    Then navigation controls have meaningful labels and minimum touch targets
    And errors and loading states are announced without relying only on color
