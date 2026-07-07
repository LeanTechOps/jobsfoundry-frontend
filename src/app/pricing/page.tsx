'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import { api } from '@/lib/api'
import { toast } from 'react-toastify'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import type { ApiPlan } from '@/types/pricing'

interface PlanPriceData {
  monthly?: { price: number; priceId: string }
  annual?: { perMonth: number; total: number; priceId: string }
}

// Static includes copy per plan
const PLAN_INCLUDES = {
  free: [
    'Up to 5 auto-applications/day',
    '1 resume profile',
    'Basic job tracker',
    'Application status tracking',
    'Job search access — no credit card required',
  ],
  pro: [
    'Up to 50 auto-applications/day',
    '5 resume profiles',
    'AI resume tailoring per job',
    'AI cover letter generator',
    'Full application analytics',
    'Priority email support',
  ],
  business: [
    'Everything in Pro',
    'Up to 200 auto-applications/day',
    'Unlimited resume profiles',
    'Hiring manager email outreach',
    'A/B testing for job titles',
    'Dedicated account support',
  ],
}

const INCLUDED_IN_ALL_PAID = [
  'Works on all major ATS systems (Workday, Greenhouse, Lever, iCIMS, Taleo and more)',
  'Application status tracking and job tracker dashboard',
  'Resume profile storage',
  '30-day money-back guarantee',
  'Email support',
]

export default function PricingPage() {
  const { isAuthenticated, subscription } = useAuth()
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null)
  const [priceData, setPriceData] = useState<Record<string, PlanPriceData>>({})
  const [pricesLoading, setPricesLoading] = useState(true)
  const currentPlan = (subscription?.plan ?? 'FREE').toLowerCase()
  // 'YEARLY' → 'year', 'MONTHLY' / null → 'month'
  const currentInterval = subscription?.billingCycle === 'YEARLY' ? 'year' : 'month'

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const plans = await api.get<ApiPlan[]>('/stripe/pricing')
        const data: Record<string, PlanPriceData> = {}
        for (const plan of plans) {
          if (!data[plan.id]) data[plan.id] = {}
          if (plan.interval === 'month') {
            data[plan.id].monthly = { price: plan.price, priceId: plan.stripePriceId }
          } else if (plan.interval === 'year') {
            data[plan.id].annual = {
              total: plan.price,
              perMonth: Math.round((plan.price / 12) * 100) / 100,
              priceId: plan.stripePriceId,
            }
          }
        }
        setPriceData(data)
      } catch {
        // fall back to static prices
      } finally {
        setPricesLoading(false)
      }
    }
    fetchPlans()
  }, [])

  const handleSelectPlan = async (planId: string, priceId?: string) => {
    if (planId === 'free') {
      window.location.href = isAuthenticated ? '/dashboard' : '/login?plan=free'
      return
    }
    if (!isAuthenticated) {
      window.location.href = `/login?plan=${planId}`
      return
    }
    if (!priceId) {
      toast.error('This plan is not yet available. Please try again later.')
      return
    }
    setLoadingPlan(priceId)
    try {
      const { url } = await api.post<{ url: string }>('/stripe/create-subscription-session', {
        stripePriceId: priceId,
      })
      window.location.href = url
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoadingPlan(null)
    }
  }

  const PriceSkeleton = () => (
    <span className="inline-block w-16 h-4 bg-slate-200 rounded animate-pulse align-middle" />
  )

  // A row is "current" only if both plan AND billing interval match
  const isCurrent = (planId: string, interval: 'month' | 'year' = 'month') =>
    currentPlan === planId && currentInterval === interval

  // ── Shared table styles ──────────────────────────────────────────────────────
  const tableHeaderCls = 'border border-slate-200 rounded-xl overflow-hidden mb-3'
  const colHeader = 'px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider bg-slate-50 border-b border-slate-200'
  const cell = 'px-5 py-4'

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-white pt-16">
        <main className="max-w-4xl mx-auto px-4 sm:px-6 py-16 sm:py-24">

          {/* Page header */}
          <div className="mb-16">
            <p className="text-sm font-semibold text-blue-accent uppercase tracking-widest mb-4">Pricing</p>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-navy mb-5 leading-tight">
              Every plan, real numbers.
            </h1>
            <p className="text-slate-600 text-lg max-w-2xl leading-relaxed">
              No &ldquo;contact us&rdquo; for paid plans. No login required to see what you&apos;re paying for.
              Prices are charged in USD.
            </p>
          </div>

          {/* ── FREE ────────────────────────────────────────────────────────────── */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold text-navy mb-2">Free Plan</h2>
            <p className="text-slate-600 text-sm mb-6 leading-relaxed max-w-2xl">
              Start applying to jobs automatically with no credit card. Great for exploring the platform.
            </p>

            <div className={tableHeaderCls}>
              <div className="grid grid-cols-[140px_1fr_160px]">
                <div className={colHeader}>Plan</div>
                <div className={colHeader}>Includes</div>
                <div className={colHeader} />
              </div>

              <div className="grid grid-cols-[140px_1fr_160px] items-start bg-white">
                <div className={cell}>
                  <span className="font-bold text-navy">Free</span>
                  <p className="text-sm font-semibold text-slate-700 mt-0.5">No charge</p>
                </div>
                <div className={cell}>
                  <ul className="space-y-1.5">
                    {PLAN_INCLUDES.free.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm text-slate-700">
                        <span className="text-blue-accent font-bold mt-px select-none">✓</span>
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className={`${cell} flex items-start pt-5`}>
                  <button
                    onClick={() => handleSelectPlan('free')}
                    disabled={isCurrent('free', 'month')}
                    className="w-full text-sm font-semibold px-4 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-700 text-white transition-all duration-150 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {isCurrent('free', 'month') ? 'Current plan' : 'Get Started'}
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* ── PRO ─────────────────────────────────────────────────────────────── */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold text-navy mb-2">Pro Plan</h2>
            <p className="text-slate-600 text-sm mb-6 leading-relaxed max-w-2xl">
              50 auto-applications/day with AI resume tailoring and cover letters. Best for active job seekers.
            </p>

            <div className={tableHeaderCls}>
              <div className="grid grid-cols-[140px_100px_1fr_160px]">
                <div className={colHeader}>Plan</div>
                <div className={colHeader}>Price</div>
                <div className={colHeader}>Includes</div>
                <div className={colHeader} />
              </div>

              <div className="grid grid-cols-[140px_100px_1fr_160px] items-start bg-blue-50/40">
                <div className={cell}>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-navy">Pro</span>
                    <span className="text-[10px] font-bold bg-blue-accent text-white px-2 py-0.5 rounded-full uppercase tracking-wide">Popular</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">Monthly</p>
                </div>
                <div className={cell}>
                  {pricesLoading ? (
                    <PriceSkeleton />
                  ) : (
                    <span className="text-base font-bold text-blue-accent">
                      {priceData.pro?.monthly ? `$${priceData.pro.monthly.price}/mo` : '$9.99/mo'}
                    </span>
                  )}
                </div>
                <div className={cell}>
                  <ul className="space-y-1.5">
                    {PLAN_INCLUDES.pro.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm text-slate-700">
                        <span className="text-blue-accent font-bold mt-px select-none">✓</span>
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className={`${cell} flex items-start pt-5`}>
                  <button
                    onClick={() => handleSelectPlan('pro', priceData.pro?.monthly?.priceId)}
                    disabled={isCurrent('pro', 'month') || loadingPlan === priceData.pro?.monthly?.priceId}
                    className="w-full text-sm font-semibold px-4 py-2.5 rounded-lg bg-blue-accent hover:bg-blue-500 text-white shadow-sm hover:shadow-md transition-all duration-150 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {loadingPlan === priceData.pro?.monthly?.priceId ? (
                      <span className="inline-flex items-center justify-center gap-1.5">
                        <span className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        …
                      </span>
                    ) : isCurrent('pro', 'month') ? 'Current plan' : 'Start Pro'}
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* ── BUSINESS ────────────────────────────────────────────────────────── */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold text-navy mb-2">Business Plan</h2>
            <p className="text-slate-600 text-sm mb-6 leading-relaxed max-w-2xl">
              200 auto-applications/day, hiring manager outreach, and A/B testing. For power users and recruiters.
            </p>

            <div className={tableHeaderCls}>
              <div className="grid grid-cols-[140px_130px_1fr_160px]">
                <div className={colHeader}>Plan</div>
                <div className={colHeader}>Price</div>
                <div className={colHeader}>Includes</div>
                <div className={colHeader} />
              </div>

              {/* Monthly row */}
              <div className="grid grid-cols-[140px_130px_1fr_160px] items-start bg-white border-b border-slate-100">
                <div className={cell}>
                  <span className="font-bold text-navy">Business</span>
                  <p className="text-xs text-slate-500 mt-0.5">Monthly</p>
                </div>
                <div className={cell}>
                  {pricesLoading ? (
                    <PriceSkeleton />
                  ) : (
                    <span className="text-base font-bold text-navy">
                      {priceData.business?.monthly ? `$${priceData.business.monthly.price}/mo` : '$25/mo'}
                    </span>
                  )}
                </div>
                <div className={cell}>
                  <ul className="space-y-1.5">
                    {PLAN_INCLUDES.business.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm text-slate-700">
                        <span className="text-blue-accent font-bold mt-px select-none">✓</span>
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className={`${cell} flex items-start pt-5`}>
                  <button
                    onClick={() => handleSelectPlan('business', priceData.business?.monthly?.priceId)}
                    disabled={isCurrent('business', 'month') || loadingPlan === priceData.business?.monthly?.priceId}
                    className="w-full text-sm font-semibold px-4 py-2.5 rounded-lg bg-navy hover:bg-slate-700 text-white transition-all duration-150 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {loadingPlan === priceData.business?.monthly?.priceId ? (
                      <span className="inline-flex items-center justify-center gap-1.5">
                        <span className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        …
                      </span>
                    ) : isCurrent('business', 'month') ? 'Current plan' : 'Start Business'}
                  </button>
                </div>
              </div>

              {/* Annual row — only rendered if Stripe returns an annual price for business */}
              {!pricesLoading && priceData.business?.annual && (
                <div className="grid grid-cols-[140px_130px_1fr_160px] items-start bg-emerald-50/40">
                  <div className={cell}>
                    <span className="font-bold text-navy">Business</span>
                    <p className="text-xs text-slate-500 mt-0.5">Annual</p>
                  </div>
                  <div className={cell}>
                    <span className="text-base font-bold text-navy">
                      ${priceData.business.annual.perMonth}/mo
                    </span>
                    <p className="text-xs text-slate-500 mt-0.5">
                      billed ${priceData.business.annual.total}/yr
                    </p>
                  </div>
                  <div className={cell}>
                    <span className="inline-flex items-center gap-1.5 text-sm text-emerald-700 font-semibold">
                      <span className="text-emerald-600 font-bold select-none">✓</span>
                      Save ~{Math.round(100 - (priceData.business.annual.perMonth / (priceData.business.monthly?.price ?? 25)) * 100)}% vs monthly
                    </span>
                    <p className="text-sm text-slate-600 mt-1">Everything in Business Monthly, billed once per year.</p>
                  </div>
                  <div className={`${cell} flex items-start pt-5`}>
                    <button
                      onClick={() => handleSelectPlan('business', priceData.business?.annual?.priceId)}
                      disabled={isCurrent('business', 'year') || loadingPlan === priceData.business?.annual?.priceId}
                      className="w-full text-sm font-semibold px-4 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition-all duration-150 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    >
                      {loadingPlan === priceData.business?.annual?.priceId ? (
                        <span className="inline-flex items-center justify-center gap-1.5">
                          <span className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                          …
                        </span>
                      ) : isCurrent('business', 'year') ? 'Current plan' : 'Start Annual'}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {priceData.business?.annual && (
              <p className="text-xs text-slate-500 mt-2">
                Annual billing is charged upfront for the full year. You can switch between monthly and annual from your dashboard.
              </p>
            )}
          </section>

          {/* ── Included in every paid plan ─────────────────────────────────────── */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold text-navy mb-2">Included in every paid plan</h2>
            <p className="text-slate-600 text-sm mb-6">
              These come with Pro and Business at no extra charge.
            </p>

            <div className="border border-slate-200 rounded-xl overflow-hidden">
              {INCLUDED_IN_ALL_PAID.map((item, i) => (
                <div
                  key={item}
                  className={`flex items-start gap-3 px-5 py-4 border-b border-slate-100 last:border-0 ${
                    i % 2 === 0 ? 'bg-white' : 'bg-slate-50/40'
                  }`}
                >
                  <span className="text-blue-accent font-bold text-sm mt-px select-none">✓</span>
                  <span className="text-sm text-slate-700">{item}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Billing notes */}
          <div className="border-t border-slate-200 pt-10 text-sm text-slate-600 space-y-2 leading-relaxed">
            <p>
              Billing terms, taxes and renewals are documented in{' '}
              <Link href="#" className="text-blue-accent hover:underline">pricing &amp; billing</Link>;
              refunds in the{' '}
              <Link href="#" className="text-blue-accent hover:underline">refund policy</Link>.
            </p>
            <p>
              Questions?{' '}
              <Link href="/#faq" className="text-blue-accent hover:underline">See the FAQ</Link>
              {' '}or email{' '}
              <a href="mailto:hello@jobblitz.ai" className="text-blue-accent hover:underline">
                hello@jobblitz.ai
              </a>
            </p>
          </div>

        </main>
        <Footer />
      </div>
    </>
  )
}
