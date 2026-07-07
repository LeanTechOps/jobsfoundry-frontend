import { BriefcaseIcon, MapPinIcon } from '@heroicons/react/24/outline'

interface Props {
  initials: string
  displayName: string
  email: string
  headline: string
  location: string
}

export default function ProfileHero({ initials, displayName, email, headline, location }: Props) {
  return (
    <div className="bg-navy relative overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-blue-accent/10 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute -bottom-32 -right-32 w-[400px] h-[400px] rounded-full bg-blue-accent/5 blur-3xl" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-8 flex items-center gap-5">
        <div className="relative flex-shrink-0">
          <div className="w-16 h-16 rounded-xl bg-navy-light flex items-center justify-center ring-2 ring-white/10 shadow-lg">
            <span className="text-xl font-black text-white select-none">{initials}</span>
          </div>
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-blue-accent border-2 border-navy rounded-full" />
        </div>

        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-extrabold text-white tracking-tight leading-tight">{displayName}</h1>
          <p className="text-white/60 text-sm mt-0.5">{email}</p>
          <div className="flex flex-wrap items-center gap-4 mt-2">
            {headline && (
              <span className="flex items-center gap-1.5 text-sm text-white/80 font-medium">
                <BriefcaseIcon className="w-3.5 h-3.5 text-blue-accent flex-shrink-0" />
                {headline}
              </span>
            )}
            {location && (
              <span className="flex items-center gap-1.5 text-sm text-white/60">
                <MapPinIcon className="w-3.5 h-3.5 text-blue-accent flex-shrink-0" />
                {location}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
