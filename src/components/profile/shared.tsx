export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-sm font-semibold text-navy uppercase tracking-widest mb-5">{children}</p>
  )
}

export function Field({
  label, value, onChange, placeholder, type = 'text', readOnly = false, hint,
}: {
  label: string
  value: string
  onChange?: (v: string) => void
  placeholder?: string
  type?: string
  readOnly?: boolean
  hint?: string
}) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-bold text-navy">{label}</label>
      <input
        type={type}
        value={value}
        readOnly={readOnly}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        className={`w-full px-4 py-3 rounded-xl text-base transition-all outline-none border-2
          ${readOnly
            ? 'bg-slate-50 border-slate-200 text-slate-400 cursor-default'
            : 'bg-white border-slate-200 text-navy font-medium placeholder:text-slate-300 hover:border-slate-300 focus:border-navy focus:ring-4 focus:ring-navy/10'
          }`}
      />
      {hint && <p className="text-sm text-slate-500">{hint}</p>}
    </div>
  )
}

export function Card({
  title, icon: Icon, iconColor, iconBg, stripe, children,
}: {
  title: string
  icon: React.ElementType
  iconColor: string
  iconBg: string
  stripe: string
  children: React.ReactNode
}) {
  return (
    <div className="group bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-200">
      <div className={`h-1.5 w-full ${stripe}`} />
      <div className="p-7">
        <div className="flex items-center gap-3 mb-6">
          <div className={`w-11 h-11 rounded-xl ${iconBg} ${iconColor} flex items-center justify-center flex-shrink-0 transition-transform duration-200 group-hover:scale-110`}>
            <Icon className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-bold text-navy">{title}</h2>
        </div>
        {children}
      </div>
    </div>
  )
}
