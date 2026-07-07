'use client'

import { motion } from 'framer-motion'

export default function SocialProof() {
  return (
    <section className="bg-slate-50 py-12 sm:py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '0px 0px -60px 0px' }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden flex flex-col sm:flex-row items-stretch"
        >
          {/* Left: message */}
          <div className="flex-1 p-10 sm:p-14 flex flex-col justify-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 mb-6 w-fit">
              <span className="w-2 h-2 rounded-full bg-blue-accent animate-pulse" />
              <span className="text-xs font-bold text-blue-accent tracking-widest uppercase">
                Helping 50,000+ job seekers get hired
              </span>
            </div>

            {/* Quote */}
            <blockquote className="text-2xl sm:text-3xl font-semibold text-navy leading-snug mb-8">
              &ldquo;You should{' '}
              <span className="text-blue-accent">focus on what matters</span>{' '}
              — interview prep and networking.{' '}
              <span className="text-blue-accent">Let JobBlitz handle the rest</span>.&rdquo;
            </blockquote>

            {/* Author */}
            <div className="flex items-center gap-4">
              {/* Circle avatar */}
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-accent to-violet-500 flex items-center justify-center flex-shrink-0 shadow-md">
                <span className="text-sm font-black text-white select-none">JB</span>
              </div>
              <div>
                <p className="text-sm font-bold text-navy">The JobBlitz Team</p>
                <p className="text-xs text-slate-500">Founders &amp; Product Team</p>
              </div>
            </div>
          </div>

        </motion.div>
      </div>
    </section>
  )
}
