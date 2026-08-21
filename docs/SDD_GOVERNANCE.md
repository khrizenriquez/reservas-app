# Spec-Driven Delivery Governance

Specifications define expected behaviour; code and tests implement and prove it. Before any functional change, update the relevant HU-019 scenario, trace row, and design/ADR material when architecture changes.

## Required evidence

1. Render v1 contract verifier passes.
2. Lint passes.
3. Jest passes with global coverage above 80%.
4. Touched traceability rows point to existing implementation and test files.
5. No secrets, production personal data, or unsupported endpoints are present.

One todo item equals one focused branch. The branch is pushed only after evidence is green; it is manually merged by the owner, then removed locally before the next branch begins from updated main.
