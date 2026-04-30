'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth-context'
import { doc, getDoc, updateDoc, increment } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Gift, Coins, Zap, Check, Clock } from 'lucide-react'
import { Spinner } from '@/components/ui/spinner'

export default function CreditsPage() {
  const { user } = useAuth()
  const [credits, setCredits] = useState(0)
  const [loading, setLoading] = useState(true)
  const [claiming, setClaiming] = useState(false)
  const [lastClaimed, setLastClaimed] = useState<Date | null>(null)
  const [canClaim, setCanClaim] = useState(false)

  useEffect(() => {
    async function loadCredits() {
      if (!user) return
      try {
        const userRef = doc(db, 'users', user.uid)
        const userSnap = await getDoc(userRef)
        if (userSnap.exists()) {
          const data = userSnap.data()
          setCredits(data.credits || 0)
          
          if (data.lastCreditClaim) {
            const lastClaimDate = data.lastCreditClaim.toDate()
            setLastClaimed(lastClaimDate)
            // Can claim once per day
            const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)
            setCanClaim(lastClaimDate < oneDayAgo)
          } else {
            setCanClaim(true)
          }
        }
      } catch (error) {
        console.error('Error loading credits:', error)
      } finally {
        setLoading(false)
      }
    }
    loadCredits()
  }, [user])

  const handleClaimCredits = async () => {
    if (!user || !canClaim) return
    setClaiming(true)
    try {
      const userRef = doc(db, 'users', user.uid)
      await updateDoc(userRef, {
        credits: increment(10),
        lastCreditClaim: new Date(),
      })
      setCredits(prev => prev + 10)
      setLastClaimed(new Date())
      setCanClaim(false)
    } catch (error) {
      console.error('Error claiming credits:', error)
    } finally {
      setClaiming(false)
    }
  }

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Spinner className="h-8 w-8 text-primary" />
      </div>
    )
  }

  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary neon-glow mb-2 flex items-center gap-3">
            <Gift className="h-8 w-8" />
            Free Credits
          </h1>
          <p className="text-muted-foreground">
            <span className="text-primary">$</span> Claim your daily free credits
          </p>
        </div>

        {/* Current Credits */}
        <Card className="bg-card/50 border-primary/30 neon-border mb-6">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-4 rounded-full bg-primary/10">
                  <Coins className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Current Balance</p>
                  <p className="text-4xl font-bold text-primary neon-glow">{credits}</p>
                  <p className="text-xs text-muted-foreground">credits available</p>
                </div>
              </div>
              <Zap className="h-12 w-12 text-primary/30" />
            </div>
          </CardContent>
        </Card>

        {/* Daily Claim */}
        <Card className="bg-card/50 border-border mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Gift className="h-5 w-5 text-primary" />
              Daily Bonus
            </CardTitle>
            <CardDescription>
              Claim 10 free credits every 24 hours
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/50 mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Daily Reward</p>
                  <p className="text-xs text-muted-foreground">
                    {lastClaimed 
                      ? `Last claimed: ${lastClaimed.toLocaleDateString()}`
                      : 'Never claimed'}
                  </p>
                </div>
              </div>
              <span className="text-lg font-bold text-primary">+10</span>
            </div>

            <Button
              onClick={handleClaimCredits}
              disabled={claiming || !canClaim}
              className="w-full bg-primary/10 border border-primary/50 text-primary hover:bg-primary/20 hover:border-primary neon-border disabled:opacity-50"
            >
              {claiming ? (
                <>
                  <Spinner className="h-4 w-4 mr-2" />
                  Claiming...
                </>
              ) : !canClaim ? (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Already Claimed Today
                </>
              ) : (
                <>
                  <Gift className="h-4 w-4 mr-2" />
                  Claim Free Credits
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Credit Info */}
        <Card className="bg-card/50 border-border">
          <CardHeader>
            <CardTitle className="text-foreground">How Credits Work</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>
              <span className="text-primary">{">"}</span> Credits are used for AI assistance while coding
            </p>
            <p>
              <span className="text-primary">{">"}</span> Each AI query costs 1 credit
            </p>
            <p>
              <span className="text-primary">{">"}</span> Claim 10 free credits every 24 hours
            </p>
            <p>
              <span className="text-primary">{">"}</span> New accounts start with 100 free credits
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
