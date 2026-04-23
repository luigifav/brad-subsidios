'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
  { href: '/estoque', label: 'Estoque' },
  { href: '/tratativas', label: 'Tratativas' },
  { href: '/gestao', label: 'Gestão' },
  { href: '/painel', label: 'Painel' },
]

export default function Header() {
  const pathname = usePathname()

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

      <div className="flex items-center gap-2 shrink-0">
        <div className="w-8 h-8 rounded-full bg-brand-mid flex items-center justify-center text-white text-xs font-semibold">
          AC
        </div>
        <span className="text-white/80 text-sm font-light">Ana Costa — Analista</span>
      </div>
    </header>
  )
}
