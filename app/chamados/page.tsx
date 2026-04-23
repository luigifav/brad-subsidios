'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { useChamados } from '@/context/ChamadosContext'
import { useCases } from '@/context/CasesContext'
import { Chamado } from '@/lib/mock-data'
import SLABadge from '@/components/chamados/SLABadge'
import StatusChamadoBadge from '@/components/chamados/StatusChamadoBadge'

type Filtro = 'todos' | 'abertos' | 'proximo' | 'estourados' | 'respondidos'

function isProximoVencimento(c: Chamado): boolean {
  if (c.status !== 'aberto') return false
  const deadline = new Date(c.dataAbertura).getTime() + c.slaHoras * 3600000
  return deadline - Date.now() < 24 * 3600000
}

function ordenar(lista: Chamado[]): Chamado[] {
  return [...lista].sort((a, b) => {
    const prioA = a.status === 'aberto' ? 0 : a.status === 'sla_estourado' ? 1 : 2
    const prioB = b.status === 'aberto' ? 0 : b.status === 'sla_estourado' ? 1 : 2
    if (prioA !== prioB) return prioA - prioB
    if (a.status === 'aberto' && b.status === 'aberto') {
      const deadlineA = new Date(a.dataAbertura).getTime() + a.slaHoras * 3600000
      const deadlineB = new Date(b.dataAbertura).getTime() + b.slaHoras * 3600000
      return deadlineA - deadlineB
    }
    return 0
  })
}

function formatDataCurta(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

export default function ChamadosPage() {
  const { chamados } = useChamados()
  const { cases } = useCases()
  const [filtro, setFiltro] = useState<Filtro>('todos')

  const hoje = new Date()
  const respondidosHoje = chamados.filter((c) => {
    if (!c.dataResposta) return false
    const d = new Date(c.dataResposta)
    return d.getDate() === hoje.getDate() && d.getMonth() === hoje.getMonth() && d.getFullYear() === hoje.getFullYear()
  }).length

  const abertos = chamados.filter((c) => c.status === 'aberto').length
  const estourados = chamados.filter((c) => c.status === 'sla_estourado').length

  const filtrados = useMemo(() => {
    let lista = chamados
    if (filtro === 'abertos') lista = chamados.filter((c) => c.status === 'aberto')
    else if (filtro === 'proximo') lista = chamados.filter(isProximoVencimento)
    else if (filtro === 'estourados') lista = chamados.filter((c) => c.status === 'sla_estourado')
    else if (filtro === 'respondidos') lista = chamados.filter(
      (c) => c.status === 'respondido_com_doc' || c.status === 'respondido_sem_doc',
    )
    return ordenar(lista)
  }, [chamados, filtro])

  const getProcesso = (processoId: string) => cases.find((p) => p.id === processoId)

  const filtros: { key: Filtro; label: string }[] = [
    { key: 'todos', label: 'Todos' },
    { key: 'abertos', label: 'Abertos' },
    { key: 'proximo', label: 'SLA próximo do vencimento' },
    { key: 'estourados', label: 'Estourados' },
    { key: 'respondidos', label: 'Respondidos' },
  ]

  return (
    <div className="max-w-screen-xl mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-brand-dark">Chamados Internos</h1>
        <p className="text-sm text-brand-slate font-light mt-1">
          Acompanhamento de solicitações de documentos às áreas do banco
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-brand-slate mb-1">Abertos</p>
          <p className="text-3xl font-semibold text-brand-dark">{abertos}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-brand-slate mb-1">Respondidos hoje</p>
          <p className="text-3xl font-semibold text-brand-dark">{respondidosHoje}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-brand-slate mb-1">SLAs estourados</p>
          <p className={`text-3xl font-semibold ${estourados > 0 ? 'text-red-600' : 'text-brand-dark'}`}>
            {estourados}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-brand-slate mb-1">Tempo médio de resposta</p>
          <p className="text-3xl font-semibold text-brand-dark">2h 14min</p>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-6 flex-wrap">
        {filtros.map((f) => (
          <button
            key={f.key}
            onClick={() => setFiltro(f.key)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
              filtro === f.key
                ? 'bg-brand-dark text-white'
                : 'bg-white border border-gray-200 text-brand-slate hover:bg-gray-50'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-brand-offwhite border-b border-gray-100">
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-brand-slate">Nº do chamado</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-brand-slate">Processo</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-brand-slate">Documento</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-brand-slate">Área</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-brand-slate">Aberto em</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-brand-slate">SLA</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-brand-slate">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-brand-slate">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtrados.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-10 text-center text-sm text-brand-slate font-light">
                    Nenhum chamado encontrado para este filtro.
                  </td>
                </tr>
              )}
              {filtrados.map((c) => {
                const processo = getProcesso(c.processoId)
                return (
                  <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <Link
                        href={`/chamados/${c.id}`}
                        className="font-mono text-xs text-brand-mid hover:text-brand-dark transition-colors hover:underline"
                      >
                        {c.numero}
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      {processo ? (
                        <Link
                          href={`/tratativas/${processo.id}`}
                          className="font-mono text-xs text-brand-mid hover:text-brand-dark transition-colors hover:underline"
                        >
                          {processo.numero.split('-')[0]}...
                        </Link>
                      ) : (
                        <span className="text-xs text-brand-slate font-light">{c.processoId}</span>
                      )}
                    </td>
                    <td className="px-4 py-3 font-medium text-brand-dark">{c.documentoSolicitado}</td>
                    <td className="px-4 py-3 text-brand-slate">{c.area}</td>
                    <td className="px-4 py-3 text-brand-slate font-light text-xs">{formatDataCurta(c.dataAbertura)}</td>
                    <td className="px-4 py-3">
                      <SLABadge slaHoras={c.slaHoras} dataAbertura={c.dataAbertura} status={c.status} />
                    </td>
                    <td className="px-4 py-3">
                      <StatusChamadoBadge status={c.status} />
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/chamados/${c.id}`}
                        className="px-3 py-1.5 text-xs font-semibold border border-gray-200 rounded-lg text-brand-slate hover:bg-gray-50 transition-colors"
                      >
                        Ver detalhes
                      </Link>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
