# Riverbraid-Gold-V2

**Lifecycle category:** experimental concept/demo surface  
**Normative source:** Riverbraid-Core  
**Claim boundary:** Declared Conditions Only

## Role in Riverbraid

Riverbraid-Gold-V2 is an experimental next-generation concept and demo surface for Riverbraid interface, ledger, and verification ideas.

This repository is not a canonical Evaluation Kit route unless a current registry and evidence surface explicitly say so.

## Public verification boundary

Local verifier output, demo behavior, and UI behavior must not be treated as canonical registry verification.

The repository has two deliberately separate execution surfaces:

1. **Repository-local surface** — `npm run verify`, `npm test`, and `npm run build` operate within this repository.
2. **Optional workspace surface** — `npm run rb-check`, `npm run rb-test`, and `npm run rb-build` require declared neighboring repositories and tools.

`workspace-dependency-contract.json` is the machine-readable boundary for the optional workspace commands. `scripts/run-workspace-command.mjs` executes those commands without shell-string `cd` coupling.

When a required sibling is absent, the runner emits:

```text
WORKSPACE_DEPENDENCY_UNAVAILABLE
```

and exits with code `2`. That is a classified unavailable state, not a self-contained test failure and not a PASS.

The current contract does not pin sibling source commits and does not establish integrated F3 behavior.

## Primary public routes

- Evaluation Kit: https://github.com/Riverbraid/Riverbraid-Evaluation-Kit
- Documentation: https://github.com/Riverbraid/Riverbraid-Documentation

## Local use

Install the exact lockfile dependency set with package lifecycle scripts denied:

```bash
npm ci --ignore-scripts
```

Run the local demo:

```bash
npm run dev
```

Build the local demo:

```bash
npm run build
```

## Local verification

```bash
npm run verify
npm run verify:workspace-boundary
```

The first command evaluates the repository-local stationary surface. The second confirms that optional workspace dependencies are represented and that missing siblings produce the declared unavailable outcome.

A successful local verifier does not establish success of the optional workspace commands.

## Optional prepared-workspace commands

The default workspace root is the parent directory of this repository. It may be overridden explicitly:

```bash
RIVERBRAID_WORKSPACE_ROOT=/path/to/workspace npm run rb-check
```

Commands:

- `npm run rb-check` — requires `riverbraid-tsh` and runs `cargo check`;
- `npm run rb-test` — requires `riverbraid-tsh` and runs `cargo test`;
- `npm run rb-build` — runs the local build, then requires `riverbraid-wasm-bridge` and runs `wasm-pack build`.

The prepared workspace must identify and verify its own sibling source states. Directory proximity does not establish compatibility or profile membership.

## Evidence boundary

This repository does not claim certification, legal approval, production readiness, absolute security, external audit, complete AI safety, adoption, registry freshness, integrated F3 operation, workspace portability, or absence of defects.

## Authority boundary

Riverbraid-Core remains the normative source for protocol semantics. This repository does not override Core, the Evaluation Kit registry, workflow evidence, release state, or external review.

## License

MIT.

---

**Navigation:** [Evaluation Kit](https://github.com/Riverbraid/Riverbraid-Evaluation-Kit) | [Documentation](https://github.com/Riverbraid/Riverbraid-Documentation) | [System Map](https://github.com/Riverbraid/Riverbraid-Documentation)
