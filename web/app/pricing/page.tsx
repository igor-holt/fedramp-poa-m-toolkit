'use client'

import React, { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Check, Loader2, ShieldCheck } from 'lucide-react'
import { PLANS, FREE_FEATURES, PlanId } from '@/lib/plans'
import {
  getLicenseToken,
  saveLicenseToken,
  clearLicenseToken,
  planFromToken,
  verifyLicenseToken,
} from '@/lib/license'

type Status = 'idle' | 'working' | 'success' | 'error'

function PricingInner() {
  const searchParams = useSearchParams()
  const [plan, setPlan] = useState<PlanId>('free')
  const [email, setEmail] = useState<string | null>(null)
  const [checkoutStatus, setCheckoutStatus] = useState<Record<string, Status>>({})
  const [activateStatus, setActivateStatus] = useState<Status>('idle')
  const [tokenInput, setTokenInput] = useState('')
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    const t = getLicenseToken()
    if (t) {
      setPlan(planFromToken(t))
      verifyLicenseToken(t).then((r) => {
        if (r.valid) setPlan(r.plan)
        else setPlan('free')
      })
    }
  }, [])

  useEffect(() => {
    const status = searchParams.get('status')
    const sessionId = searchParams.get('session_id')
    if (status === 'success' && sessionId) {
      setActivateStatus('working')
      fetch('/api/billing/activate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId }),
      })
        .then(async (res) => {
          const data = await res.json()
          if (!res.ok) throw new Error(data.error || 'activation failed')
          saveLicenseToken(data.license)
          setPlan(data.plan)
          setEmail(data.email)
          setActivateStatus('success')
          setMessage(`License activated for ${data.email} (${data.plan.toUpperCase()}).`)
        })
        .catch((e) => {
          setActivateStatus('error')
          setMessage(e.message)
        })
    } else if (status === 'cancelled') {
      setMessage('Checkout cancelled.')
    }
  }, [searchParams])

  const buy = async (p: Exclude<PlanId, 'free'>) => {
    setCheckoutStatus((s) => ({ ...s, [p]: 'working' }))
    try {
      const res = await fetch('/api/billing/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: p }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'checkout failed')
      window.location.href = data.url
    } catch (e: any) {
      setCheckoutStatus((s) => ({ ...s, [p]: 'error' }))
      setMessage(e.message)
    }
  }

  const activateManual = async () => {
    if (!tokenInput.trim()) return
    setActivateStatus('working')
    const r = await verifyLicenseToken(tokenInput.trim())
    if (r.valid && r.plan !== 'free') {
      saveLicenseToken(tokenInput.trim())
      setPlan(r.plan)
      setActivateStatus('success')
      setMessage(`License active (${r.plan.toUpperCase()}).`)
    } else {
      setActivateStatus('error')
      setMessage('License token is invalid or expired.')
    }
  }

  const signOutLicense = () => {
    clearLicenseToken()
    setPlan('free')
    setEmail(null)
    setMessage('License removed from this browser.')
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-x-3">
            <div className="w-8 h-8 bg-[#0A2540] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">FR</span>
            </div>
            <span className="font-semibold text-xl tracking-tight">FedRAMP POA&M</span>
          </Link>
          <div className="flex items-center gap-x-3">
            <span
              className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                plan === 'free'
                  ? 'bg-slate-100 text-slate-600'
                  : 'bg-emerald-100 text-emerald-700'
              }`}
            >
              {plan.toUpperCase()}
            </span>
            <Link
              href="/"
              className="px-4 py-2 text-sm border rounded-2xl hover:bg-white transition-colors"
            >
              Back to Builder
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tighter">
            Pricing for FedRAMP teams
          </h1>
          <p className="text-slate-600 mt-2 text-sm sm:text-base">
            Start free. Upgrade when you need OSCAL export, Drive export, and unlimited items.
          </p>
          {message && (
            <div
              className={`mt-4 inline-block px-4 py-2 rounded-2xl text-sm ${
                activateStatus === 'error'
                  ? 'bg-red-50 text-red-700'
                  : 'bg-emerald-50 text-emerald-700'
              }`}
            >
              {message}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-3xl border p-7 flex flex-col">
            <h2 className="font-semibold text-lg">Free</h2>
            <div className="mt-2">
              <span className="text-4xl font-semibold tracking-tight">$0</span>
              <span className="text-slate-500 text-sm"> / forever</span>
            </div>
            <ul className="mt-5 space-y-2.5 text-sm flex-1">
              {FREE_FEATURES.map((f) => (
                <li key={f} className="flex items-start gap-x-2">
                  <Check className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <Link
              href="/"
              className="mt-6 block text-center py-3 border rounded-3xl font-semibold text-sm hover:bg-slate-50 transition-colors"
            >
              Use Free
            </Link>
          </div>

          {(Object.keys(PLANS) as Array<Exclude<PlanId, 'free'>>).map((key) => {
            const p = PLANS[key]
            const busy = checkoutStatus[key] === 'working'
            return (
              <div
                key={p.id}
                className={`bg-white rounded-3xl border p-7 flex flex-col ${
                  p.id === 'pro' ? 'border-[#0A2540] shadow-xl' : ''
                }`}
              >
                {p.id === 'pro' && (
                  <span className="self-start text-[10px] px-2 py-0.5 bg-[#0A2540] text-white rounded-full font-medium mb-2">
                    MOST POPULAR
                  </span>
                )}
                <h2 className="font-semibold text-lg">{p.name}</h2>
                <div className="mt-2">
                  <span className="text-4xl font-semibold tracking-tight">
                    ${p.priceMonthlyUSD}
                  </span>
                  <span className="text-slate-500 text-sm"> / month</span>
                </div>
                <p className="text-xs text-slate-500 mt-1">{p.blurb}</p>
                <ul className="mt-5 space-y-2.5 text-sm flex-1">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-x-2">
                      <Check className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => buy(p.id)}
                  disabled={busy}
                  className={`mt-6 w-full py-3 rounded-3xl font-semibold text-sm transition-all active:scale-[0.985] ${
                    p.id === 'pro'
                      ? 'bg-[#0A2540] hover:bg-black text-white'
                      : 'border hover:bg-slate-50'
                  }`}
                >
                  {busy ? (
                    <span className="flex items-center justify-center gap-x-2">
                      <Loader2 className="w-4 h-4 animate-spin" /> Redirecting to Stripe...
                    </span>
                  ) : (
                    `Buy ${p.name}`
                  )}
                </button>
              </div>
            )
          })}
        </div>

        <div className="mt-10 bg-white rounded-3xl border p-7 max-w-2xl mx-auto">
          <div className="flex items-center gap-x-2 mb-3">
            <ShieldCheck className="w-5 h-5 text-[#0A2540]" />
            <h2 className="font-semibold">Already purchased?</h2>
          </div>
          {plan !== 'free' ? (
            <div className="flex items-center justify-between gap-x-4">
              <p className="text-sm text-slate-600">
                Active license: <span className="font-medium">{plan.toUpperCase()}</span>
                {email ? <span className="text-slate-500"> ({email})</span> : null} in this browser.
              </p>
              <button
                onClick={signOutLicense}
                className="text-xs text-red-500 hover:text-red-600 px-3 py-1.5 rounded-xl hover:bg-red-50 transition-colors shrink-0"
              >
                Remove
              </button>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row gap-x-3 gap-y-2">
              <input
                type="text"
                value={tokenInput}
                onChange={(e) => setTokenInput(e.target.value)}
                placeholder="Paste license token (fr1....)"
                className="flex-1 px-4 py-2.5 border border-slate-300 rounded-2xl text-sm font-mono focus:outline-none focus:border-[#0A2540]"
              />
              <button
                onClick={activateManual}
                disabled={activateStatus === 'working'}
                className="px-5 py-2.5 bg-[#0A2540] hover:bg-black text-white rounded-2xl text-sm font-medium disabled:bg-slate-400 transition-colors"
              >
                {activateStatus === 'working' ? 'Checking...' : 'Activate license'}
              </button>
            </div>
          )}
          <p className="text-[11px] text-slate-500 mt-3">
            Licenses are issued automatically after Stripe checkout and verified against your
            live subscription on each use. Cancel anytime in the Stripe customer portal.
          </p>
        </div>
      </div>
    </div>
  )
}

export default function PricingPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
        </div>
      }
    >
      <PricingInner />
    </Suspense>
  )
}
