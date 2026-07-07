'use client'

import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import { api } from '@/lib/api'
import { toast } from 'react-toastify'
import { CheckCircleIcon, ArrowLeftIcon } from '@heroicons/react/24/outline'

import ProfileHero from '@/components/profile/ProfileHero'
import PersonalInfoCard from '@/components/profile/PersonalInfoCard'
import ProfessionalLinksCard from '@/components/profile/ProfessionalLinksCard'
import ResumesSection from '@/components/profile/ResumesSection'
import JobPreferencesCard from '@/components/profile/JobPreferencesCard'
import { SectionLabel } from '@/components/profile/shared'
import type { ProfileData, Resume } from '@/components/profile/types'

export default function ProfilePage() {
  const { user, isAuthenticated, loading } = useAuth()
  const router = useRouter()

  const [form, setForm] = useState<ProfileData>({
    headline: '', location: '', linkedinUrl: '', githubUrl: '', portfolioUrl: '',
  })
  const [profileLoaded, setProfileLoaded] = useState(false)
  const [saving, setSaving] = useState(false)
  const [resumes, setResumes] = useState<Resume[]>([])
  const [resumesLoaded, setResumesLoaded] = useState(false)
  const [busyResumeId, setBusyResumeId] = useState<string | null>(null)

  useEffect(() => {
    if (!loading && !isAuthenticated) router.replace('/login')
  }, [isAuthenticated, loading, router])

  const loadProfile = useCallback(async () => {
    try {
      const data = await api.get<ProfileData>('/profile')
      setForm({
        headline: data.headline ?? '',
        location: data.location ?? '',
        linkedinUrl: data.linkedinUrl ?? '',
        githubUrl: data.githubUrl ?? '',
        portfolioUrl: data.portfolioUrl ?? '',
      })
    } catch { toast.error('Failed to load profile') }
    finally { setProfileLoaded(true) }
  }, [])

  const loadResumes = useCallback(async () => {
    try {
      const list = await api.get<Resume[]>('/profile/resumes')
      setResumes(list.map(r => ({ ...r, downloadUrl: null })))
    } catch { toast.error('Failed to load resumes') }
    finally { setResumesLoaded(true) }
  }, [])

  useEffect(() => {
    if (isAuthenticated) { loadProfile(); loadResumes() }
  }, [isAuthenticated, loadProfile, loadResumes])

  if (loading || !user) return (
    <div className="min-h-screen flex items-center justify-center bg-section-alt">
      <div className="w-7 h-7 border-2 border-navy border-t-transparent rounded-full animate-spin" />
    </div>
  )

  const initials = ((user.firstName?.[0] ?? '') + (user.lastName?.[0] ?? '')).toUpperCase() || user.email[0].toUpperCase()
  const displayName = [user.firstName, user.lastName].filter(Boolean).join(' ') || user.email
  const onChange = (k: keyof ProfileData) => (v: string) => setForm(f => ({ ...f, [k]: v }))

  const handleSave = async () => {
    setSaving(true)
    try {
      const payload = Object.fromEntries(Object.entries(form).filter(([, v]) => v !== ''))
      await api.patch('/profile', payload)
      toast.success('Profile saved!')
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to save profile')
    } finally { setSaving(false) }
  }

  const handleSetDefault = async (resumeId: string) => {
    setBusyResumeId(resumeId)
    try {
      await api.patch(`/profile/resumes/${resumeId}/default`)
      toast.success('Default resume updated')
      await loadResumes()
    } catch (err: unknown) { toast.error(err instanceof Error ? err.message : 'Failed') }
    finally { setBusyResumeId(null) }
  }

  const handleDelete = async (resumeId: string) => {
    setBusyResumeId(resumeId)
    try {
      await api.delete(`/profile/resumes/${resumeId}`)
      toast.success('Resume deleted')
      setResumes(p => p.filter(r => r.id !== resumeId))
    } catch (err: unknown) { toast.error(err instanceof Error ? err.message : 'Failed') }
    finally { setBusyResumeId(null) }
  }

  return (
    <div className="min-h-screen bg-section-alt flex flex-col">

      {/* Topbar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/dashboard"
              className="w-9 h-9 flex items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors cursor-pointer">
              <ArrowLeftIcon className="w-5 h-5" />
            </Link>
            <div className="h-5 w-px bg-slate-200" />
            <Link href="/" className="cursor-pointer">
              <span className="text-xl font-bold text-navy">JobBlitz</span>
            </Link>
          </div>
          <button
            onClick={handleSave}
            disabled={saving || !profileLoaded}
            className="inline-flex items-center gap-2 bg-blue-accent hover:bg-blue-accent-hover disabled:opacity-50 active:scale-[0.98] text-navy text-sm font-bold px-6 py-2.5 rounded-xl transition-all duration-150 cursor-pointer shadow-lg"
          >
            {saving
              ? <span className="w-4 h-4 border-2 border-navy border-t-transparent rounded-full animate-spin" />
              : <CheckCircleIcon className="w-4 h-4" />}
            {saving ? 'Saving…' : 'Save changes'}
          </button>
        </div>
      </header>

      {/* Hero */}
      <ProfileHero
        initials={initials}
        displayName={displayName}
        email={user.email}
        headline={form.headline}
        location={form.location}
      />

      {/* Content */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 py-12 space-y-12">

        {/* Profile section */}
        <div>
          <SectionLabel>Profile Details</SectionLabel>
          <div className="grid lg:grid-cols-2 gap-6">
            <PersonalInfoCard
              user={user}
              form={form}
              loaded={profileLoaded}
              onChange={onChange}
            />
            <ProfessionalLinksCard
              form={form}
              loaded={profileLoaded}
              onChange={onChange}
            />
          </div>
        </div>

        {/* Resume section */}
        <ResumesSection
          resumes={resumes}
          loaded={resumesLoaded}
          busyResumeId={busyResumeId}
          onReload={loadResumes}
          onSetDefault={handleSetDefault}
          onDelete={handleDelete}
        />

        {/* Preferences */}
        <JobPreferencesCard />

      </main>
    </div>
  )
}
