import { NextRequest } from 'next/server'
import { verifyStripeWebhook } from '@/lib/billing'

export async function POST(req: NextRequest) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET
  if (!secret) {
    return Response.json({ error: 'webhook-not-configured' }, { status: 501 })
  }
  const raw = await req.text()
  const ok = await verifyStripeWebhook(
    raw,
    req.headers.get('stripe-signature'),
    secret
  )
  if (!ok) {
    return Response.json({ error: 'bad-signature' }, { status: 400 })
  }
  let event: any = {}
  try {
    event = JSON.parse(raw)
  } catch {
    return Response.json({ error: 'bad-payload' }, { status: 400 })
  }
  // Licenses are stateless HMAC tokens; subscription status is checked live
  // against the Stripe API on every /api/billing/verify call, so no store
  // writes are required here. Accepted for lifecycle observability.
  return Response.json({ received: true, type: event.type })
}
