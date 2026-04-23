'use client'

// TODO: integrar com webhook do ServiceNow para atualização automática de status

import Link from 'next/link'
import { useCases } from '@/context/CasesContext'
import { ACOMPANHAMENTO_MOCKS } from '@/lib/acompanhamento-mock'
import MetricCard from '@/components/MetricCard'
import { StatusServiceNow, formatCurrency } from '@/lib/mock-data'

const STATUS_LABELS: Record<StatusServiceNow, { label: string; color: string }> = {
  aguardando: { label: 'Aguardando processamento', color: 'bg-gray-100 text-gray-600' },
  em_geracao: { label: 'Laudo em geração', color: 'bg-yellow-100 text-yellow-700' },
  laudo_gerado: { label: 'Laudo gerado - aguardando entrega', color: 'bg-blue-100 text-blue-700' },
  entregue: { label: 'Entregue ao Bradesco', color: 'bg-green-100 text-green-700' },
  pendencia: { label: 'Retornado com pendência', color: 'bg-orange-100 text-orange-700' },
}

export default function AcompanhamentoPage() {
  const { cases } = useCases()

  const casosDoContexto = cases.filter((c) => c.status === 'Enviado ao ServiceNow')
  const todos = [...casosDoContexto, ...ACOMPANHAMENTO_MOCKS].sort((a, b) =>
    (b.timestampEnvio ?? '').localeCompare(a.timestampEnvio ?? '')
  )

  const emGeracao = todos.filter((c) => c.statusServiceNow === 'em_geracao').length
  const laudosProntos = todos.filter((c) => c.statusServiceNow === 'laudo_gerado').length

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-brand-dark">Acompanhamento Pós-Envio</h1>
        <p className="text-sm text-brand-slate font-light mt-1">
          Casos enviados ao ServiceNow aguardando conclusão do laudo
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8">
        <MetricCard label="Em geração" value={emGeracao} />
        <MetricCard label="Laudos prontos" value={laudosProntos} />
        <MetricCard label="Entregues ao Bradesco nas últimas 24h" value={5} />
      </div>

      {todos.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-brand-slate">
          <svg className="w-12 h-12 mb-3 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <span className="text-sm font-light">Nenhum caso em acompanhamento no momento</span>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {todos.map((caso) => {
            const sn = caso.statusServiceNow
            const badge = sn ? STATUS_LABELS[sn] : null

            return (
              <div key={caso.id} className="bg-white rounded-xl border border-gray-100 p-5 flex items-center gap-6">
                <div className="flex-1 min-w-0">
                  <Link
                    href={`/acompanhamento/${caso.id}`}
                    className="text-sm font-semibold text-brand-dark hover:text-brand-mid transition-colors truncate block"
                  >
                    {caso.numero}
                  </Link>
                  <div className="flex items-center gap-4 mt-1">
                    <span className="text-xs text-brand-slate font-light">{caso.tipoSubsidio}</span>
                    <span className="text-xs text-brand-slate/50">|</span>
                    <span className="text-xs text-brand-slate font-light">{caso.analistaResponsavel}</span>
                    <span className="text-xs text-brand-slate/50">|</span>
                    <span className="text-xs text-brand-slate font-light">{formatCurrency(caso.valorCausa)}</span>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1.5 shrink-0">
                  <span className="text-xs font-mono text-brand-mid font-semibold">
                    {caso.protocoloServiceNow}
                  </span>
                  {badge && (
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${badge.color}`}>
                      {badge.label}
                    </span>
                  )}
                  {caso.tempoDesdeEnvio && (
                    <span className="text-xs text-brand-slate/60 font-light">
                      enviado há {caso.tempoDesdeEnvio}
                    </span>
                  )}
                </div>

                <Link
                  href={`/acompanhamento/${caso.id}`}
                  className="shrink-0 flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-brand-dark rounded-lg hover:bg-brand-hover transition-colors"
                >
                  Ver detalhes
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
