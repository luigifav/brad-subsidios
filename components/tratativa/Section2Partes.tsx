// TODO: integrar com API do tribunal (TJ/STJ) para busca de dados processuais

import { Processo, maskCPF } from '@/lib/mock-data'
import SectionBanner from './SectionBanner'
import ReadonlyField from './ReadonlyField'

interface Section2Props {
  processo: Processo
  advogadoReu: string
  onAdvogadoReuChange: (value: string) => void
}

export default function Section2Partes({ processo, advogadoReu, onAdvogadoReuChange }: Section2Props) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6 mb-4">
      <h2 className="text-base font-semibold text-brand-dark mb-4">2. Partes Envolvidas</h2>
      <SectionBanner message="Dados obtidos automaticamente via integração com o sistema judiciário" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ReadonlyField label="Nome do Autor" value={processo.nomeAutor} />
        <ReadonlyField label="CPF do Autor" value={maskCPF(processo.cpfAutor)} />
        <ReadonlyField label="Advogado do Autor" value={processo.advogadoAutor} />
        <ReadonlyField label="OAB" value={processo.oabAdvogadoAutor} />
        <ReadonlyField label="Réu" value="Banco Bradesco S.A." />
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold uppercase tracking-wide text-brand-slate">
            Advogado do Réu
          </label>
          <input
            type="text"
            value={advogadoReu}
            onChange={(e) => onAdvogadoReuChange(e.target.value)}
            placeholder="Informar advogado do réu..."
            className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-brand-dark bg-white focus:outline-none focus:ring-2 focus:ring-brand-mid placeholder:text-gray-300 font-light"
          />
        </div>
      </div>
    </div>
  )
}
