'use client'

import { useState } from 'react'
import Modal from '@/components/ui/Modal'

type Acao = 'nota' | 'gestor' | 'pausa' | null

interface AcoesRapidasProps {
  processoNumero: string
}

export default function AcoesRapidas({ processoNumero }: AcoesRapidasProps) {
  const [modalAberto, setModalAberto] = useState<Acao>(null)
  const [nota, setNota] = useState('')
  const [motivoPausa, setMotivoPausa] = useState('')
  const [toast, setToast] = useState<string | null>(null)

  function fecharModal() {
    setModalAberto(null)
    setNota('')
    setMotivoPausa('')
  }

  function mostrarToast(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(null), 3000)
  }

  function confirmar() {
    // TODO: implementar persistência real dessas ações
    const acao = modalAberto
    fecharModal()
    if (acao === 'nota') mostrarToast('Nota interna registrada com sucesso.')
    else if (acao === 'gestor') mostrarToast('Gestor sinalizado sobre o bloqueio.')
    else if (acao === 'pausa') mostrarToast('Caso pausado com sucesso.')
  }

  return (
    <>
      <div className="flex flex-wrap gap-2 mb-5">
        <button
          onClick={() => setModalAberto('nota')}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-brand-slate border border-gray-200 rounded-lg hover:bg-gray-50 hover:text-brand-dark transition-colors"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          Adicionar nota
        </button>

        <button
          onClick={() => setModalAberto('gestor')}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-brand-slate border border-gray-200 rounded-lg hover:bg-gray-50 hover:text-brand-dark transition-colors"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          Sinalizar gestor
        </button>

        <button
          onClick={() => setModalAberto('pausa')}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-brand-slate border border-gray-200 rounded-lg hover:bg-gray-50 hover:text-brand-dark transition-colors"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Pausar caso
        </button>
      </div>

      {/* Modal: Adicionar nota */}
      <Modal isOpen={modalAberto === 'nota'} onClose={fecharModal} title="Adicionar nota interna">
        <p className="text-xs text-brand-slate font-light mb-3">
          A nota será registrada no histórico do caso ({processoNumero}) e visível apenas para a equipe interna.
        </p>
        <textarea
          value={nota}
          onChange={(e) => setNota(e.target.value)}
          placeholder="Descreva a nota..."
          rows={4}
          className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 text-brand-dark placeholder:text-brand-slate/40 focus:outline-none focus:ring-2 focus:ring-brand-mid/30 resize-none"
        />
        <div className="flex gap-3 mt-4">
          <button
            onClick={fecharModal}
            className="flex-1 px-4 py-2 text-sm font-semibold text-brand-slate border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={confirmar}
            className="flex-1 px-4 py-2 text-sm font-semibold text-white bg-brand-dark rounded-lg hover:bg-brand-hover transition-colors"
          >
            Confirmar
          </button>
        </div>
      </Modal>

      {/* Modal: Sinalizar gestor */}
      <Modal isOpen={modalAberto === 'gestor'} onClose={fecharModal} title="Sinalizar bloqueio ao gestor">
        <p className="text-xs text-brand-slate font-light mb-3">
          Informe o motivo do bloqueio para que o gestor possa intervir no caso {processoNumero}.
        </p>
        <div className="flex flex-col gap-3">
          <div>
            <label className="text-xs font-semibold text-brand-slate mb-1 block">Tipo de bloqueio</label>
            <select className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 text-brand-dark focus:outline-none focus:ring-2 focus:ring-brand-mid/30 bg-white">
              <option>Documento não localizado</option>
              <option>Prazo em risco</option>
              <option>Informação contraditória</option>
              <option>Aguardando resposta de terceiro</option>
              <option>Outro</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-brand-slate mb-1 block">Observação</label>
            <textarea
              placeholder="Descreva o bloqueio em detalhes..."
              rows={3}
              className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 text-brand-dark placeholder:text-brand-slate/40 focus:outline-none focus:ring-2 focus:ring-brand-mid/30 resize-none"
            />
          </div>
        </div>
        <div className="flex gap-3 mt-4">
          <button
            onClick={fecharModal}
            className="flex-1 px-4 py-2 text-sm font-semibold text-brand-slate border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={confirmar}
            className="flex-1 px-4 py-2 text-sm font-semibold text-white bg-brand-dark rounded-lg hover:bg-brand-hover transition-colors"
          >
            Confirmar
          </button>
        </div>
      </Modal>

      {/* Modal: Pausar caso */}
      <Modal isOpen={modalAberto === 'pausa'} onClose={fecharModal} title="Pausar caso">
        <p className="text-xs text-brand-slate font-light mb-3">
          O caso {processoNumero} ficará suspenso até reativação manual pelo analista ou gestor.
        </p>
        <div className="flex flex-col gap-3">
          <div>
            <label className="text-xs font-semibold text-brand-slate mb-1 block">Motivo da pausa</label>
            <select className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 text-brand-dark focus:outline-none focus:ring-2 focus:ring-brand-mid/30 bg-white">
              <option>Aguardando documento externo</option>
              <option>Aguardando decisão judicial</option>
              <option>Solicitação do cliente</option>
              <option>Revisão interna pendente</option>
              <option>Outro</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-brand-slate mb-1 block">Observação</label>
            <textarea
              value={motivoPausa}
              onChange={(e) => setMotivoPausa(e.target.value)}
              placeholder="Detalhes adicionais..."
              rows={3}
              className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 text-brand-dark placeholder:text-brand-slate/40 focus:outline-none focus:ring-2 focus:ring-brand-mid/30 resize-none"
            />
          </div>
        </div>
        <div className="flex gap-3 mt-4">
          <button
            onClick={fecharModal}
            className="flex-1 px-4 py-2 text-sm font-semibold text-brand-slate border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={confirmar}
            className="flex-1 px-4 py-2 text-sm font-semibold text-white bg-brand-dark rounded-lg hover:bg-brand-hover transition-colors"
          >
            Confirmar
          </button>
        </div>
      </Modal>

      {/* Toast de sucesso */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-brand-dark text-white text-sm font-semibold px-5 py-3 rounded-xl shadow-lg">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-green-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
            {toast}
          </div>
        </div>
      )}
    </>
  )
}
