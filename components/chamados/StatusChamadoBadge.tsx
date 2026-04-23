import { ChamadoStatus } from '@/lib/mock-data'

const CORES: Record<ChamadoStatus, string> = {
  aberto: 'bg-yellow-100 text-yellow-700',
  respondido_com_doc: 'bg-green-100 text-green-700',
  respondido_sem_doc: 'bg-orange-100 text-orange-700',
  sla_estourado: 'bg-red-100 text-red-700',
  cancelado: 'bg-gray-100 text-gray-500',
}

const LABELS: Record<ChamadoStatus, string> = {
  aberto: 'Aberto',
  respondido_com_doc: 'Respondido com documento',
  respondido_sem_doc: 'Respondido sem documento',
  sla_estourado: 'SLA estourado',
  cancelado: 'Cancelado',
}

interface StatusChamadoBadgeProps {
  status: ChamadoStatus
}

export default function StatusChamadoBadge({ status }: StatusChamadoBadgeProps) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${CORES[status]}`}>
      {LABELS[status]}
    </span>
  )
}
