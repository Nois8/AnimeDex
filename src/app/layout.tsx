import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AnimeDex',
  description: 'Tu plataforma definitiva para descubrir, valorar y compartir tus animes favoritos.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={inter.className} style={{ margin: 0, minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#121212', color: '#FFFFFF' }}>
        <Navbar />
        <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', width: '100%' }}>
          {children}
        </div>
        <Footer />
      </body>
    </html>
  )
}
