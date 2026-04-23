// TODO: substituir reavaliação via reducer por job agendado server-side

import { Chamado } from './mock-data'

export const MINIMO_DOCS_PARA_LAUDO = 4

interface ResultadoAguardar {
  acao: 'aguardar'
  motivo: string
  chamadosAbertos: number
}

interface ResultadoEnviarServiceNow {
  acao: 'enviar_servicenow'
  motivo: string
}

interface ResultadoEscalarGestor {
  acao: 'escalar_gestor'
  motivo: string
  chamadosPendentes: Chamado[]
}

export type ResultadoReavaliacao =
  | ResultadoAguardar
  | ResultadoEnviarServiceNow
  | ResultadoEscalarGestor

export function reavaliarCaso(
  processoId: string,
  chamados: Chamado[],
  docsEncontrados: number = 4,
): ResultadoReavaliacao {
  const chamadosDoCaso = chamados.filter(
    (c) => c.processoId === processoId && c.status !== 'cancelado',
  )

  const abertos = chamadosDoCaso.filter((c) => c.status === 'aberto')
  if (abertos.length > 0) {
    return {
      acao: 'aguardar',
      motivo: `${abertos.length} chamado(s) ainda em aberto aguardando resposta das áreas.`,
      chamadosAbertos: abertos.length,
    }
  }

  const comDoc = chamadosDoCaso.filter((c) => c.status === 'respondido_com_doc').length
  const totalDocs = docsEncontrados + comDoc

  if (totalDocs >= MINIMO_DOCS_PARA_LAUDO) {
    return {
      acao: 'enviar_servicenow',
      motivo: `${totalDocs} documentos reunidos. Documentação suficiente para geração do laudo.`,
    }
  }

  const pendentes = chamadosDoCaso.filter(
    (c) => c.status === 'sla_estourado' || c.status === 'respondido_sem_doc',
  )

  return {
    acao: 'escalar_gestor',
    motivo: `Apenas ${totalDocs} de ${MINIMO_DOCS_PARA_LAUDO} documentos mínimos reunidos após encerramento dos chamados.`,
    chamadosPendentes: pendentes,
  }
}
