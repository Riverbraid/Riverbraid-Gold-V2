# Riverbraid Gold V2
**The Sovereign Relational Ledger**

## Principles
1. **Mechanical Honesty:** The machine and the law are one.
2. **Spatial Integrity:** Every seal is recomputed against the physical floor.
3. **Temporal Bridging:** History is a non-linear, persistent chain.

## Getting Started
1. `npm install`
2. `npm run dev`
3. Open `http://localhost:4444`

## Core Functions
- **Execute Seal:** Anchors a state into the persistent ledger.
- **Resurrect Braid:** Imports a JSON manifest to restore state history.
- **Export Manifest:** Downloads a cryptographically chained record of all transitions.

## Verification
The system uses SHA-256 to ensure that every sequence follows the `previousHash`. If the logic is tampered with, the `Sovereign` invariant will Fail-Closed.
