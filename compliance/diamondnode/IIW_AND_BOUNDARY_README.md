# Diamondnode IIW + Authorization Boundary

**Freeze date:** 2026-07-16

## IIW
See the multi-sheet POA&M workbook (Drive) — sheet "IIW Inventory" now contains 12 components with:
- Software / Version / Baseline
- Network Interfaces / Ports / Protocols
- Function, Data Types, Owner, Notes

## Formal Boundary Diagram
`Diamondnode_Authorization_Boundary_Diagram_20260716.png` (Drive)

Hard invariants inside the solid boundary:
- ENG-4096-50W
- Tj_max = 89.6 °C
- Bare-metal power bounding before any agent code
- λ_lock (Ed25519)
- dryRunFirst + halt_and_capsule

External / partial / compensating (dashed): Fable-5 public signals, LidLift, Stripe, GitHub source, operator SSH.
