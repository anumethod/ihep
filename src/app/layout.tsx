import type { Metadata } from 'next'
import './globals.css'
import { Providers } from './providers'

export const metadata: Metadata = {
  title: 'Health Insight Ventures - Digital Health Platform',
  description: 'Comprehensive healthcare platform for HIV patient management and support with AI-powered wellness tips and community features.',
}

import MainLayout from '@/app/components/MainLayout';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <MainLayout>{children}</MainLayout>
        </Providers>
      </body>
    </html>
  )
}
