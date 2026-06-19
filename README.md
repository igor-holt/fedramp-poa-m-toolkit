# FedRAMP POA&M & SSP Toolkit

**A publicly usable, SEO-indexable web-based toolkit for Cloud Service Providers (CSPs) preparing FedRAMP authorization packages.**

> **Two versions available:**
> - **Static (Instant)**: Browser-only POA&M builder (no login)
> - **Next.js (Full)**: With Google Drive OAuth export + future advanced features

[![Deploy Static Tool](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Figor-holt%2Ffedramp-poa-m-toolkit)
[![Deploy Next.js App](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Figor-holt%2Ffedramp-poa-m-toolkit&root-directory=web)

Interactive tools to build, manage, and export FedRAMP Plan of Action and Milestones (POA&M), System Security Plan (SSP) components, and the Initial Authorization Package Checklist — all in the browser, with one-click export to official FedRAMP Excel/Word template formats.

Part of sovereign infrastructure and compliance tooling by [Kovach Enterprises](https://kovachenterprises.com) / [Genesis Conductor](https://www.genesisconductor.io) (Igor Holt, PI).

## Quick Start

### Static Version (Recommended for speed)

The static version is immediately usable at the root of this repo and deploys instantly.

### Next.js Version (with Google Drive OAuth)

See [`web/`](./web) and [`OAUTH_SETUP.md`](./OAUTH_SETUP.md) for the full version with server-side Google Drive export.

## Features

- Interactive POA&M Builder with live table and export
- Python generator for high-fidelity templates
- Google Drive integration (Next.js version)
- Genesis Conductor evt- event emission support
- Full documentation for FedRAMP compliance workflows

## Deployment

- **Static tool**: One-click deploy from root
- **Next.js app**: Deploy with Root Directory set to `web`

The buttons above handle both cases automatically.

---

*Continue with the rest of the original README content below...*