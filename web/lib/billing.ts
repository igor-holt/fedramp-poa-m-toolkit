import type { PlanId } from './plans'

const STRIPE_API = 'https://api.stripe.com/v1'
const LICENSE_TTL_SECONDS = 90 * 24 * 3600

export interface LicensePayload {
  v: 1
  email: string
  plan: PlanId
  sub?: string
  sid?: string
  iat: number
  exp: number
}

export interface VerifyResult {
  valid: boolean
  plan: PlanId
  email?: string
  reason?: string
  liveCheck: boolean
}

function b64urlEncode(bytes: Uint8Array): string {
  let bin = ''
  for (const b of bytes) bin += String.fromCharCode(b)
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

function b64urlDecode(s: string): Uint8Array {
  const b64 = s.replace(/-/g, '+').replace(/_/g, '/')
  const bin = atob(b64 + '='.repeat((4 - (b64.length % 4)) % 4))
  const out = new Uint8Array(bin.length)
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i)
  return out
}

async function hmacHex(key: string, data: string): Promise<string> {
  const enc = new TextEncoder()
  const k = await crypto.subtle.importKey(
    'raw',
    enc.encode(key),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  )
  const sig = await crypto.subtle.sign('HMAC', k, enc.encode(data))
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

function signingSecret(): string {
  const s = process.env.LICENSE_SIGNING_SECRET
  if (!s) throw new Error('LICENSE_SIGNING_SECRET is not set')
  return s
}

export async function issueLicense(p: {
  email: string
  plan: PlanId
  sub?: string
  sid?: string
}): Promise<string> {
  const now = Math.floor(Date.now() / 1000)
  const payload: LicensePayload = {
    v: 1,
    email: p.email,
    plan: p.plan,
    sub: p.sub,
    sid: p.sid,
    iat: now,
    exp: now + LICENSE_TTL_SECONDS,
  }
  const body = b64urlEncode(new TextEncoder().encode(JSON.stringify(payload)))
  const sig = await hmacHex(signingSecret(), body)
  return `fr1.${body}.${sig}`
}

export async function verifyLicense(token: string): Promise<VerifyResult> {
  const fail = (reason: string, liveCheck = false): VerifyResult => ({
    valid: false,
    plan: 'free',
    reason,
    liveCheck,
  })
  try {
    const parts = token.split('.')
    if (parts.length !== 3 || parts[0] !== 'fr1') return fail('malformed')
    const sig = await hmacHex(signingSecret(), parts[1])
    if (sig !== parts[2]) return fail('bad-signature')
    const payload = JSON.parse(
      new TextDecoder().decode(b64urlDecode(parts[1]))
    ) as LicensePayload
    if (payload.v !== 1) return fail('bad-version')
    if (payload.plan !== 'pro' && payload.plan !== 'enterprise') return fail('not-a-paid-plan')
    if (payload.exp < Math.floor(Date.now() / 1000)) return fail('expired')
    let liveCheck = false
    if (payload.sub && process.env.STRIPE_SECRET_KEY) {
      try {
        const sub = await stripeGet(`/subscriptions/${payload.sub}`)
        liveCheck = true
        if (!['active', 'trialing'].includes(sub.status)) {
          return fail(`subscription-${sub.status}`, true)
        }
      } catch {
        liveCheck = false
      }
    }
    return { valid: true, plan: payload.plan, email: payload.email, liveCheck }
  } catch {
    return fail('error')
  }
}

export function stripeKey(): string | undefined {
  return process.env.STRIPE_SECRET_KEY
}

export async function stripeGet(path: string): Promise<any> {
  const key = stripeKey()
  if (!key) throw new Error('STRIPE_SECRET_KEY is not set')
  const res = await fetch(`${STRIPE_API}${path}`, {
    headers: { Authorization: `Bearer ${key}` },
  })
  if (!res.ok) throw new Error(`stripe_${res.status}`)
  return res.json()
}

export async function stripePost(
  path: string,
  body: URLSearchParams
): Promise<any> {
  const key = stripeKey()
  if (!key) throw new Error('STRIPE_SECRET_KEY is not set')
  const res = await fetch(`${STRIPE_API}${path}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body,
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data?.error?.message || `stripe_${res.status}`)
  return data
}

export function priceIdForPlan(plan: PlanId): string | undefined {
  if (plan === 'pro') return process.env.STRIPE_PRICE_PRO
  if (plan === 'enterprise') return process.env.STRIPE_PRICE_ENTERPRISE
  return undefined
}

export async function createCheckoutSession(
  plan: Exclude<PlanId, 'free'>,
  origin: string
): Promise<string> {
  const priceId = priceIdForPlan(plan)
  if (!priceId) throw new Error(`Stripe price for plan "${plan}" is not configured`)
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || origin
  const session = await stripePost(
    '/checkout/sessions',
    new URLSearchParams({
      mode: 'subscription',
      'line_items[0][price]': priceId,
      'line_items[0][quantity]': '1',
      success_url: `${appUrl}/pricing?status=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/pricing?status=cancelled`,
      allow_promotion_codes: 'true',
      'subscription_data[metadata][plan]': plan,
      'metadata[plan]': plan,
    })
  )
  return session.url
}

export async function activateFromSession(sessionId: string): Promise<{
  license: string
  plan: PlanId
  email: string
} | null> {
  const sess = await stripeGet(
    `/checkout/sessions/${encodeURIComponent(sessionId)}?expand[]=subscription`
  )
  if (sess.mode !== 'subscription' || sess.payment_status !== 'paid') return null
  const plan = (sess.metadata?.plan || sess.subscription?.metadata?.plan) as
    | PlanId
    | undefined
  if (plan !== 'pro' && plan !== 'enterprise') return null
  const email = sess.customer_details?.email || sess.customer_email || 'unknown'
  const subId =
    typeof sess.subscription === 'string' ? sess.subscription : sess.subscription?.id
  const license = await issueLicense({ email, plan, sub: subId, sid: sess.id })
  return { license, plan, email }
}

export async function verifyStripeWebhook(
  rawBody: string,
  signatureHeader: string | null,
  secret: string
): Promise<boolean> {
  if (!signatureHeader) return false
  const parts = Object.fromEntries(
    signatureHeader.split(',').map((kv) => {
      const i = kv.indexOf('=')
      return [kv.slice(0, i), kv.slice(i + 1)]
    })
  )
  const t = parts.t
  const v1 = parts.v1
  if (!t || !v1) return false
  const expected = await hmacHex(secret, `${t}.${rawBody}`)
  if (expected.length !== v1.length) return false
  let diff = 0
  for (let i = 0; i < expected.length; i++) {
    diff |= expected.charCodeAt(i) ^ v1.charCodeAt(i)
  }
  return diff === 0
}
