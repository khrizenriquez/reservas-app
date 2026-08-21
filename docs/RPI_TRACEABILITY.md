# RPI Traceability

RPI maps each immutable HU-019 scenario to policy/contract, implementation, test, and evidence. The machine-readable canonical map is specs/traceability.yaml.

Every row must include:

- the scenario identifier;
- Render v1 operation identifiers or none for local-only UI;
- implementation and test paths;
- PLANNED, PASS, or formally approved EXCLUDED status; and
- reproducible evidence for PASS.

The traceability validation added in the scaffold checks that scenario IDs, operation names, and referenced paths remain valid.
