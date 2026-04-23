'use client'

// TODO: implementar autenticação e perfis de acesso (gestor vs analista)

import { createContext, useContext, useReducer } from 'react'
import { Analise, MOCK_PROCESSOS, Processo, ProcessoStatus, StatusServiceNow } from '@/lib/mock-data'

type Action =
  | { type: 'DISTRIBUIR'; ids: string[]; analista: string }
  | { type: 'INICIAR_TRATATIVA'; id: string }
  | { type: 'ATUALIZAR_ANALISE'; id: string; analise: Analise }
  | { type: 'ENVIAR_SERVICENOW'; id: string; protocolo: string }
  | { type: 'ENVIAR_SERVICENOW_AUTOMATICO'; id: string; protocolo: string }
  | { type: 'MARCAR_PENDENTE_GESTOR'; id: string; motivo: string }

interface CasesContextType {
  cases: Processo[]
  dispatch: React.Dispatch<Action>
  getCase: (id: string) => Processo | undefined
}

function reducer(state: Processo[], action: Action): Processo[] {
  switch (action.type) {
    case 'DISTRIBUIR':
      return state.map((p) =>
        action.ids.includes(p.id) && p.status === 'Na fila'
          ? { ...p, status: 'Distribuído' as ProcessoStatus, analistaResponsavel: action.analista }
          : p
      )
    case 'INICIAR_TRATATIVA':
      return state.map((p) =>
        p.id === action.id && p.status === 'Distribuído'
          ? { ...p, status: 'Em tratativa' as ProcessoStatus }
          : p
      )
    case 'ATUALIZAR_ANALISE':
      return state.map((p) =>
        p.id === action.id ? { ...p, analise: { ...p.analise, ...action.analise } } : p
      )
    case 'ENVIAR_SERVICENOW':
      return state.map((p) =>
        p.id === action.id
          ? {
              ...p,
              status: 'Enviado ao ServiceNow' as ProcessoStatus,
              protocoloServiceNow: action.protocolo,
              statusServiceNow: 'em_geracao' as StatusServiceNow,
              timestampEnvio: new Date().toISOString(),
            }
          : p
      )
    case 'ENVIAR_SERVICENOW_AUTOMATICO':
      return state.map((p) =>
        p.id === action.id && p.status !== 'Enviado ao ServiceNow'
          ? {
              ...p,
              status: 'Enviado ao ServiceNow' as ProcessoStatus,
              protocoloServiceNow: action.protocolo,
              statusServiceNow: 'em_geracao' as StatusServiceNow,
              timestampEnvio: new Date().toISOString(),
              pendenteGestor: false,
            }
          : p
      )
    case 'MARCAR_PENDENTE_GESTOR':
      return state.map((p) =>
        p.id === action.id
          ? { ...p, pendenteGestor: true, pendenciaDescricao: action.motivo }
          : p
      )
    default:
      return state
  }
}

const CasesContext = createContext<CasesContextType | null>(null)

export function CasesProvider({ children }: { children: React.ReactNode }) {
  const [cases, dispatch] = useReducer(reducer, MOCK_PROCESSOS)

  function getCase(id: string) {
    return cases.find((p) => p.id === id)
  }

  return (
    <CasesContext.Provider value={{ cases, dispatch, getCase }}>
      {children}
    </CasesContext.Provider>
  )
}

export function useCases() {
  const ctx = useContext(CasesContext)
  if (!ctx) throw new Error('useCases must be used inside CasesProvider')
  return ctx
}
