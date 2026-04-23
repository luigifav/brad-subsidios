'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { Tarefa } from '@/lib/tarefas-mock'
import StatusTarefaBadge from './StatusTarefaBadge'

interface Props {
  gcpj: string
  tarefas: Tarefa[]
  tarefaAtualNumero: string
}

export default function MultiplaTarefaPopover({ gcpj, tarefas, tarefaAtualNumero }: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const outras = tarefas.filter((t) => t.numero !== tarefaAtualNumero)

  return (
    <div ref={ref} className="relative inline-flex items-center gap-1">
      <button
        onClick={(e) => { e.stopPropagation(); setIsOpen((v) => !v) }}
        title={`Este GCPJ tem ${tarefas.length} tarefas vinculadas`}
        className="text-brand-slate hover:text-brand-dark transition-colors"
      >
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute left-0 top-6 z-50 w-72 bg-white border border-gray-200 rounded-lg shadow-lg p-3">
          <p className="text-xs font-semibold text-brand-slate uppercase tracking-wide mb-2">
            {tarefas.length} tarefas neste GCPJ
          </p>
          <div className="space-y-2">
            {outras.map((t) => (
              <div key={t.numero} className="flex items-center justify-between gap-2 py-1 border-t border-gray-50">
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-brand-dark truncate">{t.numero}</p>
                  <p className="text-xs text-brand-slate font-light truncate">{t.tarefa}</p>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <StatusTarefaBadge status={t.status} />
                  <Link
                    href={`/tratativas/${t.numero}`}
                    className="text-xs font-semibold text-brand-mid hover:underline"
                    onClick={() => setIsOpen(false)}
                  >
                    Ver
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
