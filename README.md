# Subsídios Bradesco — SBK

Plataforma interna de gestão de subsídios bancários. MVP de demonstração executiva.

## Sobre o Produto

A plataforma agrega e estrutura todas as informações necessárias para instruir um processo de subsídio bancário. Ao final, envia o pacote de dados estruturado para o ServiceNow, que é responsável por gerar o laudo/parecer formal entregue ao Bradesco. A plataforma não gera o documento diretamente: ela alimenta o ServiceNow com dados completos e organizados.

O MVP demonstra o fluxo completo com dados mockados e automações simuladas por timers.

## Stack

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS v4
- React Context + useReducer (estado em memória, sem banco de dados)

## Instalação

```bash
npm install
npm run dev
```

Abrir em `http://localhost:3000` (redireciona automaticamente para `/estoque`).

## Páginas

### Estoque (`/estoque`)

Visão geral dos processos em fila. Inclui:
- Métricas de volume (total na fila, distribuídos, prazo crítico)
- Tabela com 15 processos mockados do TJSP
- Seleção múltipla e distribuição de casos para analistas via modal

### Tratativas (`/tratativas`)

Lista os casos atribuídos à analista Ana Costa com status "Distribuído" ou "Em tratativa".
Clique em "Abrir tratativa" para acessar o formulário.

### Formulário de Tratativa (`/tratativas/[id]`)

Núcleo do MVP. Formulário em 5 seções com barra de progresso:

1. **Identificação do Processo** — dados pré-preenchidos via integração simulada com o tribunal
2. **Partes Envolvidas** — dados do autor, advogados e réu (advogado do réu é editável)
3. **Documentos do Banco** — automações paralelas que buscam 6 documentos nos sistemas do Bradesco: LAUDO, EXTRATO, TERMO DE CESTA, LIGAÇÃO - FONE FÁCIL, LOG, TELA TRAG. Cada documento resolve de forma independente com animação em tempo real.
4. **Análise do Subsídio** — campos preenchidos pelo analista (risco, probabilidade, estratégia, fundamento, precedentes)
5. **Resumo para o ServiceNow** — preview visual do payload a ser enviado, com alertas de campos faltantes e botão de envio com confirmação e simulação de transmissão

### Painel (`/painel`)

Placeholder para funcionalidade futura.

## Pontos de Integração Futura

Os comentários `// TODO:` no código marcam todos os pontos onde integrações reais devem ser implementadas:

- `Section1Identificacao.tsx` — API do tribunal (TJ/STJ) para busca de dados processuais
- `Section3Documentos.tsx` — Sistemas internos do Bradesco para busca automática de documentos por produto
- `Section5Resumo.tsx` — API do ServiceNow para envio real do payload
- `app/layout.tsx` — Autenticação e perfis de acesso (gestor vs analista)
