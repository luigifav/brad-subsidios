'use client'

import { useMemo } from 'react'
import { Processo, Analise, formatDate } from '@/lib/mock-data'

interface TimelineEvent {
  type:
    | 'criacao'
    | 'distribuicao'
    | 'inicio'
    | 'automacao'
    | 'campo'
    | 'servicenow'
    | 'alerta'
  title: string
  description: string
  timestamp: string
}

const EVENT_COLORS: Record<TimelineEvent['type'], string> = {
  criacao: 'bg-gray-400',
  distribuicao: 'bg-blue-500',
  inicio: 'bg-yellow-500',
  automacao: 'bg-brand-mid',
  campo: 'bg-brand-slate',
  servicenow: 'bg-green-600',
  alerta: 'bg-red-500',
}

function addDays(isoDate: string, days: number): string {
  const d = new Date(isoDate)
  d.setDate(d.getDate() + days)
  return d.toISOString().slice(0, 10)
}

interface Props {
  processo: Processo
  analise: Analise
  docsComplete: boolean
  isOpen: boolean
  onClose: () => void
}

export default function Timeline({ processo, analise, docsComplete, isOpen, onClose }: Props) {
  const events = useMemo<TimelineEvent[]>(() => {
    const list: TimelineEvent[] = []

    list.push({
      type: 'criacao',
      title: 'Caso criado no estoque',
      description: 'Recebido via integração com sistema judiciário',
      timestamp: formatDate(processo.dataEntrada),
    })

    if (processo.analistaResponsavel) {
      const distDate = addDays(processo.dataEntrada, 1)
      list.push({
        type: 'distribuicao',
        title: 'Caso distribuído',
        description: `Atribuído a ${processo.analistaResponsavel} por Maria Silva (Gestora)`,
        timestamp: formatDate(distDate),
      })

      if (
        processo.status === 'Em tratativa' ||
        processo.status === 'Enviado ao ServiceNow' ||
        processo.status === 'Concluído'
      ) {
        list.push({
          type: 'inicio',
          title: 'Tratativa iniciada',
          description: `${processo.analistaResponsavel} abriu o formulário`,
          timestamp: `${formatDate(distDate)}, +4h`,
        })
      }
    }

    if (docsComplete) {
      list.push({
        type: 'automacao',
        title: 'Automação de documentos executada',
        description: '6 documentos solicitados, 4 encontrados, 2 indisponíveis',
        timestamp: 'há 12 minutos',
      })
    }

    if (analise.tipoRisco) {
      list.push({
        type: 'campo',
        title: 'Análise de risco preenchida',
        description: `Tipo de risco definido como ${analise.tipoRisco}`,
        timestamp: 'há 8 minutos',
      })
    }

    if (analise.valorRecomendado) {
      list.push({
        type: 'campo',
        title: 'Valor do subsídio definido',
        description: `Valor recomendado: R$ ${analise.valorRecomendado}`,
        timestamp: 'há 5 minutos',
      })
    }

    if (analise.estrategia) {
      list.push({
        type: 'campo',
        title: 'Estratégia definida',
        description: analise.estrategia,
        timestamp: 'há 2 minutos',
      })
    }

    if (processo.status === 'Enviado ao ServiceNow' && processo.protocoloServiceNow) {
      list.push({
        type: 'servicenow',
        title: 'Enviado ao ServiceNow',
        description: `Protocolo ${processo.protocoloServiceNow} gerado`,
        timestamp: 'há alguns instantes',
      })
    }

    return list
  }, [processo, analise, docsComplete])

  return (
    <>
      {/* Aba lateral visível quando fechado */}
      {!isOpen && (
        <button
          onClick={() => onClose()}
          aria-label="Abrir timeline"
          className="fixed right-0 top-1/2 -translate-y-1/2 z-40 flex flex-col items-center justify-center gap-2 w-10 h-28 bg-white border border-gray-200 border-r-0 rounded-l-md shadow-sm hover:bg-brand-offwhite transition-colors cursor-pointer"
          style={{ writingMode: 'vertical-rl' }}
        >
          <svg
            className="w-4 h-4 text-brand-slate mb-1 rotate-90"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span className="text-xs font-semibold text-brand-slate tracking-wide">Timeline</span>
        </button>
      )}

      {/* Painel lateral */}
      {isOpen && (
        <div
          className="fixed right-0 top-16 bottom-0 z-40 w-80 bg-white border-l border-gray-200 flex flex-col"
          style={{ width: '320px' }}
        >
          {/* Header */}
          <div className="flex items-start justify-between p-5 border-b border-gray-100">
            <div>
              <h2 className="text-sm font-semibold text-brand-dark">Timeline do caso</h2>
              <p className="text-xs text-brand-slate font-light mt-0.5">{processo.numero}</p>
            </div>
            <button
              onClick={onClose}
              aria-label="Fechar timeline"
              className="text-brand-slate hover:text-brand-dark transition-colors mt-0.5"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Eventos */}
          <div className="flex-1 overflow-y-auto p-5">
            <div className="relative">
              {/* Eixo vertical */}
              <div className="absolute left-[5px] top-0 bottom-0 w-px border-l-2 border-gray-100" />

              <ul className="space-y-5">
                {events.map((event, i) => (
                  <li key={i} className="relative flex gap-3 pl-5">
                    {/* Bolinha */}
                    <span
                      className={`absolute left-0 top-1 w-3 h-3 rounded-full flex-shrink-0 ${EVENT_COLORS[event.type]}`}
                    />
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-brand-dark leading-snug">{event.title}</p>
                      <p className="text-xs text-brand-slate font-light mt-0.5 leading-snug">{event.description}</p>
                      <p className="text-xs text-brand-slate font-light italic mt-1">{event.timestamp}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
