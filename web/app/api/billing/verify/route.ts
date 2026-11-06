import { NextRequest } from 'next/server'
import { verifyLicense } from '@/lib/billing'

export async function POST(req: NextRequest) {
  try {
    const { license } = await req.json()
    if (!license || typeof license !== 'string') {
      return Response.json({ valid: false, plan: 'free', reason: 'missing-license' }, { status: 400 })
    }
    const result = await verifyLicense(license)
    return Response.json(result)
  } catch (e: any) {
    return Response.json(
      { valid: false, plan: 'free', reason: e?.message || 'verify-failed' },
      { status: 500 }
    )
  }
}
