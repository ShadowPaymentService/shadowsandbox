'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Terminal,
  Clock,
  Coins,
  Settings,
  Gift,
  FolderOpen,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Plus,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const menuItems = [
  { icon: Clock, label: 'Recent', href: '/dashboard' },
  { icon: FolderOpen, label: 'Your Projects', href: '/dashboard/projects' },
  { icon: Gift, label: 'Free Credits', href: '/dashboard/credits' },
  { icon: Coins, label: 'Credits', href: '/dashboard/billing' },
  { icon: Settings, label: 'Settings', href: '/dashboard/settings' },
  { icon: Discord, label: 'Settings', href: '/dashboard/discord-live' },
]

export function DashboardSidebar() {
  const pathname = usePathname()
  const { user, signOut } = useAuth()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <aside
      className={cn(
        'h-full bg-sidebar border-r border-sidebar-border flex flex-col transition-all duration-300',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Header */}
      <div className="p-4 border-b border-sidebar-border flex items-center justify-between">
        {!collapsed && (
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="relative">
              <Terminal className="h-6 w-6 text-primary" />
              <div className="absolute inset-0 blur-sm bg-primary/50 -z-10" />
            </div>
            <span className="font-bold text-primary neon-glow text-sm">ShadowSandBox</span>
          </Link>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      {/* Create Project Button */}
      <div className="p-3">
        <Link href="/dashboard/new">
          <Button
            className={cn(
              'w-full bg-primary/10 border border-primary/50 text-primary hover:bg-primary/20 hover:border-primary transition-all neon-border',
              collapsed ? 'px-0 justify-center' : ''
            )}
          >
            <Plus className="h-4 w-4" />
            {!collapsed && <span className="ml-2">Create Project</span>}
          </Button>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = pathname === item.href || 
            (item.href !== '/dashboard' && pathname?.startsWith(item.href))
          
          return (
            <Link key={item.href} href={item.href}>
              <div
                className={cn(
                  'flex items-center gap-3 px-3 py-2 rounded-md transition-all duration-200 group',
                  isActive
                    ? 'bg-primary/10 text-primary border border-primary/30'
                    : 'text-muted-foreground hover:text-primary hover:bg-primary/5'
                )}
              >
                <item.icon className={cn(
                  'h-5 w-5 flex-shrink-0',
                  isActive && 'drop-shadow-[0_0_3px_rgba(0,255,0,0.5)]'
                )} />
                {!collapsed && (
                  <span className="text-sm font-medium">{item.label}</span>
                )}
              </div>
            </Link>
          )
        })}
      </nav>

      {/* User Section */}
      <div className="p-3 border-t border-sidebar-border">
        <div
          className={cn(
            'flex items-center gap-3 p-2 rounded-md',
            collapsed ? 'justify-center' : ''
          )}
        >
          <Avatar className="h-8 w-8 border border-primary/30">
            <AvatarImage src={user?.photoURL || undefined} />
            <AvatarFallback className="bg-primary/10 text-primary text-xs">
              {user?.displayName?.charAt(0) || user?.email?.charAt(0) || '?'}
            </AvatarFallback>
          </Avatar>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {user?.displayName || 'User'}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {user?.email}
              </p>
            </div>
          )}
        </div>
        
        <Button
          variant="ghost"
          onClick={() => signOut()}
          className={cn(
            'w-full mt-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10',
            collapsed ? 'px-0 justify-center' : 'justify-start'
          )}
        >
          <LogOut className="h-4 w-4" />
          {!collapsed && <span className="ml-2">Sign Out</span>}
        </Button>
      </div>
    </aside>
  )
}
