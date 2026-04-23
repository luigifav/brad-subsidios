'use client'

import { useAtivaPersona } from '@/context/PersonaContext'
import type { Persona } from '@/lib/personas'

const OPCOES: { id: Persona; label: string }[] = [
  { id: 'operador', label: 'Operador' },
  { id: 'gestor', label: 'Gestor' },
]

export default function PersonaToggle() {
  const { persona, trocarPersona } = useAtivaPersona()

  return (
    <div title="Alternar perfil de uso" className="flex items-center h-9 bg-brand-mid/20 rounded-full p-1 gap-0.5">
      {OPCOES.map((op) => {
        const isActive = persona === op.id
        return (
          <button
            key={op.id}
            onClick={() => trocarPersona(op.id)}
            className={`px-4 py-1.5 rounded-full text-sm transition-colors ${
              isActive
                ? 'bg-white text-brand-dark font-semibold shadow-sm'
                : 'text-white/70 font-light hover:text-white'
            }`}
          >
            {op.label}
          </button>
        )
      })}
    </div>
  )
}
