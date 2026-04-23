import { ProcessoStatus, TipoRisco } from '@/lib/mock-data'

const statusColors: Record<ProcessoStatus, string> = {
  'Na fila': 'bg-gray-100 text-gray-600',
  'Distribuído': 'bg-blue-100 text-blue-700',
  'Em tratativa': 'bg-yellow-100 text-yellow-700',
  'Enviado ao ServiceNow': 'bg-purple-100 text-purple-700',
  'Concluído': 'bg-green-100 text-green-700',
}

const riscoColors: Record<TipoRisco, string> = {
  'Baixo': 'bg-green-100 text-green-700',
  'Médio': 'bg-yellow-100 text-yellow-700',
  'Alto': 'bg-orange-100 text-orange-700',
  'Crítico': 'bg-red-100 text-red-700',
}

interface StatusBadgeProps {
  label: string
  variant?: 'status' | 'risco' | 'custom'
  customClass?: string
}

export default function StatusBadge({ label, variant = 'status', customClass }: StatusBadgeProps) {
  let cls = customClass ?? ''

  if (!customClass) {
    if (variant === 'status') {
      cls = statusColors[label as ProcessoStatus] ?? 'bg-gray-100 text-gray-600'
    } else if (variant === 'risco') {
      cls = riscoColors[label as TipoRisco] ?? 'bg-gray-100 text-gray-600'
    }
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${cls}`}>
      {label}
    </span>
  )
}
