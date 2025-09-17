import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { QueryProvider } from '@/lib/query-provider'
import { Toaster } from '@/components/ui/toaster'

const inter = Inter({ subsets: ['latin'] })



export const metadata: Metadata = {
  title: 'The Boring Marketer - AI Marketing Team',
  description: '',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <QueryProvider>
          {children}
          <Toaster />
        </QueryProvider>
      </body>
    </html>
  )
}



