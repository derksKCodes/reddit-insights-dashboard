"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { BarChart3, TrendingUp, Users, MessageSquare, Menu, X, Home, Settings } from "lucide-react"
import { cn } from "@/lib/utils"

interface SidebarNavigationProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

export function SidebarNavigation({ activeTab, onTabChange }: SidebarNavigationProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)

  const navigationItems = [
    { id: "overview", label: "Overview", icon: Home },
    { id: "posts", label: "Top Posts", icon: MessageSquare },
    { id: "trends", label: "Trends", icon: TrendingUp },
    { id: "growth", label: "Growth", icon: BarChart3 },
    { id: "comparison", label: "Compare", icon: Users },
  ]

  return (
    <div
      className={cn(
        "fixed left-0 top-0 h-full bg-gradient-to-b from-slate-900 to-slate-800 dark:from-slate-900 dark:to-slate-800 light:from-white light:to-slate-50 border-r border-slate-700 dark:border-slate-700 light:border-slate-200 transition-all duration-300 z-50",
        isCollapsed ? "w-16" : "w-64",
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-700 dark:border-slate-700 light:border-slate-200">
        {!isCollapsed && (
          <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent font-display">
            Reddit Insights
          </h1>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="text-slate-400 hover:text-white hover:bg-slate-700"
        >
          {isCollapsed ? <Menu className="h-4 w-4" /> : <X className="h-4 w-4" />}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-2">
        {navigationItems.map((item) => {
          const Icon = item.icon
          const isActive = activeTab === item.id

          return (
            <Button
              key={item.id}
              variant={isActive ? "default" : "ghost"}
              className={cn(
                "w-full justify-start transition-all duration-200",
                isActive
                  ? "bg-gradient-to-r from-indigo-500 to-cyan-500 text-white shadow-lg"
                  : "text-slate-400 hover:text-white hover:bg-slate-700",
                isCollapsed && "px-2",
              )}
              onClick={() => onTabChange(item.id)}
            >
              <Icon className={cn("h-4 w-4", !isCollapsed && "mr-3")} />
              {!isCollapsed && item.label}
            </Button>
          )
        })}
      </nav>

      {/* Footer */}
      {!isCollapsed && (
        <div className="absolute bottom-4 left-4 right-4">
          <Button variant="ghost" className="w-full justify-start text-slate-400 hover:text-white hover:bg-slate-700">
            <Settings className="h-4 w-4 mr-3" />
            Settings
          </Button>
        </div>
      )}
    </div>
  )
}
