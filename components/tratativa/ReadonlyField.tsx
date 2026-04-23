interface ReadonlyFieldProps {
  label: string
  value: string
}

export default function ReadonlyField({ label, value }: ReadonlyFieldProps) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs font-semibold uppercase tracking-wide text-brand-slate">{label}</span>
      <div className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-sm font-semibold text-brand-dark">
        {value}
      </div>
    </div>
  )
}
