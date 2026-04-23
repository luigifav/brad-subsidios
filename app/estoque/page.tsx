'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useCases } from '@/context/CasesContext'
import { useAtivaPersona } from '@/context/PersonaContext'
import MetricCard from '@/components/MetricCard'
import StatusBadge from '@/components/StatusBadge'
import DistribuirModal from '@/components/DistribuirModal'
import { formatCurrency, formatDate } from '@/lib/mock-data'

export default function EstoquePage() {
  const { cases, dispatch } = useCases()
  const { persona, config } = useAtivaPersona()
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [showModal, setShowModal] = useState(false)

  const naFila = cases.filter((c) => c.status === 'Na fila')
  const prazoCritico = 7
  const isGestor = persona === 'gestor'

  const subtitulo = isGestor
    ? 'Visão completa da esteira e distribuição de casos'
    : 'Acompanhe os casos distribuídos para você'

  function toggleSelect(id: string) {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )
  }

  function toggleAll() {
    const naFilaIds = naFila.map((c) => c.id)
    if (selectedIds.length === naFilaIds.length) {
      setSelectedIds([])
    } else {
      setSelectedIds(naFilaIds)
    }
  }

  function handleDistribuir(analista: string) {
    dispatch({ type: 'DISTRIBUIR', ids: selectedIds, analista })
    setSelectedIds([])
  }

  return (
    <div className="max-w-screen-xl mx-auto px-6 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-brand-dark">Estoque de Processos</h1>
        <p className="text-sm text-brand-slate font-light mt-1">{subtitulo}</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <MetricCard label="Total na fila" value={142} />
        <MetricCard label="Distribuídos hoje" value={18} />
        <MetricCard label="Aguardando distribuição" value={naFila.length} />
        <MetricCard label="Prazo crítico (48h)" value={prazoCritico} highlight />
      </div>

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <span className="text-sm font-semibold text-brand-dark">
            {cases.length} processos
          </span>
          {isGestor && (
            <button
              disabled={selectedIds.length === 0}
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-brand-dark rounded-lg hover:bg-brand-hover transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Distribuir selecionados
              {selectedIds.length > 0 && (
                <span className="bg-white/20 rounded-full px-1.5 py-0.5 text-xs">{selectedIds.length}</span>
              )}
            </button>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-brand-offwhite border-b border-gray-100">
                {isGestor && (
                  <th className="px-4 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedIds.length === naFila.length && naFila.length > 0}
                      onChange={toggleAll}
                      className="rounded border-gray-300 text-brand-mid focus:ring-brand-mid"
                    />
                  </th>
                )}
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-brand-slate">Nº do Processo</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-brand-slate">Vara / Comarca</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-brand-slate">Tipo de Subsídio</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-brand-slate">Valor Estimado</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-brand-slate">Data de Entrada</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-brand-slate">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-brand-slate">Analista</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {cases.map((processo) => {
                const isSelectable = processo.status === 'Na fila'
                const isSelected = selectedIds.includes(processo.id)
                const isMeu = processo.analistaResponsavel === config.nome
                const rowOpacity = !isGestor && processo.analistaResponsavel && !isMeu ? 'opacity-40' : ''

                return (
                  <tr
                    key={processo.id}
                    className={`hover:bg-gray-50 transition-colors ${isSelected ? 'bg-brand-offwhite' : ''} ${rowOpacity}`}
                  >
                    {isGestor && (
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          disabled={!isSelectable}
                          checked={isSelected}
                          onChange={() => toggleSelect(processo.id)}
                          className="rounded border-gray-300 text-brand-mid focus:ring-brand-mid disabled:opacity-30"
                        />
                      </td>
                    )}
                    <td className="px-4 py-3">
                      {(processo.status === 'Em tratativa' || processo.status === 'Distribuído') &&
                       processo.analistaResponsavel === config.nome ? (
                        <Link
                          href={`/tratativas/${processo.id}`}
                          className="font-semibold text-brand-mid hover:text-brand-dark transition-colors"
                        >
                          {processo.numero}
                        </Link>
                      ) : (
                        <span className="font-semibold text-brand-dark">{processo.numero}</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-brand-slate font-light">
                      {processo.vara}<br />
                      <span className="text-xs">{processo.comarca}</span>
                    </td>
                    <td className="px-4 py-3 text-brand-dark font-light">{processo.tipoSubsidio}</td>
                    <td className="px-4 py-3 font-semibold text-brand-dark">{formatCurrency(processo.valorCausa)}</td>
                    <td className="px-4 py-3 text-brand-slate font-light">{formatDate(processo.dataEntrada)}</td>
                    <td className="px-4 py-3">
                      <StatusBadge label={processo.status} variant="status" />
                    </td>
                    <td className="px-4 py-3 text-brand-slate font-light text-xs">
                      {processo.analistaResponsavel ?? '—'}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      <DistribuirModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        selectedCount={selectedIds.length}
        onConfirm={handleDistribuir}
      />
    </div>
  )
}
