# Spec-Driven Development Governance

## Core principle

Specification comes first. No implementation change is valid without explicit mapping to requirement and gate.

## Required gates

1. Contract check (legacy profile) PASS.
2. Lint + unit/integration tests PASS.
3. Build/doctor environment checks PASS.
4. Functional flow coverage evidence PASS.
5. Security hygiene PASS (no secrets in repo or prompts).

## Completion criteria

A requirement can be marked PASS only with reproducible evidence.

A requirement outside scope must be EXCLUDED with formal approval and rationale.

Residual backend risks must stay visible and accepted explicitly.

## Required artifacts for each change

- Requirement ID(s)
- Contract impact statement
- Traceability update
- Test evidence
- Risk notes

## Canonical sources

- `specs/governance/SDD_ADR_IA_CIERRE_100.md`
- `specs/traceability.yaml`
- `specs/acceptance/HU-019-mobile-client.feature`
