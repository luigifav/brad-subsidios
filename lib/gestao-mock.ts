export interface AnalistaProdutividade {
  nome: string
  distribuidos: number
  emTratativa: number
  enviados: number
  tempoMedio: string
  carga: number
}

export interface EtapaSLA {
  etapa: string
  tempo: string
  variacao: number
}

export interface VolumeTipo {
  tipo: string
  percentual: number
  cor: string
}

export interface CasoCritico {
  id: string | null
  numero: string
  tipo: string
  analista: string
  venteEm: string
  horasRestantes: number
  valor: number
}

export const ANALISTAS_PRODUTIVIDADE: AnalistaProdutividade[] = [
  { nome: 'Ana Costa', distribuidos: 24, emTratativa: 3, enviados: 18, tempoMedio: '3h 42min', carga: 75 },
  { nome: 'Pedro Lima', distribuidos: 19, emTratativa: 2, enviados: 15, tempoMedio: '4h 15min', carga: 60 },
  { nome: 'Carla Mendes', distribuidos: 31, emTratativa: 4, enviados: 24, tempoMedio: '3h 18min', carga: 95 },
  { nome: 'João Ferreira', distribuidos: 17, emTratativa: 1, enviados: 14, tempoMedio: '5h 02min', carga: 45 },
]

export const ETAPAS_SLA: EtapaSLA[] = [
  { etapa: 'Na fila', tempo: '1d 4h', variacao: -12 },
  { etapa: 'Distribuído para Em tratativa', tempo: '2h 18min', variacao: -5 },
  { etapa: 'Em tratativa', tempo: '4h 32min', variacao: 3 },
  { etapa: 'Enviado ao ServiceNow', tempo: '38min', variacao: -22 },
]

export const VOLUME_TIPOS: VolumeTipo[] = [
  { tipo: 'Dano Moral', percentual: 35, cor: '#023631' },
  { tipo: 'Revisional', percentual: 22, cor: '#075056' },
  { tipo: 'Cobrança Indevida', percentual: 18, cor: '#0A5A52' },
  { tipo: 'Fraude', percentual: 15, cor: '#2A7C79' },
  { tipo: 'Negativação Indevida', percentual: 10, cor: '#0E4442' },
]

export const FILA_CRITICA: CasoCritico[] = [
  {
    id: 'proc-012',
    numero: '0123456-78.2024.8.26.0053',
    tipo: 'Cobrança Indevida',
    analista: 'Ana Costa',
    venteEm: 'em 8h',
    horasRestantes: 8,
    valor: 9500,
  },
  {
    id: 'proc-013',
    numero: '0134567-89.2023.8.26.0564',
    tipo: 'Revisional',
    analista: 'Ana Costa',
    venteEm: 'em 16h',
    horasRestantes: 16,
    valor: 88000,
  },
  {
    id: null,
    numero: '0167890-12.2024.8.26.0100',
    tipo: 'Dano Moral',
    analista: 'Carla Mendes',
    venteEm: 'em 22h',
    horasRestantes: 22,
    valor: 31500,
  },
  {
    id: null,
    numero: '0189012-34.2024.8.26.0200',
    tipo: 'Fraude',
    analista: 'Pedro Lima',
    venteEm: 'em 36h',
    horasRestantes: 36,
    valor: 120000,
  },
  {
    id: null,
    numero: '0201234-56.2024.8.26.0300',
    tipo: 'Negativação Indevida',
    analista: 'João Ferreira',
    venteEm: 'em 44h',
    horasRestantes: 44,
    valor: 15000,
  },
]
