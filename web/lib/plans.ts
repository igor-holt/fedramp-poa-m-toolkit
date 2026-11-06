export type PlanId = 'free' | 'pro' | 'enterprise'

export const FREE_ITEM_LIMIT = 10

export interface PlanInfo {
  id: Exclude<PlanId, 'free'>
  name: string
  priceMonthlyUSD: number
  blurb: string
  features: string[]
}

export const PLANS: Record<Exclude<PlanId, 'free'>, PlanInfo> = {
  pro: {
    id: 'pro',
    name: 'Pro',
    priceMonthlyUSD: 49,
    blurb: 'For solo security engineers shipping FedRAMP packages.',
    features: [
      'Unlimited POA&M items (free tier caps at 10)',
      'OSCAL-style JSON export',
      'Google Drive one-click export',
      'Official Excel template export',
      'Email support',
    ],
  },
  enterprise: {
    id: 'enterprise',
    name: 'Enterprise',
    priceMonthlyUSD: 299,
    blurb: 'For CSP teams and 3PAO-facing workflows.',
    features: [
      'Everything in Pro',
      'SSP component generator',
      'Team workspaces with audit trail',
      '3PAO-ready report bundles',
      'Priority support + onboarding call',
    ],
  },
}

export const FREE_FEATURES = [
  'POA&M builder with auto-calculated remediation timelines',
  'Up to 10 POA&M items',
  'Official Excel template export',
]
