'use client'

import { useRouter } from 'next/navigation'
import { useCases } from '@/context/CasesContext'
import { useAtivaPersona } from '@/context/PersonaContext'
import PersonaGuard from '@/components/PersonaGuard'
import StatusBadge from '@/components/StatusBadge'
import { formatCurrency } from '@/lib/mock-data'

function TratativasContent() {
  const { cases, dispatch } = useCases()
  const { config } = useAtivaPersona()
  const router = useRouter()

  const meusCasos = cases.filter(
    (c) =>
      c.analistaResponsavel === config.nome &&
      (c.status === 'Distribuído' || c.status === 'Em tratativa')
  )

  function abrirTratativa(id: string) {
    dispatch({ type: 'INICIAR_TRATATIVA', id })
    router.push(`/tratativas/${id}`)
  }

  return (
    <div className="max-w-screen-lg mx-auto px-6 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-brand-dark">Minhas Tratativas</h1>
        <p className="text-sm text-brand-slate font-light mt-1">
          {config.nome} — {meusCasos.length} {meusCasos.length === 1 ? 'caso' : 'casos'} em andamento
        </p>
      </div>

      {meusCasos.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-brand-slate">
          <svg className="w-10 h-10 opacity-30 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span className="text-sm font-light">Nenhum caso distribuído para você no momento.</span>
        </div>
      )}

      <div className="flex flex-col gap-4">
        {meusCasos.map((caso) => (
          <div
            key={caso.id}
            className="bg-white rounded-xl border border-gray-100 p-5 flex items-center justify-between gap-4"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <span className="font-semibold text-brand-dark text-sm">{caso.numero}</span>
                <StatusBadge label={caso.status} variant="status" />
              </div>
              <div className="flex flex-wrap gap-x-6 gap-y-1 text-xs text-brand-slate font-light">
                <span>{caso.tipoSubsidio}</span>
                <span>{caso.vara} — {caso.comarca}</span>
                <span className="font-semibold text-brand-dark">{formatCurrency(caso.valorCausa)}</span>
              </div>
              <div className="mt-1.5 text-xs text-brand-slate font-light">
                Produto: <span className="text-brand-mid font-semibold">{caso.produto}</span>
              </div>
            </div>

            <button
              onClick={() => abrirTratativa(caso.id)}
              className="shrink-0 flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-brand-dark rounded-lg hover:bg-brand-hover transition-colors"
            >
              Abrir tratativa
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function TratativasPage() {
  return (
    <PersonaGuard permitidas={['operador']}>
      <TratativasContent />
    </PersonaGuard>
  )
}
