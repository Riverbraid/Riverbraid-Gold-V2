# Dependency Policy (Riverbraid-Gold-V2)

Riverbraid-Gold-V2 prioritizes deterministic, clean installs.

- `npm install` and `npm ci` must resolve without `--force` or `--legacy-peer-deps`.
- ERESOLVE failures must be corrected by aligning package dependency declarations and lockfile state.
- CI must not hide dependency conflicts with install flags that accept potentially broken resolution.
- Temporary workarounds, if ever needed, must be documented and must not become the default verification path.

## Current Phase 4 policy

The Phase 4 remediation path is proper dependency alignment only. No automatic `--force` or `--legacy-peer-deps` is authorized for CI.

## Evidence boundary

This policy supports deterministic repository hygiene and inspectable verification behavior. It is not certification, legal approval, production readiness, complete AI safety, or external audit.
