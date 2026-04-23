'use client'

import { use, useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useCases } from '@/context/CasesContext'
import { Analise } from '@/lib/mock-data'
import ProgressBar from '@/components/tratativa/ProgressBar'
import Section1Identificacao from '@/components/tratativa/Section1Identificacao'
import Section2Partes from '@/components/tratativa/Section2Partes'
import Section3Documentos from '@/components/tratativa/Section3Documentos'
import Section4Analise from '@/components/tratativa/Section4Analise'
import Section5Resumo from '@/components/tratativa/Section5Resumo'

const SECTION_LABELS = ['Identificação', 'Partes', 'Documentos', 'Análise', 'Envio']

interface PageProps {
  params: Promise<{ id: string }>
}

export default function TratativaFormPage({ params }: PageProps) {
  const { id } = use(params)
  const { getCase, dispatch } = useCases()
  const router = useRouter()
  const processo = getCase(id)

  const [advogadoReu, setAdvogadoReu] = useState(processo?.advogadoReu ?? '')
  const [analise, setAnalise] = useState<Analise>(processo?.analise ?? {})
  const [docsComplete, setDocsComplete] = useState(false)

  const completedSections = useMemo(() => {
    let count = 1 // seção 1 sempre completa (pré-preenchida)
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

  if (!processo) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] gap-3">
        <p className="text-brand-slate font-light">Processo não encontrado.</p>
        <a href="/tratativas" className="text-sm font-semibold text-brand-mid hover:underline">
          Voltar às tratativas
        </a>
      </div>
    )
  }

  function handleAnaliseChange(field: keyof Analise, value: string) {
    setAnalise((prev) => ({ ...prev, [field]: value }))
  }

  function handleEnviado(protocolo: string) {
    dispatch({ type: 'ATUALIZAR_ANALISE', id, analise })
    dispatch({ type: 'ENVIAR_SERVICENOW', id, protocolo })
  }

  return (
    <div className="max-w-screen-md mx-auto px-6 py-8">
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => router.push('/tratativas')}
          className="flex items-center gap-1.5 text-sm text-brand-slate hover:text-brand-dark transition-colors font-light"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Tratativas
        </button>
        <span className="text-brand-slate/40">/</span>
        <span className="text-sm font-semibold text-brand-dark truncate">{processo.numero}</span>
      </div>

      <div className="mb-6">
        <h1 className="text-xl font-semibold text-brand-dark">Formulário de Tratativa</h1>
        <p className="text-sm text-brand-slate font-light mt-1">
          Instrução do processo para geração do laudo pelo ServiceNow
        </p>
      </div>

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
      />

      <Section4Analise analise={analise} onChange={handleAnaliseChange} />

      <Section5Resumo
        processo={processo}
        analise={analise}
        docsComplete={docsComplete}
        onEnviado={handleEnviado}
      />
    </div>
  )
}
