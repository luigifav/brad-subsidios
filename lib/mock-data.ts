// TODO: substituir mock por dados reais de APIs dos sistemas do banco e tribunal

export type ProcessoStatus =
  | 'Na fila'
  | 'Distribuído'
  | 'Em tratativa'
  | 'Enviado ao ServiceNow'
  | 'Concluído'

export type TipoSubsidio =
  | 'Dano Moral'
  | 'Revisional'
  | 'Cobrança Indevida'
  | 'Fraude'
  | 'Negativação Indevida'

export type TipoRisco = 'Baixo' | 'Médio' | 'Alto' | 'Crítico'
export type Probabilidade = 'Remota' | 'Possível' | 'Provável' | 'Certa'
export type Estrategia =
  | 'Pagar integralmente'
  | 'Propor acordo'
  | 'Contestar'
  | 'Encaminhar ao jurídico externo'

export type DocumentoStatus = 'idle' | 'loading' | 'found' | 'unavailable'

export type StatusServiceNow =
  | 'aguardando'
  | 'em_geracao'
  | 'laudo_gerado'
  | 'entregue'
  | 'pendencia'

export interface Analise {
  tipoRisco?: TipoRisco
  probabilidade?: Probabilidade
  valorRecomendado?: string
  fundamento?: string
  estrategia?: Estrategia
  precedentes?: string
  observacoesInternas?: string
}

export interface Processo {
  id: string
  numero: string
  produto: string
  vara: string
  comarca: string
  tribunal: string
  tipoSubsidio: TipoSubsidio
  tipoAcao: string
  faseProcessual: string
  valorCausa: number
  dataEntrada: string
  dataDistribuicao: string
  status: ProcessoStatus
  analistaResponsavel: string | null
  nomeAutor: string
  cpfAutor: string
  advogadoAutor: string
  oabAdvogadoAutor: string
  advogadoReu: string
  analise?: Analise
  protocoloServiceNow?: string
  statusServiceNow?: StatusServiceNow
  tempoDesdeEnvio?: string
  timestampEnvio?: string
  pendenciaDescricao?: string
}

export interface DocumentoBanco {
  nome: string
  tipo: string
  resolveMs: number
  resultado: 'found' | 'unavailable'
  status: DocumentoStatus
}

export const DOCUMENTOS_CESTAS: DocumentoBanco[] = [
  { nome: 'LAUDO', tipo: 'PDF', resolveMs: 1200, resultado: 'found', status: 'idle' },
  { nome: 'EXTRATO', tipo: 'PDF', resolveMs: 1800, resultado: 'found', status: 'idle' },
  { nome: 'TERMO DE CESTA', tipo: 'PDF', resolveMs: 2100, resultado: 'found', status: 'idle' },
  { nome: 'LIGAÇÃO - FONE FÁCIL', tipo: 'ÁUDIO', resolveMs: 2800, resultado: 'found', status: 'idle' },
  { nome: 'LOG', tipo: 'TXT', resolveMs: 3200, resultado: 'unavailable', status: 'idle' },
  { nome: 'TELA TRAG', tipo: 'IMG', resolveMs: 3500, resultado: 'unavailable', status: 'idle' },
]

export const MOCK_PROCESSOS: Processo[] = [
  {
    id: 'proc-001',
    numero: '0012345-67.2023.8.26.0100',
    produto: 'Cestas de Serviços',
    vara: '2ª Vara Cível',
    comarca: 'Santo André',
    tribunal: 'TJSP',
    tipoSubsidio: 'Dano Moral',
    tipoAcao: 'Ação de Indenização por Dano Moral',
    faseProcessual: 'Conhecimento',
    valorCausa: 15000,
    dataEntrada: '2024-01-15',
    dataDistribuicao: '2023-11-08',
    status: 'Na fila',
    analistaResponsavel: null,
    nomeAutor: 'Marcos Antônio Ferreira',
    cpfAutor: '345.678.901-23',
    advogadoAutor: 'Dr. Rogério Alves',
    oabAdvogadoAutor: 'OAB/SP 198.432',
    advogadoReu: 'Dra. Beatriz Cardoso',
  },
  {
    id: 'proc-002',
    numero: '0023456-78.2023.8.26.0200',
    produto: 'Cestas de Serviços',
    vara: '4ª Vara Cível',
    comarca: 'Guarulhos',
    tribunal: 'TJSP',
    tipoSubsidio: 'Revisional',
    tipoAcao: 'Ação Revisional de Contrato Bancário',
    faseProcessual: 'Recursal',
    valorCausa: 45000,
    dataEntrada: '2024-01-18',
    dataDistribuicao: '2023-09-22',
    status: 'Na fila',
    analistaResponsavel: null,
    nomeAutor: 'Fernanda Costa Lima',
    cpfAutor: '456.789.012-34',
    advogadoAutor: 'Dr. Cláudio Martins',
    oabAdvogadoAutor: 'OAB/SP 210.554',
    advogadoReu: 'Dr. Henrique Souza',
  },
  {
    id: 'proc-003',
    numero: '0034567-89.2024.8.26.0053',
    produto: 'Cestas de Serviços',
    vara: '1ª Vara Cível Central',
    comarca: 'São Paulo',
    tribunal: 'TJSP',
    tipoSubsidio: 'Cobrança Indevida',
    tipoAcao: 'Ação de Repetição de Indébito',
    faseProcessual: 'Conhecimento',
    valorCausa: 8500,
    dataEntrada: '2024-02-03',
    dataDistribuicao: '2024-01-10',
    status: 'Na fila',
    analistaResponsavel: null,
    nomeAutor: 'Paulo Roberto Nascimento',
    cpfAutor: '567.890.123-45',
    advogadoAutor: 'Dra. Marina Santos',
    oabAdvogadoAutor: 'OAB/SP 178.001',
    advogadoReu: 'Dr. Renato Pires',
  },
  {
    id: 'proc-004',
    numero: '0045678-90.2024.8.26.0300',
    produto: 'Cestas de Serviços',
    vara: '6ª Vara Cível',
    comarca: 'Campinas',
    tribunal: 'TJSP',
    tipoSubsidio: 'Fraude',
    tipoAcao: 'Ação de Indenização por Fraude Bancária',
    faseProcessual: 'Execução',
    valorCausa: 120000,
    dataEntrada: '2024-02-10',
    dataDistribuicao: '2024-01-25',
    status: 'Na fila',
    analistaResponsavel: null,
    nomeAutor: 'Júlia Aparecida Mendes',
    cpfAutor: '678.901.234-56',
    advogadoAutor: 'Dr. Eduardo Rocha',
    oabAdvogadoAutor: 'OAB/SP 245.789',
    advogadoReu: 'Dra. Simone Castro',
  },
  {
    id: 'proc-005',
    numero: '0056789-01.2023.8.26.0408',
    produto: 'Cestas de Serviços',
    vara: '3ª Vara Cível',
    comarca: 'Osasco',
    tribunal: 'TJSP',
    tipoSubsidio: 'Negativação Indevida',
    tipoAcao: 'Ação de Cancelamento de Apontamento',
    faseProcessual: 'Conhecimento',
    valorCausa: 5800,
    dataEntrada: '2024-02-15',
    dataDistribuicao: '2023-12-05',
    status: 'Na fila',
    analistaResponsavel: null,
    nomeAutor: 'Ricardo Sousa Pinto',
    cpfAutor: '789.012.345-67',
    advogadoAutor: 'Dra. Priscila Melo',
    oabAdvogadoAutor: 'OAB/SP 192.344',
    advogadoReu: 'Dr. Flávio Nogueira',
  },
  {
    id: 'proc-006',
    numero: '0067890-12.2024.8.26.0501',
    produto: 'Cestas de Serviços',
    vara: '1ª Vara Cível',
    comarca: 'Barueri',
    tribunal: 'TJSP',
    tipoSubsidio: 'Dano Moral',
    tipoAcao: 'Ação de Indenização por Dano Moral',
    faseProcessual: 'Recursal',
    valorCausa: 25000,
    dataEntrada: '2024-02-20',
    dataDistribuicao: '2024-01-30',
    status: 'Na fila',
    analistaResponsavel: null,
    nomeAutor: 'Camila Rodrigues Almeida',
    cpfAutor: '890.123.456-78',
    advogadoAutor: 'Dr. Tiago Lopes',
    oabAdvogadoAutor: 'OAB/SP 267.890',
    advogadoReu: 'Dra. Adriana Fonseca',
  },
  {
    id: 'proc-007',
    numero: '0078901-23.2023.8.26.0564',
    produto: 'Cestas de Serviços',
    vara: '5ª Vara Cível',
    comarca: 'São Bernardo do Campo',
    tribunal: 'TJSP',
    tipoSubsidio: 'Revisional',
    tipoAcao: 'Ação Revisional de Cláusulas Contratuais',
    faseProcessual: 'Execução',
    valorCausa: 67000,
    dataEntrada: '2024-02-25',
    dataDistribuicao: '2023-10-14',
    status: 'Na fila',
    analistaResponsavel: null,
    nomeAutor: 'Bruno Henrique Oliveira',
    cpfAutor: '901.234.567-89',
    advogadoAutor: 'Dra. Letícia Campos',
    oabAdvogadoAutor: 'OAB/SP 155.672',
    advogadoReu: 'Dr. Samuel Tavares',
  },
  {
    id: 'proc-008',
    numero: '0089012-34.2024.8.26.0053',
    produto: 'Cestas de Serviços',
    vara: '3ª Vara Cível Central',
    comarca: 'São Paulo',
    tribunal: 'TJSP',
    tipoSubsidio: 'Cobrança Indevida',
    tipoAcao: 'Ação de Repetição de Indébito Cumulada com Dano Moral',
    faseProcessual: 'Conhecimento',
    valorCausa: 12000,
    dataEntrada: '2024-03-01',
    dataDistribuicao: '2024-02-08',
    status: 'Na fila',
    analistaResponsavel: null,
    nomeAutor: 'Vanessa Cristina Barbosa',
    cpfAutor: '012.345.678-90',
    advogadoAutor: 'Dr. Fabrício Lima',
    oabAdvogadoAutor: 'OAB/SP 301.456',
    advogadoReu: 'Dr. André Monteiro',
  },
  {
    id: 'proc-009',
    numero: '0090123-45.2024.8.26.0053',
    produto: 'Cestas de Serviços',
    vara: '5ª Vara Cível Central',
    comarca: 'São Paulo',
    tribunal: 'TJSP',
    tipoSubsidio: 'Dano Moral',
    tipoAcao: 'Ação de Indenização por Dano Moral e Material',
    faseProcessual: 'Recursal',
    valorCausa: 35000,
    dataEntrada: '2024-03-05',
    dataDistribuicao: '2024-02-12',
    status: 'Distribuído',
    analistaResponsavel: 'Ana Costa',
    nomeAutor: 'Luciana Ferreira Gomes',
    cpfAutor: '123.456.789-01',
    advogadoAutor: 'Dr. Marcelo Vieira',
    oabAdvogadoAutor: 'OAB/SP 188.923',
    advogadoReu: 'Dra. Patrícia Duarte',
  },
  {
    id: 'proc-010',
    numero: '0101234-56.2023.8.26.0300',
    produto: 'Cestas de Serviços',
    vara: '8ª Vara Cível',
    comarca: 'Campinas',
    tribunal: 'TJSP',
    tipoSubsidio: 'Fraude',
    tipoAcao: 'Ação de Indenização por Fraude Eletrônica',
    faseProcessual: 'Conhecimento',
    valorCausa: 178500,
    dataEntrada: '2024-03-08',
    dataDistribuicao: '2023-08-17',
    status: 'Distribuído',
    analistaResponsavel: 'Ana Costa',
    nomeAutor: 'Diego Augusto Pereira',
    cpfAutor: '234.567.890-12',
    advogadoAutor: 'Dra. Roberta Carvalho',
    oabAdvogadoAutor: 'OAB/SP 223.785',
    advogadoReu: 'Dr. Guilherme Prates',
  },
  {
    id: 'proc-011',
    numero: '0112345-67.2024.8.26.0408',
    produto: 'Cestas de Serviços',
    vara: '2ª Vara Cível',
    comarca: 'Osasco',
    tribunal: 'TJSP',
    tipoSubsidio: 'Negativação Indevida',
    tipoAcao: 'Ação Declaratória de Inexistência de Débito',
    faseProcessual: 'Conhecimento',
    valorCausa: 22000,
    dataEntrada: '2024-03-12',
    dataDistribuicao: '2024-01-19',
    status: 'Distribuído',
    analistaResponsavel: 'Ana Costa',
    nomeAutor: 'Tatiana Moreira Silva',
    cpfAutor: '345.678.901-23',
    advogadoAutor: 'Dr. Leonardo Azevedo',
    oabAdvogadoAutor: 'OAB/SP 279.102',
    advogadoReu: 'Dra. Carla Neves',
  },
  {
    id: 'proc-012',
    numero: '0123456-78.2024.8.26.0053',
    produto: 'Cestas de Serviços',
    vara: '2ª Vara Cível Central',
    comarca: 'São Paulo',
    tribunal: 'TJSP',
    tipoSubsidio: 'Cobrança Indevida',
    tipoAcao: 'Ação de Repetição de Indébito',
    faseProcessual: 'Conhecimento',
    valorCausa: 9500,
    dataEntrada: '2024-03-15',
    dataDistribuicao: '2024-02-20',
    status: 'Em tratativa',
    analistaResponsavel: 'Ana Costa',
    nomeAutor: 'Anderson Luís Correia',
    cpfAutor: '456.789.012-34',
    advogadoAutor: 'Dra. Viviane Esteves',
    oabAdvogadoAutor: 'OAB/SP 165.890',
    advogadoReu: 'Dr. Caio Braga',
  },
  {
    id: 'proc-013',
    numero: '0134567-89.2023.8.26.0564',
    produto: 'Cestas de Serviços',
    vara: '7ª Vara Cível',
    comarca: 'São Bernardo do Campo',
    tribunal: 'TJSP',
    tipoSubsidio: 'Revisional',
    tipoAcao: 'Ação Revisional de Contrato de Empréstimo',
    faseProcessual: 'Execução',
    valorCausa: 88000,
    dataEntrada: '2024-03-18',
    dataDistribuicao: '2023-07-03',
    status: 'Em tratativa',
    analistaResponsavel: 'Ana Costa',
    nomeAutor: 'Gabriela Souza Ramos',
    cpfAutor: '567.890.123-45',
    advogadoAutor: 'Dr. Rafael Teixeira',
    oabAdvogadoAutor: 'OAB/SP 241.337',
    advogadoReu: 'Dra. Isabela Cunha',
  },
  {
    id: 'proc-014',
    numero: '0145678-90.2024.8.26.0053',
    produto: 'Cestas de Serviços',
    vara: '7ª Vara Cível Central',
    comarca: 'São Paulo',
    tribunal: 'TJSP',
    tipoSubsidio: 'Dano Moral',
    tipoAcao: 'Ação de Indenização por Dano Moral',
    faseProcessual: 'Conhecimento',
    valorCausa: 43000,
    dataEntrada: '2024-03-20',
    dataDistribuicao: '2024-02-28',
    status: 'Distribuído',
    analistaResponsavel: 'Pedro Lima',
    nomeAutor: 'Sérgio Medeiros Filho',
    cpfAutor: '678.901.234-56',
    advogadoAutor: 'Dra. Amanda Xavier',
    oabAdvogadoAutor: 'OAB/SP 198.004',
    advogadoReu: 'Dr. Thiago Mota',
  },
  {
    id: 'proc-015',
    numero: '0156789-01.2024.8.26.0200',
    produto: 'Cestas de Serviços',
    vara: '1ª Vara Cível',
    comarca: 'Guarulhos',
    tribunal: 'TJSP',
    tipoSubsidio: 'Fraude',
    tipoAcao: 'Ação de Indenização por Fraude em Conta Corrente',
    faseProcessual: 'Recursal',
    valorCausa: 156000,
    dataEntrada: '2024-03-22',
    dataDistribuicao: '2024-01-05',
    status: 'Concluído',
    analistaResponsavel: 'Carla Mendes',
    nomeAutor: 'Patrícia Helena Borges',
    cpfAutor: '789.012.345-67',
    advogadoAutor: 'Dr. Fernando Macedo',
    oabAdvogadoAutor: 'OAB/SP 312.088',
    advogadoReu: 'Dra. Juliana Freitas',
    protocoloServiceNow: 'SN-2024-00731',
    statusServiceNow: 'entregue',
    tempoDesdeEnvio: '2d 4h',
    timestampEnvio: '2024-01-07T10:00:00.000Z',
  },
]

export const ANALISTAS = [
  'Ana Costa',
  'Pedro Lima',
  'Carla Mendes',
  'João Ferreira',
]

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

export function formatDate(isoDate: string): string {
  const [year, month, day] = isoDate.split('-')
  return `${day}/${month}/${year}`
}

export function maskCPF(cpf: string): string {
  const digits = cpf.replace(/\D/g, '')
  if (digits.length !== 11) return '***.***.***-**'
  return `***.***.${digits.slice(6, 9)}-${digits.slice(9, 11)}`
}
