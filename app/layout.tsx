import type { Metadata, Viewport } from 'next'
import { Fira_Code } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { AuthProvider } from '@/lib/auth-context'
import './globals.css'

const firaCode = Fira_Code({ 
  subsets: ['latin'],
  variable: '--font-fira-code',
})

export const metadata: Metadata = {
  title: 'ShadowSandBox | Cloud IDE',
  description: 'A powerful cloud-based IDE for hackers and developers. Code anywhere, anytime.',
  keywords: ['IDE', 'cloud', 'coding', 'development', 'programming'],
}

export const viewport: Viewport = {
  themeColor: '#00ff00',
  colorScheme: 'dark',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark bg-background">
      <body className={`${firaCode.variable} font-mono antialiased`}>
        <AuthProvider>
          {children}
        </AuthProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
