'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { createProject, cloneFromGithub } from '@/lib/projects'
import { ProjectType, PROJECT_TEMPLATES } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Field, FieldLabel, FieldGroup } from '@/components/ui/field'
import { Spinner } from '@/components/ui/spinner'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Plus, Github, ArrowRight, Code2, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

const projectTypes: { type: ProjectType; icon: string; name: string; description: string }[] = [
  { type: 'html-css', icon: '🌐', name: 'HTML/CSS', description: 'Web development with HTML, CSS, and JavaScript' },
  { type: 'nodejs', icon: '⬢', name: 'Node.js', description: 'Server-side JavaScript with Node.js' },
  { type: 'python', icon: '🐍', name: 'Python', description: 'Python development environment' },
  { type: 'jupyter', icon: '📓', name: 'Jupyter Labs', description: 'Interactive notebooks for data science' },
  { type: 'docker', icon: '🐳', name: 'Docker', description: 'Containerized development environment' },
]

export default function NewProjectPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [selectedType, setSelectedType] = useState<ProjectType | null>(null)
  const [projectName, setProjectName] = useState('')
  const [creating, setCreating] = useState(false)
  
  // GitHub clone state
  const [githubUrl, setGithubUrl] = useState('')
  const [repoName, setRepoName] = useState('')
  const [cloning, setCloning] = useState(false)
  const [cloneDialogOpen, setCloneDialogOpen] = useState(false)

  const handleCreate = async () => {
    if (!user || !selectedType || !projectName.trim()) return
    setCreating(true)
    try {
      const projectId = await createProject(user.uid, projectName.trim(), selectedType)
      router.push(`/dashboard/project/${projectId}`)
    } catch (error) {
      console.error('Error creating project:', error)
      setCreating(false)
    }
  }

  const handleClone = async () => {
    if (!user || !githubUrl.trim() || !repoName.trim()) return
    setCloning(true)
    try {
      const projectId = await cloneFromGithub(user.uid, githubUrl.trim(), repoName.trim())
      router.push(`/dashboard/project/${projectId}`)
    } catch (error) {
      console.error('Error cloning repository:', error)
      setCloning(false)
    }
  }

  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary neon-glow mb-2 flex items-center gap-3">
            <Plus className="h-8 w-8" />
            Create New Project
          </h1>
          <p className="text-muted-foreground">
            <span className="text-primary">$</span> Choose your environment and start coding
          </p>
        </div>

        {/* Project Type Selection */}
        <Card className="bg-card/50 border-border mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Code2 className="h-5 w-5 text-primary" />
              Select Environment
            </CardTitle>
            <CardDescription>
              Choose the type of project you want to create
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {projectTypes.map((pt) => (
                <button
                  key={pt.type}
                  onClick={() => setSelectedType(pt.type)}
                  className={cn(
                    'p-4 rounded-lg text-left transition-all duration-200 border',
                    selectedType === pt.type
                      ? 'bg-primary/10 border-primary neon-border'
                      : 'bg-secondary/50 border-border hover:border-primary/50'
                  )}
                >
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-3xl">{pt.icon}</span>
                    {selectedType === pt.type && (
                      <Check className="h-5 w-5 text-primary" />
                    )}
                  </div>
                  <h3 className="font-semibold text-foreground mb-1">{pt.name}</h3>
                  <p className="text-sm text-muted-foreground">{pt.description}</p>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Project Name */}
        <Card className="bg-card/50 border-border mb-6">
          <CardHeader>
            <CardTitle className="text-foreground">Project Details</CardTitle>
            <CardDescription>
              Give your project a name
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="projectName">Project Name</FieldLabel>
                <Input
                  id="projectName"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="my-awesome-project"
                  className="bg-input border-border focus:border-primary"
                />
              </Field>
            </FieldGroup>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            onClick={handleCreate}
            disabled={!selectedType || !projectName.trim() || creating}
            className="flex-1 bg-primary/10 border border-primary/50 text-primary hover:bg-primary/20 hover:border-primary neon-border disabled:opacity-50"
          >
            {creating ? (
              <>
                <Spinner className="h-4 w-4 mr-2" />
                Creating...
              </>
            ) : (
              <>
                <Plus className="h-4 w-4 mr-2" />
                Create Project
                <ArrowRight className="h-4 w-4 ml-2" />
              </>
            )}
          </Button>

          <Dialog open={cloneDialogOpen} onOpenChange={setCloneDialogOpen}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="flex-1 border-border text-foreground hover:bg-secondary hover:text-primary"
              >
                <Github className="h-4 w-4 mr-2" />
                Clone from GitHub
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-card border-border">
              <DialogHeader>
                <DialogTitle className="text-foreground flex items-center gap-2">
                  <Github className="h-5 w-5 text-primary" />
                  Clone Repository
                </DialogTitle>
                <DialogDescription>
                  Paste a GitHub repository URL to clone it
                </DialogDescription>
              </DialogHeader>
              <FieldGroup className="space-y-4 mt-4">
                <Field>
                  <FieldLabel htmlFor="githubUrl">Repository URL</FieldLabel>
                  <Input
                    id="githubUrl"
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    placeholder="https://github.com/username/repo"
                    className="bg-input border-border focus:border-primary"
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="repoName">Project Name</FieldLabel>
                  <Input
                    id="repoName"
                    value={repoName}
                    onChange={(e) => setRepoName(e.target.value)}
                    placeholder="my-cloned-project"
                    className="bg-input border-border focus:border-primary"
                  />
                </Field>
                <Button
                  onClick={handleClone}
                  disabled={!githubUrl.trim() || !repoName.trim() || cloning}
                  className="w-full bg-primary/10 border border-primary/50 text-primary hover:bg-primary/20 hover:border-primary neon-border"
                >
                  {cloning ? (
                    <>
                      <Spinner className="h-4 w-4 mr-2" />
                      Cloning...
                    </>
                  ) : (
                    <>
                      <Github className="h-4 w-4 mr-2" />
                      Clone Repository
                    </>
                  )}
                </Button>
              </FieldGroup>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  )
}
