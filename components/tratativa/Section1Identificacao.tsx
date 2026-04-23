// TODO: integrar com API do tribunal (TJ/STJ) para busca de dados processuais

import { Processo, formatCurrency, formatDate } from '@/lib/mock-data'
import SectionBanner from './SectionBanner'
import ReadonlyField from './ReadonlyField'

interface Section1Props {
  processo: Processo
}

export default function Section1Identificacao({ processo }: Section1Props) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6 mb-4">
      <h2 className="text-base font-semibold text-brand-dark mb-4">1. Identificação do Processo</h2>
      <SectionBanner message="Dados obtidos automaticamente via integração com o sistema judiciário" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ReadonlyField label="Número do Processo" value={processo.numero} />
        <ReadonlyField label="Tribunal" value={processo.tribunal} />
        <ReadonlyField label="Vara / Comarca" value={`${processo.vara} — ${processo.comarca}`} />
        <ReadonlyField label="Tipo de Ação" value={processo.tipoAcao} />
        <ReadonlyField label="Fase Processual" value={processo.faseProcessual} />
        <ReadonlyField label="Data de Distribuição da Ação" value={formatDate(processo.dataDistribuicao)} />
        <ReadonlyField label="Valor da Causa" value={formatCurrency(processo.valorCausa)} />
        <ReadonlyField label="Produto" value={processo.produto} />
      </div>
    </div>
  )
}
