'use client'

import { useEffect, useRef, useState } from 'react'

export function Terminal() {
  const terminalRef = useRef<HTMLDivElement>(null)
  const [initialized, setInitialized] = useState(false)
  const terminalInstanceRef = useRef<import('@xterm/xterm').Terminal | null>(null)

  useEffect(() => {
    if (!terminalRef.current || initialized) return

    let terminal: import('@xterm/xterm').Terminal | null = null

    const initTerminal = async () => {
      const { Terminal } = await import('@xterm/xterm')
      const { FitAddon } = await import('@xterm/addon-fit')
      
      // Import CSS dynamically
      await import('@xterm/xterm/css/xterm.css')

      terminal = new Terminal({
        theme: {
          background: '#0a0a0a',
          foreground: '#00ff00',
          cursor: '#00ff00',
          cursorAccent: '#0a0a0a',
          selectionBackground: '#003300',
          black: '#0a0a0a',
          red: '#ff3333',
          green: '#00ff00',
          yellow: '#ffff00',
          blue: '#0066ff',
          magenta: '#ff00ff',
          cyan: '#00ffff',
          white: '#ffffff',
          brightBlack: '#333333',
          brightRed: '#ff6666',
          brightGreen: '#33ff33',
          brightYellow: '#ffff66',
          brightBlue: '#3399ff',
          brightMagenta: '#ff66ff',
          brightCyan: '#66ffff',
          brightWhite: '#ffffff',
        },
        fontFamily: 'Fira Code, monospace',
        fontSize: 13,
        lineHeight: 1.4,
        cursorBlink: true,
        cursorStyle: 'block',
        scrollback: 1000,
      })

      const fitAddon = new FitAddon()
      terminal.loadAddon(fitAddon)

      terminal.open(terminalRef.current!)
      fitAddon.fit()

      terminalInstanceRef.current = terminal

      // Welcome message
      terminal.writeln('\x1b[32m╔══════════════════════════════════════════╗\x1b[0m')
      terminal.writeln('\x1b[32m║    Welcome to ShadowSandBox Terminal     ║\x1b[0m')
      terminal.writeln('\x1b[32m╚══════════════════════════════════════════╝\x1b[0m')
      terminal.writeln('')
      terminal.writeln('\x1b[90mThis is a simulated terminal environment.\x1b[0m')
      terminal.writeln('\x1b[90mType "help" for available commands.\x1b[0m')
      terminal.writeln('')
      
      let currentLine = ''
      const prompt = '\x1b[32mshadow\x1b[0m@\x1b[36msandbox\x1b[0m:\x1b[33m~\x1b[0m$ '
      
      terminal.write(prompt)

      // Simple command handling
      terminal.onData((data) => {
        if (!terminal) return

        if (data === '\r') {
          // Enter pressed
          terminal.write('\r\n')
          handleCommand(terminal, currentLine.trim())
          currentLine = ''
          terminal.write(prompt)
        } else if (data === '\x7f') {
          // Backspace
          if (currentLine.length > 0) {
            currentLine = currentLine.slice(0, -1)
            terminal.write('\b \b')
          }
        } else if (data >= ' ') {
          // Regular character
          currentLine += data
          terminal.write(data)
        }
      })

      // Handle resize
      const resizeObserver = new ResizeObserver(() => {
        fitAddon.fit()
      })
      
      if (terminalRef.current) {
        resizeObserver.observe(terminalRef.current)
      }

      setInitialized(true)

      return () => {
        resizeObserver.disconnect()
        terminal?.dispose()
      }
    }

    initTerminal()

    return () => {
      if (terminalInstanceRef.current) {
        terminalInstanceRef.current.dispose()
        terminalInstanceRef.current = null
      }
    }
  }, [initialized])

  return (
    <div 
      ref={terminalRef} 
      className="h-full w-full bg-[#0a0a0a] p-2"
      style={{ minHeight: '100px' }}
    />
  )
}

function handleCommand(terminal: import('@xterm/xterm').Terminal, command: string) {
  const commands: Record<string, () => void> = {
    help: () => {
      terminal.writeln('\x1b[32mAvailable commands:\x1b[0m')
      terminal.writeln('  \x1b[36mhelp\x1b[0m     - Show this help message')
      terminal.writeln('  \x1b[36mclear\x1b[0m    - Clear the terminal')
      terminal.writeln('  \x1b[36mdate\x1b[0m     - Show current date and time')
      terminal.writeln('  \x1b[36mwhoami\x1b[0m   - Display current user')
      terminal.writeln('  \x1b[36mecho\x1b[0m     - Echo text back')
      terminal.writeln('  \x1b[36muname\x1b[0m    - Print system information')
      terminal.writeln('  \x1b[36mpwd\x1b[0m      - Print working directory')
      terminal.writeln('  \x1b[36mls\x1b[0m       - List directory contents')
      terminal.writeln('  \x1b[36mneofetch\x1b[0m - Display system info')
    },
    clear: () => {
      terminal.clear()
    },
    date: () => {
      terminal.writeln(new Date().toString())
    },
    whoami: () => {
      terminal.writeln('\x1b[32mhacker\x1b[0m')
    },
    uname: () => {
      terminal.writeln('ShadowSandBox OS 1.0.0 - Cloud IDE Terminal')
    },
    pwd: () => {
      terminal.writeln('/home/hacker/project')
    },
    ls: () => {
      terminal.writeln('\x1b[34m.\x1b[0m  \x1b[34m..\x1b[0m  \x1b[32mindex.html\x1b[0m  \x1b[32mstyle.css\x1b[0m  \x1b[32mscript.js\x1b[0m')
    },
    neofetch: () => {
      terminal.writeln('\x1b[32m        ___           ___      \x1b[0m   \x1b[32mhacker\x1b[0m@\x1b[36msandbox\x1b[0m')
      terminal.writeln('\x1b[32m       /\\  \\         /\\  \\     \x1b[0m   ─────────────────')
      terminal.writeln('\x1b[32m      /::\\  \\       /::\\  \\    \x1b[0m   \x1b[32mOS:\x1b[0m ShadowSandBox')
      terminal.writeln('\x1b[32m     /:/\\ \\  \\     /:/\\ \\  \\   \x1b[0m   \x1b[32mHost:\x1b[0m Cloud IDE')
      terminal.writeln('\x1b[32m    _\\:\\~\\ \\  \\   _\\:\\~\\ \\  \\  \x1b[0m   \x1b[32mKernel:\x1b[0m WebTerm 1.0')
      terminal.writeln('\x1b[32m   /\\ \\:\\ \\ \\__\\ /\\ \\:\\ \\ \\__\\ \x1b[0m   \x1b[32mShell:\x1b[0m shadow-sh')
      terminal.writeln('\x1b[32m   \\:\\ \\:\\ \\/__/ \\:\\ \\:\\ \\/__/ \x1b[0m   \x1b[32mTerminal:\x1b[0m xterm.js')
      terminal.writeln('\x1b[32m    \\:\\ \\:\\__\\    \\:\\ \\:\\__\\   \x1b[0m   \x1b[32mTheme:\x1b[0m Neon Green')
      terminal.writeln('\x1b[32m     \\:\\/:/  /     \\:\\/:/  /   \x1b[0m   \x1b[32mIcons:\x1b[0m Lucide')
      terminal.writeln('\x1b[32m      \\::/  /       \\::/  /    \x1b[0m   ')
      terminal.writeln('\x1b[32m       \\/__/         \\/__/     \x1b[0m   \x1b[40m  \x1b[41m  \x1b[42m  \x1b[43m  \x1b[44m  \x1b[45m  \x1b[46m  \x1b[47m  \x1b[0m')
    },
  }

  if (!command) return

  // Handle echo command specially
  if (command.startsWith('echo ')) {
    terminal.writeln(command.substring(5))
    return
  }

  const handler = commands[command]
  if (handler) {
    handler()
  } else {
    terminal.writeln(`\x1b[31mCommand not found: ${command}\x1b[0m`)
    terminal.writeln('Type "help" for available commands.')
  }
}
