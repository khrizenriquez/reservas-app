degradación incompatible de Expo 57 a 53.
# Security Policy

## Scope

This repository currently stores governance, documentation, and specifications used to build the project from scratch.

## Sensitive data rules

Do not commit any of the following:

- `.env` files
- API keys, tokens, passwords, credentials, or session data
- signing keys, certificates, or private key material
- personal data in screenshots, logs, prompts, or test fixtures

## Vulnerability reporting

Report security issues through the maintainer private communication channel.
Do not open public issues with exploit details.

## Merge security requirements

Security-sensitive changes must include:

- human review
- documented risk assessment
- verification evidence

Do not merge unresolved critical security findings.

## Dependency and tooling posture

When runtime code and dependency manifests are introduced, add dependency vulnerability checks to the quality gates and fail the pipeline on critical findings unless an explicit, time-bound exception is documented.
