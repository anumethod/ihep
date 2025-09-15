import { Metadata } from 'next'
import { Dashboard } from '@/components/Dashboard'

export const metadata: Metadata = {
  title: 'Health Insight Ventures - Your Digital Health Platform',
  description: 'Comprehensive healthcare platform for HIV patient management and support with AI-powered wellness tips and community features.',
}

export default function HomePage() {
  return <Dashboard />
}