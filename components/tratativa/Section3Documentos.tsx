'use client'

// TODO: integrar com sistemas internos do Bradesco para busca automática de documentos por produto
// (LAUDO, EXTRATO, TERMO DE CESTA, LIGAÇÃO - FONE FÁCIL, LOG, TELA TRAG)

import { useState, useCallback } from 'react'
import { DocumentoBanco, DocumentoStatus, DOCUMENTOS_CESTAS } from '@/lib/mock-data'
import Modal from '@/components/ui/Modal'

interface Section3Props {
  onComplete: () => void
  isComplete: boolean
}

type DocState = DocumentoBanco & { status: DocumentoStatus }

export default function Section3Documentos({ onComplete, isComplete }: Section3Props) {
  const [docs, setDocs] = useState<DocState[]>(DOCUMENTOS_CESTAS.map((d) => ({ ...d })))
  const [previewDoc, setPreviewDoc] = useState<string | null>(null)
  const [dispatched, setDispatched] = useState(false)

  const allResolved = docs.every((d) => d.status === 'found' || d.status === 'unavailable')

  const disparar = useCallback(() => {
    if (dispatched) return
    setDispatched(true)

    setDocs((prev) => prev.map((d) => ({ ...d, status: 'loading' as DocumentoStatus })))

    DOCUMENTOS_CESTAS.forEach((doc, i) => {
      setTimeout(() => {
        setDocs((prev) =>
          prev.map((d) => (d.nome === doc.nome ? { ...d, status: doc.resultado } : d))
        )
        if (i === DOCUMENTOS_CESTAS.length - 1) {
          onComplete()
        }
      }, doc.resolveMs)
    })
  }, [dispatched, onComplete])

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6 mb-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold text-brand-dark">3. Documentos do Banco</h2>
        <div className="flex items-center gap-3">
          {allResolved && (
            <span className="flex items-center gap-1.5 text-xs font-semibold text-green-600">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
              Automações concluídas
            </span>
          )}
          <button
            onClick={disparar}
            disabled={dispatched}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-brand-mid rounded-lg hover:bg-brand-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            {dispatched ? 'Automações disparadas' : 'Disparar todas as automações'}
          </button>
        </div>
      </div>

      <div className="mb-4 px-4 py-3 rounded-lg bg-brand-mid/10 border border-brand-mid/20 text-sm text-brand-mid font-light flex items-start gap-2">
        <svg className="shrink-0 mt-0.5 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20A10 10 0 0012 2z" />
        </svg>
        <span className="italic">Documentos obtidos automaticamente dos sistemas internos do Bradesco. Cada documento dispara uma automação independente.</span>
      </div>

      <div className="border border-gray-100 rounded-lg overflow-hidden mb-5">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-brand-offwhite border-b border-gray-100">
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-brand-slate">Documento</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-brand-slate">Tipo</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-brand-slate">Status da Automação</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-brand-slate">Ação</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {docs.map((doc) => (
              <tr key={doc.nome} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 font-semibold text-brand-dark">{doc.nome}</td>
                <td className="px-4 py-3 text-brand-slate font-light">{doc.tipo}</td>
                <td className="px-4 py-3">
                  {doc.status === 'idle' && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-500">
                      Aguardando
                    </span>
                  )}
                  {doc.status === 'loading' && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-yellow-50 text-yellow-600">
                      <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Buscando...
                    </span>
                  )}
                  {doc.status === 'found' && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                      Encontrado
                    </span>
                  )}
                  {doc.status === 'unavailable' && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-orange-100 text-orange-700">
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Indisponível
                    </span>
                  )}
                </td>
                <td className="px-4 py-3">
                  {doc.status === 'found' && (
                    <button
                      onClick={() => setPreviewDoc(doc.nome)}
                      className="text-xs font-semibold text-brand-mid hover:text-brand-dark transition-colors underline underline-offset-2"
                    >
                      Visualizar
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="border-2 border-dashed border-gray-200 rounded-lg p-5 text-center">
        <svg className="w-8 h-8 text-gray-300 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
        </svg>
        <p className="text-sm font-semibold text-brand-slate">Documentos adicionados manualmente</p>
        <p className="text-xs text-brand-slate font-light mt-1">Anexe documentos que não foram encontrados automaticamente</p>
        <button className="mt-3 px-3 py-1.5 text-xs font-semibold border border-gray-200 rounded-lg text-brand-slate hover:bg-gray-50 transition-colors">
          Selecionar arquivo
        </button>
      </div>

      <Modal
        isOpen={previewDoc !== null}
        onClose={() => setPreviewDoc(null)}
        title="Visualização de documento"
      >
        <div className="bg-brand-offwhite rounded-lg p-4 text-center">
          <svg className="w-10 h-10 text-brand-mid mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="text-sm font-semibold text-brand-dark">Simulação de visualização</p>
          <p className="text-sm text-brand-mid font-semibold mt-1">{previewDoc}</p>
          <p className="text-xs text-brand-slate font-light mt-2">
            Em produção, este botão abrirá o documento real obtido do sistema do banco.
          </p>
        </div>
        <button
          onClick={() => setPreviewDoc(null)}
          className="mt-4 w-full px-4 py-2 text-sm font-semibold text-brand-slate border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Fechar
        </button>
      </Modal>
    </div>
  )
}
