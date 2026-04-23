'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAtivaPersona } from '@/context/PersonaContext'
import type { Persona } from '@/lib/personas'

interface PersonaGuardProps {
  permitidas: Persona[]
  children: React.ReactNode
}

export default function PersonaGuard({ permitidas, children }: PersonaGuardProps) {
  const { persona, config } = useAtivaPersona()
  const router = useRouter()

  const permitido = permitidas.includes(persona)

  useEffect(() => {
    if (!permitido) {
      router.replace(config.rotaInicial)
    }
  }, [permitido, config.rotaInicial, router])

  if (!permitido) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <div className="w-6 h-6 border-2 border-brand-mid border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return <>{children}</>
}
