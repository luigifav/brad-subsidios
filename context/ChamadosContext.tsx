'use client'

// TODO: integrar com API de abertura de chamados do Bradesco (sistema interno)
// TODO: implementar polling ou webhook para atualização de status dos chamados

import { createContext, useContext, useReducer, useEffect, useRef } from 'react'
import { Chamado, ChamadoStatus, AreaBanco, getSLA } from '@/lib/mock-data'
import { reavaliarCaso } from '@/lib/robo-reavaliacao'
import { useCases } from './CasesContext'

type Action =
  | { type: 'ABRIR_CHAMADO'; processoId: string; documento: string; area: AreaBanco }
  | { type: 'RESPONDER_COM_DOC'; id: string }
  | { type: 'RESPONDER_SEM_DOC'; id: string; motivoAusencia: string }
  | { type: 'ESTOURAR_SLA'; id: string }
  | { type: 'CANCELAR'; id: string }

interface ChamadosContextType {
  chamados: Chamado[]
  dispatch: React.Dispatch<Action>
  getChamado: (id: string) => Chamado | undefined
  getChamadosDoCaso: (processoId: string) => Chamado[]
}

const chamadoCounter = { value: 851 }

function gerarNumeroChamado(): string {
  return `CHM-2026-${String(chamadoCounter.value++).padStart(5, '0')}`
}

function reducer(state: Chamado[], action: Action): Chamado[] {
  switch (action.type) {
    case 'ABRIR_CHAMADO': {
      const exists = state.some(
        (c) =>
          c.processoId === action.processoId &&
          c.documentoSolicitado === action.documento &&
          c.status === 'aberto',
      )
      if (exists) return state
      const slaHoras = getSLA(action.area, action.documento)
      const novo: Chamado = {
        id: `chm-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        numero: gerarNumeroChamado(),
        processoId: action.processoId,
        documentoSolicitado: action.documento,
        area: action.area,
        slaHoras,
        dataAbertura: new Date().toISOString(),
        status: 'aberto',
        abertoPor: 'automacao',
      }
      return [...state, novo]
    }
    case 'RESPONDER_COM_DOC':
      return state.map((c) =>
        c.id === action.id
          ? { ...c, status: 'respondido_com_doc' as ChamadoStatus, dataResposta: new Date().toISOString() }
          : c,
      )
    case 'RESPONDER_SEM_DOC':
      return state.map((c) =>
        c.id === action.id
          ? {
              ...c,
              status: 'respondido_sem_doc' as ChamadoStatus,
              dataResposta: new Date().toISOString(),
              motivoAusencia: action.motivoAusencia,
            }
          : c,
      )
    case 'ESTOURAR_SLA':
      return state.map((c) =>
        c.id === action.id ? { ...c, status: 'sla_estourado' as ChamadoStatus } : c,
      )
    case 'CANCELAR':
      return state.map((c) =>
        c.id === action.id ? { ...c, status: 'cancelado' as ChamadoStatus } : c,
      )
    default:
      return state
  }
}

function createMockChamados(): Chamado[] {
  const h = (hours: number) => new Date(Date.now() - hours * 3600000).toISOString()
  return [
    {
      id: 'chm-001',
      numero: 'CHM-2026-00841',
      processoId: 'proc-012',
      documentoSolicitado: 'LOG',
      area: 'T.I.',
      slaHoras: 24,
      dataAbertura: h(20),
      status: 'aberto',
      abertoPor: 'automacao',
    },
    {
      id: 'chm-002',
      numero: 'CHM-2026-00842',
      processoId: 'proc-012',
      documentoSolicitado: 'TELA TRAG',
      area: 'T.I.',
      slaHoras: 48,
      dataAbertura: h(12),
      status: 'aberto',
      abertoPor: 'automacao',
    },
    {
      id: 'chm-003',
      numero: 'CHM-2026-00843',
      processoId: 'proc-013',
      documentoSolicitado: 'EXTRATO',
      area: 'Operações',
      slaHoras: 12,
      dataAbertura: h(5),
      status: 'aberto',
      abertoPor: 'automacao',
    },
    {
      id: 'chm-004',
      numero: 'CHM-2026-00844',
      processoId: 'proc-013',
      documentoSolicitado: 'LAUDO',
      area: 'Compliance',
      slaHoras: 48,
      dataAbertura: h(30),
      dataResposta: h(5),
      status: 'respondido_com_doc',
      abertoPor: 'automacao',
    },
    {
      id: 'chm-005',
      numero: 'CHM-2026-00845',
      processoId: 'proc-009',
      documentoSolicitado: 'TERMO DE CESTA',
      area: 'Operações',
      slaHoras: 24,
      dataAbertura: h(28),
      dataResposta: h(8),
      status: 'respondido_com_doc',
      abertoPor: 'automacao',
    },
    {
      id: 'chm-006',
      numero: 'CHM-2026-00846',
      processoId: 'proc-010',
      documentoSolicitado: 'LOG',
      area: 'T.I.',
      slaHoras: 24,
      dataAbertura: h(20),
      dataResposta: h(3),
      status: 'respondido_sem_doc',
      motivoAusencia: 'Logs do período não disponíveis por manutenção programada do sistema.',
      abertoPor: 'automacao',
    },
    {
      id: 'chm-007',
      numero: 'CHM-2026-00847',
      processoId: 'proc-011',
      documentoSolicitado: 'TELA TRAG',
      area: 'T.I.',
      slaHoras: 48,
      dataAbertura: h(40),
      dataResposta: h(10),
      status: 'respondido_sem_doc',
      motivoAusencia: 'Tela TRAG não localizada para a data e horário indicados.',
      abertoPor: 'automacao',
    },
    {
      id: 'chm-008',
      numero: 'CHM-2026-00848',
      processoId: 'proc-013',
      documentoSolicitado: 'LIGAÇÃO - FONE FÁCIL',
      area: 'Operações',
      slaHoras: 72,
      dataAbertura: h(80),
      status: 'sla_estourado',
      abertoPor: 'automacao',
    },
    {
      id: 'chm-009',
      numero: 'CHM-2026-00849',
      processoId: 'proc-010',
      documentoSolicitado: 'TELA TRAG',
      area: 'T.I.',
      slaHoras: 48,
      dataAbertura: h(60),
      status: 'sla_estourado',
      abertoPor: 'automacao',
    },
    {
      id: 'chm-010',
      numero: 'CHM-2026-00850',
      processoId: 'proc-011',
      documentoSolicitado: 'LIGAÇÃO - FONE FÁCIL',
      area: 'Operações',
      slaHoras: 72,
      dataAbertura: h(80),
      status: 'sla_estourado',
      abertoPor: 'automacao',
    },
    {
      id: 'chm-011',
      numero: 'CHM-2026-00852',
      processoId: 'proc-012',
      documentoSolicitado: 'LAUDO',
      area: 'Compliance',
      slaHoras: 2,
      dataAbertura: h(1.5),
      status: 'aberto',
      abertoPor: 'manual',
    },
  ]
}

const ChamadosContext = createContext<ChamadosContextType | null>(null)

export function ChamadosProvider({ children }: { children: React.ReactNode }) {
  const { dispatch: casesDispatch } = useCases()
  const [chamados, dispatch] = useReducer(reducer, undefined, createMockChamados)
  const prevRef = useRef<Chamado[]>(chamados)

  useEffect(() => {
    // TODO: substituir reavaliação via reducer por job agendado server-side
    const prev = prevRef.current
    const changedProcessos = new Set<string>()

    chamados.forEach((c) => {
      const old = prev.find((p) => p.id === c.id)
      if (old && old.status !== c.status) changedProcessos.add(c.processoId)
    })
    chamados
      .filter((c) => !prev.find((p) => p.id === c.id))
      .forEach((c) => changedProcessos.add(c.processoId))

    changedProcessos.forEach((processoId) => {
      const resultado = reavaliarCaso(processoId, chamados)
      if (resultado.acao === 'enviar_servicenow') {
        const protocolo = `SN-AUTO-${Date.now().toString().slice(-6)}`
        casesDispatch({ type: 'ENVIAR_SERVICENOW_AUTOMATICO', id: processoId, protocolo })
      } else if (resultado.acao === 'escalar_gestor') {
        casesDispatch({ type: 'MARCAR_PENDENTE_GESTOR', id: processoId, motivo: resultado.motivo })
      }
    })

    prevRef.current = chamados
  }, [chamados, casesDispatch])

  function getChamado(id: string) {
    return chamados.find((c) => c.id === id)
  }

  function getChamadosDoCaso(processoId: string) {
    return chamados.filter((c) => c.processoId === processoId)
  }

  return (
    <ChamadosContext.Provider value={{ chamados, dispatch, getChamado, getChamadosDoCaso }}>
      {children}
    </ChamadosContext.Provider>
  )
}

export function useChamados() {
  const ctx = useContext(ChamadosContext)
  if (!ctx) throw new Error('useChamados must be used inside ChamadosProvider')
  return ctx
}
