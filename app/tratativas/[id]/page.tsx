'use client'

// TODO: mapear tarefas para processos jurídicos via GCPJ em integração real

import { use, useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useCases } from '@/context/CasesContext'
import { useTarefas } from '@/context/TarefasContext'
import { Analise, Processo, ProcessoStatus, TipoSubsidio } from '@/lib/mock-data'
import { Tarefa } from '@/lib/tarefas-mock'
import ProgressBar from '@/components/tratativa/ProgressBar'
import Section1Identificacao from '@/components/tratativa/Section1Identificacao'
import Section2Partes from '@/components/tratativa/Section2Partes'
import Section3Documentos from '@/components/tratativa/Section3Documentos'
import Section4Analise from '@/components/tratativa/Section4Analise'
import Section5Resumo from '@/components/tratativa/Section5Resumo'
import AcoesRapidas from '@/components/tratativa/AcoesRapidas'
import SidePanel from '@/components/tratativa/SidePanel'
import PersonaGuard from '@/components/PersonaGuard'
import ResumoTarefaCard from '@/components/estoque/ResumoTarefaCard'

const SECTION_LABELS = ['Identificação', 'Partes', 'Documentos', 'Análise', 'Envio']

const VARAS = ['1ª Vara Cível', '2ª Vara Cível', '3ª Vara Cível', '4ª Vara Cível', '5ª Vara Cível Central']
const COMARCAS = ['São Paulo', 'Santo André', 'Guarulhos', 'Campinas', 'Santos', 'Osasco', 'Ribeirão Preto']
const NOMES = [
  'Carlos Eduardo Santos', 'Maria Aparecida Lima', 'José Roberto Oliveira',
  'Ana Paula Ferreira', 'Roberto Carlos Mendes', 'Fernanda Costa Silva',
  'Paulo Henrique Souza', 'Juliana Ribeiro Alves',
]
const ADVOGADOS_AUTOR = [
  'Dr. Rogério Alves', 'Dra. Patrícia Moura', 'Dr. Cláudio Martins',
  'Dra. Carla Fonseca', 'Dr. Henrique Bastos',
]

function numHash(str: string): number {
  let h = 0
  for (let i = 0; i < str.length; i++) {
    h = (h * 31 + str.charCodeAt(i)) >>> 0
  }
  return h
}

function pick<T>(arr: T[], hash: number): T {
  return arr[hash % arr.length]
}

function gerarProcessoSintetico(tarefa: Tarefa): Processo {
  const h = numHash(tarefa.numeroGCPJ)
  const gcpj = tarefa.numeroGCPJ
  const ultimosCinco = gcpj.slice(-5)
  const numero = `00${ultimosCinco}-${String(h % 99).padStart(2, '0')}.2024.8.26.0100`

  const tipoSubsidioMap: Record<string, TipoSubsidio> = {
    'Consignado Bradesco': 'Revisional',
    'Cesta de Serviços': 'Cobrança Indevida',
    'Contas': 'Dano Moral',
  }
  const tipoAcaoMap: Record<string, string> = {
    'Consignado Bradesco': 'Ação Revisional de Contrato de Crédito Consignado',
    'Cesta de Serviços': 'Ação de Repetição de Indébito por Cobrança Indevida',
    'Contas': 'Ação de Indenização por Dano Moral',
  }

  const valorBase = 5000 + (h % 45000)

  return {
    id: tarefa.numero,
    numero,
    produto: tarefa.produto,
    vara: pick(VARAS, h),
    comarca: pick(COMARCAS, h + 1),
    tribunal: 'TJSP',
    tipoSubsidio: tipoSubsidioMap[tarefa.produto] ?? 'Dano Moral',
    tipoAcao: tipoAcaoMap[tarefa.produto] ?? 'Ação Cível',
    faseProcessual: 'Conhecimento',
    valorCausa: valorBase,
    dataEntrada: tarefa.criacaoEm.substring(0, 10),
    dataDistribuicao: tarefa.criacaoEm.substring(0, 10),
    status: tarefa.status === 'Em Andamento' ? 'Em tratativa' : 'Distribuído' as ProcessoStatus,
    analistaResponsavel: tarefa.analista,
    nomeAutor: pick(NOMES, h + 2),
    cpfAutor: `***.${String((h % 999)).padStart(3, '0')}.***-**`,
    advogadoAutor: pick(ADVOGADOS_AUTOR, h + 3),
    oabAdvogadoAutor: `OAB/SP ${String(100000 + (h % 200000))}`,
    advogadoReu: 'Dra. Beatriz Cardoso',
  }
}

interface PageProps {
  params: Promise<{ id: string }>
}

export default function TratativaFormPage({ params }: PageProps) {
  const { id } = use(params)
  const { dispatch } = useCases()
  const { getTarefa, getTarefasPorGCPJ } = useTarefas()
  const router = useRouter()

  const tarefa = getTarefa(id)
  const processo = useMemo(() => tarefa ? gerarProcessoSintetico(tarefa) : null, [tarefa])
  const outrasDoGCPJ = tarefa ? getTarefasPorGCPJ(tarefa.numeroGCPJ).filter((t) => t.numero !== id) : []

  const [advogadoReu, setAdvogadoReu] = useState(processo?.advogadoReu ?? '')
  const [analise, setAnalise] = useState<Analise>(processo?.analise ?? {})
  const [docsComplete, setDocsComplete] = useState(false)

  const completedSections = useMemo(() => {
    let count = 1
    if (advogadoReu.trim().length > 0) count++
    if (docsComplete) count++
    if (
      analise.tipoRisco &&
      analise.probabilidade &&
      analise.valorRecomendado &&
      analise.fundamento &&
      analise.estrategia
    ) count++
    return count
  }, [advogadoReu, docsComplete, analise])

  if (!tarefa || !processo) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] gap-3">
        <p className="text-brand-slate font-light">Tarefa não encontrada.</p>
        <a href="/estoque" className="text-sm font-semibold text-brand-mid hover:underline">
          Voltar ao estoque
        </a>
      </div>
    )
  }

  function handleAnaliseChange(field: keyof Analise, value: string) {
    setAnalise((prev) => ({ ...prev, [field]: value }))
  }

  function handleEnviado(protocolo: string) {
    dispatch({ type: 'ATUALIZAR_ANALISE', id: processo!.id, analise })
    dispatch({ type: 'ENVIAR_SERVICENOW', id: processo!.id, protocolo })
  }

  return (
    <PersonaGuard permitidas={['operador']}>
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => router.push('/estoque')}
          className="flex items-center gap-1.5 text-sm text-brand-slate hover:text-brand-dark transition-colors font-light"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Estoque
        </button>
        <span className="text-brand-slate/40">/</span>
        <span className="text-sm font-semibold text-brand-dark truncate">{tarefa.numero}</span>
      </div>

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-brand-dark">Formulário de Tratativa</h1>
        <p className="text-sm text-brand-slate font-light mt-1">
          Instrução do processo para geração do laudo pelo ServiceNow
        </p>
        <p className="text-xs text-brand-slate font-light italic mt-1">
          Tudo sobre este caso neste lugar: formulário, chamados, acompanhamento e histórico.
        </p>
      </div>

      {/* Grid de duas colunas: principal (2/3) e lateral (1/3) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

        {/* Coluna principal */}
        <div className="lg:col-span-2">
          <ResumoTarefaCard tarefa={tarefa} outrasCount={outrasDoGCPJ.length} />

          <AcoesRapidas processoNumero={tarefa.numero} />

          <ProgressBar
            totalSections={5}
            completedSections={completedSections}
            labels={SECTION_LABELS}
          />

          <Section1Identificacao processo={processo} />

          <Section2Partes
            processo={processo}
            advogadoReu={advogadoReu}
            onAdvogadoReuChange={setAdvogadoReu}
          />

          <Section3Documentos
            onComplete={() => setDocsComplete(true)}
            isComplete={docsComplete}
            processoId={tarefa.numero}
          />

          <Section4Analise analise={analise} onChange={handleAnaliseChange} />

          <Section5Resumo
            processo={processo}
            analise={analise}
            docsComplete={docsComplete}
            onEnviado={handleEnviado}
          />
        </div>

        {/* Coluna lateral */}
        <div className="lg:col-span-1">
          <SidePanel
            processo={processo}
            analise={analise}
            docsComplete={docsComplete}
          />
        </div>
      </div>
    </div>
    </PersonaGuard>
  )
}
