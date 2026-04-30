'use client'

import { useState } from 'react'
import { ProjectFile } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '@/components/ui/context-menu'
import { 
  File, 
  FileCode, 
  FileJson, 
  FileType, 
  Plus, 
  Trash2,
  FolderOpen,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface FileExplorerProps {
  files: ProjectFile[]
  activeFileId: string | null
  onFileSelect: (fileId: string) => void
  onCreateFile: (name: string) => void
  onDeleteFile: (fileId: string) => void
}

const fileIcons: Record<string, React.ReactNode> = {
  javascript: <FileCode className="h-4 w-4 text-yellow-400" />,
  typescript: <FileCode className="h-4 w-4 text-blue-400" />,
  html: <FileCode className="h-4 w-4 text-orange-400" />,
  css: <FileCode className="h-4 w-4 text-blue-300" />,
  python: <FileCode className="h-4 w-4 text-green-400" />,
  json: <FileJson className="h-4 w-4 text-yellow-300" />,
  markdown: <FileType className="h-4 w-4 text-gray-400" />,
  yaml: <FileJson className="h-4 w-4 text-red-400" />,
  dockerfile: <File className="h-4 w-4 text-cyan-400" />,
}

export function FileExplorer({
  files,
  activeFileId,
  onFileSelect,
  onCreateFile,
  onDeleteFile,
}: FileExplorerProps) {
  const [isCreating, setIsCreating] = useState(false)
  const [newFileName, setNewFileName] = useState('')

  const handleCreate = () => {
    if (newFileName.trim()) {
      onCreateFile(newFileName.trim())
      setNewFileName('')
      setIsCreating(false)
    }
  }

  const getFileIcon = (file: ProjectFile) => {
    return fileIcons[file.language] || <File className="h-4 w-4 text-muted-foreground" />
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="h-10 border-b border-border flex items-center justify-between px-3">
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
          <FolderOpen className="h-4 w-4 text-primary" />
          Files
        </span>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 text-muted-foreground hover:text-primary"
          onClick={() => setIsCreating(true)}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {/* File List */}
      <div className="flex-1 overflow-y-auto p-2">
        {isCreating && (
          <div className="mb-2">
            <Input
              value={newFileName}
              onChange={(e) => setNewFileName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleCreate()
                if (e.key === 'Escape') setIsCreating(false)
              }}
              onBlur={() => {
                if (!newFileName.trim()) setIsCreating(false)
              }}
              placeholder="filename.ext"
              className="h-7 text-xs bg-input border-primary/50"
              autoFocus
            />
          </div>
        )}

        {files.length === 0 && !isCreating ? (
          <div className="text-center py-8">
            <File className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-xs text-muted-foreground">No files yet</p>
            <Button
              variant="ghost"
              size="sm"
              className="mt-2 text-xs text-primary"
              onClick={() => setIsCreating(true)}
            >
              <Plus className="h-3 w-3 mr-1" />
              Create file
            </Button>
          </div>
        ) : (
          <div className="space-y-0.5">
            {files.map((file) => (
              <ContextMenu key={file.id}>
                <ContextMenuTrigger>
                  <button
                    onClick={() => onFileSelect(file.id)}
                    className={cn(
                      'w-full flex items-center gap-2 px-2 py-1.5 rounded text-sm transition-colors',
                      activeFileId === file.id
                        ? 'bg-primary/10 text-primary'
                        : 'text-foreground hover:bg-secondary'
                    )}
                  >
                    {getFileIcon(file)}
                    <span className="truncate">{file.name}</span>
                  </button>
                </ContextMenuTrigger>
                <ContextMenuContent className="bg-popover border-border">
                  <ContextMenuItem
                    onClick={() => onDeleteFile(file.id)}
                    className="text-destructive focus:text-destructive"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </ContextMenuItem>
                </ContextMenuContent>
              </ContextMenu>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
