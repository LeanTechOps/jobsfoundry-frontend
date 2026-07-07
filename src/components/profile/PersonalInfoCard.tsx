import { UserCircleIcon } from '@heroicons/react/24/outline'
import { Card, Field } from './shared'
import type { ProfileData } from './types'

interface Props {
  user: { firstName?: string | null; lastName?: string | null; email: string }
  form: ProfileData
  loaded: boolean
  onChange: (k: keyof ProfileData) => (v: string) => void
}

export default function PersonalInfoCard({ user, form, loaded, onChange }: Props) {
  return (
    <Card
      title="Personal Information"
      icon={UserCircleIcon}
      iconColor="text-navy"
      iconBg="bg-blue-muted"
      stripe="bg-blue-accent"
    >
      {!loaded ? (
        <div className="space-y-5">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-12 bg-slate-100 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <Field label="First name" value={user.firstName ?? ''} readOnly hint="Set by Google" />
            <Field label="Last name" value={user.lastName ?? ''} readOnly hint="Set by Google" />
          </div>
          <Field label="Email" value={user.email} readOnly />
          <Field
            label="Headline"
            value={form.headline}
            onChange={onChange('headline')}
            placeholder="e.g. Senior Software Engineer · 5 YOE"
          />
          <Field
            label="Location"
            value={form.location}
            onChange={onChange('location')}
            placeholder="e.g. San Francisco, CA"
          />
        </div>
      )}
    </Card>
  )
}
