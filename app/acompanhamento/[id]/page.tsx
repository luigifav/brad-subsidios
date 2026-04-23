'use client'

// TODO: integrar com webhook do ServiceNow para atualização automática de status
// TODO: implementar download real do laudo gerado

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useCases } from '@/context/CasesContext'
import { ACOMPANHAMENTO_MOCKS } from '@/lib/acompanhamento-mock'
import Modal from '@/components/ui/Modal'
import { formatCurrency, formatDate, StatusServiceNow } from '@/lib/mock-data'

const STATUS_LABELS: Record<StatusServiceNow, { label: string; color: string }> = {
  aguardando: { label: 'Aguardando processamento', color: 'bg-gray-100 text-gray-600' },
  em_geracao: { label: 'Laudo em geração', color: 'bg-yellow-100 text-yellow-700' },
  laudo_gerado: { label: 'Laudo gerado - aguardando entrega', color: 'bg-blue-100 text-blue-700' },
  entregue: { label: 'Entregue ao Bradesco', color: 'bg-green-100 text-green-700' },
  pendencia: { label: 'Retornado com pendência', color: 'bg-orange-100 text-orange-700' },
}

function gerarTimestampRelativo(base: string, offsetMinutos: number): string {
  const d = new Date(new Date(base).getTime() + offsetMinutos * 60 * 1000)
  return d.toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }).replace(',', ' às')
}

export default function AcompanhamentoDetalhe() {
  const params = useParams()
  const router = useRouter()
  const { getCase } = useCases()
  const [showModal, setShowModal] = useState(false)

  const caso = getCase(params.id as string) ?? ACOMPANHAMENTO_MOCKS.find((m) => m.id === params.id)

  if (!caso) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col items-center justify-center py-20 text-brand-slate">
        <p className="text-sm font-light">Caso não encontrado.</p>
        <Link href="/acompanhamento" className="mt-4 text-sm font-semibold text-brand-mid hover:underline">
          Voltar ao Acompanhamento
        </Link>
      </div>
    )
  }

  const status = caso.statusServiceNow ?? 'aguardando'
  const tsBase = caso.timestampEnvio ?? new Date().toISOString()
  const proto = caso.protocoloServiceNow ?? ''

  const etapasDone = {
    payload: true,
    geracao: ['laudo_gerado', 'entregue', 'pendencia'].includes(status),
    laudoGerado: ['laudo_gerado', 'entregue'].includes(status),
    entregue: status === 'entregue',
  }

  const etapas = [
    {
      num: 1,
      label: 'Payload recebido',
      done: etapasDone.payload,
      active: false,
      timestamp: gerarTimestampRelativo(tsBase, 0),
    },
    {
      num: 2,
      label: 'Laudo em geração',
      done: etapasDone.geracao,
      active: status === 'em_geracao',
      timestamp: etapasDone.geracao ? gerarTimestampRelativo(tsBase, 15) : undefined,
    },
    {
      num: 3,
      label: 'Laudo gerado',
      done: etapasDone.laudoGerado,
      active: false,
      timestamp: etapasDone.laudoGerado ? gerarTimestampRelativo(tsBase, 90) : undefined,
    },
    {
      num: 4,
      label: 'Entregue ao Bradesco',
      done: etapasDone.entregue,
      active: false,
      timestamp: etapasDone.entregue ? gerarTimestampRelativo(tsBase, 120) : undefined,
    },
  ]

  const eventos: { label: string; done: boolean; timestamp?: string }[] = [
    { label: 'Payload recebido pelo ServiceNow', done: true, timestamp: gerarTimestampRelativo(tsBase, 1) },
    { label: 'Validação estrutural concluída', done: true, timestamp: gerarTimestampRelativo(tsBase, 5) },
    {
      label: 'Geração do laudo iniciada',
      done: ['em_geracao', 'laudo_gerado', 'entregue', 'pendencia'].includes(status),
      timestamp: ['em_geracao', 'laudo_gerado', 'entregue', 'pendencia'].includes(status)
        ? gerarTimestampRelativo(tsBase, 15)
        : undefined,
    },
    {
      label: 'Laudo gerado',
      done: ['laudo_gerado', 'entregue'].includes(status),
      timestamp: ['laudo_gerado', 'entregue'].includes(status)
        ? gerarTimestampRelativo(tsBase, 90)
        : undefined,
    },
    {
      label: 'Entrega ao Bradesco iniciada',
      done: status === 'entregue',
      timestamp: status === 'entregue' ? gerarTimestampRelativo(tsBase, 100) : undefined,
    },
    {
      label: 'Entrega confirmada',
      done: status === 'entregue',
      timestamp: status === 'entregue' ? gerarTimestampRelativo(tsBase, 120) : undefined,
    },
  ]

  const badge = STATUS_LABELS[status]

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="flex items-center gap-3 mb-6">
        <Link
          href="/acompanhamento"
          className="text-sm text-brand-slate hover:text-brand-dark transition-colors font-light"
        >
          Acompanhamento
        </Link>
        <span className="text-brand-slate/40">/</span>
        <span className="text-sm font-semibold text-brand-dark truncate">{caso.numero}</span>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 flex flex-col gap-5">

          {/* Card 1: Resumo do caso */}
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <h2 className="text-base font-semibold text-brand-dark mb-4">Resumo do caso</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wide text-brand-slate">Número do processo</span>
                <p className="text-sm font-semibold text-brand-dark mt-0.5">{caso.numero}</p>
              </div>
              <div>
                <span className="text-xs font-semibold uppercase tracking-wide text-brand-slate">Tipo de subsídio</span>
                <p className="text-sm font-semibold text-brand-dark mt-0.5">{caso.tipoSubsidio}</p>
              </div>
              <div>
                <span className="text-xs font-semibold uppercase tracking-wide text-brand-slate">Valor da causa</span>
                <p className="text-sm font-semibold text-brand-dark mt-0.5">{formatCurrency(caso.valorCausa)}</p>
              </div>
              <div>
                <span className="text-xs font-semibold uppercase tracking-wide text-brand-slate">Analista responsável</span>
                <p className="text-sm font-semibold text-brand-dark mt-0.5">{caso.analistaResponsavel ?? 'Não atribuído'}</p>
              </div>
              <div>
                <span className="text-xs font-semibold uppercase tracking-wide text-brand-slate">Data de envio ao ServiceNow</span>
                <p className="text-sm font-semibold text-brand-dark mt-0.5">
                  {caso.timestampEnvio
                    ? new Date(caso.timestampEnvio).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
                    : formatDate(caso.dataEntrada)}
                </p>
              </div>
              <div>
                <span className="text-xs font-semibold uppercase tracking-wide text-brand-slate">Protocolo ServiceNow</span>
                <p className="text-lg font-semibold text-brand-mid font-mono mt-0.5">{proto}</p>
              </div>
            </div>
          </div>

          {/* Card 2: Status do ServiceNow (timeline horizontal) */}
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-base font-semibold text-brand-dark">Status do ServiceNow</h2>
              {badge && (
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${badge.color}`}>
                  {badge.label}
                </span>
              )}
            </div>

            <div className="flex items-start">
              {etapas.map((etapa, idx) => (
                <div key={etapa.num} className="flex items-start flex-1 min-w-0">
                  <div className="flex flex-col items-center flex-1 min-w-0">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold shrink-0 ${
                      etapa.done
                        ? 'bg-green-500 text-white'
                        : etapa.active
                        ? 'bg-yellow-400 text-white animate-pulse'
                        : 'bg-gray-100 text-gray-400'
                    }`}>
                      {etapa.done ? (
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : etapa.active ? (
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      ) : (
                        etapa.num
                      )}
                    </div>
                    <span className="text-xs text-brand-slate font-light mt-2 text-center px-1">{etapa.label}</span>
                    {etapa.timestamp && (
                      <span className="text-xs text-brand-slate/60 font-light mt-0.5 text-center">{etapa.timestamp}</span>
                    )}
                    {!etapa.timestamp && !etapa.done && !etapa.active && (
                      <span className="text-xs text-brand-slate/40 font-light mt-0.5">Aguardando</span>
                    )}
                  </div>
                  {idx < etapas.length - 1 && (
                    <div className={`h-px flex-1 mt-5 mx-1 ${etapa.done ? 'bg-brand-mid' : 'bg-gray-200'}`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Card 3: Laudo gerado */}
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <h2 className="text-base font-semibold text-brand-dark mb-4">Laudo gerado</h2>

            {(status === 'laudo_gerado' || status === 'entregue') && (
              <div className="flex flex-col items-center gap-4 py-4">
                <div className="w-16 h-16 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center">
                  <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold text-brand-dark">Laudo_{proto}.pdf</p>
                  <p className="text-xs text-brand-slate font-light mt-1">
                    Gerado em {gerarTimestampRelativo(tsBase, 90)}
                  </p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-brand-dark rounded-lg hover:bg-brand-hover transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    Visualizar laudo
                  </button>
                  <button className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-brand-slate border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Baixar PDF
                  </button>
                </div>
              </div>
            )}

            {(status === 'aguardando' || status === 'em_geracao') && (
              <div className="bg-gray-50 border border-gray-100 rounded-xl p-8 flex flex-col items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                  <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <p className="text-sm text-brand-slate font-light text-center">
                  Laudo será disponibilizado após a geração pelo ServiceNow
                </p>
              </div>
            )}

            {status === 'pendencia' && (
              // TODO: notificar analista quando pendência for retornada
              <div className="bg-red-50 border border-red-200 rounded-xl p-5">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                    <svg className="w-4 h-4 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-red-700">Retornado com pendência</p>
                    <p className="text-sm text-red-600 font-light mt-1">
                      {caso.pendenciaDescricao ?? 'Pendência identificada pelo ServiceNow. Revise e reenvie o processo.'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => router.push(`/tratativas/${caso.id}`)}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Corrigir e reenviar
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Coluna lateral: Eventos */}
        <div className="col-span-1">
          <div className="bg-white rounded-xl border border-gray-100 p-6 sticky top-20">
            <h2 className="text-base font-semibold text-brand-dark mb-5">Eventos</h2>
            <div className="flex flex-col gap-0">
              {eventos.map((ev, idx) => (
                <div key={idx} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className={`w-3 h-3 rounded-full shrink-0 mt-0.5 ${ev.done ? 'bg-brand-mid' : 'bg-gray-200'}`} />
                    {idx < eventos.length - 1 && (
                      <div className={`w-px flex-1 min-h-6 mt-1 ${ev.done ? 'bg-brand-mid/30' : 'bg-gray-100'}`} />
                    )}
                  </div>
                  <div className="pb-5 min-w-0">
                    <p className={`text-sm font-semibold leading-tight ${ev.done ? 'text-brand-dark' : 'text-brand-slate/50'}`}>
                      {ev.label}
                    </p>
                    {ev.timestamp ? (
                      <p className="text-xs text-brand-slate/60 font-light mt-0.5">{ev.timestamp}</p>
                    ) : (
                      <p className="text-xs text-brand-slate/40 font-light mt-0.5">Aguardando</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modal de visualização do laudo */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={`Laudo_${proto}.pdf`}
        maxWidth="max-w-3xl"
      >
        <div className="bg-brand-offwhite rounded-lg p-8 text-sm font-light text-brand-dark leading-relaxed space-y-6 max-h-[60vh] overflow-y-auto">
          <div className="text-center border-b border-gray-200 pb-6">
            <p className="text-base font-semibold uppercase tracking-widest text-brand-dark">Laudo Técnico de Subsídio</p>
            <p className="text-xs text-brand-slate mt-2">Protocolo: {proto}</p>
            <p className="text-xs text-brand-slate">Processo: {caso.numero}</p>
            <p className="text-xs text-brand-slate">
              Gerado em: {gerarTimestampRelativo(tsBase, 90)}
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-brand-mid mb-3">1. Identificação do Processo</p>
            <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-xs">
              <div><span className="font-semibold">Número:</span> {caso.numero}</div>
              <div><span className="font-semibold">Tribunal:</span> {caso.tribunal}</div>
              <div><span className="font-semibold">Vara:</span> {caso.vara}</div>
              <div><span className="font-semibold">Comarca:</span> {caso.comarca}</div>
              <div><span className="font-semibold">Fase Processual:</span> {caso.faseProcessual}</div>
              <div><span className="font-semibold">Valor da Causa:</span> {formatCurrency(caso.valorCausa)}</div>
              <div><span className="font-semibold">Tipo de Ação:</span> {caso.tipoAcao}</div>
              <div><span className="font-semibold">Tipo de Subsídio:</span> {caso.tipoSubsidio}</div>
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-brand-mid mb-3">2. Análise Técnica</p>
            <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-xs">
              <div><span className="font-semibold">Tipo de Risco:</span> {caso.analise?.tipoRisco ?? 'Não informado'}</div>
              <div><span className="font-semibold">Probabilidade:</span> {caso.analise?.probabilidade ?? 'Não informado'}</div>
            </div>
            {caso.analise?.fundamento && (
              <p className="text-xs mt-3 text-brand-slate">{caso.analise.fundamento}</p>
            )}
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-brand-mid mb-3">3. Recomendação</p>
            <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-xs">
              <div>
                <span className="font-semibold">Estratégia recomendada:</span>{' '}
                {caso.analise?.estrategia ?? 'Não informada'}
              </div>
              <div>
                <span className="font-semibold">Valor do subsídio:</span>{' '}
                {caso.analise?.valorRecomendado ? `R$ ${caso.analise.valorRecomendado}` : 'Não informado'}
              </div>
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-brand-mid mb-3">4. Fundamentação</p>
            <p className="text-xs text-brand-slate">
              {caso.analise?.fundamento ?? 'Sem fundamentação registrada.'}
            </p>
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
    </div>
  )
}
