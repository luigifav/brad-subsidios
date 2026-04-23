'use client'

import { Processo, Analise } from '@/lib/mock-data'
import ChamadosDoCaso from './ChamadosDoCaso'
import StatusServiceNowCompacto from './StatusServiceNowCompacto'
import Timeline from './Timeline'

interface SidePanelProps {
  processo: Processo
  analise: Analise
  docsComplete: boolean
}

export default function SidePanel({ processo, analise, docsComplete }: SidePanelProps) {
  const showServiceNow =
    processo.status === 'Enviado ao ServiceNow' || processo.status === 'Concluído'

  return (
    <div className="sticky top-24 max-w-[380px] w-full">
      {/* Painel 1: Chamados vinculados */}
      <div className="bg-white rounded-xl border border-gray-100 p-4 mb-4">
        <ChamadosDoCaso processoId={processo.id} />
      </div>

      {/* Painel 2: Status no ServiceNow (só aparece após envio) */}
      {showServiceNow && (
        <div className="bg-white rounded-xl border border-gray-100 p-4 mb-4">
          <StatusServiceNowCompacto processo={processo} />
        </div>
      )}

      {/* Painel 3: Histórico do caso */}
      <div className="bg-white rounded-xl border border-gray-100 p-4 mb-4">
        <h3 className="text-sm font-semibold text-brand-dark mb-3">Histórico do caso</h3>
        <Timeline
          processo={processo}
          analise={analise}
          docsComplete={docsComplete}
          panelMode
        />
      </div>
    </div>
  )
}
