@HU-019 @RF-028 @RN-033
Feature: Manage laboratory reservations from a native Render v1 mobile client

  @HU-019-S01
  Scenario: Restore the persisted UI identity
    Given a user previously completed Render v1 login
    When the app is reopened
    Then only normalized identity is restored from Expo SecureStore
    And no password token cookie or full API response is persisted

  @HU-019-S02
  Scenario: Access the mobile application
    Given an institutional user enters credentials
    When login succeeds
    Then the app calls only POST /api/auth/login/
    And it opens the role-aware native dashboard

  @HU-019-S03
  Scenario: Search availability and begin a reservation
    Given a signed-in user supplies a valid date and interval
    When availability is requested
    Then GET /api/labs/disponibles/ shows free labs with a readable time rail
    And selection transfers only the documented values to reservation creation

  @HU-019-S04
  Scenario: Create and manage a future reservation
    Given an available lab and a valid reason
    Then the app uses only documented list create detail update and cancel operations
    And a professor receives mutation actions only for own future records
    And cancellation requires native confirmation

  @HU-019-S05
  Scenario: Use profile and password change
    Given a persisted UI identity
    When the user changes their password
    Then POST /api/auth/cambiar-contrasena/ is used for that identity only

  @HU-019-S06
  Scenario: Use native administration and user management
    Given an administrator UI identity
    Then labs and conditions can use only their published list/create/update operations
    And users can use only list/create/reset/inactivate operations
    And professors cannot see administrative mutations

  @HU-019-S07
  Scenario: Inspect published audit logs
    Given a signed-in user provides an audit user ID
    Then GET /api/logs/ is sent only with documented UMG_User_ID
    And weekly metrics and lists derive solely from returned records

  @HU-019-S08
  Scenario: Keep connectivity behaviour safe
    Given the device is offline
    Then previously read data is identified as stale
    And every mutation is disabled and never queued

  @HU-019-S09
  Scenario: Complete core journeys accessibly
    Given a screen-reader or large-text user
    Then navigation controls, forms, errors, charts, and dialogs have accessible labels
    And status is never communicated only by colour
