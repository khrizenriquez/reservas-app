# Commit Start Checklist

Use this before opening the first implementation PR in a new repository.

## Repo bootstrap

- [ ] `docs/` folder committed.
- [ ] `specs/` folder with contract + acceptance + traceability committed.
- [ ] Branch strategy documented (trunk-based expected).
- [ ] PR template for AI-assisted changes configured.

## Spec-driven readiness

- [ ] Product spec accepted.
- [ ] Acceptance scenarios present and versioned.
- [ ] Traceability matrix created.
- [ ] Contract manifest and canonical OpenAPI pinned.

## Harness readiness

- [ ] Contract verifier script present.
- [ ] Lint/test/build scripts present in package manager config.
- [ ] CI pipeline wired to fail on gate errors.
- [ ] Evidence storage convention defined (artifacts/logs/checksums).

## Security readiness

- [ ] Secret handling policy documented.
- [ ] No secrets in source, prompts, or examples.
- [ ] Risk and limitation disclosure format defined.

## Done definition for first feature commit

- [ ] Requirement ID mapped.
- [ ] Traceability row added or updated.
- [ ] Contract impact reviewed.
- [ ] All gates PASS with reproducible evidence.
