'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import PendenciaItemCard from './PendenciaItem'
import type { PendenciaItem } from '@/lib/pendencias'

interface Props {
  items: PendenciaItem[]
  showInitialTooltip: boolean
  onTooltipShown: () => void
  onClose: () => void
}

export default function PendenciasDropdown({ items, showInitialTooltip, onTooltipShown, onClose }: Props) {
  const [showTooltip, setShowTooltip] = useState(showInitialTooltip)

  useEffect(() => {
    if (!showInitialTooltip) return
    const timer = setTimeout(() => {
      setShowTooltip(false)
      onTooltipShown()
    }, 3000)
    return () => clearTimeout(timer)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const count = items.length

  return (
    <div className="absolute right-0 top-full mt-2 w-[400px] bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-100">
        <p className="text-sm font-semibold text-brand-dark">Precisa de você</p>
        <p className="text-xs text-brand-slate font-light">
          {count} {count === 1 ? 'item aguardando' : 'itens aguardando'} sua ação
        </p>
      </div>

      <div className="overflow-y-auto max-h-[360px] divide-y divide-gray-50">
        {items.map(item => (
          <PendenciaItemCard key={item.id} item={item} onClick={onClose} />
        ))}
        {count === 0 && (
          <p className="text-center text-sm text-brand-slate font-light py-8">
            Nenhum item pendente
          </p>
        )}
      </div>

      <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between">
        <Link
          href="/tratativas"
          className="text-xs text-brand-mid font-medium hover:underline"
          onClick={onClose}
        >
          Ver todos os pendentes
        </Link>
      </div>

      {showTooltip && (
        <div className="px-4 pb-3 text-xs text-brand-mid italic border-t border-gray-50 pt-2">
          A plataforma lembra por você. Nenhum caso fica esquecido.
        </div>
      )}
    </div>
  )
}
