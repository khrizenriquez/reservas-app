# ADR Register

This register tracks architecture decisions affecting the mobile client.

## Active for app

- ADR-010: web architecture decision remains active in cycle tracking but does not apply directly to mobile app behavior.
- ADR-011: Expo mobile architecture (active).
- ADR-012: Spec-Driven Development (active).
- ADR-013: Trunk-based development (active).
- ADR-016: End-to-end traceability (active).

## Partial applicability

- ADR-006: auth/RBAC limits apply as legacy constraint only.
- ADR-004: Kong applies for integrated gateway testing.

## Historical (not active in this cycle)

- ADR-001
- ADR-007
- ADR-008
- ADR-014
- ADR-015
- ADR-017

## ADR update rule

If a change modifies an architecture decision or breaks an active decision:

1. Update this ADR register.
2. Update closure checklist/governance documents.
3. Include evidence in PR (tests, contract checks, rationale).

## Source of truth

Primary source: `specs/governance/ADR_DEPENDENCIAS_Y_VIGENCIA.md`.
