# Diamondnode / Genesis Conductor — FedRAMP SSP Front-Matter Population Draft
**Date:** 2026-07-16  
**Target Baseline:** Moderate (with High-control considerations for attestation & thermal surfaces)  
**CSP:** Kovach Enterprises / Genesis Conductor  
**CSO:** Diamondnode (Cloudflare Worker attestation surface + ttectra-gpu closed-loop control + Thermo CDI SaaS)  
**PI / System Owner:** Igor Holt  

This document supplies the concrete values required to populate Sections 1–12 of the official FedRAMP SSP template. Appendix A (controls) and remaining appendices will be generated in subsequent passes.

---

## 3. System Information (Table 3.1)

| Field | Value |
|-------|-------|
| CSP Name | Kovach Enterprises (Genesis Conductor) |
| CSO Name | Diamondnode |
| FedRAMP Package ID | (To be assigned) |
| Service Model | PaaS / SaaS (attestation surface + Thermo CDI) |
| Digital Identity Level | Level 2 (AAL2 / IAL2 / FAL2) — Moderate |
| FIPS PUB 199 Level | Moderate |
| Fully Operational as of | 2026-07-16 (core dual-plugin surface operational; residual POA&M items open) |
| Deployment Model | Hybrid Cloud (Cloudflare edge + local/edge GPU nodes under ENG-4096-50W) |
| Authorization Path | Agency Authorization (primary); JAB path under evaluation |
| General System Description | Diamondnode is a sovereign, thermodynamically constrained agentic runtime and attestation surface. It comprises (1) a Cloudflare Worker (gc-diamond-node) providing Ed25519 λ_lock attestation, D1 seismic-log/audit tables, R2 artifact storage, and an MCP tool surface; (2) the ttectra-gpu closed-loop plant (GPU as controlled plant with hard Tj_max = 89.6 °C and ENG-4096-50W power/VRAM envelope, bare-metal power bounding, dynamic energy governor); and (3) the Thermo CDI SaaS product ($99/mo) that productizes the same substrate. Fable-5 Living Mirror provides a demand-generation channel. All production paths enforce dryRunFirst and halt_and_capsule. |

## 4. System Owner

| Field | Value |
|-------|-------|
| Name | Igor Holt |
| Title | Principal Investigator / Principal Machine Learning Researcher & Systems Architect |
| Company / Organization | Kovach Enterprises / Genesis Conductor |
| Address | Green Haven, Maryland, US |
| Email | igor@kovachenterprises.com |

## 5. Assignment of Security Responsibility (ISSO)

| Field | Value |
|-------|-------|
| Name | Igor Holt (interim; formal ISSO designation pending) |
| Title | Principal Investigator / Acting ISSO |
| Company / Organization | Kovach Enterprises |
| Address | Green Haven, Maryland, US |
| Email | igor@kovachenterprises.com |

## Authorization Boundary Summary

- Cloudflare Worker (gc-diamond-node) + D1 + R2
- ttectra-gpu closed-loop plant + Dynamic Energy Governor on edge hosts (ENG-4096-50W)
- MCP tool surface (control_evidence bridge)
- Thermo CDI SaaS product surface
- Fable-5 (partial — public signals only)

Hard invariants: ENG-4096-50W, Tj_max=89.6°C, bare-metal power bounding, λ_lock, dryRunFirst + halt_and_capsule.

Companion artifacts: POA&M xlsx (Drive), IIW Inventory sheet, Appendix A control narratives draft.
