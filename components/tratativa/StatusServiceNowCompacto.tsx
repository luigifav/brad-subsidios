'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Processo, StatusServiceNow, formatCurrency } from '@/lib/mock-data'
import Modal from '@/components/ui/Modal'

const STATUS_LABELS: Record<StatusServiceNow, { label: string; color: string }> = {
  aguardando: { label: 'Aguardando processamento', color: 'bg-gray-100 text-gray-600' },
  em_geracao: { label: 'Laudo em geração', color: 'bg-yellow-100 text-yellow-700' },
  laudo_gerado: { label: 'Laudo gerado', color: 'bg-blue-100 text-blue-700' },
  entregue: { label: 'Entregue ao Bradesco', color: 'bg-green-100 text-green-700' },
  pendencia: { label: 'Retornado com pendência', color: 'bg-orange-100 text-orange-700' },
}

function tempoDesdeEnvio(timestampEnvio: string): string {
  const ms = Date.now() - new Date(timestampEnvio).getTime()
  const min = Math.floor(ms / 60000)
  const h = Math.floor(min / 60)
  const d = Math.floor(h / 24)
  if (d > 0) return `há ${d} dia${d > 1 ? 's' : ''}`
  if (h > 0) return `há ${h}h`
  if (min > 0) return `há ${min}min`
  return 'há instantes'
}

function gerarTimestampRelativo(base: string, offsetMinutos: number): string {
  const d = new Date(new Date(base).getTime() + offsetMinutos * 60 * 1000)
  return d
    .toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })
    .replace(',', ' às')
}

interface StatusServiceNowCompactoProps {
  processo: Processo
}

export default function StatusServiceNowCompacto({ processo }: StatusServiceNowCompactoProps) {
  const [showModal, setShowModal] = useState(false)

  if (processo.status !== 'Enviado ao ServiceNow' && processo.status !== 'Concluído') {
    return null
  }

  const status = processo.statusServiceNow ?? 'aguardando'
  const proto = processo.protocoloServiceNow ?? ''
  const tsBase = processo.timestampEnvio ?? new Date().toISOString()
  const badge = STATUS_LABELS[status]

  const etapas = [
    {
      done: true,
      active: false,
      label: 'Payload',
    },
    {
      done: ['laudo_gerado', 'entregue', 'pendencia'].includes(status),
      active: status === 'em_geracao',
      label: 'Geração',
    },
    {
      done: ['laudo_gerado', 'entregue'].includes(status),
      active: false,
      label: 'Laudo',
    },
    {
      done: status === 'entregue',
      active: false,
      label: 'Entrega',
    },
  ]

  return (
    <>
      <div>
        <h3 className="text-sm font-semibold text-brand-dark mb-3">Status no ServiceNow</h3>

        <div className="flex items-center justify-between gap-2 mb-1">
          <span className="text-sm font-mono text-brand-mid truncate">{proto}</span>
          {badge && (
            <span className={`px-2 py-0.5 rounded-full text-xs font-semibold shrink-0 ${badge.color}`}>
              {badge.label}
            </span>
          )}
        </div>

        <p className="text-xs text-brand-slate font-light mb-3">
          Enviado {tempoDesdeEnvio(tsBase)}
        </p>

        {/* Mini timeline horizontal com 4 pontos */}
        <div className="flex items-start mb-3">
          {etapas.map((e, idx) => (
            <div key={idx} className="flex items-start flex-1 min-w-0">
              <div className="flex flex-col items-center flex-1 min-w-0">
                <div
                  className={`w-3 h-3 rounded-full shrink-0 ${
                    e.done
                      ? 'bg-green-500'
                      : e.active
                      ? 'bg-yellow-400 animate-pulse'
                      : 'bg-gray-200'
                  }`}
                />
                <span className="text-[10px] text-brand-slate/60 font-light mt-0.5 text-center leading-tight">
                  {e.label}
                </span>
              </div>
              {idx < etapas.length - 1 && (
                <div
                  className={`h-px flex-1 mt-1.5 mx-0.5 ${e.done ? 'bg-green-400' : 'bg-gray-200'}`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Laudo disponível quando entregue */}
        {status === 'entregue' && (
          <div className="flex items-center gap-2 mb-3 p-2 bg-green-50 border border-green-100 rounded-lg">
            <svg className="w-4 h-4 text-red-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-brand-dark">Laudo disponível</p>
              <button
                onClick={() => setShowModal(true)}
                className="text-xs font-semibold text-brand-mid hover:underline"
              >
                Visualizar laudo
              </button>
            </div>
          </div>
        )}

        <Link
          href={`/acompanhamento/${processo.id}`}
          className="text-xs font-semibold text-brand-mid hover:underline"
        >
          Ver detalhes do acompanhamento →
        </Link>
      </div>

      {/* Modal do laudo */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={`Laudo_${proto}.pdf`}
        maxWidth="max-w-3xl"
      >
        <div className="bg-brand-offwhite rounded-lg p-8 text-sm font-light text-brand-dark leading-relaxed space-y-6 max-h-[60vh] overflow-y-auto">
          <div className="text-center border-b border-gray-200 pb-6">
            <p className="text-base font-semibold uppercase tracking-widest text-brand-dark">
              Laudo Técnico de Subsídio
            </p>
            <p className="text-xs text-brand-slate mt-2">Protocolo: {proto}</p>
            <p className="text-xs text-brand-slate">Processo: {processo.numero}</p>
            <p className="text-xs text-brand-slate">
              Gerado em: {gerarTimestampRelativo(tsBase, 90)}
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-brand-mid mb-3">
              1. Identificação do Processo
            </p>
            <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-xs">
              <div><span className="font-semibold">Número:</span> {processo.numero}</div>
              <div><span className="font-semibold">Tribunal:</span> {processo.tribunal}</div>
              <div><span className="font-semibold">Vara:</span> {processo.vara}</div>
              <div><span className="font-semibold">Comarca:</span> {processo.comarca}</div>
              <div><span className="font-semibold">Valor da Causa:</span> {formatCurrency(processo.valorCausa)}</div>
              <div><span className="font-semibold">Tipo de Subsídio:</span> {processo.tipoSubsidio}</div>
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-brand-mid mb-3">
              2. Análise Técnica
            </p>
            <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-xs">
              <div><span className="font-semibold">Tipo de Risco:</span> {processo.analise?.tipoRisco ?? 'Não informado'}</div>
              <div><span className="font-semibold">Probabilidade:</span> {processo.analise?.probabilidade ?? 'Não informado'}</div>
              <div><span className="font-semibold">Estratégia:</span> {processo.analise?.estrategia ?? 'Não informada'}</div>
              <div><span className="font-semibold">Valor do subsídio:</span> {processo.analise?.valorRecomendado ? `R$ ${processo.analise.valorRecomendado}` : 'Não informado'}</div>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-4 text-center">
            <p className="text-xs text-brand-slate/60 italic">
              Documento gerado automaticamente pelo ServiceNow — SBK Legal Ops
            </p>
          </div>
        </div>

        <div className="mt-4 flex justify-end">
          <button
            onClick={() => setShowModal(false)}
            className="px-5 py-2.5 text-sm font-semibold text-brand-slate border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Fechar
          </button>
        </div>
      </Modal>
    </>
  )
}
