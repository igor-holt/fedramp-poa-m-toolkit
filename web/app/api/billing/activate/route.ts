import { NextRequest } from 'next/server'
import { activateFromSession } from '@/lib/billing'

export async function POST(req: NextRequest) {
  try {
    const { sessionId } = await req.json()
    if (!sessionId || typeof sessionId !== 'string') {
      return Response.json({ error: 'missing-session' }, { status: 400 })
    }
    const result = await activateFromSession(sessionId)
    if (!result) {
      return Response.json({ error: 'not-paid-or-invalid' }, { status: 402 })
    }
    return Response.json(result)
  } catch (e: any) {
    return Response.json({ error: e?.message || 'activate-failed' }, { status: 500 })
  }
}
