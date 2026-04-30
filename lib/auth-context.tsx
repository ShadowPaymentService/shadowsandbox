'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { 
  User, 
  signInWithPopup, 
  signOut as firebaseSignOut,
  onAuthStateChanged 
} from 'firebase/auth'
import { auth, googleProvider, githubProvider, db } from './firebase'
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore'

interface AuthContextType {
  user: User | null
  loading: boolean
  error: string | null
  signInWithGoogle: () => Promise<void>
  signInWithGithub: () => Promise<void>
  signOut: () => Promise<void>
  updateUserProfile: (data: { displayName?: string; email?: string }) => Promise<void>
  clearError: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const clearError = () => setError(null)

  const getErrorMessage = (errorCode: string): string => {
    switch (errorCode) {
      case 'auth/unauthorized-domain':
        return 'This domain is not authorized. Please add your domain to Firebase Console: Authentication > Settings > Authorized domains'
      case 'auth/popup-closed-by-user':
        return 'Sign in was cancelled. Please try again.'
      case 'auth/popup-blocked':
        return 'Popup was blocked. Please allow popups for this site.'
      case 'auth/account-exists-with-different-credential':
        return 'An account already exists with this email using a different sign-in method.'
      case 'auth/invalid-api-key':
        return 'Invalid Firebase API key. Please check your environment variables.'
      default:
        return `Authentication error: ${errorCode}`
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Create or update user document in Firestore
        const userRef = doc(db, 'users', user.uid)
        const userSnap = await getDoc(userRef)
        
        if (!userSnap.exists()) {
          await setDoc(userRef, {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            credits: 100, // Free credits
            createdAt: serverTimestamp(),
            lastLoginAt: serverTimestamp(),
          })
        } else {
          await setDoc(userRef, { lastLoginAt: serverTimestamp() }, { merge: true })
        }
      }
      setUser(user)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const signInWithGoogle = async () => {
    try {
      setError(null)
      await signInWithPopup(auth, googleProvider)
    } catch (err) {
      const firebaseError = err as { code?: string }
      const message = getErrorMessage(firebaseError.code || 'unknown')
      setError(message)
      console.error('Error signing in with Google:', err)
      throw err
    }
  }

  const signInWithGithub = async () => {
    try {
      setError(null)
      await signInWithPopup(auth, githubProvider)
    } catch (err) {
      const firebaseError = err as { code?: string }
      const message = getErrorMessage(firebaseError.code || 'unknown')
      setError(message)
      console.error('Error signing in with GitHub:', err)
      throw err
    }
  }

  const signOut = async () => {
    try {
      await firebaseSignOut(auth)
    } catch (error) {
      console.error('Error signing out:', error)
      throw error
    }
  }

  const updateUserProfile = async (data: { displayName?: string; email?: string }) => {
    if (!user) return
    const userRef = doc(db, 'users', user.uid)
    await setDoc(userRef, data, { merge: true })
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading,
      error,
      signInWithGoogle, 
      signInWithGithub, 
      signOut,
      updateUserProfile,
      clearError
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
