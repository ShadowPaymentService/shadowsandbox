'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/lib/auth-context'
import { getUserProjects, deleteProject } from '@/lib/projects'
import { Project, PROJECT_TEMPLATES } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Spinner } from '@/components/ui/spinner'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { FolderOpen, Plus, MoreVertical, Trash2, ExternalLink } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

export default function ProjectsPage() {
  const { user } = useAuth()
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => {
    loadProjects()
  }, [user])

  async function loadProjects() {
    if (!user) return
    try {
      const userProjects = await getUserProjects(user.uid)
      setProjects(userProjects)
    } catch (error) {
      console.error('Error loading projects:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (projectId: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return
    setDeletingId(projectId)
    try {
      await deleteProject(projectId)
      setProjects(prev => prev.filter(p => p.id !== projectId))
    } catch (error) {
      console.error('Error deleting project:', error)
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="h-full overflow-y-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-primary neon-glow mb-2 flex items-center gap-3">
            <FolderOpen className="h-8 w-8" />
            Your Projects
          </h1>
          <p className="text-muted-foreground">
            <span className="text-primary">$</span> {projects.length} project{projects.length !== 1 ? 's' : ''} total
          </p>
        </div>
        <Link href="/dashboard/new">
          <Button className="bg-primary/10 border border-primary/50 text-primary hover:bg-primary/20 hover:border-primary neon-border">
            <Plus className="h-4 w-4 mr-2" />
            New Project
          </Button>
        </Link>
      </div>

      {/* Projects Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Spinner className="h-8 w-8 text-primary" />
        </div>
      ) : projects.length === 0 ? (
        <Card className="bg-card/50 border-border">
          <CardContent className="flex flex-col items-center justify-center py-20">
            <FolderOpen className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">No projects yet</h3>
            <p className="text-muted-foreground mb-6">Create your first project to get started</p>
            <Link href="/dashboard/new">
              <Button className="bg-primary/10 border border-primary/50 text-primary hover:bg-primary/20 neon-border">
                <Plus className="h-4 w-4 mr-2" />
                Create Project
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project) => (
            <Card
              key={project.id}
              className="bg-card/50 border-border hover:border-primary/50 transition-all group"
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="text-3xl">
                    {PROJECT_TEMPLATES[project.type]?.icon || '📁'}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-2 py-1 rounded bg-primary/10 text-primary border border-primary/30">
                      {PROJECT_TEMPLATES[project.type]?.name || project.type}
                    </span>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-popover border-border">
                        <DropdownMenuItem asChild>
                          <Link href={`/dashboard/project/${project.id}`} className="flex items-center">
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Open
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDelete(project.id)}
                          className="text-destructive focus:text-destructive"
                          disabled={deletingId === project.id}
                        >
                          {deletingId === project.id ? (
                            <Spinner className="h-4 w-4 mr-2" />
                          ) : (
                            <Trash2 className="h-4 w-4 mr-2" />
                          )}
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
                
                <Link href={`/dashboard/project/${project.id}`}>
                  <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors truncate mb-1">
                    {project.name}
                  </h3>
                </Link>
                
                {project.description && (
                  <p className="text-sm text-muted-foreground truncate mb-2">
                    {project.description}
                  </p>
                )}
                
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{project.files?.length || 0} files</span>
                  <span>{formatDistanceToNow(project.updatedAt, { addSuffix: true })}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
