// TODO: implementar autenticação e perfis de acesso (gestor vs analista)

import type { Metadata } from 'next'
import { Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'
import { CasesProvider } from '@/context/CasesContext'
import { ChamadosProvider } from '@/context/ChamadosContext'
import { TarefasProvider } from '@/context/TarefasContext'
import { PersonaProvider } from '@/context/PersonaContext'
import Header from '@/components/Header'
import FaixaContexto from '@/components/header/FaixaContexto'

const jakartaSans = Plus_Jakarta_Sans({
  variable: '--font-jakarta-sans',
  subsets: ['latin'],
  weight: ['300', '600'],
})

export const metadata: Metadata = {
  title: 'Subsídios Bradesco — SBK',
  description: 'Plataforma interna de gestão de subsídios bancários',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={jakartaSans.variable}>
      <body className="min-h-screen bg-brand-offwhite">
        <CasesProvider>
          <ChamadosProvider>
            <TarefasProvider>
            <PersonaProvider>
              <Header />
              <FaixaContexto />
              <main className="pt-24 min-h-screen">
                {children}
              </main>
            </PersonaProvider>
            </TarefasProvider>
          </ChamadosProvider>
        </CasesProvider>
      </body>
    </html>
  )
}
