'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/lib/auth-context'
import { getUserProjects } from '@/lib/projects'
import { Project, PROJECT_TEMPLATES } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Spinner } from '@/components/ui/spinner'
import { Clock, Plus, Folder, ArrowRight } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

export default function DashboardPage() {
  const { user } = useAuth()
  const [recentProjects, setRecentProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadProjects() {
      if (!user) return
      try {
        const projects = await getUserProjects(user.uid)
        setRecentProjects(projects.slice(0, 6))
      } catch (error) {
        console.error('Error loading projects:', error)
      } finally {
        setLoading(false)
      }
    }
    loadProjects()
  }, [user])

  return (
    <div className="h-full overflow-y-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary neon-glow mb-2">
          {">"} Welcome back, {user?.displayName?.split(' ')[0] || 'Hacker'}
        </h1>
        <p className="text-muted-foreground">
          <span className="text-primary">$</span> Your coding sanctuary awaits
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Link href="/dashboard/new">
          <Card className="bg-card/50 border-primary/30 hover:border-primary transition-all cursor-pointer group neon-border">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 rounded-lg bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">
                <Plus className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">New Project</h3>
                <p className="text-sm text-muted-foreground">Start coding</p>
              </div>
            </CardContent>
          </Card>
        </Link>
        
        <Link href="/dashboard/projects">
          <Card className="bg-card/50 border-border hover:border-primary/50 transition-all cursor-pointer group">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 rounded-lg bg-secondary text-primary group-hover:bg-primary/10 transition-colors">
                <Folder className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">All Projects</h3>
                <p className="text-sm text-muted-foreground">{recentProjects.length} projects</p>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Recent Projects */}
      <Card className="bg-card/50 border-border">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Clock className="h-5 w-5 text-primary" />
            Recent Projects
          </CardTitle>
          <Link href="/dashboard/projects">
            <Button variant="ghost" size="sm" className="text-primary hover:text-primary hover:bg-primary/10">
              View All
              <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Spinner className="h-6 w-6 text-primary" />
            </div>
          ) : recentProjects.length === 0 ? (
            <div className="text-center py-12">
              <Folder className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">No projects yet</p>
              <Link href="/dashboard/new">
                <Button className="bg-primary/10 border border-primary/50 text-primary hover:bg-primary/20">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Project
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recentProjects.map((project) => (
                <Link key={project.id} href={`/dashboard/project/${project.id}`}>
                  <Card className="bg-secondary/50 border-border hover:border-primary/50 transition-all cursor-pointer group h-full">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="text-2xl">
                          {PROJECT_TEMPLATES[project.type]?.icon || '📁'}
                        </div>
                        <span className="text-xs px-2 py-1 rounded bg-primary/10 text-primary border border-primary/30">
                          {PROJECT_TEMPLATES[project.type]?.name || project.type}
                        </span>
                      </div>
                      <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                        {project.name}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatDistanceToNow(project.updatedAt, { addSuffix: true })}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
