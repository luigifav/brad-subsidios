export type Persona = 'operador' | 'gestor'

export interface PersonaConfig {
  id: Persona
  nome: string
  cargo: string
  iniciais: string
  navegacao: { href: string; label: string }[]
  rotaInicial: string
}

export const PERSONAS: Record<Persona, PersonaConfig> = {
  operador: {
    id: 'operador',
    nome: 'Ana Costa',
    cargo: 'Analista',
    iniciais: 'AC',
    navegacao: [
      { href: '/estoque', label: 'Estoque' },
      { href: '/tratativas', label: 'Tratativas' },
      { href: '/acompanhamento', label: 'Acompanhamento' },
    ],
    rotaInicial: '/estoque',
  },
  gestor: {
    id: 'gestor',
    nome: 'Maria Silva',
    cargo: 'Gestora',
    iniciais: 'MS',
    navegacao: [
      { href: '/estoque', label: 'Estoque' },
      { href: '/chamados', label: 'Chamados' },
      { href: '/acompanhamento', label: 'Acompanhamento' },
      { href: '/gestao', label: 'Gestão' },
    ],
    rotaInicial: '/gestao',
  },
}
