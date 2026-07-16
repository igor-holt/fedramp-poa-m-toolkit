# ISCP / CMP / IRP Stubs — Diamondnode 2026-07-16

## ISCP Stub
Priority scenarios: Worker/D1/R2 outage; edge thermal breach; λ_lock failure; secrets exposure.
RTO targets: control plane 4h, edge 8h. Tabletop by 2026-10-31 (FIND-006).

## CMP Stub
CIs: Worker, D1 schema, handoff DAG, ttectra-gpu + plant baselines, Energy Governor, MCP schemas, ENG-4096-50W hosts.
Change control: PR + PI review, dryRunFirst mandatory, lightweight CAB (FIND-004), Git source of truth.

## IRP Stub
Categories: λ_lock failure, thermal breach, MCP injection, secrets exposure, Fable-5 abuse, platform integrity, supply-chain.
Lead: Acting ISSO. Process: Detect → Contain (halt_and_capsule) → Eradicate/Recover → Post-incident + POA&M.
Tabletop by 2026-10-31.

Formal boundary review agenda with Ouroboros Coalition prepared.
