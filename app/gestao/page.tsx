import { Fragment } from 'react'
import Link from 'next/link'
import MetricCard from '@/components/MetricCard'
import { formatCurrency } from '@/lib/mock-data'
import {
  ANALISTAS_PRODUTIVIDADE,
  ETAPAS_SLA,
  VOLUME_TIPOS,
  FILA_CRITICA,
} from '@/lib/gestao-mock'

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) }
}

function donutArc(
  cx: number,
  cy: number,
  outerR: number,
  innerR: number,
  startAngle: number,
  endAngle: number,
): string {
  const gap = 1.5
  const s = startAngle + gap
  const e = endAngle - gap
  const o1 = polarToCartesian(cx, cy, outerR, s)
  const o2 = polarToCartesian(cx, cy, outerR, e)
  const i1 = polarToCartesian(cx, cy, innerR, s)
  const i2 = polarToCartesian(cx, cy, innerR, e)
  const large = e - s > 180 ? 1 : 0
  return [
    `M ${o1.x.toFixed(2)} ${o1.y.toFixed(2)}`,
    `A ${outerR} ${outerR} 0 ${large} 1 ${o2.x.toFixed(2)} ${o2.y.toFixed(2)}`,
    `L ${i2.x.toFixed(2)} ${i2.y.toFixed(2)}`,
    `A ${innerR} ${innerR} 0 ${large} 0 ${i1.x.toFixed(2)} ${i1.y.toFixed(2)}`,
    'Z',
  ].join(' ')
}

function buildSlices() {
  let currentAngle = 0
  return VOLUME_TIPOS.map((item) => {
    const startAngle = currentAngle
    const endAngle = currentAngle + (item.percentual / 100) * 360
    currentAngle = endAngle
    return { ...item, startAngle, endAngle }
  })
}

export default function GestaoPage() {
  const slices = buildSlices()

  return (
    <div className="max-w-screen-xl mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-brand-dark">Gestão da Esteira</h1>
        <p className="text-sm text-brand-slate font-light mt-1">
          Visão consolidada de produtividade e SLA
        </p>
      </div>

      {/* Bloco 1: Métricas consolidadas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <MetricCard label="Casos processados no mês" value="287" />
        <MetricCard label="Tempo médio de tratativa" value="4h 32min" />
        <MetricCard label="Taxa de envio ao ServiceNow" value="94%" />
        <MetricCard label="SLA cumprido" value="89%" />
      </div>

      {/* Bloco 2: Produtividade por analista */}
      <div className="bg-white rounded-xl border border-gray-100 p-6 mb-8">
        <h2 className="text-base font-semibold text-brand-dark mb-4">
          Produtividade por analista
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-brand-offwhite">
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide text-brand-slate rounded-l-lg">
                  Analista
                </th>
                <th className="text-right px-4 py-3 text-xs font-semibold uppercase tracking-wide text-brand-slate">
                  Distribuídos
                </th>
                <th className="text-right px-4 py-3 text-xs font-semibold uppercase tracking-wide text-brand-slate">
                  Em tratativa
                </th>
                <th className="text-right px-4 py-3 text-xs font-semibold uppercase tracking-wide text-brand-slate">
                  Enviados ao ServiceNow
                </th>
                <th className="text-right px-4 py-3 text-xs font-semibold uppercase tracking-wide text-brand-slate">
                  Tempo médio
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide text-brand-slate rounded-r-lg w-44">
                  Carga atual
                </th>
              </tr>
            </thead>
            <tbody>
              {ANALISTAS_PRODUTIVIDADE.map((a) => {
                const isOverloaded = a.carga >= 90
                return (
                  <tr key={a.nome} className="border-t border-gray-50 hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-brand-dark">{a.nome}</td>
                    <td className="px-4 py-3 text-right text-brand-slate">{a.distribuidos}</td>
                    <td className="px-4 py-3 text-right text-brand-slate">{a.emTratativa}</td>
                    <td className="px-4 py-3 text-right text-brand-slate">{a.enviados}</td>
                    <td className="px-4 py-3 text-right text-brand-slate">{a.tempoMedio}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${isOverloaded ? '' : 'bg-brand-mid'}`}
                            style={{
                              width: `${a.carga}%`,
                              ...(isOverloaded ? { backgroundColor: '#F59E0B' } : {}),
                            }}
                          />
                        </div>
                        <span className="text-xs text-brand-slate w-8 text-right shrink-0">
                          {a.carga}%
                        </span>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bloco 3: SLA por etapa */}
      <div className="bg-white rounded-xl border border-gray-100 p-6 mb-8">
        <h2 className="text-base font-semibold text-brand-dark mb-4">
          Tempo médio por etapa
        </h2>
        <div className="flex flex-col md:flex-row items-stretch">
          {ETAPAS_SLA.map((etapa, i) => (
            <Fragment key={etapa.etapa}>
              <div className="flex-1 bg-brand-offwhite rounded-xl px-5 py-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-brand-slate mb-2">
                  {etapa.etapa}
                </p>
                <p className="text-2xl font-semibold text-brand-dark">{etapa.tempo}</p>
                <p
                  className={`text-xs font-medium mt-1 ${
                    etapa.variacao < 0 ? 'text-green-600' : 'text-red-500'
                  }`}
                >
                  {etapa.variacao > 0 ? '+' : ''}
                  {etapa.variacao}% vs mês anterior
                </p>
              </div>
              {i < ETAPAS_SLA.length - 1 && (
                <>
                  <div className="hidden md:flex items-center justify-center px-2 text-gray-300 text-lg shrink-0">
                    &#8594;
                  </div>
                  <div className="md:hidden h-px bg-gray-100 my-3" />
                </>
              )}
            </Fragment>
          ))}
        </div>
      </div>

      {/* Bloco 4: Volume por tipo de subsídio */}
      <div className="bg-white rounded-xl border border-gray-100 p-6 mb-8">
        <h2 className="text-base font-semibold text-brand-dark mb-6">
          Volume por tipo de subsídio
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="flex justify-center">
            <svg
              viewBox="0 0 220 220"
              width="220"
              height="220"
              aria-label="Gráfico de volume por tipo de subsídio"
            >
              {slices.map((slice) => (
                <path
                  key={slice.tipo}
                  d={donutArc(110, 110, 90, 55, slice.startAngle, slice.endAngle)}
                  fill={slice.cor}
                />
              ))}
              <text
                x="110"
                y="108"
                textAnchor="middle"
                dominantBaseline="auto"
                style={{ fontSize: 28, fontWeight: 600, fill: '#023631' }}
              >
                287
              </text>
              <text
                x="110"
                y="124"
                textAnchor="middle"
                dominantBaseline="auto"
                style={{ fontSize: 11, fill: '#4A545E' }}
              >
                casos no mês
              </text>
            </svg>
          </div>

          <div className="flex flex-col gap-3">
            {VOLUME_TIPOS.map((item) => (
              <div key={item.tipo} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className="w-3 h-3 rounded-full shrink-0"
                    style={{ backgroundColor: item.cor }}
                  />
                  <span className="text-sm text-brand-slate">{item.tipo}</span>
                </div>
                <span className="text-sm font-semibold text-brand-dark">{item.percentual}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bloco 5: Fila crítica */}
      <div className="bg-white rounded-xl border border-gray-100 p-6 mb-8">
        <div className="mb-4">
          <h2 className="text-base font-semibold text-brand-dark">Casos com prazo crítico</h2>
          <p className="text-xs text-brand-slate font-light">
            Ordenados por data de vencimento
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-brand-offwhite">
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide text-brand-slate rounded-l-lg">
                  Nº do Processo
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide text-brand-slate">
                  Tipo de subsídio
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide text-brand-slate">
                  Analista responsável
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide text-brand-slate">
                  Vence em
                </th>
                <th className="text-right px-4 py-3 text-xs font-semibold uppercase tracking-wide text-brand-slate rounded-r-lg">
                  Valor estimado
                </th>
              </tr>
            </thead>
            <tbody>
              {FILA_CRITICA.map((caso) => {
                const isCritical = caso.horasRestantes < 24
                const isWarning = caso.horasRestantes >= 24 && caso.horasRestantes < 48
                const badgeClass = isCritical
                  ? 'bg-red-100 text-red-700'
                  : isWarning
                    ? 'bg-orange-100 text-orange-700'
                    : 'bg-gray-100 text-gray-600'
                return (
                  <tr key={caso.numero} className="border-t border-gray-50 hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono text-xs">
                      {caso.id ? (
                        <Link
                          href={`/tratativas/${caso.id}`}
                          className="text-brand-mid hover:text-brand-dark transition-colors hover:underline"
                        >
                          {caso.numero}
                        </Link>
                      ) : (
                        <span className="text-brand-dark">{caso.numero}</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-brand-slate">{caso.tipo}</td>
                    <td className="px-4 py-3 text-brand-slate">{caso.analista}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${badgeClass}`}
                      >
                        {caso.venteEm}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-brand-dark">
                      {formatCurrency(caso.valor)}
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
