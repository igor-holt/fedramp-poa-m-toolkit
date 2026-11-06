import type { PlanId } from './plans'

const STORAGE_KEY = 'framp_license'

export function getLicenseToken(): string | null {
  if (typeof window === 'undefined') return null
  return window.localStorage.getItem(STORAGE_KEY)
}

export function saveLicenseToken(token: string): void {
  window.localStorage.setItem(STORAGE_KEY, token)
}

export function clearLicenseToken(): void {
  window.localStorage.removeItem(STORAGE_KEY)
}

export function planFromToken(token: string): PlanId {
  try {
    const b64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')
    const payload = JSON.parse(atob(b64))
    return payload.plan === 'pro' || payload.plan === 'enterprise' ? payload.plan : 'free'
  } catch {
    return 'free'
  }
}

export async function verifyLicenseToken(
  token: string
): Promise<{ valid: boolean; plan: PlanId }> {
  try {
    const res = await fetch('/api/billing/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ license: token }),
    })
    const data = await res.json()
    const plan: PlanId =
      data.plan === 'pro' || data.plan === 'enterprise' ? data.plan : 'free'
    return { valid: !!data.valid, plan }
  } catch {
    return { valid: false, plan: 'free' }
  }
}
