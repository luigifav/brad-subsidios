'use client'

// TODO: refinar lógica de sugestão automática considerando especialidade por produto

import { useState, useMemo } from 'react'
import Modal from '@/components/ui/Modal'
import { ANALISTAS_REAIS, Tarefa } from '@/lib/tarefas-mock'
import { useTarefas } from '@/context/TarefasContext'

interface DistribuirModalProps {
  isOpen: boolean
  onClose: () => void
  selectedCount: number
  onConfirm: (analista: string) => void
  selectedTarefas?: Tarefa[]
}

export default function DistribuirModal({
  isOpen,
  onClose,
  selectedCount,
  onConfirm,
  selectedTarefas = [],
}: DistribuirModalProps) {
  const { tarefas } = useTarefas()
  const [analista, setAnalista] = useState(ANALISTAS_REAIS[0])
  const [sugestaoAceita, setSugestaoAceita] = useState(false)
  const [mostrarSugestao, setMostrarSugestao] = useState(false)

  const cargaPorAnalista = useMemo(() => {
    const mapa: Record<string, number> = {}
    ANALISTAS_REAIS.forEach((a) => { mapa[a] = 0 })
    tarefas.forEach((t) => {
      if (t.status === 'Em Andamento' && t.analista && mapa[t.analista] !== undefined) {
        mapa[t.analista]++
      }
    })
    return mapa
  }, [tarefas])

  const analistaSugerido = useMemo(() => {
    return ANALISTAS_REAIS.reduce((melhor, atual) =>
      (cargaPorAnalista[atual] ?? 0) < (cargaPorAnalista[melhor] ?? 0) ? atual : melhor
    )
  }, [cargaPorAnalista])

  function handleConfirm() {
    onConfirm(analista)
    setSugestaoAceita(false)
    setMostrarSugestao(false)
    onClose()
  }

  function handleAceitarSugestao() {
    setAnalista(analistaSugerido)
    setSugestaoAceita(true)
    setMostrarSugestao(false)
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Distribuir tarefas">
      <p className="text-sm text-brand-slate font-light mb-4">
        {selectedCount} {selectedCount === 1 ? 'tarefa selecionada será atribuída' : 'tarefas selecionadas serão atribuídas'} ao analista escolhido.
      </p>

      <div className="mb-4">
        <label className="block text-xs font-semibold uppercase tracking-wide text-brand-slate mb-2">
          Analista responsável
        </label>
        <select
          value={analista}
          onChange={(e) => setAnalista(e.target.value)}
          className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-brand-dark bg-white focus:outline-none focus:ring-2 focus:ring-brand-mid"
        >
          {ANALISTAS_REAIS.map((a) => (
            <option key={a} value={a}>
              {a} ({cargaPorAnalista[a] ?? 0} em andamento)
            </option>
          ))}
        </select>
      </div>

      {!mostrarSugestao && !sugestaoAceita && (
        <button
          onClick={() => setMostrarSugestao(true)}
          className="w-full mb-4 px-3 py-2 text-sm font-semibold text-brand-mid border border-brand-mid/30 rounded-lg hover:bg-brand-mid/5 transition-colors flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          Distribuição automática sugerida
        </button>
      )}

      {mostrarSugestao && (
        <div className="mb-4 p-3 bg-brand-offwhite rounded-lg border border-gray-200">
          <p className="text-sm text-brand-dark mb-3">
            Sugerimos atribuir a <span className="font-semibold">{analistaSugerido}</span>{' '}
            (carga atual: {cargaPorAnalista[analistaSugerido] ?? 0} tarefas).
          </p>
          <div className="flex gap-2">
            <button
              onClick={handleAceitarSugestao}
              className="px-3 py-1.5 text-xs font-semibold text-white bg-brand-dark rounded-lg hover:bg-brand-hover transition-colors"
            >
              Aceitar
            </button>
            <button
              onClick={() => setMostrarSugestao(false)}
              className="px-3 py-1.5 text-xs font-semibold text-brand-slate border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Escolher outro
            </button>
          </div>
        </div>
      )}

      {sugestaoAceita && (
        <p className="text-xs text-emerald-600 font-semibold mb-4">
          Sugestão aceita: {analista}
        </p>
      )}

      <div className="flex gap-3 justify-end">
        <button
          onClick={onClose}
          className="px-4 py-2 text-sm font-semibold text-brand-slate border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Cancelar
        </button>
        <button
          onClick={handleConfirm}
          className="px-4 py-2 text-sm font-semibold text-white bg-brand-dark rounded-lg hover:bg-brand-hover transition-colors"
        >
          Confirmar distribuição
        </button>
      </div>
    </Modal>
  )
}
