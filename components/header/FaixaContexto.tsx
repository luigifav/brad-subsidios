'use client'

import { useAtivaPersona } from '@/context/PersonaContext'

const FAIXA_CONFIG = {
  operador: {
    bg: 'bg-brand-mid',
    texto: 'Visão do operador — foco em execução de casos',
  },
  gestor: {
    bg: 'bg-brand-dark',
    texto: 'Visão do gestor — foco em orquestração da esteira',
  },
}

export default function FaixaContexto() {
  const { persona } = useAtivaPersona()
  const { bg, texto } = FAIXA_CONFIG[persona]

  return (
    <div className={`fixed top-16 left-0 right-0 z-30 h-7 flex items-center justify-center ${bg}`}>
      <span className="text-xs font-light text-white">{texto}</span>
    </div>
  )
}
