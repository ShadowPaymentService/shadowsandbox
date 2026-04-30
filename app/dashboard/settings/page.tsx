'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth-context'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Field, FieldLabel, FieldGroup } from '@/components/ui/field'
import { Settings, User, Mail, Save, Check } from 'lucide-react'
import { Spinner } from '@/components/ui/spinner'

export default function SettingsPage() {
  const { user, updateUserProfile } = useAuth()
  const [displayName, setDisplayName] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    async function loadUserData() {
      if (!user) return
      try {
        const userRef = doc(db, 'users', user.uid)
        const userSnap = await getDoc(userRef)
        if (userSnap.exists()) {
          const data = userSnap.data()
          setDisplayName(data.displayName || '')
          setEmail(data.email || '')
        }
      } catch (error) {
        console.error('Error loading user data:', error)
      } finally {
        setLoading(false)
      }
    }
    loadUserData()
  }, [user])

  const handleSave = async () => {
    setSaving(true)
    try {
      await updateUserProfile({ displayName, email })
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch (error) {
      console.error('Error saving profile:', error)
    } finally {
      setSaving(false)
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
            <Settings className="h-8 w-8" />
            Settings
          </h1>
          <p className="text-muted-foreground">
            <span className="text-primary">$</span> Manage your account preferences
          </p>
        </div>

        {/* Profile Settings */}
        <Card className="bg-card/50 border-border mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <User className="h-5 w-5 text-primary" />
              Profile Information
            </CardTitle>
            <CardDescription>
              Update your account details
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FieldGroup className="space-y-4">
              <Field>
                <FieldLabel htmlFor="displayName">Display Name</FieldLabel>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="displayName"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Your display name"
                    className="pl-10 bg-input border-border focus:border-primary"
                  />
                </div>
              </Field>

              <Field>
                <FieldLabel htmlFor="email">Email Address</FieldLabel>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="pl-10 bg-input border-border focus:border-primary"
                  />
                </div>
              </Field>

              <Button
                onClick={handleSave}
                disabled={saving}
                className="bg-primary/10 border border-primary/50 text-primary hover:bg-primary/20 hover:border-primary neon-border"
              >
                {saving ? (
                  <>
                    <Spinner className="h-4 w-4 mr-2" />
                    Saving...
                  </>
                ) : saved ? (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Saved!
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </FieldGroup>
          </CardContent>
        </Card>

        {/* Account Info */}
        <Card className="bg-card/50 border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Account Information</CardTitle>
            <CardDescription>Your account details from authentication provider</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
              <span className="text-sm text-muted-foreground">User ID</span>
              <code className="text-xs text-primary bg-primary/10 px-2 py-1 rounded">
                {user?.uid}
              </code>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
              <span className="text-sm text-muted-foreground">Auth Provider</span>
              <span className="text-sm text-foreground">
                {user?.providerData[0]?.providerId === 'google.com' ? 'Google' : 
                 user?.providerData[0]?.providerId === 'github.com' ? 'GitHub' : 'Unknown'}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
