interface MetricCardProps {
  label: string
  value: number | string
  highlight?: boolean
}

export default function MetricCard({ label, value, highlight = false }: MetricCardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5 flex flex-col gap-1">
      <span className="text-xs font-semibold uppercase tracking-wide text-brand-slate">{label}</span>
      <span className={`text-3xl font-semibold ${highlight ? 'text-red-600' : 'text-brand-dark'}`}>
        {value}
      </span>
    </div>
  )
}
