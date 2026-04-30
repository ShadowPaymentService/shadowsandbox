'use client'

import { useState, useCallback } from 'react'
import Link from 'next/link'
import { Project, ProjectFile } from '@/lib/types'
import { FileExplorer } from './file-explorer'
import { CodeEditor } from './code-editor'
import { Terminal } from './terminal'
import { AIAssistant } from './ai-assistant'
import { Button } from '@/components/ui/button'
import {
  Terminal as TerminalIcon,
  ArrowLeft,
  Save,
  Bot,
  PanelLeftClose,
  PanelLeft,
  ChevronDown,
  ChevronUp,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface IDELayoutProps {
  project: Project
  onSaveFiles: (files: ProjectFile[]) => Promise<void>
}

export function IDELayout({ project, onSaveFiles }: IDELayoutProps) {
  const [files, setFiles] = useState<ProjectFile[]>(project.files || [])
  const [activeFileId, setActiveFileId] = useState<string | null>(
    files.length > 0 ? files[0].id : null
  )
  const [showSidebar, setShowSidebar] = useState(true)
  const [showTerminal, setShowTerminal] = useState(true)
  const [showAI, setShowAI] = useState(false)
  const [saving, setSaving] = useState(false)
  const [terminalHeight, setTerminalHeight] = useState(200)

  const activeFile = files.find((f) => f.id === activeFileId) || null

  const handleFileSelect = (fileId: string) => {
    setActiveFileId(fileId)
  }

  const handleFileChange = useCallback((fileId: string, content: string) => {
    setFiles((prev) =>
      prev.map((f) => (f.id === fileId ? { ...f, content } : f))
    )
  }, [])

  const handleSave = async () => {
    setSaving(true)
    try {
      await onSaveFiles(files)
    } finally {
      setSaving(false)
    }
  }

  const handleCreateFile = (name: string) => {
    const extension = name.split('.').pop() || ''
    const languageMap: Record<string, string> = {
      js: 'javascript',
      ts: 'typescript',
      jsx: 'javascript',
      tsx: 'typescript',
      html: 'html',
      css: 'css',
      py: 'python',
      json: 'json',
      md: 'markdown',
      yml: 'yaml',
      yaml: 'yaml',
    }
    
    const newFile: ProjectFile = {
      id: Date.now().toString(),
      name,
      path: `/${name}`,
      content: '',
      language: languageMap[extension] || 'plaintext',
    }
    
    setFiles((prev) => [...prev, newFile])
    setActiveFileId(newFile.id)
  }

  const handleDeleteFile = (fileId: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== fileId))
    if (activeFileId === fileId) {
      const remainingFiles = files.filter((f) => f.id !== fileId)
      setActiveFileId(remainingFiles.length > 0 ? remainingFiles[0].id : null)
    }
  }

  const handleAIInsert = (code: string) => {
    if (!activeFile) return
    handleFileChange(activeFile.id, activeFile.content + '\n' + code)
  }

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <header className="h-12 border-b border-border flex items-center justify-between px-4 bg-card/50">
        <div className="flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <TerminalIcon className="h-5 w-5 text-primary" />
            <span className="font-semibold text-foreground">{project.name}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowSidebar(!showSidebar)}
            className="text-muted-foreground hover:text-primary"
          >
            {showSidebar ? <PanelLeftClose className="h-4 w-4" /> : <PanelLeft className="h-4 w-4" />}
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowAI(!showAI)}
            className={cn(
              'text-muted-foreground hover:text-primary',
              showAI && 'bg-primary/10 text-primary'
            )}
          >
            <Bot className="h-4 w-4 mr-1" />
            AI
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowTerminal(!showTerminal)}
            className={cn(
              'text-muted-foreground hover:text-primary',
              showTerminal && 'bg-primary/10 text-primary'
            )}
          >
            <TerminalIcon className="h-4 w-4 mr-1" />
            Terminal
          </Button>
          
          <Button
            onClick={handleSave}
            disabled={saving}
            size="sm"
            className="bg-primary/10 border border-primary/50 text-primary hover:bg-primary/20"
          >
            <Save className="h-4 w-4 mr-1" />
            {saving ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar with AI */}
        {(showSidebar || showAI) && (
          <div className={cn(
            'flex flex-col border-r border-border bg-card/30',
            showAI ? 'w-80' : 'w-56'
          )}>
            {showSidebar && (
              <div className={cn('flex-1 overflow-hidden', showAI && 'border-b border-border')}>
                <FileExplorer
                  files={files}
                  activeFileId={activeFileId}
                  onFileSelect={handleFileSelect}
                  onCreateFile={handleCreateFile}
                  onDeleteFile={handleDeleteFile}
                />
              </div>
            )}
            {showAI && (
              <div className={cn('overflow-hidden', showSidebar ? 'h-1/2' : 'flex-1')}>
                <AIAssistant
                  activeFile={activeFile}
                  onInsertCode={handleAIInsert}
                />
              </div>
            )}
          </div>
        )}

        {/* Editor + Terminal */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Code Editor */}
          <div className="flex-1 overflow-hidden">
            <CodeEditor
              file={activeFile}
              onChange={(content) => activeFile && handleFileChange(activeFile.id, content)}
            />
          </div>

          {/* Terminal */}
          {showTerminal && (
            <div 
              className="border-t border-border bg-card/50"
              style={{ height: terminalHeight }}
            >
              {/* Terminal Resize Handle */}
              <div className="h-6 border-b border-border flex items-center justify-between px-2 cursor-ns-resize bg-secondary/50"
                onMouseDown={(e) => {
                  const startY = e.clientY
                  const startHeight = terminalHeight
                  
                  const handleMouseMove = (e: MouseEvent) => {
                    const diff = startY - e.clientY
                    setTerminalHeight(Math.max(100, Math.min(500, startHeight + diff)))
                  }
                  
                  const handleMouseUp = () => {
                    document.removeEventListener('mousemove', handleMouseMove)
                    document.removeEventListener('mouseup', handleMouseUp)
                  }
                  
                  document.addEventListener('mousemove', handleMouseMove)
                  document.addEventListener('mouseup', handleMouseUp)
                }}
              >
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <TerminalIcon className="h-3 w-3" />
                  Terminal
                </span>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4 text-muted-foreground hover:text-primary p-0"
                    onClick={() => setTerminalHeight(prev => Math.min(500, prev + 50))}
                  >
                    <ChevronUp className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4 text-muted-foreground hover:text-primary p-0"
                    onClick={() => setTerminalHeight(prev => Math.max(100, prev - 50))}
                  >
                    <ChevronDown className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              <div className="h-[calc(100%-24px)]">
                <Terminal />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
