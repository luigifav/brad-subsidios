'use client'

import { useEffect, useState } from 'react'
import { ChamadoStatus } from '@/lib/mock-data'

interface SLABadgeProps {
  slaHoras: number
  dataAbertura: string
  status: ChamadoStatus
}

function formatDuracao(ms: number): string {
  const totalMin = Math.floor(Math.abs(ms) / 60000)
  const h = Math.floor(totalMin / 60)
  const min = totalMin % 60
  if (h === 0) return `${min}min`
  if (min === 0) return `${h}h`
  return `${h}h ${min}min`
}

export default function SLABadge({ slaHoras, dataAbertura, status }: SLABadgeProps) {
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    if (status !== 'aberto') return
    const id = setInterval(() => setNow(Date.now()), 60000)
    return () => clearInterval(id)
  }, [status])

  if (status !== 'aberto' && status !== 'sla_estourado') {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-500">
        —
      </span>
    )
  }

  const deadline = new Date(dataAbertura).getTime() + slaHoras * 3600000
  const remaining = deadline - now

  if (remaining <= 0) {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-900 text-red-400 border border-red-600">
        estourou há {formatDuracao(remaining)}
      </span>
    )
  }

  const h24 = 24 * 3600000
  const h6 = 6 * 3600000

  if (remaining > h24) {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-700">
        em {formatDuracao(remaining)}
      </span>
    )
  }
  if (remaining > h6) {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700">
        em {formatDuracao(remaining)}
      </span>
    )
  }
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-700">
      em {formatDuracao(remaining)}
    </span>
  )
}
