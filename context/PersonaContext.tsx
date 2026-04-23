'use client'

// TODO: substituir por autenticação real e claims de perfil.

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import type { Persona, PersonaConfig } from '@/lib/personas'
import { PERSONAS } from '@/lib/personas'

interface PersonaContextValue {
  persona: Persona
  config: PersonaConfig
  trocarPersona: (persona: Persona) => void
}

const PersonaContext = createContext<PersonaContextValue | null>(null)

const STORAGE_KEY = 'sbk-persona-ativa'

export function PersonaProvider({ children }: { children: ReactNode }) {
  const router = useRouter()
  const [persona, setPersona] = useState<Persona>('operador')

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved === 'operador' || saved === 'gestor') {
      setPersona(saved)
    }
  }, [])

  function trocarPersona(novaPersona: Persona) {
    setPersona(novaPersona)
    localStorage.setItem(STORAGE_KEY, novaPersona)
    router.push(PERSONAS[novaPersona].rotaInicial)
  }

  return (
    <PersonaContext.Provider value={{ persona, config: PERSONAS[persona], trocarPersona }}>
      {children}
    </PersonaContext.Provider>
  )
}

export function useAtivaPersona(): PersonaContextValue {
  const ctx = useContext(PersonaContext)
  if (!ctx) throw new Error('useAtivaPersona deve ser usado dentro de PersonaProvider')
  return ctx
}
