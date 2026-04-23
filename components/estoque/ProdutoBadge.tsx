import { Produto } from '@/lib/tarefas-mock'

const CORES: Record<Produto, { bg: string; text: string }> = {
  'Consignado Bradesco': { bg: '#023631', text: '#023631' },
  'Cesta de Serviços': { bg: '#075056', text: '#075056' },
  'Contas': { bg: '#0A5A52', text: '#0A5A52' },
}

export default function ProdutoBadge({ produto }: { produto: Produto }) {
  const cor = CORES[produto]
  return (
    <span
      className="rounded-full px-2.5 py-0.5 text-xs font-semibold inline-flex"
      style={{ backgroundColor: `${cor.bg}22`, color: cor.text }}
    >
      {produto}
    </span>
  )
}
