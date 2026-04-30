'use client'

import { useCallback } from 'react'
import Editor, { OnMount } from '@monaco-editor/react'
import { ProjectFile } from '@/lib/types'
import { Spinner } from '@/components/ui/spinner'
import { FileCode } from 'lucide-react'

interface CodeEditorProps {
  file: ProjectFile | null
  onChange: (content: string) => void
}

export function CodeEditor({ file, onChange }: CodeEditorProps) {
  const handleEditorMount: OnMount = useCallback((editor, monaco) => {
    // Define custom theme matching our hacker aesthetic
    monaco.editor.defineTheme('shadowsandbox', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '4a5f4a', fontStyle: 'italic' },
        { token: 'keyword', foreground: '00ff00' },
        { token: 'string', foreground: '7fff7f' },
        { token: 'number', foreground: '00cc00' },
        { token: 'type', foreground: '00ff99' },
        { token: 'function', foreground: '00ffcc' },
        { token: 'variable', foreground: 'aaffaa' },
        { token: 'operator', foreground: '00ff00' },
      ],
      colors: {
        'editor.background': '#0a0a0a',
        'editor.foreground': '#00ff00',
        'editor.lineHighlightBackground': '#0f1f0f',
        'editor.selectionBackground': '#003300',
        'editor.inactiveSelectionBackground': '#002200',
        'editorCursor.foreground': '#00ff00',
        'editorWhitespace.foreground': '#1a2f1a',
        'editorLineNumber.foreground': '#2a4a2a',
        'editorLineNumber.activeForeground': '#00ff00',
        'editor.selectionHighlightBackground': '#004400',
        'editorBracketMatch.background': '#003300',
        'editorBracketMatch.border': '#00ff00',
        'editorIndentGuide.background': '#1a2a1a',
        'editorIndentGuide.activeBackground': '#2a4a2a',
        'scrollbarSlider.background': '#002200',
        'scrollbarSlider.hoverBackground': '#003300',
        'scrollbarSlider.activeBackground': '#004400',
      },
    })

    monaco.editor.setTheme('shadowsandbox')

    // Set editor options
    editor.updateOptions({
      fontFamily: 'Fira Code, monospace',
      fontSize: 14,
      lineHeight: 22,
      minimap: { enabled: false },
      scrollBeyondLastLine: false,
      cursorBlinking: 'expand',
      cursorStyle: 'line',
      cursorWidth: 2,
      smoothScrolling: true,
      padding: { top: 16, bottom: 16 },
      renderLineHighlight: 'all',
      bracketPairColorization: { enabled: true },
    })
  }, [])

  if (!file) {
    return (
      <div className="h-full flex items-center justify-center bg-[#0a0a0a]">
        <div className="text-center">
          <FileCode className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Select a file to start editing</p>
          <p className="text-xs text-muted-foreground mt-2">
            or create a new file from the file explorer
          </p>
        </div>
      </div>
    )
  }

  return (
    <Editor
      height="100%"
      language={file.language}
      value={file.content}
      onChange={(value) => onChange(value || '')}
      onMount={handleEditorMount}
      loading={
        <div className="h-full flex items-center justify-center bg-[#0a0a0a]">
          <div className="flex flex-col items-center gap-2">
            <Spinner className="h-6 w-6 text-primary" />
            <span className="text-primary text-sm">Loading editor...</span>
          </div>
        </div>
      }
      options={{
        fontFamily: 'Fira Code, monospace',
        fontSize: 14,
        lineHeight: 22,
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        automaticLayout: true,
        tabSize: 2,
        wordWrap: 'on',
        padding: { top: 16, bottom: 16 },
      }}
    />
  )
}
