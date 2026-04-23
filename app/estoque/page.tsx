'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { useTarefas } from '@/context/TarefasContext'
import { useAtivaPersona } from '@/context/PersonaContext'
import MetricCard from '@/components/MetricCard'
import ProdutoBadge from '@/components/estoque/ProdutoBadge'
import StatusTarefaBadge from '@/components/estoque/StatusTarefaBadge'
import MultiplaTarefaPopover from '@/components/estoque/MultiplaTarefaPopover'
import DistribuirModal from '@/components/DistribuirModal'
import { Produto, TarefaStatus, TipoTarefa, ANALISTAS_REAIS, Tarefa } from '@/lib/tarefas-mock'

const PRODUTO_COR: Record<Produto, string> = {
  'Consignado Bradesco': '#023631',
  'Cesta de Serviços': '#075056',
  'Contas': '#0A5A52',
}

const STATUS_PRIORIDADE: Record<TarefaStatus, number> = {
  'A Iniciar': 0,
  'Em Andamento': 1,
  'Pendente Regularização': 2,
  'Devolvido (Internamente)': 3,
  'Concluída': 4,
}

const TIPOS_TAREFA: TipoTarefa[] = [
  'Pré-Análise do Produto',
  'Análise do Produto',
  'Análise Cadastro',
  'Pendente Cadastro',
]

function formatRelativa(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const minutos = Math.floor(diff / 60000)
  if (minutos < 1) return 'agora'
  if (minutos < 60) return `há ${minutos} min`
  const horas = Math.floor(minutos / 60)
  if (horas < 24) return `há ${horas}h`
  const dias = Math.floor(horas / 24)
  if (dias === 1) return 'há 1 dia'
  return `há ${dias} dias`
}

export default function EstoquePage() {
  const { tarefas, dispatch } = useTarefas()
  const { persona, config } = useAtivaPersona()
  const isGestor = persona === 'gestor'

  const [busca, setBusca] = useState('')
  const [filtroProduto, setFiltroProduto] = useState<Produto | ''>('')
  const [filtroStatus, setFiltroStatus] = useState<TarefaStatus | ''>('')
  const [filtroTarefa, setFiltroTarefa] = useState<TipoTarefa | ''>('')
  const [filtroAnalista, setFiltroAnalista] = useState('')
  const [selectedNums, setSelectedNums] = useState<string[]>([])
  const [sortCol, setSortCol] = useState<string>('status')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')
  const [showModal, setShowModal] = useState(false)

  const gcpjMap = useMemo(() => {
    const m = new Map<string, Tarefa[]>()
    tarefas.forEach((t) => {
      const arr = m.get(t.numeroGCPJ) ?? []
      arr.push(t)
      m.set(t.numeroGCPJ, arr)
    })
    return m
  }, [tarefas])

  const gcpjsMultiplos = useMemo(() => {
    const s = new Set<string>()
    gcpjMap.forEach((arr, gcpj) => { if (arr.length > 1) s.add(gcpj) })
    return s
  }, [gcpjMap])

  // Métricas
  const total = tarefas.length
  const aIniciar = tarefas.filter((t) => t.status === 'A Iniciar')
  const emAndamento = tarefas.filter((t) => t.status === 'Em Andamento')
  const semAnalista = tarefas.filter((t) => !t.analista)
  const aIniciarHighlight = aIniciar.length > total * 0.8

  // Distribuição por produto
  const countPorProduto = useMemo(() => {
    const m: Partial<Record<Produto, number>> = {}
    tarefas.forEach((t) => { m[t.produto] = (m[t.produto] ?? 0) + 1 })
    return m
  }, [tarefas])

  // Fila por tipo
  const countPorTipo = useMemo(() => {
    const m: Partial<Record<TipoTarefa, { total: number; aIniciar: number; emAndamento: number; semAnalista: number }>> = {}
    tarefas.forEach((t) => {
      if (!m[t.tarefa]) m[t.tarefa] = { total: 0, aIniciar: 0, emAndamento: 0, semAnalista: 0 }
      m[t.tarefa]!.total++
      if (t.status === 'A Iniciar') m[t.tarefa]!.aIniciar++
      if (t.status === 'Em Andamento') m[t.tarefa]!.emAndamento++
      if (!t.analista) m[t.tarefa]!.semAnalista++
    })
    return m
  }, [tarefas])

  const hasFilters = busca || filtroProduto || filtroStatus || filtroTarefa || filtroAnalista

  const tarefasFiltradas = useMemo(() => {
    let resultado = tarefas

    if (busca) {
      const b = busca.toLowerCase()
      resultado = resultado.filter(
        (t) => t.numero.toLowerCase().includes(b) || t.numeroGCPJ.toLowerCase().includes(b)
      )
    }
    if (filtroProduto) resultado = resultado.filter((t) => t.produto === filtroProduto)
    if (filtroStatus) resultado = resultado.filter((t) => t.status === filtroStatus)
    if (filtroTarefa) resultado = resultado.filter((t) => t.tarefa === filtroTarefa)
    if (filtroAnalista === '__sem__') {
      resultado = resultado.filter((t) => !t.analista)
    } else if (filtroAnalista) {
      resultado = resultado.filter((t) => t.analista === filtroAnalista)
    }

    return [...resultado].sort((a, b) => {
      let cmp = 0
      if (sortCol === 'status') {
        cmp = STATUS_PRIORIDADE[a.status] - STATUS_PRIORIDADE[b.status]
        if (cmp === 0) cmp = new Date(a.criacaoEm).getTime() - new Date(b.criacaoEm).getTime()
      } else if (sortCol === 'numero') {
        cmp = a.numero.localeCompare(b.numero)
      } else if (sortCol === 'gcpj') {
        cmp = a.numeroGCPJ.localeCompare(b.numeroGCPJ)
      } else if (sortCol === 'produto') {
        cmp = a.produto.localeCompare(b.produto)
      } else if (sortCol === 'tarefa') {
        cmp = a.tarefa.localeCompare(b.tarefa)
      } else if (sortCol === 'analista') {
        cmp = (a.analista ?? '').localeCompare(b.analista ?? '')
      } else if (sortCol === 'criacao') {
        cmp = new Date(a.criacaoEm).getTime() - new Date(b.criacaoEm).getTime()
      } else if (sortCol === 'atualizacao') {
        cmp = new Date(a.atualizacaoEm).getTime() - new Date(b.atualizacaoEm).getTime()
      }
      return sortDir === 'asc' ? cmp : -cmp
    })
  }, [tarefas, busca, filtroProduto, filtroStatus, filtroTarefa, filtroAnalista, sortCol, sortDir])

  const selecionaveis = tarefasFiltradas.filter((t) => !t.analista)
  const todasSelecionadas = selecionaveis.length > 0 && selecionaveis.every((t) => selectedNums.includes(t.numero))

  const selectedTarefas = useMemo(
    () => tarefas.filter((t) => selectedNums.includes(t.numero)),
    [tarefas, selectedNums]
  )

  function toggleSort(col: string) {
    if (sortCol === col) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortCol(col)
      setSortDir('asc')
    }
  }

  function toggleSelect(numero: string) {
    setSelectedNums((prev) =>
      prev.includes(numero) ? prev.filter((x) => x !== numero) : [...prev, numero]
    )
  }

  function toggleAll() {
    const nums = selecionaveis.map((t) => t.numero)
    if (todasSelecionadas) {
      setSelectedNums([])
    } else {
      setSelectedNums(nums)
    }
  }

  function handleDistribuir(analista: string) {
    dispatch({ type: 'DISTRIBUIR_TAREFAS', numeros: selectedNums, analista })
    setSelectedNums([])
  }

  function limparFiltros() {
    setBusca('')
    setFiltroProduto('')
    setFiltroStatus('')
    setFiltroTarefa('')
    setFiltroAnalista('')
  }

  function SortIcon({ col }: { col: string }) {
    if (sortCol !== col) return <span className="opacity-30 ml-1">↕</span>
    return <span className="ml-1">{sortDir === 'asc' ? '↑' : '↓'}</span>
  }

  return (
    <div className="max-w-screen-xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-brand-dark">Estoque Operacional</h1>
        <p className="text-sm text-brand-slate font-light mt-1">
          {isGestor
            ? 'Visão completa da esteira operacional'
            : 'Tarefas recebidas da base do Bradesco aguardando processamento'}
        </p>
      </div>

      {/* Bloco 1 — Métricas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <MetricCard label="Tarefas no estoque" value={total} />
        <MetricCard label="A iniciar" value={aIniciar.length} highlight={aIniciarHighlight} />
        <MetricCard label="Em andamento" value={emAndamento.length} />
        <div className="bg-white rounded-xl border border-gray-100 p-5 flex flex-col gap-1">
          <span className="text-xs font-semibold uppercase tracking-wide text-brand-slate">Sem analista</span>
          <span className={`text-3xl font-semibold ${semAnalista.length > 50 ? 'text-orange-500' : 'text-brand-dark'}`}>
            {semAnalista.length}
          </span>
        </div>
      </div>

      {/* Bloco 2 — Distribuição por produto */}
      <div className="bg-white rounded-xl border border-gray-100 p-5 mb-6">
        <p className="text-sm font-semibold text-brand-dark mb-3">Composição do estoque por produto</p>
        <div className="h-3 rounded-full overflow-hidden flex mb-3">
          {(Object.keys(PRODUTO_COR) as Produto[]).map((p) => {
            const count = countPorProduto[p] ?? 0
            const pct = (count / total) * 100
            return pct > 0 ? (
              <div
                key={p}
                style={{ width: `${pct}%`, backgroundColor: PRODUTO_COR[p] }}
                title={`${p}: ${count} (${pct.toFixed(1)}%)`}
              />
            ) : null
          })}
        </div>
        <div className="flex flex-wrap gap-4">
          {(Object.keys(PRODUTO_COR) as Produto[]).map((p) => {
            const count = countPorProduto[p] ?? 0
            const pct = total > 0 ? ((count / total) * 100).toFixed(1) : '0'
            return (
              <div key={p} className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: PRODUTO_COR[p] }} />
                <span className="text-xs text-brand-slate font-light">{p}</span>
                <span className="text-xs font-semibold text-brand-dark">{pct}%</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Bloco 3 — Fila por tipo de tarefa */}
      <div className="bg-white rounded-xl border border-gray-100 p-5 mb-6">
        <p className="text-sm font-semibold text-brand-dark mb-3">Fila por estágio de processamento</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {TIPOS_TAREFA.map((tipo) => {
            const dados = countPorTipo[tipo] ?? { total: 0, aIniciar: 0, emAndamento: 0, semAnalista: 0 }
            const isAtivo = filtroTarefa === tipo
            return (
              <button
                key={tipo}
                onClick={() => setFiltroTarefa(isAtivo ? '' : tipo)}
                className={`text-left p-4 rounded-lg border transition-colors ${
                  isAtivo
                    ? 'border-brand-mid bg-brand-offwhite'
                    : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50'
                }`}
              >
                <p className="text-xs font-semibold text-brand-slate uppercase tracking-wide mb-1">
                  {tipo}
                </p>
                <p className="text-3xl font-semibold text-brand-dark mb-2">{dados.total}</p>
                {dados.total > 0 && (
                  <div className="h-1.5 rounded-full overflow-hidden flex mb-1.5">
                    <div
                      style={{ width: `${(dados.aIniciar / dados.total) * 100}%`, backgroundColor: '#023631' }}
                    />
                    <div
                      style={{ width: `${(dados.emAndamento / dados.total) * 100}%`, backgroundColor: '#075056' }}
                    />
                    <div
                      style={{ width: `${((dados.total - dados.aIniciar - dados.emAndamento) / dados.total) * 100}%`, backgroundColor: '#ECEFF3' }}
                    />
                  </div>
                )}
                {dados.semAnalista > 0 && (
                  <p className="text-xs text-orange-500 font-light">
                    {dados.semAnalista} aguardando distribuição
                  </p>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Bloco 4 — Filtros e tabela */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        {/* Barra de filtros */}
        <div className="px-5 py-4 border-b border-gray-100">
          <div className="flex flex-wrap gap-3 items-center">
            {/* Busca */}
            <div className="relative">
              <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-brand-slate" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Buscar tarefa ou GCPJ..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="pl-8 pr-3 py-2 text-sm border border-gray-200 rounded-lg text-brand-dark placeholder-brand-slate/50 focus:outline-none focus:ring-2 focus:ring-brand-mid w-52"
              />
            </div>

            {/* Produto */}
            <select
              value={filtroProduto}
              onChange={(e) => setFiltroProduto(e.target.value as Produto | '')}
              className="px-3 py-2 text-sm border border-gray-200 rounded-lg text-brand-dark bg-white focus:outline-none focus:ring-2 focus:ring-brand-mid"
            >
              <option value="">Produto</option>
              <option value="Consignado Bradesco">Consignado Bradesco</option>
              <option value="Cesta de Serviços">Cesta de Serviços</option>
              <option value="Contas">Contas</option>
            </select>

            {/* Status */}
            <select
              value={filtroStatus}
              onChange={(e) => setFiltroStatus(e.target.value as TarefaStatus | '')}
              className="px-3 py-2 text-sm border border-gray-200 rounded-lg text-brand-dark bg-white focus:outline-none focus:ring-2 focus:ring-brand-mid"
            >
              <option value="">Status</option>
              <option value="A Iniciar">A Iniciar</option>
              <option value="Em Andamento">Em Andamento</option>
              <option value="Devolvido (Internamente)">Devolvido</option>
              <option value="Pendente Regularização">Pendente Regularização</option>
            </select>

            {/* Tarefa */}
            <select
              value={filtroTarefa}
              onChange={(e) => setFiltroTarefa(e.target.value as TipoTarefa | '')}
              className="px-3 py-2 text-sm border border-gray-200 rounded-lg text-brand-dark bg-white focus:outline-none focus:ring-2 focus:ring-brand-mid"
            >
              <option value="">Tarefa</option>
              <option value="Pré-Análise do Produto">Pré-Análise do Produto</option>
              <option value="Análise do Produto">Análise do Produto</option>
              <option value="Análise Cadastro">Análise Cadastro</option>
              <option value="Pendente Cadastro">Pendente Cadastro</option>
            </select>

            {/* Analista */}
            <select
              value={filtroAnalista}
              onChange={(e) => setFiltroAnalista(e.target.value)}
              className="px-3 py-2 text-sm border border-gray-200 rounded-lg text-brand-dark bg-white focus:outline-none focus:ring-2 focus:ring-brand-mid"
            >
              <option value="">Analista</option>
              <option value="__sem__">Sem analista</option>
              {ANALISTAS_REAIS.map((a) => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>

            {hasFilters && (
              <button
                onClick={limparFiltros}
                className="px-3 py-2 text-sm font-semibold text-brand-slate hover:text-brand-dark transition-colors"
              >
                Limpar filtros
              </button>
            )}

            {/* Contador e botão distribuir */}
            <div className="ml-auto flex items-center gap-3">
              <span className="text-xs text-brand-slate font-light">
                Exibindo {tarefasFiltradas.length} de {total} tarefas
              </span>
              {isGestor && (
                <button
                  disabled={selectedNums.length === 0}
                  onClick={() => setShowModal(true)}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-brand-dark rounded-lg hover:bg-brand-hover transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Distribuir selecionados
                  {selectedNums.length > 0 && (
                    <span className="bg-white/20 rounded-full px-1.5 py-0.5 text-xs">{selectedNums.length}</span>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Tabela */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-brand-offwhite border-b border-gray-100">
                {isGestor && (
                  <th className="px-4 py-3 text-left w-10">
                    <input
                      type="checkbox"
                      checked={todasSelecionadas}
                      onChange={toggleAll}
                      className="rounded border-gray-300 text-brand-mid focus:ring-brand-mid"
                    />
                  </th>
                )}
                <th
                  className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-brand-slate cursor-pointer hover:text-brand-dark"
                  onClick={() => toggleSort('numero')}
                >
                  Número <SortIcon col="numero" />
                </th>
                <th
                  className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-brand-slate cursor-pointer hover:text-brand-dark"
                  onClick={() => toggleSort('gcpj')}
                >
                  GCPJ <SortIcon col="gcpj" />
                </th>
                <th
                  className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-brand-slate cursor-pointer hover:text-brand-dark"
                  onClick={() => toggleSort('produto')}
                >
                  Produto <SortIcon col="produto" />
                </th>
                <th
                  className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-brand-slate cursor-pointer hover:text-brand-dark"
                  onClick={() => toggleSort('tarefa')}
                >
                  Tarefa <SortIcon col="tarefa" />
                </th>
                <th
                  className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-brand-slate cursor-pointer hover:text-brand-dark"
                  onClick={() => toggleSort('status')}
                >
                  Status <SortIcon col="status" />
                </th>
                <th
                  className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-brand-slate cursor-pointer hover:text-brand-dark"
                  onClick={() => toggleSort('analista')}
                >
                  Analista <SortIcon col="analista" />
                </th>
                <th
                  className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-brand-slate cursor-pointer hover:text-brand-dark"
                  onClick={() => toggleSort('criacao')}
                >
                  Criada <SortIcon col="criacao" />
                </th>
                <th
                  className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-brand-slate cursor-pointer hover:text-brand-dark"
                  onClick={() => toggleSort('atualizacao')}
                >
                  Atualização <SortIcon col="atualizacao" />
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {tarefasFiltradas.map((tarefa) => {
                const isSelected = selectedNums.includes(tarefa.numero)
                const isMeu = tarefa.analista === config.nome
                const isDevolvido = tarefa.status === 'Devolvido (Internamente)' || tarefa.status === 'Pendente Regularização'
                const rowBg = isSelected ? 'bg-brand-offwhite' : (!isGestor && tarefa.analista && !isMeu) ? '' : (isMeu && !isGestor) ? 'bg-brand-offwhite/50' : ''
                const rowOpacity = !isGestor && tarefa.analista && !isMeu ? 'opacity-50' : ''
                const temMultiplas = gcpjsMultiplos.has(tarefa.numeroGCPJ)

                return (
                  <tr
                    key={tarefa.numero}
                    className={`hover:bg-gray-50 transition-colors ${rowBg} ${rowOpacity}`}
                    style={isDevolvido ? { borderLeft: '3px solid #dc2626' } : undefined}
                  >
                    {isGestor && (
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          disabled={!!tarefa.analista}
                          checked={isSelected}
                          onChange={() => toggleSelect(tarefa.numero)}
                          className="rounded border-gray-300 text-brand-mid focus:ring-brand-mid disabled:opacity-30"
                        />
                      </td>
                    )}
                    <td className="px-4 py-3">
                      <Link
                        href={`/tratativas/${tarefa.numero}`}
                        className="font-semibold text-brand-mid hover:text-brand-dark transition-colors"
                      >
                        {tarefa.numero}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-brand-slate font-light text-xs">
                      <div className="flex items-center gap-1">
                        <span>{tarefa.numeroGCPJ}</span>
                        {temMultiplas && (
                          <MultiplaTarefaPopover
                            gcpj={tarefa.numeroGCPJ}
                            tarefas={gcpjMap.get(tarefa.numeroGCPJ) ?? []}
                            tarefaAtualNumero={tarefa.numero}
                          />
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <ProdutoBadge produto={tarefa.produto} />
                    </td>
                    <td className="px-4 py-3 text-brand-dark font-light text-xs">{tarefa.tarefa}</td>
                    <td className="px-4 py-3">
                      <StatusTarefaBadge status={tarefa.status} />
                    </td>
                    <td className="px-4 py-3 text-xs">
                      {tarefa.analista ? (
                        <span className="text-brand-dark font-light">{tarefa.analista}</span>
                      ) : (
                        <span className="text-brand-slate italic font-light">não atribuído</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-xs text-brand-slate font-light">
                      {formatRelativa(tarefa.criacaoEm)}
                    </td>
                    <td className="px-4 py-3 text-xs text-brand-slate font-light">
                      {formatRelativa(tarefa.atualizacaoEm)}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>

          {tarefasFiltradas.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12">
              <p className="text-brand-slate font-light text-sm">Nenhuma tarefa encontrada.</p>
              {hasFilters && (
                <button onClick={limparFiltros} className="mt-2 text-sm font-semibold text-brand-mid hover:underline">
                  Limpar filtros
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {isGestor && (
        <DistribuirModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          selectedCount={selectedNums.length}
          onConfirm={handleDistribuir}
          selectedTarefas={selectedTarefas}
        />
      )}
    </div>
  )
}
