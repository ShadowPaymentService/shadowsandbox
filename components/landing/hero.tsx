'use client'

import { useState } from 'react'
import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import { Terminal, Code2, Zap, Shield, Github, AlertTriangle, X } from 'lucide-react'

export function LandingHero() {
  const { signInWithGoogle, signInWithGithub, error, clearError } = useAuth()
  const [isLoading, setIsLoading] = useState<'google' | 'github' | null>(null)
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin')

  const handleGoogleSignIn = async () => {
    setIsLoading('google')
    try {
      await signInWithGoogle()
    } catch {
      setIsLoading(null)
    }
  }

  const handleGithubSignIn = async () => {
    setIsLoading('github')
    try {
      await signInWithGithub()
    } catch {
      setIsLoading(null)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="w-full px-6 py-4 flex items-center justify-between border-b border-border/50">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Terminal className="h-8 w-8 text-primary" />
            <div className="absolute inset-0 blur-md bg-primary/50 -z-10" />
          </div>
          <span className="text-xl font-bold text-primary neon-glow">ShadowSandBox</span>
        </div>
        <div className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
          <a href="#features" className="hover:text-primary transition-colors">Features</a>
          <a href="#pricing" className="hover:text-primary transition-colors">Pricing</a>
          <a href="#docs" className="hover:text-primary transition-colors">Docs</a>
        </div>
      </header>

      {/* Main Hero */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="max-w-4xl mx-auto text-center">
          {/* Glitch Title */}
          <div className="relative mb-6">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
              <span className="glitch-text inline-block text-primary neon-glow">
                SHADOW
              </span>
              <br />
              <span className="text-foreground">SANDBOX</span>
            </h1>
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent pointer-events-none" />
          </div>

          {/* Tagline */}
          <p className="text-xl md:text-2xl text-muted-foreground mb-4 max-w-2xl mx-auto">
            {">"} The cloud IDE built for{' '}
            <span className="text-primary">hackers</span> and{' '}
            <span className="text-primary">beasts</span>
          </p>
          
          <p className="text-sm text-muted-foreground mb-8 font-mono">
            <span className="text-primary">$</span> code --anywhere --anytime --unstoppable
          </p>

          {/* Auth Mode Toggle */}
          <div className="flex justify-center gap-2 mb-6">
            <button
              onClick={() => setAuthMode('signin')}
              className={`px-6 py-2 text-sm font-mono rounded-md transition-all duration-300 ${
                authMode === 'signin'
                  ? 'bg-primary text-background neon-glow'
                  : 'text-muted-foreground hover:text-primary border border-border hover:border-primary/50'
              }`}
            >
              SIGN IN
            </button>
            <button
              onClick={() => setAuthMode('signup')}
              className={`px-6 py-2 text-sm font-mono rounded-md transition-all duration-300 ${
                authMode === 'signup'
                  ? 'bg-primary text-background neon-glow'
                  : 'text-muted-foreground hover:text-primary border border-border hover:border-primary/50'
              }`}
            >
              SIGN UP
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 mx-auto max-w-lg p-4 rounded-lg bg-destructive/10 border border-destructive/50 flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
              <div className="flex-1 text-sm text-destructive text-left">{error}</div>
              <button onClick={clearError} className="text-destructive hover:text-destructive/80">
                <X className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* Auth Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button
              onClick={handleGoogleSignIn}
              disabled={isLoading !== null}
              size="lg"
              className="relative bg-card border border-primary/50 text-primary hover:bg-primary/10 hover:border-primary px-8 py-6 text-lg neon-border transition-all duration-300 group"
            >
              <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              {isLoading === 'google' ? 'Authenticating...' : `${authMode === 'signin' ? 'Sign in' : 'Sign up'} with Google`}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-r from-primary/0 via-primary/10 to-primary/0" />
            </Button>

            <Button
              onClick={handleGithubSignIn}
              disabled={isLoading !== null}
              size="lg"
              className="relative bg-card border border-primary/50 text-primary hover:bg-primary/10 hover:border-primary px-8 py-6 text-lg neon-border transition-all duration-300 group"
            >
              <Github className="w-5 h-5 mr-3" />
              {isLoading === 'github' ? 'Authenticating...' : `${authMode === 'signin' ? 'Sign in' : 'Sign up'} with GitHub`}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-r from-primary/0 via-primary/10 to-primary/0" />
            </Button>
          </div>

          {/* Setup Instructions */}
          <div className="mb-12 p-4 rounded-lg bg-card/30 border border-border max-w-lg mx-auto">
            <p className="text-xs text-muted-foreground font-mono text-left">
              <span className="text-primary">{">"}</span> First time? Add your domain to{' '}
              <span className="text-primary">Firebase Console</span>:
              <br />
              <span className="text-primary ml-4">$</span> Authentication {">"} Settings {">"} Authorized domains
              <br />
              <span className="text-primary ml-4">$</span> Add: <span className="text-primary">{typeof window !== 'undefined' ? window.location.hostname : 'your-domain.vercel.app'}</span>
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto" id="features">
            <FeatureCard
              icon={<Code2 className="h-6 w-6" />}
              title="Multi-Language"
              description="HTML, Node.js, Python, Jupyter, and Docker support"
            />
            <FeatureCard
              icon={<Zap className="h-6 w-6" />}
              title="AI Assistant"
              description="Powered by advanced AI to help you code faster"
            />
            <FeatureCard
              icon={<Shield className="h-6 w-6" />}
              title="Cloud Sync"
              description="Your projects saved and synced across devices"
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full px-6 py-4 border-t border-border/50 text-center text-sm text-muted-foreground">
        <p>
          <span className="text-primary">{">"}</span> Built for developers who dare to push boundaries
        </p>
      </footer>
    </div>
  )
}

function FeatureCard({ 
  icon, 
  title, 
  description 
}: { 
  icon: React.ReactNode
  title: string
  description: string 
}) {
  return (
    <div className="p-6 rounded-lg bg-card/50 border border-border hover:border-primary/50 transition-all duration-300 group">
      <div className="text-primary mb-3 group-hover:neon-glow transition-all">
        {icon}
      </div>
      <h3 className="font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  )
}
