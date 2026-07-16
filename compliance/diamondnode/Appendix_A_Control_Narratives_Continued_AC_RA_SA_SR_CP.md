# Appendix A — Security Control Narratives (Continued)
## Diamondnode / Genesis Conductor  
**Date:** 2026-07-16  
**Families:** AC, RA, SA, SR, CP

### AC — Access Control
**AC-2 / AC-3** — Partially Implemented. Cloudflare + GitHub identities; formal lifecycle + least-privilege token rotation under FIND-002/FIND-005.
**AC-6** — Partially Implemented. No --execute default; LidLift recommended pre-filter.
**AC-17** — Partially Implemented. Key-based SSH + HTTPS only.

### RA — Risk Assessment
**RA-3 / RA-5** — Partially Implemented. Continuous assessment against hard invariants; SBOM + vulnerability gate under FIND-003.

### SA — System and Services Acquisition
**SA-4 / SA-5 / SA-10 / SA-11** — Partially Implemented. Primarily internal development; Git + CI; residual under FIND-003/FIND-005.
**SA-22** — Planned.

### SR — Supply Chain Risk Management
**SR-2 / SR-3 / SR-5** — Planned. Minimal dependency surface + Ed25519 signing + preference for FedRAMP-authorized upstream (Cloudflare). Formal SCRMP = Appendix P; FIND-003 is primary residual.

### CP — Contingency Planning
**CP-2 / CP-3 / CP-4** — Planned (FIND-006). Extend Genesis Conductor ISCP; tabletop by 2026-10-31.
**CP-9 / CP-10** — Partially Implemented (D1/R2/Git durability).

See companion POA&M, CIS/CRM workbook, and IIW Inventory for full cross-walk.
