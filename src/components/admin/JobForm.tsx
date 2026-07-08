'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCreateJob, useUpdateJob } from '@/hooks/useJobs'
import { useDebounce } from '@/hooks/useDebounce'
import { toast } from 'react-toastify'
import { XMarkIcon } from '@heroicons/react/24/outline'

const WORK_MODES = ['ONSITE', 'REMOTE', 'HYBRID']
const WORK_MODE_LABELS: Record<string, string> = { ONSITE: 'On-site', REMOTE: 'Remote', HYBRID: 'Hybrid' }
const JOB_TYPES = ['FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP', 'FREELANCE']
const EXP_LEVELS = ['ENTRY', 'MID', 'SENIOR', 'LEAD', 'EXECUTIVE']
const STATUSES = ['DRAFT', 'ACTIVE', 'PAUSED', 'CLOSED']
const SALARY_PERIODS: { value: string; label: string }[] = [
  { value: 'HOURLY', label: 'Per hour' },
  { value: 'WEEKLY', label: 'Per week' },
  { value: 'BIWEEKLY', label: 'Every 15 days' },
  { value: 'MONTHLY', label: 'Per month' },
]

interface JobFormProps {
  initialData?: Partial<JobFormData>
  jobId?: string
}

interface JobFormData {
  title: string
  company: string
  companyDomain: string
  location: string
  workMode: string
  type: string
  experienceLevel: string
  status: string
  description: string
  responsibilities: string
  requirements: string
  benefits: string
  skills: string[]
  salaryMin: string
  salaryMax: string
  salaryCurrency: string
  salaryPeriod: string
  salaryNegotiable: boolean
  visaSponsorship: boolean
  applicationUrl: string
  closesAt: string
}

const DEFAULT: JobFormData = {
  title: '', company: '', companyDomain: '', location: '',
  workMode: 'ONSITE', type: 'FULL_TIME', experienceLevel: 'MID', status: 'DRAFT',
  description: '', responsibilities: '', requirements: '', benefits: '',
  skills: [], salaryMin: '', salaryMax: '', salaryCurrency: 'USD', salaryPeriod: 'MONTHLY',
  salaryNegotiable: false, visaSponsorship: false,
  applicationUrl: '', closesAt: '',
}

// These must live OUTSIDE JobForm — defining components inside a render function
// creates a new type on every render, causing React to unmount/remount on each keystroke.

function Section({ title, hint, children }: { title: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-5">
      <div className="border-l-2 border-blue-accent pl-3">
        <h2 className="text-lg font-bold text-navy">{title}</h2>
        {hint && <p className="text-sm text-slate-600 mt-0.5">{hint}</p>}
      </div>
      {children}
    </div>
  )
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-base font-semibold text-navy mb-2">
        {label} {required && <span className="text-peach text-xl leading-none">*</span>}
      </label>
      {children}
    </div>
  )
}

function Checkbox({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button
      type="button"
      onClick={(e) => { e.stopPropagation(); onChange(!checked) }}
      className="flex items-center gap-2.5 cursor-pointer select-none group w-full text-left"
    >
      <div
        className={`w-5 h-5 rounded-md border-2 flex-shrink-0 flex items-center justify-center transition-all duration-150 ${checked ? 'bg-navy border-navy' : 'border-slate-300 group-hover:border-navy'}`}
      >
        {checked && <svg className="w-3 h-3 text-blue-accent" fill="none" viewBox="0 0 12 12"><path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" /></svg>}
      </div>
      <span className="text-base text-navy font-semibold">{label}</span>
    </button>
  )
}

const inputCls =
  'w-full border border-slate-300 rounded-xl px-3 py-2.5 text-sm text-navy bg-white focus:outline-none focus:ring-2 focus:ring-blue-accent/50 focus:border-navy transition-colors placeholder:text-slate-500 placeholder:font-medium cursor-pointer'
const textareaCls = `${inputCls} resize-y min-h-28 leading-relaxed`

export default function JobForm({ initialData, jobId }: JobFormProps) {
  const router = useRouter()
  const [form, setForm] = useState<JobFormData>({ ...DEFAULT, ...initialData })
  const [skillInput, setSkillInput] = useState('')
  const createJob = useCreateJob()
  const updateJob = useUpdateJob(jobId ?? '')

  // Debounce the domain so logo only fetches 700ms after the user stops typing
  const debouncedDomain = useDebounce(form.companyDomain, 700)

  const set = (field: keyof JobFormData, value: unknown) =>
    setForm((prev) => ({ ...prev, [field]: value }))

  const addSkill = () => {
    const s = skillInput.trim()
    if (s && !form.skills.includes(s)) set('skills', [...form.skills, s])
    setSkillInput('')
  }

  const removeSkill = (s: string) => set('skills', form.skills.filter((x) => x !== s))

  const saving = createJob.isPending || updateJob.isPending

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const payload = {
      ...form,
      salaryMin: (!form.salaryNegotiable && form.salaryMin) ? Number(form.salaryMin) : undefined,
      salaryMax: (!form.salaryNegotiable && form.salaryMax) ? Number(form.salaryMax) : undefined,
      closesAt: form.closesAt || undefined,
      companyDomain: form.companyDomain || undefined,
      location: form.location || undefined,
      responsibilities: form.responsibilities || undefined,
      requirements: form.requirements || undefined,
      benefits: form.benefits || undefined,
      applicationUrl: form.applicationUrl || undefined,
    }
    try {
      if (jobId) {
        await updateJob.mutateAsync(payload)
        toast.success('Job updated')
      } else {
        await createJob.mutateAsync(payload)
        toast.success('Job created')
      }
      router.push('/admin/jobs')
    } catch {
      toast.error('Failed to save job')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Basic info */}
      <Section title="Basic Information">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Job Title" required>
            <input className={inputCls} value={form.title} onChange={(e) => set('title', e.target.value)} required placeholder="e.g. Senior Software Engineer" />
          </Field>
          <Field label="Company" required>
            <input className={inputCls} value={form.company} onChange={(e) => set('company', e.target.value)} required placeholder="e.g. Stripe" />
          </Field>
          <Field label="Company Domain">
            <input
              className={inputCls}
              value={form.companyDomain}
              onChange={(e) => set('companyDomain', e.target.value.toLowerCase().replace(/^https?:\/\//,'').replace(/^www\./,'').split('/')[0])}
              placeholder="stripe.com"
            />
            <p className="text-sm text-slate-500 mt-1.5">Domain only — e.g. <span className="font-mono text-navy">stripe.com</span></p>
            {debouncedDomain && (
              <div className="mt-3 flex items-center gap-3 p-3 bg-section-alt rounded-xl border border-slate-200">
                <img
                  key={debouncedDomain}
                  src={`https://www.google.com/s2/favicons?domain=${debouncedDomain}&sz=64`}
                  alt=""
                  className="w-10 h-10 rounded-lg object-contain border border-slate-200 bg-white p-1 shrink-0"
                  onError={(e) => { e.currentTarget.style.display = 'none'; (e.currentTarget.nextSibling as HTMLElement)?.style.setProperty('display','flex') }}
                  onLoad={(e) => { e.currentTarget.style.display = 'block'; (e.currentTarget.nextSibling as HTMLElement)?.style.setProperty('display','none') }}
                />
                <div className="w-10 h-10 rounded-lg border border-slate-200 bg-slate-100 items-center justify-center text-sm font-bold text-slate-500 shrink-0 hidden">
                  {debouncedDomain[0].toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-bold text-navy">{debouncedDomain}</p>
                  <p className="text-xs text-slate-500">Company logo preview</p>
                </div>
              </div>
            )}
          </Field>
          <Field label="Location">
            <input className={inputCls} value={form.location} onChange={(e) => set('location', e.target.value)} placeholder="New York, NY" />
          </Field>
        </div>
        <Field label="Work Mode">
          <div className="flex gap-1 p-1 bg-section-alt rounded-xl w-fit">
            {WORK_MODES.map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => set('workMode', m)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-150 cursor-pointer ${
                  form.workMode === m
                    ? 'bg-navy text-blue-accent shadow-sm'
                    : 'text-slate-500 hover:text-navy'
                }`}
              >
                {WORK_MODE_LABELS[m]}
              </button>
            ))}
          </div>
        </Field>
      </Section>

      {/* Classification */}
      <Section title="Classification" hint="Helps candidates filter and find the right role">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Field label="Job Type">
            <select className={inputCls} value={form.type} onChange={(e) => set('type', e.target.value)}>
              {JOB_TYPES.map((t) => <option key={t} value={t}>{t.replace('_', ' ')}</option>)}
            </select>
          </Field>
          <Field label="Experience Level">
            <select className={inputCls} value={form.experienceLevel} onChange={(e) => set('experienceLevel', e.target.value)}>
              {EXP_LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
            </select>
          </Field>
          <Field label="Status">
            <select className={inputCls} value={form.status} onChange={(e) => set('status', e.target.value)}>
              {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </Field>
        </div>
      </Section>

      {/* Description */}
      <Section title="Description" hint="Be specific — good descriptions attract better candidates">
        <Field label="Job Description" required>
          <textarea className={textareaCls} value={form.description} onChange={(e) => set('description', e.target.value)} required placeholder="What does this role involve day-to-day?" />
        </Field>
        <Field label="Responsibilities">
          <textarea className={textareaCls} value={form.responsibilities} onChange={(e) => set('responsibilities', e.target.value)} placeholder="Key responsibilities…" />
        </Field>
        <Field label="Requirements">
          <textarea className={textareaCls} value={form.requirements} onChange={(e) => set('requirements', e.target.value)} placeholder="Must-have qualifications, years of experience, etc." />
        </Field>
        <Field label="Benefits">
          <textarea className={`${inputCls} resize-y min-h-20`} value={form.benefits} onChange={(e) => set('benefits', e.target.value)} placeholder="Health, 401k, equity, remote, etc." />
        </Field>
      </Section>

      {/* Skills */}
      <Section title="Required Skills" hint="These are used to match candidates from the user pool">
        <div className="flex gap-2">
          <input
            className={`${inputCls} flex-1`}
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addSkill() } }}
            placeholder="Type a skill and press Enter or Add"
          />
          <button
            type="button"
            onClick={addSkill}
            className="px-4 py-2 bg-blue-muted hover:bg-blue-accent/20 text-navy font-semibold rounded-xl text-sm transition-colors cursor-pointer"
          >
            Add
          </button>
        </div>
        {form.skills.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-1">
            {form.skills.map((s) => (
              <span key={s} className="flex items-center gap-1.5 bg-navy text-blue-accent text-xs font-bold px-3 py-1.5 rounded-full">
                {s}
                <button type="button" onClick={() => removeSkill(s)} className="hover:text-peach transition-colors cursor-pointer">
                  <XMarkIcon className="w-3.5 h-3.5" />
                </button>
              </span>
            ))}
          </div>
        )}
      </Section>

      {/* Salary */}
      <Section title="Compensation">
        <Checkbox
          checked={form.salaryNegotiable}
          onChange={(v) => set('salaryNegotiable', v)}
          label="Salary is negotiable (range below is a guide only)"
        />
        <div className={`grid grid-cols-2 sm:grid-cols-4 gap-4 transition-opacity duration-150 ${form.salaryNegotiable ? 'opacity-50' : ''}`}>
          <Field label="Min Salary">
            <input className={inputCls} type="number" min={0} value={form.salaryMin} onChange={(e) => set('salaryMin', e.target.value)} placeholder="60,000" disabled={form.salaryNegotiable} />
          </Field>
          <Field label="Max Salary">
            <input className={inputCls} type="number" min={0} value={form.salaryMax} onChange={(e) => set('salaryMax', e.target.value)} placeholder="100,000" disabled={form.salaryNegotiable} />
          </Field>
          <Field label="Currency">
            <input className={inputCls} value={form.salaryCurrency} onChange={(e) => set('salaryCurrency', e.target.value.toUpperCase())} maxLength={3} disabled={form.salaryNegotiable} />
          </Field>
          <Field label="Paid">
            <select className={inputCls} value={form.salaryPeriod} onChange={(e) => set('salaryPeriod', e.target.value)} disabled={form.salaryNegotiable}>
              {SALARY_PERIODS.map(({ value, label }) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </Field>
        </div>
      </Section>

      {/* Visa */}
      <button
        type="button"
        onClick={() => set('visaSponsorship', !form.visaSponsorship)}
        className="w-full text-left bg-white border border-slate-200 rounded-2xl p-6 space-y-5 cursor-pointer hover:border-navy/30 transition-colors group"
      >
        <div className="border-l-2 border-blue-accent pl-3">
          <h2 className="text-lg font-bold text-navy">Visa Sponsorship</h2>
        </div>
        <Checkbox checked={form.visaSponsorship} onChange={(v) => set('visaSponsorship', v)} label="This position offers visa sponsorship" />
      </button>

      {/* Application */}
      <Section title="Application Details">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Application URL">
            <input className={inputCls} type="url" value={form.applicationUrl} onChange={(e) => set('applicationUrl', e.target.value)} placeholder="https://careers.company.com/…" />
          </Field>
          <Field label="Closes At">
            <input className={inputCls} type="date" value={form.closesAt} onChange={(e) => set('closesAt', e.target.value)} />
          </Field>
        </div>
      </Section>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 pt-2 pb-8">
        <button
          type="button"
          onClick={() => router.push('/admin/jobs')}
          className="px-5 py-2.5 text-sm font-semibold border-2 border-slate-200 rounded-xl text-slate-600 hover:border-navy/30 hover:bg-section-alt transition-all duration-150 cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={saving}
          className="px-6 py-2.5 text-sm font-bold bg-blue-accent hover:bg-blue-accent-hover active:scale-95 text-navy rounded-xl transition-all duration-150 shadow-sm hover:shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {saving ? 'Saving…' : jobId ? 'Update Job' : 'Create Job'}
        </button>
      </div>
    </form>
  )
}
