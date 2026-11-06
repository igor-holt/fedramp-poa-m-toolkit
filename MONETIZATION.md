# Monetization Runbook — FedRAMP POA&M Toolkit

This repo ships a complete paid-tier ("Pro" / "Enterprise") layer on top of the free
POA&M builder. Two deployment paths, both paid via Stripe:

| Path | Stack | Best for |
|---|---|---|
| **Next.js app** (`web/`) | Stripe Checkout Sessions + HMAC license tokens verified live against Stripe | Hosted SaaS on Vercel/Cloudflare Pages (recommended) |
| **Static** (`index.html`) | Stripe Payment Links wired via `billing-config.js` | Zero-backend landing page |

## What is gated

| Feature | Free | Pro ($49/mo) | Enterprise ($299/mo) |
|---|---|---|---|
| POA&M items | up to 10 | unlimited | unlimited |
| Excel template export | yes | yes | yes |
| OSCAL-style JSON export | no | yes | yes |
| Google Drive export (`/api/drive/export`, enforced server-side) | no | yes | yes |
| SSP generator, team workspaces, audit trail | no | no | yes (roadmap) |

## 1. Create the Stripe products (5 minutes, test mode first)

```bash
stripe login

stripe products create --name "FedRAMP Toolkit Pro" --description "Unlimited POA&M items, OSCAL + Drive export"
stripe prices create --product prod_XXX --unit-amount 4900 --currency usd --recurring[interval]=month
# -> price_AAA  (copy this into STRIPE_PRICE_PRO)

stripe products create --name "FedRAMP Toolkit Enterprise" --description "Pro + SSP generator, team workspaces, audit trail"
stripe prices create --product prod_YYY --unit-amount 29900 --currency usd --recurring[interval]=month
# -> price_BBB  (copy this into STRIPE_PRICE_ENTERPRISE)
```

Enable the **customer portal** (Billing → Customer portal) so subscribers can
cancel/upgrade themselves: that cancellation flips the Stripe subscription to
`canceled`, and license verification starts failing automatically (no store to update).

## 2. Configure environment variables (Vercel / Cloudflare / local `.env.local`)

See `web/.env.example`. Required for the paid flow:

```
STRIPE_SECRET_KEY=sk_test_...        # or sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...      # optional but recommended
STRIPE_PRICE_PRO=price_AAA
STRIPE_PRICE_ENTERPRISE=price_BBB
LICENSE_SIGNING_SECRET=<32+ random chars, e.g. openssl rand -hex 32>
NEXT_PUBLIC_APP_URL=https://your-deployment-url
```

## 3. Webhook (optional but recommended)

```bash
stripe listen --forward-to https://your-deployment-url/api/billing/webhook
# or in the Dashboard: Developers → Webhooks → /api/billing/webhook
#   events: checkout.session.completed, customer.subscription.updated, customer.subscription.deleted
```

The webhook endpoint verifies the `stripe-signature` header (HMAC-SHA256) and is ack-only:
licenses are stateless tokens, and `/api/billing/verify` checks the live subscription
status against the Stripe API on every call.

## 4. How a purchase flows

1. User clicks **Buy Pro** on `/pricing` → `POST /api/billing/checkout` creates a
   Stripe Checkout Session (subscription mode) → redirect to Stripe.
2. On success Stripe redirects to `/pricing?status=success&session_id=cs_...`.
3. The pricing page calls `POST /api/billing/activate`, which retrieves the session
   from Stripe, requires `payment_status === "paid"`, and returns an HMAC-signed
   license token (`fr1.<payload>.<sig>`, 90-day expiry, embeds the Stripe subscription id).
4. The token is stored in `localStorage` and sent as `x-license` on gated calls.
5. `POST /api/billing/verify` re-checks the HMAC + expiry and, when `STRIPE_SECRET_KEY`
   is set, the live subscription status. The Drive export route enforces this server-side.

## 5. Test end-to-end (test mode)

```bash
cd web
npm install
npm run dev
# open http://localhost:3000/pricing → Buy Pro → Stripe test card 4242 4242 4242 4242
# after redirect back, the license activates and the builder unlocks
curl -X POST http://localhost:3000/api/billing/verify \
  -H 'Content-Type: application/json' -d '{"license":"fr1...."}'
```

## 6. Static landing page path (zero backend)

```bash
cp billing-config.example.js billing-config.js
# paste your Stripe Payment Link URLs into billing-config.js
# deploy index.html anywhere (Vercel static / Cloudflare Pages / GitHub Pages)
```

The **Buy Pro / Buy Enterprise** buttons on `index.html` read
`window.FEDRAMP_BILLING` from `billing-config.js` (gitignored).

## Pricing rationale

FedRAMP authorization packages cost CSPs $100k–$500k+ with a 3PAO. Comparable
compliance tooling (Drata, Vanta, Secureframe) is priced in the thousands per month.
$49/mo Pro is an impulse buy for a solo ISSO; $299/mo Enterprise targets teams.
The free tier (10 items, Excel only) keeps SEO/AEO traffic flowing from the public
toolkit into the funnel.

## Compliance notes

- No card data touches this repo: Stripe Checkout / Payment Links are PCI SAQ-A scope.
- License tokens contain only email, plan, and Stripe IDs — no secrets.
- The static page makes no revenue claim beyond pricing; see `compliance/` for the
  Diamondnode compliance artifacts that govern this repo.
