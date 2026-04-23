'use client'

import { useRouter } from 'next/navigation'
import { useTarefas } from '@/context/TarefasContext'
import { useAtivaPersona } from '@/context/PersonaContext'
import PersonaGuard from '@/components/PersonaGuard'
import StatusTarefaBadge from '@/components/estoque/StatusTarefaBadge'
import ProdutoBadge from '@/components/estoque/ProdutoBadge'

function diasRelativo(dataIso: string): string {
  const dias = Math.floor((Date.now() - new Date(dataIso).getTime()) / 86_400_000)
  if (dias === 0) return 'hoje'
  if (dias === 1) return '1 dia'
  return `${dias} dias`
}

function TratativasContent() {
  const { tarefas } = useTarefas()
  const { config } = useAtivaPersona()
  const router = useRouter()

  const minhasTarefas = tarefas.filter(
    (t) =>
      t.analista === config.nome &&
      (t.status === 'Em Andamento' || t.status === 'A Iniciar')
  )

  return (
    <div className="max-w-screen-lg mx-auto px-6 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-brand-dark">Minhas Tratativas</h1>
        <p className="text-sm text-brand-slate font-light mt-1">
          {config.nome} — {minhasTarefas.length}{' '}
          {minhasTarefas.length === 1 ? 'caso' : 'casos'} em andamento
        </p>
      </div>

      {minhasTarefas.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-brand-slate">
          <svg
            className="w-10 h-10 opacity-30 mb-3"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <span className="text-sm font-light">Nenhuma tarefa atribuída a você no momento</span>
          <span className="text-xs font-light mt-1 text-center text-brand-slate/70">
            Quando o gestor distribuir tarefas, elas aparecerão aqui
          </span>
          <button
            onClick={() => router.push('/estoque')}
            className="mt-4 text-sm font-semibold text-brand-mid hover:underline"
          >
            Ver estoque completo
          </button>
        </div>
      )}

      <div className="flex flex-col gap-4">
        {minhasTarefas.map((tarefa) => (
          <div
            key={tarefa.numero}
            className="bg-white rounded-xl border border-gray-100 p-5 flex items-center justify-between gap-4"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-sm font-semibold text-brand-dark">{tarefa.numero}</span>
                <StatusTarefaBadge status={tarefa.status} />
              </div>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-brand-slate font-light mb-1">
                <ProdutoBadge produto={tarefa.produto} />
                <span>{tarefa.tarefa}</span>
                <span>GCPJ {tarefa.numeroGCPJ}</span>
              </div>
              <div className="text-xs text-brand-slate font-light">
                Criada há {diasRelativo(tarefa.criacaoEm)} · Atualizada há{' '}
                {diasRelativo(tarefa.atualizacaoEm)}
              </div>
            </div>

            <button
              onClick={() => router.push(`/tratativas/${tarefa.numero}`)}
              className="shrink-0 flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-brand-dark rounded-lg hover:bg-brand-hover transition-colors"
            >
              Abrir tratativa
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function TratativasPage() {
  return (
    <PersonaGuard permitidas={['operador']}>
      <TratativasContent />
    </PersonaGuard>
  )
}
