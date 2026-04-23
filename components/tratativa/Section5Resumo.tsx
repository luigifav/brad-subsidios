'use client'

// TODO: substituir mock por chamada real à API do ServiceNow

import { useState } from 'react'
import { Analise, Processo, formatCurrency, formatDate, maskCPF } from '@/lib/mock-data'
import Modal from '@/components/ui/Modal'
import StatusBadge from '@/components/StatusBadge'

interface Section5Props {
  processo: Processo
  analise: Analise
  docsComplete: boolean
  onEnviado: (protocolo: string) => void
}

interface FichaItemProps {
  label: string
  value: string | undefined
  required?: boolean
}

function FichaItem({ label, value, required = true }: FichaItemProps) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs font-semibold uppercase tracking-wide text-brand-slate">{label}</span>
      {value ? (
        <span className="text-sm font-semibold text-brand-dark">{value}</span>
      ) : required ? (
        <span className="flex items-center gap-1 text-xs text-orange-500 font-semibold">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Campo não preenchido
        </span>
      ) : (
        <span className="text-xs text-brand-slate font-light italic">Não informado</span>
      )}
    </div>
  )
}

function FichaGrupo({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-5">
      <h4 className="text-xs font-semibold uppercase tracking-widest text-brand-mid mb-3 pb-1.5 border-b border-brand-mid/20">
        {title}
      </h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {children}
      </div>
    </div>
  )
}

export default function Section5Resumo({ processo, analise, docsComplete, onEnviado }: Section5Props) {
  const [showConfirm, setShowConfirm] = useState(false)
  const [sending, setSending] = useState(false)
  const [success, setSuccess] = useState(false)
  const [protocolo, setProtocolo] = useState('')

  const camposObrigatorios = [
    analise.tipoRisco,
    analise.probabilidade,
    analise.valorRecomendado,
    analise.fundamento,
    analise.estrategia,
  ]
  const camposFaltando = camposObrigatorios.filter((v) => !v).length
  const podeEnviar = camposFaltando === 0 && docsComplete

  function handleConfirmar() {
    setShowConfirm(false)
    setSending(true)
    setTimeout(() => {
      const proto = `SN-2026-${String(Math.floor(Math.random() * 90000) + 10000)}`
      setSending(false)
      setSuccess(true)
      setProtocolo(proto)
      onEnviado(proto)
    }, 2000)
  }

  if (success) {
    return (
      <div className="bg-white rounded-xl border border-gray-100 p-10 mb-4 flex flex-col items-center text-center">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-brand-dark mb-2">Dados transmitidos com sucesso</h3>
        <p className="text-sm text-brand-slate font-light mb-5">
          O ServiceNow iniciará a geração do laudo/parecer em breve.
        </p>
        <div className="bg-brand-offwhite border border-brand-mid/30 rounded-lg px-6 py-3 mb-6">
          <span className="text-xs font-semibold text-brand-slate uppercase tracking-wide">Protocolo ServiceNow</span>
          <p className="text-lg font-semibold text-brand-mid font-mono mt-1">{protocolo}</p>
        </div>
        {/* TODO: integrar com webhook do ServiceNow para atualização automática de status */}
        <div className="flex gap-3">
          <a
            href="/tratativas"
            className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-brand-dark rounded-lg hover:bg-brand-hover transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Voltar às Tratativas
          </a>
          <a
            href={`/acompanhamento/${processo.id}`}
            className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-brand-mid border border-brand-mid rounded-lg hover:bg-brand-mid/5 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            Acompanhar no pós-envio
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6 mb-4">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-base font-semibold text-brand-dark">5. Resumo para o ServiceNow</h2>
        {camposFaltando > 0 && (
          <span className="flex items-center gap-1.5 text-xs font-semibold text-orange-500">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {camposFaltando} {camposFaltando === 1 ? 'campo obrigatório faltando' : 'campos obrigatórios faltando'}
          </span>
        )}
      </div>

      <div className="bg-brand-offwhite rounded-xl p-5 border border-gray-200 mb-5">
        <p className="text-xs text-brand-slate font-light italic mb-4">
          Este é o payload que será transmitido ao ServiceNow para geração do laudo/parecer.
        </p>

        <FichaGrupo title="Identificação do Processo">
          <FichaItem label="Número" value={processo.numero} />
          <FichaItem label="Tribunal" value={processo.tribunal} />
          <FichaItem label="Vara / Comarca" value={`${processo.vara} — ${processo.comarca}`} />
          <FichaItem label="Tipo de Ação" value={processo.tipoAcao} />
          <FichaItem label="Fase Processual" value={processo.faseProcessual} />
          <FichaItem label="Valor da Causa" value={formatCurrency(processo.valorCausa)} />
          <FichaItem label="Produto" value={processo.produto} />
          <FichaItem label="Tipo de Subsídio" value={processo.tipoSubsidio} />
        </FichaGrupo>

        <FichaGrupo title="Partes Envolvidas">
          <FichaItem label="Autor" value={processo.nomeAutor} />
          <FichaItem label="CPF do Autor" value={maskCPF(processo.cpfAutor)} />
          <FichaItem label="Advogado do Autor" value={`${processo.advogadoAutor} — ${processo.oabAdvogadoAutor}`} />
          <FichaItem label="Réu" value="Banco Bradesco S.A." />
        </FichaGrupo>

        <FichaGrupo title="Análise do Subsídio">
          <div className="flex flex-col gap-0.5">
            <span className="text-xs font-semibold uppercase tracking-wide text-brand-slate">Tipo de Risco</span>
            {analise.tipoRisco ? (
              <StatusBadge label={analise.tipoRisco} variant="risco" />
            ) : (
              <span className="flex items-center gap-1 text-xs text-orange-500 font-semibold">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Campo não preenchido
              </span>
            )}
          </div>
          <FichaItem label="Probabilidade de Êxito" value={analise.probabilidade} />
          <FichaItem label="Valor do Subsídio Recomendado" value={analise.valorRecomendado ? `R$ ${analise.valorRecomendado}` : undefined} />
          <FichaItem label="Estratégia Recomendada" value={analise.estrategia} />
          <div className="flex flex-col gap-0.5 md:col-span-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-brand-slate">Fundamento do Subsídio</span>
            {analise.fundamento ? (
              <span className="text-sm text-brand-dark font-light">{analise.fundamento}</span>
            ) : (
              <span className="flex items-center gap-1 text-xs text-orange-500 font-semibold">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Campo não preenchido
              </span>
            )}
          </div>
          <FichaItem label="Precedentes Relevantes" value={analise.precedentes} required={false} />
        </FichaGrupo>

        <div className="mt-2 px-3 py-2 bg-gray-100 rounded-lg text-xs text-brand-slate font-light italic">
          * As observações internas não são incluídas neste payload.
        </div>
      </div>

      <button
        onClick={() => setShowConfirm(true)}
        disabled={!podeEnviar || sending}
        title={!podeEnviar ? 'Preencha todos os campos obrigatórios e execute as automações de documentos para continuar' : undefined}
        className="w-full flex items-center justify-center gap-3 h-12 rounded-lg text-sm font-semibold text-white bg-brand-dark hover:bg-brand-hover transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {sending ? (
          <>
            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Transmitindo dados para o ServiceNow...
          </>
        ) : (
          <>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
            Enviar para o ServiceNow
          </>
        )}
      </button>

      <Modal
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        title="Confirmar envio para o ServiceNow"
      >
        <p className="text-sm text-brand-slate font-light mb-5">
          Após o envio, o ServiceNow iniciará a geração do laudo/parecer para o Bradesco. Esta ação não pode ser desfeita.
        </p>
        <div className="flex gap-3">
          <button
            onClick={() => setShowConfirm(false)}
            className="flex-1 px-4 py-2 text-sm font-semibold text-brand-slate border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirmar}
            className="flex-1 px-4 py-2 text-sm font-semibold text-white bg-brand-dark rounded-lg hover:bg-brand-hover transition-colors"
          >
            Confirmar envio
          </button>
        </div>
      </Modal>
    </div>
  )
}
