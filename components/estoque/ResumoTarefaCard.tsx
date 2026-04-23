import Link from 'next/link'
import { Tarefa } from '@/lib/tarefas-mock'
import ProdutoBadge from './ProdutoBadge'
import StatusTarefaBadge from './StatusTarefaBadge'

interface Props {
  tarefa: Tarefa
  outrasCount: number
}

export default function ResumoTarefaCard({ tarefa, outrasCount }: Props) {
  return (
    <div className="border-l-4 bg-white p-4 rounded-lg mb-6" style={{ borderLeftColor: '#075056' }}>
      <div className="flex items-center gap-3 flex-wrap">
        <span className="text-sm font-semibold text-brand-dark">Tarefa {tarefa.numero}</span>
        <ProdutoBadge produto={tarefa.produto} />
        <StatusTarefaBadge status={tarefa.status} />
      </div>
      <p className="text-xs text-brand-slate mt-1.5">
        Parte do caso GCPJ {tarefa.numeroGCPJ}
      </p>
      {outrasCount > 0 && (
        <p className="text-xs text-brand-slate mt-1">
          Há {outrasCount} {outrasCount === 1 ? 'outra tarefa' : 'outras tarefas'} deste caso.{' '}
          <Link
            href={`/estoque?gcpj=${tarefa.numeroGCPJ}`}
            className="font-semibold text-brand-mid hover:underline"
          >
            Ver todas
          </Link>
        </p>
      )}
    </div>
  )
}
