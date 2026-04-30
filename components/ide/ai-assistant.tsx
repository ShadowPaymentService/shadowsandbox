'use client'

import { useRef, useEffect, useState } from 'react'
import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport, UIMessage } from 'ai'
import { ProjectFile } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Spinner } from '@/components/ui/spinner'
import { Bot, Send, Copy, Check, Code, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface AIAssistantProps {
  activeFile: ProjectFile | null
  onInsertCode: (code: string) => void
}

function getUIMessageText(msg: UIMessage): string {
  if (!msg.parts || !Array.isArray(msg.parts)) return ''
  return msg.parts
    .filter((p): p is { type: 'text'; text: string } => p.type === 'text')
    .map((p) => p.text)
    .join('')
}

export function AIAssistant({ activeFile, onInsertCode }: AIAssistantProps) {
  const [input, setInput] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)

  const { messages, sendMessage, status, setMessages } = useChat({
    transport: new DefaultChatTransport({
      api: '/api/chat',
      prepareSendMessagesRequest: ({ id, messages }) => ({
        body: {
          messages,
          id,
          context: activeFile?.content || '',
        },
      }),
    }),
  })

  const isLoading = status === 'streaming' || status === 'submitted'

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return
    sendMessage({ text: input })
    setInput('')
  }

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  const extractCodeBlocks = (text: string): string[] => {
    const codeBlockRegex = /```[\w]*\n([\s\S]*?)```/g
    const blocks: string[] = []
    let match
    while ((match = codeBlockRegex.exec(text)) !== null) {
      blocks.push(match[1].trim())
    }
    return blocks
  }

  const renderMessage = (content: string) => {
    // Simple markdown-like rendering for code blocks
    const parts = content.split(/(```[\w]*\n[\s\S]*?```)/g)
    
    return parts.map((part, index) => {
      if (part.startsWith('```')) {
        const lines = part.split('\n')
        const language = lines[0].replace('```', '').trim()
        const code = lines.slice(1, -1).join('\n')
        
        return (
          <div key={index} className="my-2 rounded-md bg-[#0a0a0a] border border-primary/30 overflow-hidden">
            <div className="flex items-center justify-between px-3 py-1 bg-primary/10 border-b border-primary/30">
              <span className="text-xs text-primary">{language || 'code'}</span>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => onInsertCode(code)}
                  title="Insert into editor"
                >
                  <Code className="h-3 w-3 text-primary" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => handleCopy(code, index)}
                >
                  {copiedIndex === index ? (
                    <Check className="h-3 w-3 text-primary" />
                  ) : (
                    <Copy className="h-3 w-3 text-muted-foreground" />
                  )}
                </Button>
              </div>
            </div>
            <pre className="p-3 overflow-x-auto text-xs text-primary">
              <code>{code}</code>
            </pre>
          </div>
        )
      }
      
      return (
        <span key={index} className="whitespace-pre-wrap">
          {part}
        </span>
      )
    })
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="h-10 border-b border-border flex items-center justify-between px-3">
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
          <Bot className="h-4 w-4 text-primary" />
          AI Assistant
        </span>
        {messages.length > 0 && (
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-muted-foreground hover:text-destructive"
            onClick={() => setMessages([])}
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center py-8">
            <Bot className="h-10 w-10 text-primary/50 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground mb-2">AI Coding Assistant</p>
            <p className="text-xs text-muted-foreground">
              Ask me to help with your code, explain concepts, or debug issues.
            </p>
          </div>
        ) : (
          messages.map((message, index) => {
            const text = getUIMessageText(message)
            return (
              <div
                key={message.id}
                className={cn(
                  'text-sm',
                  message.role === 'user'
                    ? 'bg-primary/10 border border-primary/30 rounded-lg p-3'
                    : ''
                )}
              >
                {message.role === 'user' ? (
                  <div className="flex items-start gap-2">
                    <span className="text-primary text-xs">{'>'}</span>
                    <span className="text-foreground">{text}</span>
                  </div>
                ) : (
                  <div className="text-muted-foreground">
                    {renderMessage(text)}
                  </div>
                )}
              </div>
            )
          })
        )}
        
        {isLoading && (
          <div className="flex items-center gap-2 text-primary">
            <Spinner className="h-4 w-4" />
            <span className="text-xs">Thinking...</span>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-3 border-t border-border">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask the AI..."
            className="flex-1 h-8 text-sm bg-input border-border focus:border-primary"
            disabled={isLoading}
          />
          <Button
            type="submit"
            size="icon"
            disabled={isLoading || !input.trim()}
            className="h-8 w-8 bg-primary/10 border border-primary/50 text-primary hover:bg-primary/20"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  )
}
