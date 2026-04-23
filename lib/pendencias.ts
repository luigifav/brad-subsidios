import type { Processo, Chamado } from './mock-data'

export type PendenciaTipo = 'sla' | 'resposta' | 'parado' | 'devolvido' | 'servicenow'

export interface PendenciaItem {
  id: string
  tipo: PendenciaTipo
  titulo: string
  descricao: string
  timestamp: string
  processoId: string
  href: string
}

const USUARIO_ATIVO = 'Ana Costa'

function horasRestantes(dataAbertura: string, slaHoras: number): number {
  const expira = new Date(dataAbertura).getTime() + slaHoras * 3_600_000
  return (expira - Date.now()) / 3_600_000
}

function diasDesde(data: string): number {
  return (Date.now() - new Date(data).getTime()) / 86_400_000
}

function formatRelativo(data: string): string {
  const diff = Date.now() - new Date(data).getTime()
  const mins = Math.floor(diff / 60_000)
  if (mins < 1) return 'agora'
  if (mins < 60) return `há ${mins}min`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `há ${hrs}h`
  const days = Math.floor(hrs / 24)
  if (days < 30) return `há ${days} dia${days !== 1 ? 's' : ''}`
  const months = Math.floor(days / 30)
  return `há ${months} ${months === 1 ? 'mês' : 'meses'}`
}

export function derivePendencias(cases: Processo[], chamados: Chamado[]): PendenciaItem[] {
  // TODO: filtrar por usuário ativo real
  const meusCasos = cases.filter(p => p.analistaResponsavel === USUARIO_ATIVO)
  const meusCasosIds = new Set(meusCasos.map(p => p.id))
  const meusChamados = chamados.filter(c => meusCasosIds.has(c.processoId))

  const items: PendenciaItem[] = []

  // SLA vencendo: chamado aberto com menos de 3h restantes (incluindo já vencido)
  for (const c of meusChamados) {
    if (c.status === 'aberto' && horasRestantes(c.dataAbertura, c.slaHoras) < 3) {
      const horas = horasRestantes(c.dataAbertura, c.slaHoras)
      const proc = meusCasos.find(p => p.id === c.processoId)
      const label =
        horas < 0
          ? 'Chamado com SLA vencido'
          : `Chamado vencendo em ${Math.ceil(horas)}h`
      items.push({
        id: `sla-${c.id}`,
        tipo: 'sla',
        titulo: label,
        descricao: `Processo ${proc?.numero ?? c.processoId} — ${c.documentoSolicitado}`,
        timestamp: formatRelativo(c.dataAbertura),
        processoId: c.processoId,
        href: `/tratativas/${c.processoId}`,
      })
      if (items.filter(i => i.tipo === 'sla').length >= 2) break
    }
  }

  // Resposta recebida: respondido_com_doc com dataResposta nas últimas 24h
  for (const c of meusChamados) {
    if (c.status === 'respondido_com_doc' && c.dataResposta) {
      const hrsAgo = (Date.now() - new Date(c.dataResposta).getTime()) / 3_600_000
      if (hrsAgo < 24) {
        const proc = meusCasos.find(p => p.id === c.processoId)
        items.push({
          id: `resp-${c.id}`,
          tipo: 'resposta',
          titulo: 'Documento chegou',
          descricao: `Processo ${proc?.numero ?? c.processoId} — ${c.documentoSolicitado} recebido ${formatRelativo(c.dataResposta)}`,
          timestamp: formatRelativo(c.dataResposta),
          processoId: c.processoId,
          href: `/tratativas/${c.processoId}`,
        })
        break
      }
    }
  }

  // Devolvido pelo gestor
  for (const p of meusCasos) {
    if (p.pendenteGestor) {
      items.push({
        id: `dev-${p.id}`,
        tipo: 'devolvido',
        titulo: 'Gestor devolveu com comentário',
        descricao: `Processo ${p.numero} — Revisão necessária`,
        timestamp: formatRelativo(p.dataDistribuicao),
        processoId: p.id,
        href: `/tratativas/${p.id}`,
      })
      break
    }
  }

  // ServiceNow retornou pendência
  for (const p of meusCasos) {
    if (p.statusServiceNow === 'pendencia') {
      items.push({
        id: `snow-${p.id}`,
        tipo: 'servicenow',
        titulo: 'ServiceNow retornou erro',
        descricao: `Processo ${p.numero} — ${p.pendenciaDescricao ?? 'Campo incompleto'}`,
        timestamp: p.timestampEnvio ? formatRelativo(p.timestampEnvio) : 'recentemente',
        processoId: p.id,
        href: `/acompanhamento/${p.id}`,
      })
      break
    }
  }

  // Caso parado: Em tratativa sem atividade há 2+ dias
  let paradoCount = 0
  for (const p of meusCasos) {
    if (p.status === 'Em tratativa' && diasDesde(p.dataDistribuicao) >= 2) {
      const dias = Math.floor(diasDesde(p.dataDistribuicao))
      const diasLabel = dias > 30 ? 'mais de 30' : String(dias)
      items.push({
        id: `parado-${p.id}`,
        tipo: 'parado',
        titulo: `Caso parado há ${diasLabel} dias`,
        descricao: `Processo ${p.numero} — Aguardando sua análise`,
        timestamp: formatRelativo(p.dataDistribuicao),
        processoId: p.id,
        href: `/tratativas/${p.id}`,
      })
      paradoCount++
      if (paradoCount >= 2) break
    }
  }

  return items.slice(0, 6)
}
