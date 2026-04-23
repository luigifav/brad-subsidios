'use client'

import { Analise, TipoRisco, Probabilidade, Estrategia } from '@/lib/mock-data'
import StatusBadge from '@/components/StatusBadge'

interface Section4Props {
  analise: Analise
  onChange: (field: keyof Analise, value: string) => void
}

const riscos: TipoRisco[] = ['Baixo', 'Médio', 'Alto', 'Crítico']
const probabilidades: Probabilidade[] = ['Remota', 'Possível', 'Provável', 'Certa']
const estrategias: Estrategia[] = [
  'Pagar integralmente',
  'Propor acordo',
  'Contestar',
  'Encaminhar ao jurídico externo',
]

const labelCls = 'text-xs font-semibold uppercase tracking-wide text-brand-slate'
const inputCls = 'w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-brand-dark bg-white focus:outline-none focus:ring-2 focus:ring-brand-mid font-light'
const textareaCls = `${inputCls} resize-none`
const selectCls = `${inputCls} cursor-pointer`

export default function Section4Analise({ analise, onChange }: Section4Props) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6 mb-4">
      <h2 className="text-base font-semibold text-brand-dark mb-5">4. Análise do Subsídio</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="flex flex-col gap-1.5">
          <label className={labelCls}>Tipo de Risco</label>
          <div className="flex items-center gap-3">
            <select
              value={analise.tipoRisco ?? ''}
              onChange={(e) => onChange('tipoRisco', e.target.value)}
              className={selectCls}
            >
              <option value="">Selecionar...</option>
              {riscos.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
            {analise.tipoRisco && (
              <StatusBadge label={analise.tipoRisco} variant="risco" />
            )}
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className={labelCls}>Probabilidade de Êxito do Autor</label>
          <select
            value={analise.probabilidade ?? ''}
            onChange={(e) => onChange('probabilidade', e.target.value)}
            className={selectCls}
          >
            <option value="">Selecionar...</option>
            {probabilidades.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className={labelCls}>Valor do Subsídio Recomendado</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-brand-slate font-semibold">R$</span>
            <input
              type="text"
              value={analise.valorRecomendado ?? ''}
              onChange={(e) => onChange('valorRecomendado', e.target.value)}
              placeholder="0,00"
              className={`${inputCls} pl-9`}
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className={labelCls}>Estratégia Recomendada</label>
          <select
            value={analise.estrategia ?? ''}
            onChange={(e) => onChange('estrategia', e.target.value)}
            className={selectCls}
          >
            <option value="">Selecionar...</option>
            {estrategias.map((e) => <option key={e} value={e}>{e}</option>)}
          </select>
        </div>

        <div className="flex flex-col gap-1.5 md:col-span-2">
          <label className={labelCls}>Fundamento do Subsídio</label>
          <textarea
            rows={4}
            value={analise.fundamento ?? ''}
            onChange={(e) => onChange('fundamento', e.target.value)}
            placeholder="Ex: Ausência de relação contratual comprovada. Cliente não reconhece a contratação da cesta de serviços objeto do litígio..."
            className={textareaCls}
          />
        </div>

        <div className="flex flex-col gap-1.5 md:col-span-2">
          <label className={labelCls}>Precedentes Relevantes</label>
          <textarea
            rows={3}
            value={analise.precedentes ?? ''}
            onChange={(e) => onChange('precedentes', e.target.value)}
            placeholder="Registre jurisprudência aplicável ao caso..."
            className={textareaCls}
          />
        </div>

        <div className="flex flex-col gap-1.5 md:col-span-2">
          <label className={`${labelCls} flex items-center gap-2`}>
            Observações Internas
            <span className="text-xs font-light italic text-brand-slate normal-case tracking-normal">
              (uso interno, não enviado ao ServiceNow)
            </span>
          </label>
          <textarea
            rows={3}
            value={analise.observacoesInternas ?? ''}
            onChange={(e) => onChange('observacoesInternas', e.target.value)}
            placeholder="Observações para uso interno da equipe..."
            className={textareaCls}
          />
        </div>
      </div>
    </div>
  )
}
