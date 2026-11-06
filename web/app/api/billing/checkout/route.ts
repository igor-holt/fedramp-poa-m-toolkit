import { NextRequest } from 'next/server'
import { createCheckoutSession } from '@/lib/billing'
import { PlanId } from '@/lib/plans'

export async function POST(req: NextRequest) {
  try {
    const { plan } = (await req.json()) as { plan?: PlanId }
    if (plan !== 'pro' && plan !== 'enterprise') {
      return Response.json({ error: 'invalid-plan' }, { status: 400 })
    }
    const origin =
      req.headers.get('origin') ||
      process.env.NEXT_PUBLIC_APP_URL ||
      'http://localhost:3000'
    const url = await createCheckoutSession(plan, origin)
    return Response.json({ url })
  } catch (e: any) {
    return Response.json({ error: e?.message || 'checkout-failed' }, { status: 500 })
  }
}
