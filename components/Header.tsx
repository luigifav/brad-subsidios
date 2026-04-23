'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect, useRef, useMemo } from 'react'
import { useCases } from '@/context/CasesContext'
import { useChamados } from '@/context/ChamadosContext'
import { derivePendencias } from '@/lib/pendencias'
import PendenciasDropdown from './header/PendenciasDropdown'

const navItems = [
  { href: '/estoque', label: 'Estoque' },
  { href: '/tratativas', label: 'Tratativas' },
  { href: '/chamados', label: 'Chamados' },
  { href: '/acompanhamento', label: 'Acompanhamento' },
  { href: '/gestao', label: 'Gestão' },
  { href: '/painel', label: 'Painel' },
]

function BellIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={className ?? 'w-5 h-5'}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
    </svg>
  )
}

export default function Header() {
  const pathname = usePathname()
  const { cases } = useCases()
  const { chamados } = useChamados()

  const [isOpen, setIsOpen] = useState(false)
  const [tooltipSeen, setTooltipSeen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const pendencias = useMemo(() => derivePendencias(cases, chamados), [cases, chamados])
  const hasUrgent = pendencias.some(p => p.tipo === 'sla' || p.tipo === 'servicenow')

  useEffect(() => {
    if (!isOpen) return
    function handleOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleOutside)
    return () => document.removeEventListener('mousedown', handleOutside)
  }, [isOpen])

  return (
    <header className="fixed top-0 left-0 right-0 z-40 h-16 bg-brand-dark flex items-center px-6 gap-8">
      <div className="flex items-center gap-3 shrink-0">
        <span className="text-white text-xl font-semibold tracking-tight">SBK</span>
        <div className="h-5 w-px bg-white/20" />
        <span className="text-white/60 text-xs font-light">Subsídios Bradesco</span>
      </div>

      <nav className="flex items-center gap-1 flex-1">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                isActive
                  ? 'bg-white/10 text-white font-semibold'
                  : 'text-white/60 hover:text-white hover:bg-white/5 font-light'
              }`}
            >
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="flex items-center gap-4 shrink-0">
        <div ref={containerRef} className="relative">
          <button
            onClick={() => setIsOpen(prev => !prev)}
            aria-label="Pendencias"
            className="relative p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            <span className={hasUrgent && pendencias.length > 0 ? 'animate-pulse' : ''}>
              <BellIcon className="w-5 h-5 text-white/80" />
            </span>
            {pendencias.length > 0 && (
              <span
                className={`absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-0.5 rounded-full flex items-center justify-center text-[10px] font-semibold text-white ${
                  hasUrgent ? 'bg-red-600' : 'bg-brand-mid'
                }`}
              >
                {pendencias.length}
              </span>
            )}
          </button>

          {isOpen && (
            <PendenciasDropdown
              items={pendencias}
              showInitialTooltip={!tooltipSeen}
              onTooltipShown={() => setTooltipSeen(true)}
              onClose={() => setIsOpen(false)}
            />
          )}
        </div>

        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-brand-mid flex items-center justify-center text-white text-xs font-semibold">
            AC
          </div>
          <span className="text-white/80 text-sm font-light">Ana Costa — Analista</span>
        </div>
      </div>
    </header>
  )
}
