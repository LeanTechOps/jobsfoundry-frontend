'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  BoltIcon,
  ClipboardDocumentListIcon,
  DocumentTextIcon,
  PencilSquareIcon,
  ChartBarIcon,
  EnvelopeIcon,
} from '@heroicons/react/24/outline'
import { CheckCircleIcon } from '@heroicons/react/24/solid'

const FEATURES = [
  {
    id: 'auto-apply',
    icon: BoltIcon,
    title: 'Auto-Apply Engine',
    short: 'Apply to 100+ jobs daily, automatically.',
    accent: '#3b82f6',
    preview: <AutoApplyPreview />,
  },
  {
    id: 'tracker',
    icon: ClipboardDocumentListIcon,
    title: 'Job Application Tracker',
    short: 'Every application in one organised dashboard.',
    accent: '#10b981',
    preview: <TrackerPreview />,
  },
  {
    id: 'resume',
    icon: DocumentTextIcon,
    title: 'AI Resume Tailoring',
    short: 'Each job gets its own AI-optimised resume version.',
    accent: '#8b5cf6',
    preview: <ResumePreview />,
  },
  {
    id: 'cover-letter',
    icon: PencilSquareIcon,
    title: 'AI Cover Letter Generator',
    short: 'Personalised, keyword-rich cover letters in seconds.',
    accent: '#f59e0b',
    preview: <CoverLetterPreview />,
  },
  {
    id: 'analytics',
    icon: ChartBarIcon,
    title: 'Performance Analytics',
    short: 'See what works — and double down on it.',
    accent: '#ef4444',
    preview: <AnalyticsPreview />,
  },
  {
    id: 'outreach',
    icon: EnvelopeIcon,
    title: 'Recruiter Outreach',
    short: 'Email hiring managers automatically at target companies.',
    accent: '#06b6d4',
    preview: <OutreachPreview />,
  },
]

function AutoApplyPreview() {
  const jobs = [
    { title: 'Senior Software Engineer', company: 'Stripe', status: 'Applied', color: 'bg-blue-500' },
    { title: 'Full Stack Developer', company: 'Airbnb', status: 'Applied', color: 'bg-rose-500' },
    { title: 'Backend Engineer', company: 'Figma', status: 'Applying…', color: 'bg-violet-500' },
    { title: 'Platform Engineer', company: 'Notion', status: 'Queued', color: 'bg-slate-400' },
    { title: 'Software Engineer II', company: 'Vercel', status: 'Queued', color: 'bg-slate-400' },
  ]
  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-bold text-navy">Today&apos;s Applications</p>
        <span className="text-xs font-semibold text-blue-accent bg-blue-muted px-2.5 py-1 rounded-full">47 sent today</span>
      </div>
      {jobs.map((j) => (
        <div key={j.title} className="flex items-center gap-3 bg-white border border-slate-100 rounded-xl p-3 shadow-sm">
          <div className={`w-8 h-8 rounded-lg ${j.color} flex-shrink-0 flex items-center justify-center text-white text-xs font-bold`}>
            {j.company[0]}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-navy truncate">{j.title}</p>
            <p className="text-xs text-slate-500">{j.company}</p>
          </div>
          <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${
            j.status === 'Applied' ? 'bg-emerald-50 text-emerald-700' :
            j.status === 'Applying…' ? 'bg-blue-50 text-blue-600 animate-pulse' :
            'bg-slate-100 text-slate-500'
          }`}>
            {j.status}
          </span>
        </div>
      ))}
    </div>
  )
}

function TrackerPreview() {
  const cols = [
    { label: 'Applied', count: 47, color: 'bg-blue-accent', jobs: ['Stripe · SWE', 'Airbnb · Backend'] },
    { label: 'Interviewing', count: 6, color: 'bg-violet-500', jobs: ['Vercel · Platform', 'Notion · FS'] },
    { label: 'Offer', count: 1, color: 'bg-emerald-600', jobs: ['Figma · SWE II'] },
  ]
  return (
    <div>
      <p className="text-sm font-bold text-navy mb-4">Application Pipeline</p>
      <div className="grid grid-cols-3 gap-3">
        {cols.map((col) => (
          <div key={col.label} className="bg-slate-50 rounded-xl p-3">
            <div className="flex items-center gap-2 mb-3">
              <span className={`w-2 h-2 rounded-full ${col.color}`} />
              <p className="text-xs font-semibold text-slate-600">{col.label}</p>
              <span className="ml-auto text-xs font-bold text-slate-700">{col.count}</span>
            </div>
            {col.jobs.map((j) => (
              <div key={j} className="bg-white border border-slate-100 rounded-lg p-2 mb-2 last:mb-0">
                <p className="text-[11px] font-medium text-navy">{j}</p>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

function ResumePreview() {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-bold text-navy">Resume Tailoring</p>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">ATS Score</span>
          <span className="text-sm font-extrabold text-emerald-600">94%</span>
        </div>
      </div>
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-3">
        <div className="h-3 bg-navy rounded w-48" />
        <div className="h-2 bg-slate-200 rounded w-full" />
        <div className="h-2 bg-slate-200 rounded w-5/6" />
        <div className="mt-3">
          <div className="h-2 bg-violet-300 rounded w-32 mb-2" />
          <div className="flex flex-wrap gap-1.5">
            {['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'AWS'].map((s) => (
              <span key={s} className="text-[10px] font-semibold bg-violet-50 border border-violet-200 text-violet-700 px-2 py-0.5 rounded-full">{s}</span>
            ))}
          </div>
        </div>
        <div className="mt-2 space-y-1.5">
          <div className="h-2 bg-emerald-100 border-l-2 border-emerald-500 rounded pl-1 w-full" />
          <div className="h-2 bg-emerald-100 border-l-2 border-emerald-500 rounded pl-1 w-4/5" />
          <div className="h-2 bg-slate-100 rounded w-3/4" />
        </div>
      </div>
      <p className="text-[11px] text-emerald-700 font-semibold mt-2 flex items-center gap-1">
        <CheckCircleIcon className="w-3.5 h-3.5" /> Tailored for: Senior Software Engineer at Stripe
      </p>
    </div>
  )
}

function CoverLetterPreview() {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-bold text-navy">Cover Letter</p>
        <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">AI Generated</span>
      </div>
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
        <div className="h-2 bg-slate-700 rounded w-40 mb-3" />
        <p className="text-[11px] text-slate-500 leading-relaxed mb-2">
          Dear Hiring Manager,
        </p>
        <p className="text-[11px] text-slate-600 leading-relaxed mb-2">
          I&apos;m excited to apply for the <span className="font-semibold text-amber-600 bg-amber-50 px-0.5 rounded">Senior Software Engineer</span> role at{' '}
          <span className="font-semibold text-amber-600 bg-amber-50 px-0.5 rounded">Stripe</span>. With 5 years of experience in{' '}
          <span className="font-semibold text-amber-600 bg-amber-50 px-0.5 rounded">distributed systems</span> and a proven track record…
        </p>
        <div className="flex flex-wrap gap-1 mt-3">
          {['Personalised tone', 'Keyword rich', 'ATS-friendly'].map((tag) => (
            <span key={tag} className="text-[9px] font-semibold bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">{tag}</span>
          ))}
        </div>
      </div>
    </div>
  )
}

function AnalyticsPreview() {
  const bars = [
    { label: 'Mon', h: 40, replies: 2 },
    { label: 'Tue', h: 65, replies: 4 },
    { label: 'Wed', h: 80, replies: 6 },
    { label: 'Thu', h: 55, replies: 3 },
    { label: 'Fri', h: 90, replies: 8 },
    { label: 'Sat', h: 30, replies: 1 },
    { label: 'Sun', h: 45, replies: 2 },
  ]
  return (
    <div>
      <p className="text-sm font-bold text-navy mb-4">Weekly Performance</p>
      <div className="grid grid-cols-3 gap-3 mb-4">
        {[
          { label: 'Applied', val: '312', color: 'text-blue-accent' },
          { label: 'Responses', val: '26', color: 'text-emerald-600' },
          { label: 'Rate', val: '8.3%', color: 'text-violet-600' },
        ].map((m) => (
          <div key={m.label} className="bg-white border border-slate-100 rounded-xl p-3 text-center">
            <p className={`text-lg font-extrabold ${m.color}`}>{m.val}</p>
            <p className="text-[10px] text-slate-500 mt-0.5">{m.label}</p>
          </div>
        ))}
      </div>
      <div className="bg-white border border-slate-100 rounded-xl p-3">
        <div className="flex items-end gap-1.5 h-16">
          {bars.map((b) => (
            <div key={b.label} className="flex-1 flex flex-col items-center gap-1">
              <div
                className="w-full rounded-sm bg-blue-accent/80 hover:bg-blue-accent transition-colors duration-150"
                style={{ height: `${b.h}%` }}
              />
              <span className="text-[9px] text-slate-400">{b.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function OutreachPreview() {
  const emails = [
    { name: 'Sarah Chen', role: 'Eng. Manager · Stripe', status: 'Replied', color: 'bg-rose-500' },
    { name: 'James Park', role: 'Tech Lead · Figma', status: 'Sent', color: 'bg-violet-500' },
    { name: 'Priya Shah', role: 'Dir. Eng · Notion', status: 'Sent', color: 'bg-emerald-600' },
    { name: 'Mike Torres', role: 'CTO · Linear', status: 'Queued', color: 'bg-amber-500' },
  ]
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-bold text-navy">Recruiter Outreach</p>
        <span className="text-xs font-semibold text-cyan-700 bg-cyan-50 px-2.5 py-1 rounded-full border border-cyan-200">14 sent this week</span>
      </div>
      <div className="space-y-2.5">
        {emails.map((e) => (
          <div key={e.name} className="flex items-center gap-3 bg-white border border-slate-100 rounded-xl p-3 shadow-sm">
            <div className={`w-8 h-8 rounded-full ${e.color} flex-shrink-0 flex items-center justify-center text-white text-xs font-bold`}>
              {e.name[0]}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-navy">{e.name}</p>
              <p className="text-xs text-slate-500 truncate">{e.role}</p>
            </div>
            <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${
              e.status === 'Replied' ? 'bg-emerald-50 text-emerald-700' :
              e.status === 'Sent' ? 'bg-cyan-50 text-cyan-700' :
              'bg-slate-100 text-slate-500'
            }`}>{e.status}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function FeaturesShowcase() {
  const [active, setActive] = useState(0)
  const feature = FEATURES[active]

  return (
    <section className="bg-gradient-to-br from-blue-50/60 via-white to-violet-50/30 py-12 sm:py-16 relative overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute top-0 right-0 w-96 h-96 rounded-full bg-blue-100/40 blur-3xl" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-8">
          <p className="text-sm font-semibold text-blue-accent uppercase tracking-widest mb-3">
            All the tools you need
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-navy mb-4">
            The most powerful AI job search platform — free to start.
          </h2>
          <p className="text-slate-600 max-w-xl mx-auto">
            AI where it genuinely works. Every feature built to reduce your time-to-hire.
          </p>
        </div>

        {/* Two-panel layout */}
        <div className="bg-white border border-slate-200 rounded-3xl shadow-xl overflow-hidden">
          <div className="grid lg:grid-cols-[280px_1fr]">

            {/* Left: feature nav */}
            <div className="border-r border-slate-100 bg-slate-50/60 p-4 flex flex-col gap-1">
              {FEATURES.map((f, i) => (
                <button
                  key={f.id}
                  onClick={() => setActive(i)}
                  className={`group flex items-start gap-3 w-full text-left px-4 py-3.5 rounded-xl transition-all duration-150 cursor-pointer ${
                    active === i
                      ? 'bg-white shadow-sm border border-slate-200'
                      : 'hover:bg-white/70 border border-transparent'
                  }`}
                >
                  <div
                    className="flex-shrink-0 mt-0.5 w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-150"
                    style={{
                      backgroundColor: active === i ? f.accent + '18' : '#f1f5f9',
                      color: active === i ? f.accent : '#64748b',
                    }}
                  >
                    <f.icon className="w-4 h-4" />
                  </div>
                  <div>
                    <p
                      className="text-sm font-semibold leading-tight transition-colors duration-150"
                      style={{ color: active === i ? f.accent : '#1e293b' }}
                    >
                      {f.title}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5 leading-snug hidden sm:block">
                      {f.short}
                    </p>
                  </div>
                </button>
              ))}
            </div>

            {/* Right: feature preview */}
            <div className="p-6 sm:p-8 min-h-[420px] flex flex-col">
              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -12 }}
                  transition={{ duration: 0.2, ease: 'easeOut' }}
                  className="flex-1"
                >
                  {/* Feature header */}
                  <div className="flex items-center gap-3 mb-6">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: feature.accent + '18', color: feature.accent }}
                    >
                      <feature.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-navy">{feature.title}</h3>
                      <p className="text-sm text-slate-600">{feature.short}</p>
                    </div>
                  </div>

                  {/* Preview */}
                  <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5">
                    {feature.preview}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
