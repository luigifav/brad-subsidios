'use client'

import { useState } from 'react'
import Modal from '@/components/ui/Modal'
import { ANALISTAS } from '@/lib/mock-data'

interface DistribuirModalProps {
  isOpen: boolean
  onClose: () => void
  selectedCount: number
  onConfirm: (analista: string) => void
}

export default function DistribuirModal({ isOpen, onClose, selectedCount, onConfirm }: DistribuirModalProps) {
  const [analista, setAnalista] = useState(ANALISTAS[0])

  function handleConfirm() {
    onConfirm(analista)
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Distribuir casos">
      <p className="text-sm text-brand-slate font-light mb-4">
        {selectedCount} {selectedCount === 1 ? 'caso selecionado' : 'casos selecionados'} será atribuído ao analista escolhido.
      </p>

      <div className="mb-5">
        <label className="block text-xs font-semibold uppercase tracking-wide text-brand-slate mb-2">
          Analista responsável
        </label>
        <select
          value={analista}
          onChange={(e) => setAnalista(e.target.value)}
          className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-brand-dark bg-white focus:outline-none focus:ring-2 focus:ring-brand-mid"
        >
          {ANALISTAS.map((a) => (
            <option key={a} value={a}>{a}</option>
          ))}
        </select>
      </div>

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
