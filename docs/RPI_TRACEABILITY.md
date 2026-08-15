# RPI Traceability Model

RPI in this project is managed as:

- R: Requirement (story/scenario ID)
- P: Policy/Contract constraint (API + governance + security limits)
- I: Implementation and verification (code + tests + evidence)

## Data model

Each requirement row should map the following fields:

- requirementId: unique immutable ID (example: HU-019-S03)
- contractOps: operation names used by that requirement
- implementationFiles: source files implementing behavior
- testFiles: tests proving behavior
- status: PASS | EXCLUDED | NOT RUN
- evidence: command outputs, hashes, screenshots, logs

## Current project pattern

Canonical trace file: `specs/traceability.yaml`.

Expected parity rule:

- Scenario IDs in acceptance feature must match keys in traceability map.
- Contract operation names in traceability must exist in API manifest.

## Validation checklist

1. Every active scenario has one trace row.
2. Every trace row links to existing code and test files.
3. Every contract operation in trace rows exists in contract manifest.
4. Every PASS row has reproducible evidence attached.

## Suggested CI automation

- Parse acceptance file IDs and compare with traceability IDs.
- Validate all traceability file paths exist.
- Validate contract operation names against API manifest.
- Fail pipeline on drift.
