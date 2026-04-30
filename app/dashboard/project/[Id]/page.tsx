'use client'

import { useEffect, useState, use } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { getProject, updateProjectFiles } from '@/lib/projects'
import { Project, ProjectFile } from '@/lib/types'
import { IDELayout } from '@/components/ide/ide-layout'
import { Spinner } from '@/components/ui/spinner'

interface Props {
  params: Promise<{ id: string }>
}

export default function ProjectPage({ params }: Props) {
  const { id } = use(params)
  const { user } = useAuth()
  const router = useRouter()
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadProject() {
      if (!user) return
      try {
        const projectData = await getProject(id)
        if (!projectData) {
          setError('Project not found')
          return
        }
        if (projectData.userId !== user.uid) {
          setError('Access denied')
          return
        }
        setProject(projectData)
      } catch (err) {
        console.error('Error loading project:', err)
        setError('Failed to load project')
      } finally {
        setLoading(false)
      }
    }
    loadProject()
  }, [id, user])

  const handleSaveFiles = async (files: ProjectFile[]) => {
    if (!project) return
    try {
      await updateProjectFiles(project.id, files)
      setProject(prev => prev ? { ...prev, files } : null)
    } catch (error) {
      console.error('Error saving files:', error)
    }
  }

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Spinner className="h-8 w-8 text-primary" />
          <p className="text-primary neon-glow text-sm">Loading project...</p>
        </div>
      </div>
    )
  }

  if (error || !project) {
    return (
      <div className="h-full flex items-center justify-center bg-background">
        <div className="text-center">
          <p className="text-destructive mb-4">{error || 'Project not found'}</p>
          <button
            onClick={() => router.push('/dashboard')}
            className="text-primary hover:underline"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    )
  }

  return (
    <IDELayout 
      project={project} 
      onSaveFiles={handleSaveFiles}
    />
  )
}
