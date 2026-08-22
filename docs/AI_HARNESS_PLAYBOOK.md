# AI Harness Playbook

## Objective

Use AI as an accelerator with strict human accountability, reproducible evidence, and security controls.

## Non-negotiable rules

1. Specification first.
2. Human review is mandatory.
3. Reproducible evidence is required.
4. Small verifiable changes.
5. Transparent AI usage in every PR.

## Workflow

1. Map change to requirement ID and gate.
2. Generate proposal with AI.
3. Review security, contract, and UX manually.
4. Run local checks (contract/lint/test/build).
5. Record evidence (commands, SHAs, outputs).
6. Open PR with AI checklist and risk notes.

For a mobile release, record Android/iOS smoke evidence in
`docs/RELEASE_EVIDENCE.md`. If the owner declines manual verification, record
the waiver and residual risk instead of marking a device test as passed.

## Mandatory PR checklist

- [ ] Scope bound to requirement/gate.
- [ ] AI usage declared.
- [ ] Human review completed.
- [ ] Contract/lint/tests/build PASS.
- [ ] Risks and limits documented.
- [ ] Evidence attached.
- [ ] No secrets or sensitive data.
- [ ] Traceability updated.

## Canonical source

Primary source: `specs/governance/AI_DEVELOPMENT_PLAYBOOK.md`.
