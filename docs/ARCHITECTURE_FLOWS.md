# Architecture Flows

This file explains high-level architecture and request/response flows for the mobile client.

## 1. System context

```mermaid
flowchart LR
  U[Mobile User] --> A[Reservas Mobile App\nReact Native + Expo]
  A --> API[Render API\numg-api-django.onrender.com]
  API --> DB[(Backend Data Store)]
```

## 2. Client to API flow

```mermaid
sequenceDiagram
  participant User as User
  participant App as Mobile App
  participant API as Render API

  User->>App: Trigger action (login / list / create / update / cancel)
  App->>API: HTTP request to documented endpoint
  API-->>App: JSON response or error
  App-->>User: Render state (success/error/loading)
```

## 3. Reservation operation flow

```mermaid
flowchart TD
  S[Start] --> V[Validate input + local policy]
  V --> C{Connectivity available?}
  C -- No --> E1[Reject mutation + show offline state]
  C -- Yes --> R[Call reservation endpoint]
  R --> O{API response}
  O -- Success --> U[Update UI state + trace evidence]
  O -- Error --> E2[Normalize error + show guidance]
```

## 4. Delivery and governance flow

```mermaid
flowchart TD
  P[Update specs/docs] --> B[Implement in short-lived branch]
  B --> G1[Contract check]
  G1 --> G2[Lint check]
  G2 --> G3[Jest + coverage > 80%]
  G3 --> T[Traceability update]
  T --> M[Merge to main]
```

## 5. Notes

- The diagrams reflect current governance intent.
- Before coding, reconcile any baseline conflicts documented in `stack.md`.
