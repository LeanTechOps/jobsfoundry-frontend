'use client'

import { motion } from 'framer-motion'

import { StarIcon } from '@heroicons/react/24/solid'

const TESTIMONIALS = [
  {
    name: 'Priya Sharma',
    role: 'Software Engineer',
    company: 'Joined Stripe',
    avatar: 'PS',
    avatarBg: 'bg-violet-500',
    text: "I applied to over 200 jobs in two weeks without touching a single form. Got 8 interviews and landed my dream role. JobBlitz is genuinely life-changing.",
    border: 'border-violet-400/30 hover:border-violet-400/60',
  },
  {
    name: 'Marcus Johnson',
    role: 'Product Manager',
    company: 'Joined Notion',
    avatar: 'MJ',
    avatarBg: 'bg-blue-400',
    text: "After 3 months of manual applications with no results, I tried JobBlitz. Within the first week I had 5 interview calls scheduled. The AI resume tailoring is next-level.",
    border: 'border-blue-400/30 hover:border-blue-400/60',
  },
  {
    name: 'Aisha Patel',
    role: 'Data Analyst',
    company: 'Joined Airbnb',
    avatar: 'AP',
    avatarBg: 'bg-rose-500',
    text: "The job tracker alone is worth it. I finally stopped losing track of where I applied. Paired with auto-apply, I went from 0 callbacks to 12 in a month.",
    border: 'border-rose-400/30 hover:border-rose-400/60',
  },
  {
    name: 'Daniel Kim',
    role: 'UX Designer',
    company: 'Joined Figma',
    avatar: 'DK',
    avatarBg: 'bg-emerald-500',
    text: "I was skeptical at first, but the quality of applications JobBlitz sends is really impressive. Every cover letter felt personalised, not generic.",
    border: 'border-emerald-400/30 hover:border-emerald-400/60',
  },
  {
    name: 'Sophie Chen',
    role: 'Marketing Manager',
    company: 'Joined HubSpot',
    avatar: 'SC',
    avatarBg: 'bg-amber-500',
    text: "I had been searching for 4 months. Two weeks on JobBlitz and I had 3 offers. The recruiter outreach feature found contacts I would never have found on my own.",
    border: 'border-amber-400/30 hover:border-amber-400/60',
  },
  {
    name: 'James Okafor',
    role: 'Backend Engineer',
    company: 'Joined Vercel',
    avatar: 'JO',
    avatarBg: 'bg-sky-500',
    text: "Saved me hundreds of hours. The analytics showed me which job titles got the most responses so I could double down on what worked. Brilliant product.",
    border: 'border-sky-400/30 hover:border-sky-400/60',
  },
]

function Stars() {
  return (
    <div className="flex gap-0.5 mb-4">
      {[...Array(5)].map((_, i) => (
        <StarIcon key={i} className="w-4 h-4 text-amber-400" />
      ))}
    </div>
  )
}

export default function Testimonials() {
  return (
    <section className="bg-navy py-12 sm:py-16 relative overflow-hidden">
      {/* Background decoration */}
      <div aria-hidden className="pointer-events-none absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full bg-blue-500/10 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute -bottom-32 -left-32 w-[400px] h-[400px] rounded-full bg-violet-500/10 blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10">
          <p className="text-sm font-semibold text-blue-400 uppercase tracking-widest mb-3">
            Testimonials
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
            What job seekers are saying
          </h2>
          <p className="text-blue-200 max-w-xl mx-auto mb-6">
            Thousands of professionals have used JobBlitz to find their next role faster.
          </p>
          {/* Rating summary */}
          <div className="inline-flex items-center gap-3 bg-white/10 border border-white/20 rounded-xl px-5 py-2.5 cursor-default select-none">
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <StarIcon key={i} className="w-4 h-4 text-amber-400" />
              ))}
            </div>
            <span className="text-sm font-bold text-white">4.9</span>
            <span className="text-white/30">·</span>
            <span className="text-sm text-blue-200">2,400+ reviews</span>
          </div>
        </div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "0px 0px -60px 0px" }}
              transition={{ delay: i * 0.08, duration: 0.4, ease: 'easeOut' }}
              className={`group bg-white/8 border ${t.border} rounded-2xl p-6 backdrop-blur-sm hover:bg-white/12 hover:-translate-y-1 transition-all duration-200 flex flex-col cursor-default`}
            >
              <Stars />
              <p className="text-blue-100 text-sm leading-relaxed flex-1 mb-6">
                &ldquo;{t.text}&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-full ${t.avatarBg} text-white text-xs font-bold flex items-center justify-center flex-shrink-0 transition-transform duration-200 group-hover:scale-110`}
                >
                  {t.avatar}
                </div>
                <div>
                  <p className="text-sm font-bold text-white">{t.name}</p>
                  <p className="text-xs text-blue-300">
                    {t.role} · {t.company}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
