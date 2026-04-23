'use client'

import { use, useState } from 'react'
import Link from 'next/link'
import { useChamados } from '@/context/ChamadosContext'
import { useCases } from '@/context/CasesContext'
import SLABadge from '@/components/chamados/SLABadge'
import StatusChamadoBadge from '@/components/chamados/StatusChamadoBadge'
import Modal from '@/components/ui/Modal'
import PersonaGuard from '@/components/PersonaGuard'

interface PageProps {
  params: Promise<{ id: string }>
}

function formatData(iso: string): string {
  return new Date(iso).toLocaleString('pt-BR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

function formatDecorrido(dataAbertura: string): string {
  const ms = Date.now() - new Date(dataAbertura).getTime()
  const h = Math.floor(ms / 3600000)
  const min = Math.floor((ms % 3600000) / 60000)
  if (h === 0) return `${min}min`
  if (min === 0) return `${h}h`
  return `${h}h ${min}min`
}

export default function ChamadoDetailPage({ params }: PageProps) {
  const { id } = use(params)
  const { getChamado, dispatch } = useChamados()
  const { cases } = useCases()
  const [motivoModal, setMotivoModal] = useState(false)
  const [motivo, setMotivo] = useState('')

  const chamado = getChamado(id)

  if (!chamado) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] gap-3">
        <p className="text-brand-slate font-light">Chamado não encontrado.</p>
        <Link href="/chamados" className="text-sm font-semibold text-brand-mid hover:underline">
          Voltar aos chamados
        </Link>
      </div>
    )
  }

  const processo = cases.find((p) => p.id === chamado.processoId)

  const deadline = new Date(chamado.dataAbertura).getTime() + chamado.slaHoras * 3600000
  const elapsed = Date.now() - new Date(chamado.dataAbertura).getTime()
  const progresso = Math.min(1, elapsed / (chamado.slaHoras * 3600000))
  const progressoPercent = Math.round(progresso * 100)

  const progressoCor =
    progresso < 0.5
      ? 'bg-green-500'
      : progresso < 0.85
        ? 'bg-yellow-500'
        : 'bg-red-500'

  function handleResponderComDoc() {
    dispatch({ type: 'RESPONDER_COM_DOC', id: chamado!.id })
  }

  function handleResponderSemDoc() {
    if (!motivo.trim()) return
    dispatch({ type: 'RESPONDER_SEM_DOC', id: chamado!.id, motivoAusencia: motivo.trim() })
    setMotivoModal(false)
    setMotivo('')
  }

  function handleEstourarSLA() {
    dispatch({ type: 'ESTOURAR_SLA', id: chamado!.id })
  }

  const timeline = [
    {
      label: 'Chamado aberto pela automação',
      ts: chamado.dataAbertura,
      icon: 'raio',
      done: true,
    },
    {
      label: `Encaminhado para ${chamado.area}`,
      ts: chamado.dataAbertura,
      icon: 'seta',
      done: true,
    },
    {
      label: 'Aguardando resposta',
      ts: chamado.dataAbertura,
      icon: 'relogio',
      done: chamado.status !== 'aberto',
      animado: chamado.status === 'aberto',
    },
    ...(chamado.dataResposta
      ? [{ label: 'Resposta recebida', ts: chamado.dataResposta, icon: 'check', done: true }]
      : []),
    ...(chamado.status === 'sla_estourado'
      ? [{ label: 'SLA estourado', ts: chamado.dataAbertura, icon: 'alerta', done: true, erro: true }]
      : []),
  ]

  return (
    <PersonaGuard permitidas={['gestor']}>
    <div className="max-w-screen-xl mx-auto px-6 py-8">
      <div className="flex items-center gap-2 mb-6 text-sm">
        <Link href="/chamados" className="text-brand-mid hover:text-brand-dark transition-colors font-semibold">
          Chamados
        </Link>
        <span className="text-brand-slate/40">/</span>
        <span className="font-semibold text-brand-dark">{chamado.numero}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col gap-6">

          {/* Card 1: Resumo */}
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <div className="flex items-start justify-between mb-6">
              <div>
                <p className="font-mono text-lg font-semibold text-brand-dark">{chamado.numero}</p>
                <div className="mt-2">
                  <StatusChamadoBadge status={chamado.status} />
                </div>
              </div>
              <SLABadge slaHoras={chamado.slaHoras} dataAbertura={chamado.dataAbertura} status={chamado.status} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-brand-slate mb-1">Documento solicitado</p>
                <p className="font-semibold text-brand-dark">{chamado.documentoSolicitado}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-brand-slate mb-1">Área destinatária</p>
                <p className="font-semibold text-brand-dark">{chamado.area}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-brand-slate mb-1">Aberto por</p>
                <p className="flex items-center gap-1.5 font-semibold text-brand-dark">
                  <svg className="w-4 h-4 text-brand-mid" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Automação da plataforma
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-brand-slate mb-1">Data de abertura</p>
                <p className="font-semibold text-brand-dark">{formatData(chamado.dataAbertura)}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-brand-slate mb-1">SLA definido</p>
                <p className="font-semibold text-brand-dark">{chamado.slaHoras} horas</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-brand-slate mb-1">Tempo decorrido</p>
                <p className="font-semibold text-brand-dark">{formatDecorrido(chamado.dataAbertura)}</p>
              </div>
              {chamado.motivoAusencia && (
                <div className="md:col-span-2">
                  <p className="text-xs font-semibold uppercase tracking-wide text-brand-slate mb-1">Motivo da ausência</p>
                  <p className="text-brand-dark font-light">{chamado.motivoAusencia}</p>
                </div>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between text-xs text-brand-slate mb-1">
                <span>Progresso do SLA</span>
                <span>{progressoPercent}%</span>
              </div>
              <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${progressoCor}`}
                  style={{ width: `${progressoPercent}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-brand-slate font-light mt-1">
                <span>{formatData(chamado.dataAbertura)}</span>
                <span>{formatData(new Date(deadline).toISOString())}</span>
              </div>
            </div>
          </div>

          {/* Card 2: Processo vinculado */}
          {processo && (
            <div className="bg-white rounded-xl border border-gray-100 p-6">
              <h3 className="text-base font-semibold text-brand-dark mb-4">Processo vinculado</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-brand-slate mb-1">Número do processo</p>
                  <Link
                    href={`/tratativas/${processo.id}`}
                    className="font-mono text-xs text-brand-mid hover:text-brand-dark transition-colors hover:underline"
                  >
                    {processo.numero}
                  </Link>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-brand-slate mb-1">Tipo de subsídio</p>
                  <p className="text-brand-dark">{processo.tipoSubsidio}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-brand-slate mb-1">Analista responsável</p>
                  <p className="text-brand-dark">{processo.analistaResponsavel ?? '—'}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-brand-slate mb-1">Status do caso</p>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700">
                    {processo.status}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Card 3: Ações de demo */}
          {/* TODO: remover em produção - botões apenas para demonstração */}
          {chamado.status === 'aberto' && (
            <div className="bg-white rounded-xl border border-dashed border-gray-300 p-6">
              <div className="flex items-center gap-2 mb-4">
                <span className="px-2 py-0.5 rounded text-xs font-semibold bg-gray-100 text-gray-500">DEMO</span>
                <h3 className="text-base font-semibold text-brand-dark">Simular resposta</h3>
              </div>
              <p className="text-xs text-brand-slate font-light mb-4">
                Estes botões simulam respostas para fins de demonstração. Em produção, as respostas chegam pela integração com o sistema de chamados do Bradesco.
              </p>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={handleResponderComDoc}
                  className="px-4 py-2 text-sm font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Simular resposta com documento
                </button>
                <button
                  onClick={() => setMotivoModal(true)}
                  className="px-4 py-2 text-sm font-semibold text-white bg-orange-500 rounded-lg hover:bg-orange-600 transition-colors"
                >
                  Simular resposta sem documento
                </button>
                <button
                  onClick={handleEstourarSLA}
                  className="px-4 py-2 text-sm font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
                >
                  Simular estouro de SLA
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Coluna lateral: Timeline */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <h3 className="text-base font-semibold text-brand-dark mb-6">Timeline</h3>
            <ol className="relative border-l border-gray-200 ml-3">
              {timeline.map((item, i) => (
                <li key={i} className="mb-6 ml-6 last:mb-0">
                  <span
                    className={`absolute -left-3 flex items-center justify-center w-6 h-6 rounded-full ring-4 ring-white ${
                      item.erro
                        ? 'bg-red-100 text-red-600'
                        : item.animado
                          ? 'bg-yellow-100 text-yellow-600'
                          : item.done
                            ? 'bg-green-100 text-green-600'
                            : 'bg-gray-100 text-gray-400'
                    }`}
                  >
                    {item.icon === 'raio' && (
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    )}
                    {item.icon === 'seta' && (
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    )}
                    {item.icon === 'relogio' && (
                      <svg className={`w-3 h-3 ${item.animado ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    )}
                    {item.icon === 'check' && (
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                    {item.icon === 'alerta' && (
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    )}
                  </span>
                  <p className={`text-sm font-semibold ${item.erro ? 'text-red-600' : 'text-brand-dark'}`}>
                    {item.label}
                  </p>
                  <time className="text-xs text-brand-slate font-light">{formatData(item.ts)}</time>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>

      <Modal
        isOpen={motivoModal}
        onClose={() => { setMotivoModal(false); setMotivo('') }}
        title="Motivo da ausência do documento"
      >
        <p className="text-sm text-brand-slate font-light mb-3">
          Informe o motivo pelo qual o documento não foi fornecido:
        </p>
        <textarea
          value={motivo}
          onChange={(e) => setMotivo(e.target.value)}
          rows={3}
          placeholder="Ex: Documento não localizado no período indicado..."
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-brand-dark focus:outline-none focus:ring-2 focus:ring-brand-mid resize-none"
        />
        <div className="flex gap-3 mt-4">
          <button
            onClick={handleResponderSemDoc}
            disabled={!motivo.trim()}
            className="flex-1 px-4 py-2 text-sm font-semibold text-white bg-orange-500 rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Confirmar resposta sem documento
          </button>
          <button
            onClick={() => { setMotivoModal(false); setMotivo('') }}
            className="px-4 py-2 text-sm font-semibold text-brand-slate border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
        </div>
      </Modal>
    </div>
    </PersonaGuard>
  )
}
