import Link from 'next/link'
import type { PendenciaItem } from '@/lib/pendencias'

const TIPO_CONFIG = {
  sla: {
    bg: 'bg-red-50',
    color: 'text-red-600',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2m6-2a10 10 0 11-20 0 10 10 0 0120 0z" />
      </svg>
    ),
  },
  resposta: {
    bg: 'bg-green-50',
    color: 'text-green-600',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  parado: {
    bg: 'bg-amber-50',
    color: 'text-amber-600',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25v13.5m-7.5-13.5v13.5" />
      </svg>
    ),
  },
  devolvido: {
    bg: 'bg-blue-50',
    color: 'text-blue-600',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
      </svg>
    ),
  },
  servicenow: {
    bg: 'bg-orange-50',
    color: 'text-orange-600',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
      </svg>
    ),
  },
} as const

interface Props {
  item: PendenciaItem
  onClick: () => void
}

export default function PendenciaItemCard({ item, onClick }: Props) {
  const config = TIPO_CONFIG[item.tipo]
  return (
    <Link
      href={item.href}
      onClick={onClick}
      className="flex items-start gap-3 px-4 py-3 hover:bg-brand-offwhite transition-colors"
    >
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${config.bg}`}>
        <span className={config.color}>{config.icon}</span>
      </div>
      <div className="flex-1 min-w-0 pt-0.5">
        <p className="text-sm font-semibold text-brand-dark truncate">{item.titulo}</p>
        <p className="text-xs text-brand-slate font-light truncate mt-0.5">{item.descricao}</p>
        <p className="text-xs text-brand-slate font-light italic mt-0.5">{item.timestamp}</p>
      </div>
    </Link>
  )
}
