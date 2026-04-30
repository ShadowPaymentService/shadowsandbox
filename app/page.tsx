'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { LandingHero } from '@/components/landing/hero'
import { MatrixRain } from '@/components/landing/matrix-rain'
import { Spinner } from '@/components/ui/spinner'

export default function LandingPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard')
    }
  }, [user, loading, router])

  if (!mounted || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Spinner className="h-8 w-8 text-primary" />
          <p className="text-primary neon-glow text-sm">Initializing system...</p>
        </div>
      </div>
    )
  }

  if (user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Spinner className="h-8 w-8 text-primary" />
          <p className="text-primary neon-glow text-sm">Accessing dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <main className="relative min-h-screen bg-background overflow-hidden matrix-bg">
      <MatrixRain />
      <div className="relative z-10">
        <LandingHero />
      </div>
    </main>
  )
}
