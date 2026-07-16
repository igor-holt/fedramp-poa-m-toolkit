# Appendix A — Security Control Narratives (Draft)
## Diamondnode / Genesis Conductor  
**Baseline:** FedRAMP Moderate (with selected High considerations for attestation & thermal surfaces)  
**Date:** 2026-07-16  
**Status:** Initial draft for priority families only (AU, CA, CM, IA, SC, SI, IR)

Narratives describe the *current* implementation state. Residual gaps are tracked in the companion POA&M (FIND-xxx).

### AU — Audit and Accountability
**AU-2 / AU-3 / AU-6** — Partially Implemented. D1 tables + λ_lock provide foundation. FIND-001 tracks full evt- coverage and 1-year retention.

### CA — Assessment, Authorization, and Monitoring
**CA-5** — Implemented (this POA&M). **CA-7** — Partially Implemented; formal monthly ConMon plan after FIND-001.

### CM — Configuration Management
**CM-2 / CM-6** — Partially Implemented (ENG-4096-50W, Tj_max, dryRunFirst, plant baselines). **CM-3 / CM-9** — Planned (FIND-004 CAB + GitOps drift detection).

### IA — Identification and Authentication
**IA-5** — Planned (FIND-002 short-lived token + PQC/Ed25519 rotation).

### SC — System and Communications Protection
**SC-7 / SC-8** — Partially Implemented (Worker boundary, TLS, λ_lock). **SC-12 / SC-13** — Planned with FIND-002.

### SI — System and Information Integrity
**SI-4** — Partially Implemented. **SI-10 / SI-11** — Planned (FIND-005 + LidLift pre-filter recommendation).

### IR — Incident Response
**IR-4 / IR-8 / IR-9** — Planned (FIND-006 Diamondnode-specific playbooks + tabletop by 2026-10-31).

Full narratives and remaining families (AC, AT, CP, MA, MP, PE, PL, PM, PS, RA, SA, SR) to follow.
