# FedRAMP POA&M & SSP Toolkit

**A publicly usable, SEO-indexable web-based toolkit for Cloud Service Providers (CSPs) preparing FedRAMP authorization packages.**

Interactive tools to build, manage, and export FedRAMP Plan of Action and Milestones (POA&M), System Security Plan (SSP) components, and the Initial Authorization Package Checklist — all in the browser, with one-click export to official FedRAMP Excel/Word template formats.

Part of sovereign infrastructure and compliance tooling by [Kovach Enterprises](https://kovachenterprises.com) / [Genesis Conductor](https://www.genesisconductor.io) (Igor Holt, PI).

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Figor-holt%2Ffedramp-poa-m-toolkit)

## Features (Planned & In Progress)

- **Interactive POA&M Builder**: Guided form for adding weaknesses/findings following FedRAMP POA&M template columns (POAM ID, Controls affected, Weakness Name/Description, Detector Source, Asset ID, POC, Remediation Plan, Dates, Risk Ratings, Risk Adjustment/False Positive/Operational Requirement flags, CVE, etc.). Live table preview. Export to fully formatted FedRAMP POA&M .xlsx ready for 3PAO/AO submission.
- **SSP Wizard & Viewer**: Structured walkthrough of the FedRAMP SSP template sections, with fillable fields for system info, architecture narratives, leveraged services, external connections, separation of duties, etc. Generate or annotate SSP content.
- **Authorization Package Checklist**: Interactive checklist based on the FedRAMP Initial Authorization Package Checklist, tracking document status, versions, upload readiness for MAX.gov or secure repo.
- **Configuration Findings Tracker**: Dedicated handling for CM-6 and STIG-related findings, with bulk import/export.
- **PL-2 Findings Manager**: For documentation deficiencies.
- **Export & Import**: Full fidelity to FedRAMP templates (preserve guidance rows, mandatory fields, dropdowns where possible). Import existing POA&M for editing.
- **Public & Indexable**: No login required for core tools. Optimized meta, sitemap, structured data for search engines ("FedRAMP POA&M generator", "free FedRAMP toolkit", "sovereign FedRAMP compliance tool"). Educational content and guides embedded.
- **Sovereign AI Ready**: Designed with thermodynamic-aware, post-quantum, verifiable compliance in mind for Genesis Conductor / MCP deployments and AI/ML offerings seeking FedRAMP or equivalent authorizations.
- **Self-Hostable / Deployable**: One-click Vercel deploy. Also works with Cloudflare Pages, GitHub Pages (static export). Open source under permissive license.

## Why This Tool?

FedRAMP authorization is rigorous and document-heavy. CSPs (especially those building sovereign, high-assurance AI infrastructure like Genesis Conductor) need efficient, error-reducing tools that stay faithful to the official templates while adding usability.

This toolkit aims to:
- Reduce manual Excel/Word drudgery
- Enforce FedRAMP rules (remediation timelines: High 30d, Mod 90d, Low 180d; mandatory columns; RET correspondence)
- Enable collaboration (export/shareable state)
- Support continuous monitoring (update POA&M monthly)
- Be publicly accessible and discoverable for the broader FedRAMP community and emerging sovereign providers.

## Tech Stack & Deployment

- **Frontend**: Next.js (App Router) + TypeScript + Tailwind CSS + shadcn/ui components (for professional FedRAMP-appropriate UI)
- **Excel Handling**: SheetJS (xlsx) for client-side generation/reading of complex multi-sheet POA&M workbooks (Open, Closed, Config Findings, PL-2, Record of Changes)
- **State Management**: Zustand or React Hook Form + Zod validation matching FedRAMP mandatory/situational fields
- **SEO/Indexing**: Next.js Metadata API, JSON-LD for Tool/SoftwareApplication, sitemap.xml, robots.txt, semantic HTML, fast static generation where possible
- **Hosting**: Vercel (primary, with preview deploys from GitHub) + optional Cloudflare (CDN, WAF, custom domain, Pages Functions for advanced server features if needed)
- **MCP/Integrations**: Designed for extensibility with pbc (EULER partner content/feedback), Linear for issue tracking, GitHub Actions for CI/validation of generated artifacts

## Getting Started (Local Dev)

```bash
git clone https://github.com/igor-holt/fedramp-poa-m-toolkit.git
cd fedramp-poa-m-toolkit
npm install
npm run dev
```

Open http://localhost:3000 — start building your POA&M immediately.

## Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Figor-holt%2Ffedramp-poa-m-toolkit)

Or connect your GitHub repo to Vercel for automatic deploys on push.

For Cloudflare: Use `wrangler` or Cloudflare Pages integration with Next.js adapter if adding server logic.

## Project Structure (Initial)

```
/app
  /poam-builder          # Interactive POA&M form + table + export
  /ssp-wizard            # SSP section fillers
  /package-checklist     # Authorization package tracker
  /docs                  # Embedded guides (FedRAMP timelines, control inheritance, RET mapping, etc.)
/components
/lib                 # xlsx generators, validators, template constants matching FedRAMP spec
/public                # Static assets, template downloads (links to official FedRAMP)
```

## Roadmap

1. v0.1: Core POA&M Builder with export (MVP)
2. v0.2: SSP narrative helpers + checklist integration
3. v0.3: Import existing .xlsx, validation against FedRAMP rules, risk rating auto-calc
4. v0.4: Multi-user collab (local state share), PDF export for evidence attachment
5. v1.0: Full package generator (bundle POA&M + checklist + sample SSP snippets), integration hooks for Genesis Conductor MCP / a2a event sourcing

## Contributing

PRs welcome! Especially:
- UI/UX improvements for compliance professionals
- Additional export fidelity (exact cell formatting, dropdown data validation in xlsx)
- Accessibility (WCAG for gov use)
- Content: more guides on 3PAO assessments, JAB vs Agency path, LI-SaaS specifics

See [CONTRIBUTING.md](CONTRIBUTING.md) (to be added).

## License

MIT — free for public/commercial use. Official FedRAMP templates remain property of FedRAMP PMO; this toolkit enhances usability around them.

## Acknowledgments

- FedRAMP PMO for public templates and guidance
- Igor Holt / Kovach Enterprises / Genesis Conductor for sovereign infrastructure vision
- Community CSPs navigating authorization

**Built for verifiable, efficient, sovereign compliance.**

---

*This project is under active development. Check back or star the repo for updates. For production use, always validate generated artifacts against current FedRAMP templates and your 3PAO.*