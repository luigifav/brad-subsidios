'use client'

import Link from 'next/link'
import { useChamados } from '@/context/ChamadosContext'
import StatusChamadoBadge from '@/components/chamados/StatusChamadoBadge'
import SLABadge from '@/components/chamados/SLABadge'

interface ChamadosDoCasoProps {
  processoId: string
}

export default function ChamadosDoCaso({ processoId }: ChamadosDoCasoProps) {
  const { getChamadosDoCaso } = useChamados()
  const chamados = getChamadosDoCaso(processoId)

  return (
    <div>
      <h3 className="text-sm font-semibold text-brand-dark mb-3">Chamados vinculados</h3>

      {chamados.length === 0 ? (
        <p className="text-xs text-brand-slate font-light">
          Nenhum chamado aberto para este processo
        </p>
      ) : (
        <ul className="divide-y divide-gray-100">
          {chamados.map((c) => (
            <li key={c.id} className="py-2.5 first:pt-0 last:pb-0">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="font-semibold text-xs text-brand-dark truncate">{c.documentoSolicitado}</p>
                  <p className="text-xs text-brand-slate font-light">{c.area}</p>
                </div>
                <div className="flex flex-col items-end gap-1 shrink-0">
                  <StatusChamadoBadge status={c.status} />
                  <SLABadge slaHoras={c.slaHoras} dataAbertura={c.dataAbertura} status={c.status} />
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-3 pt-3 border-t border-gray-100">
        <Link
          href={`/chamados?processoId=${processoId}`}
          className="text-xs font-semibold text-brand-mid hover:underline"
        >
          Ver todos os chamados →
        </Link>
      </div>
    </div>
  )
}
