'use client'

// TODO: integrar fonte real via ETL da base operacional do Bradesco

import { createContext, useContext, useReducer } from 'react'
import { MOCK_TAREFAS, Tarefa, TarefaStatus } from '@/lib/tarefas-mock'

type Action =
  | { type: 'DISTRIBUIR_TAREFAS'; numeros: string[]; analista: string }
  | { type: 'INICIAR_TAREFA'; numero: string }
  | { type: 'CONCLUIR_TAREFA'; numero: string }
  | { type: 'DEVOLVER_TAREFA'; numero: string; motivo: string }

interface TarefasContextType {
  tarefas: Tarefa[]
  dispatch: React.Dispatch<Action>
  getTarefa: (numero: string) => Tarefa | undefined
  getTarefasPorGCPJ: (gcpj: string) => Tarefa[]
}

function reducer(state: Tarefa[], action: Action): Tarefa[] {
  switch (action.type) {
    case 'DISTRIBUIR_TAREFAS':
      return state.map((t) =>
        action.numeros.includes(t.numero) && t.status === 'A Iniciar'
          ? { ...t, analista: action.analista, status: 'Em Andamento' as TarefaStatus }
          : t
      )
    case 'INICIAR_TAREFA':
      return state.map((t) =>
        t.numero === action.numero && t.status === 'A Iniciar'
          ? { ...t, status: 'Em Andamento' as TarefaStatus }
          : t
      )
    case 'CONCLUIR_TAREFA':
      return state.map((t) =>
        t.numero === action.numero ? { ...t, status: 'Concluída' as TarefaStatus } : t
      )
    case 'DEVOLVER_TAREFA':
      return state.map((t) =>
        t.numero === action.numero
          ? { ...t, status: 'Devolvido (Internamente)' as TarefaStatus }
          : t
      )
    default:
      return state
  }
}

// TODO: remover reatribuição mockada quando integração real for feita
function initTarefas(tarefas: Tarefa[]): Tarefa[] {
  const indices = [10, 45, 90, 130]
  return tarefas.map((t, i) => {
    if (indices.includes(i)) {
      return { ...t, analista: 'Ana Costa', status: 'Em Andamento' as TarefaStatus }
    }
    return t
  })
}

const TarefasContext = createContext<TarefasContextType | null>(null)

export function TarefasProvider({ children }: { children: React.ReactNode }) {
  const [tarefas, dispatch] = useReducer(reducer, MOCK_TAREFAS, initTarefas)

  function getTarefa(numero: string) {
    return tarefas.find((t) => t.numero === numero)
  }

  function getTarefasPorGCPJ(gcpj: string) {
    return tarefas.filter((t) => t.numeroGCPJ === gcpj)
  }

  return (
    <TarefasContext.Provider value={{ tarefas, dispatch, getTarefa, getTarefasPorGCPJ }}>
      {children}
    </TarefasContext.Provider>
  )
}

export function useTarefas() {
  const ctx = useContext(TarefasContext)
  if (!ctx) throw new Error('useTarefas must be used inside TarefasProvider')
  return ctx
}
