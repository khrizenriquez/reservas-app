# Mobile Architecture Flows

```mermaid
flowchart LR
  U["Android or iOS user"] --> A["Expo / React Native app"]
  A --> S["Session context + SecureStore identity"]
  A --> C["Render v1 API client"]
  C --> R["Render /api/*"]
```

```mermaid
sequenceDiagram
  participant UI as Native screen
  participant Session as UI session
  participant API as Render client
  participant Render as Render v1
  UI->>Session: restore identity or sign in
  Session->>API: POST /api/auth/login/
  API->>Render: native fetch, documented operation
  Render-->>API: record or HTTP failure
  API-->>UI: normalized model or localized error code
```

## Rules

- UI screens call feature hooks; hooks call the single operation-level API client.
- Only normalized identity persists in SecureStore. It is a UI session, not a server authorization claim.
- Offline reads are marked stale. Every mutation is blocked before calling Render when connectivity is unavailable; no operation is queued.
- Admin/professor visibility is checked at both navigation and action level.
