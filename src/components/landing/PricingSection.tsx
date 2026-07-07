'use client'

import { motion } from 'framer-motion'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { CheckIcon } from '@heroicons/react/24/solid'
import { api } from '@/lib/api'

interface ApiPlan {
  id: string
  price: number
  interval: string  // 'month' | 'year'
}

export const PLANS = [
  {
    id: 'free',
    name: 'Free',
    monthlyPrice: 0,
    annualPrice: null as number | null,
    description: 'Get started with no commitment. No credit card required.',
    badge: null,
    highlighted: false,
    cta: 'Get Started Free',
    ctaHref: '/login?plan=free',
    // Only list what's included — no X marks (drivetube style)
    features: [
      '5 auto-applications per day',
      '1 resume profile',
      'Basic job tracker',
      'Application status tracking',
      'Job search access',
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    monthlyPrice: 29,
    annualPrice: null as number | null,
    description: 'For active job seekers who want measurable results.',
    badge: 'Most Popular',
    highlighted: true,
    cta: 'Start Pro',
    ctaHref: '/login?plan=pro',
    features: [
      'Everything in Free',
      '50 auto-applications per day',
      '5 resume profiles',
      'AI resume tailoring per job',
      'AI cover letter generator',
      'Full analytics dashboard',
      'Priority job matching',
      'Email support',
    ],
  },
  {
    id: 'business',
    name: 'Business',
    monthlyPrice: 79,
    annualPrice: null as number | null,
    description: 'For serious job seekers who want maximum firepower.',
    badge: null,
    highlighted: false,
    cta: 'Start Business',
    ctaHref: '/login?plan=business',
    features: [
      'Everything in Pro',
      '200 auto-applications per day',
      'Unlimited resume profiles',
      'Hiring manager email outreach',
      'A/B testing for job titles',
      'Advanced analytics & insights',
      'API access',
      'Priority support',
    ],
  },
]

interface PricingSectionProps {
  showHeader?: boolean
}

export default function PricingSection({ showHeader = true }: PricingSectionProps) {
  const [annual, setAnnual] = useState(false)
  const [livePrices, setLivePrices] = useState<Record<string, { monthly?: number; annual?: number }>>({})
  const [pricesFetched, setPricesFetched] = useState(false)

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const plans = await api.get<ApiPlan[]>('/stripe/pricing')
        const data: Record<string, { monthly?: number; annual?: number }> = {}
        for (const plan of plans) {
          if (!data[plan.id]) data[plan.id] = {}
          if (plan.interval === 'month') {
            data[plan.id].monthly = plan.price
          } else if (plan.interval === 'year') {
            data[plan.id].annual = Math.round((plan.price / 12) * 100) / 100
          }
        }
        setLivePrices(data)
      } catch {
        // silently fall back to static plan values
      } finally {
        setPricesFetched(true)
      }
    }
    fetchPrices()
  }, [])

  // Only show annual toggle once API responds and confirms annual prices exist
  const hasAnyAnnual = pricesFetched && Object.values(livePrices).some((lp) => lp.annual != null)

  return (
    <section id="pricing" className="bg-gradient-to-b from-slate-50 via-blue-50/30 to-white py-12 sm:py-16 relative overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[800px] h-[300px] rounded-full bg-blue-100/40 blur-3xl" />
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {showHeader && (
          <div className="text-center mb-8">
            <p className="text-sm font-semibold text-blue-accent uppercase tracking-widest mb-3">
              Pricing
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-navy mb-4">
              Every plan, real numbers.
            </h2>
            <p className="text-slate-600 max-w-xl mx-auto">
              No &quot;contact us&quot; for paid plans. 30-day money-back guarantee on all paid plans.
            </p>
          </div>
        )}

        {/* Billing toggle — only rendered if Stripe has at least one annual price */}
        {hasAnyAnnual && (
          <div className="flex items-center justify-center gap-4 mb-8">
            <span className={`text-sm font-medium ${!annual ? 'text-navy' : 'text-slate-400'}`}>Monthly</span>
            <button
              onClick={() => setAnnual(!annual)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-blue-accent focus-visible:ring-offset-2 cursor-pointer ${annual ? 'bg-blue-accent' : 'bg-slate-200'}`}
            >
              <span className={`inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-200 ${annual ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
            <span className={`text-sm font-medium ${annual ? 'text-navy' : 'text-slate-400'}`}>Annually</span>
            {annual && (
              <span className="bg-emerald-50 text-emerald-700 text-xs font-semibold px-2.5 py-1 rounded-full border border-emerald-200">
                Save up to 30%
              </span>
            )}
          </div>
        )}

        {/* Plan cards — when annual is on, only show plans that have an annual price (Free always shown) */}
        <div className="grid md:grid-cols-3 gap-6 items-start mb-10">
          {PLANS.filter((plan) => {
            if (!annual) return true
            if (plan.id === 'free') return true
            return livePrices[plan.id]?.annual != null
          }).map((plan, i) => {
            const lp = livePrices[plan.id]
            const monthlyPrice = lp?.monthly ?? plan.monthlyPrice
            const annualPrice = lp?.annual ?? null
            const hasAnnual = annualPrice != null
            const price = (annual && hasAnnual) ? annualPrice : monthlyPrice

            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "0px 0px -60px 0px" }}
                transition={{ delay: i * 0.1, duration: 0.4, ease: 'easeOut' }}
                className={`relative rounded-2xl border flex flex-col overflow-hidden transition-all duration-200 ${
                  plan.highlighted
                    ? 'border-blue-accent shadow-2xl shadow-blue-100 bg-navy ring-2 ring-blue-accent hover:-translate-y-1'
                    : 'border-slate-200 shadow-sm bg-white hover:-translate-y-1 hover:shadow-lg hover:border-slate-300'
                }`}
              >
                {plan.badge && (
                  <div className={`text-center text-xs font-bold py-2 tracking-wide ${
                    plan.highlighted ? 'bg-blue-accent text-white' : 'bg-slate-50 text-blue-accent border-b border-slate-100'
                  }`}>
                    {plan.badge}
                  </div>
                )}

                <div className="p-8 flex flex-col flex-1">
                  <h3 className={`text-lg font-bold mb-1 ${plan.highlighted ? 'text-white' : 'text-navy'}`}>
                    {plan.name}
                  </h3>
                  <p className={`text-sm mb-6 ${plan.highlighted ? 'text-blue-200' : 'text-slate-600'}`}>
                    {plan.description}
                  </p>

                  {/* Price */}
                  <div className="mb-2">
                    <div className="flex items-end gap-1.5">
                      <span className={`text-4xl font-extrabold leading-none ${plan.highlighted ? 'text-white' : 'text-navy'}`}>
                        {price === 0 ? 'Free' : `$${price}`}
                      </span>
                      {price > 0 && (
                        <span className={`text-sm mb-1 ${plan.highlighted ? 'text-blue-200' : 'text-slate-400'}`}>
                          /mo
                        </span>
                      )}
                    </div>
                    {annual && hasAnnual && monthlyPrice > 0 && (
                      <p className={`text-xs mt-1 ${plan.highlighted ? 'text-blue-300' : 'text-slate-400'}`}>
                        Billed ${Math.round(annualPrice! * 12)}/yr · Save ${Math.round((monthlyPrice - annualPrice!) * 12)}/yr
                      </p>
                    )}
                    {plan.monthlyPrice === 0 && (
                      <p className={`text-xs mt-1 ${plan.highlighted ? 'text-blue-300' : 'text-slate-400'}`}>
                        No credit card required
                      </p>
                    )}
                  </div>

                  {/* CTA */}
                  <Link
                    href={plan.ctaHref}
                    className={`w-full text-center font-semibold py-3 rounded-lg mt-6 mb-8 transition-all duration-150 text-sm active:scale-[0.98] cursor-pointer select-none ${
                      plan.highlighted
                        ? 'bg-white text-navy hover:bg-slate-50 hover:shadow-md'
                        : plan.id === 'free'
                        ? 'bg-slate-900 hover:bg-slate-700 text-white hover:shadow-md'
                        : 'bg-blue-accent hover:bg-blue-500 text-white hover:shadow-lg hover:shadow-blue-100'
                    }`}
                  >
                    {plan.cta}
                  </Link>

                  {/* Features — only included, no X marks (drivetube style) */}
                  <ul className="space-y-3 flex-1">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3">
                        <CheckIcon className={`w-4 h-4 flex-shrink-0 mt-0.5 ${plan.highlighted ? 'text-blue-300' : 'text-blue-accent'}`} />
                        <span className={`text-sm ${plan.highlighted ? 'text-blue-100' : 'text-slate-600'}`}>
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            )
          })}
        </div>

        <p className="text-center text-sm text-slate-500 mt-4">
          All paid plans come with a 30-day money-back guarantee.{' '}
          <a href="/pricing" className="text-blue-accent hover:underline font-medium transition-colors">
            See full plan details →
          </a>
        </p>
      </div>
    </section>
  )
}
