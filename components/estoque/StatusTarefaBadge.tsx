import { TarefaStatus } from '@/lib/tarefas-mock'

const ESTILOS: Record<TarefaStatus, string> = {
  'A Iniciar': 'bg-gray-100 text-gray-600',
  'Em Andamento': 'bg-amber-100 text-amber-700',
  'Devolvido (Internamente)': 'bg-orange-100 text-orange-700',
  'Pendente Regularização': 'bg-red-100 text-red-700',
  'Concluída': 'bg-emerald-100 text-emerald-700',
}

export default function StatusTarefaBadge({ status }: { status: TarefaStatus }) {
  return (
    <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold inline-flex ${ESTILOS[status]}`}>
      {status}
    </span>
  )
}
