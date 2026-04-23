// TODO: implementar autenticação e perfis de acesso (gestor vs analista)

import type { Metadata } from 'next'
import { Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'
import { CasesProvider } from '@/context/CasesContext'
import Header from '@/components/Header'

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
          <Header />
          <main className="pt-16 min-h-screen">
            {children}
          </main>
        </CasesProvider>
      </body>
    </html>
  )
}
