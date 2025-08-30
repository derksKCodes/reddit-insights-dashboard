"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Moon, Sun, Upload, Download } from "lucide-react"
import { useTheme } from "next-themes"
import { DashboardFilters } from "./dashboard-filters"

interface TopNavbarProps {
  onFileUpload: (file: File) => void
  onExport: () => void
  filters: any
  onFiltersChange: (filters: any) => void
}

export function TopNavbar({ onFileUpload, onExport, filters, onFiltersChange }: TopNavbarProps) {
  const { theme, setTheme } = useTheme()

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      onFileUpload(file)
    }
  }

  return (
    <div className="fixed top-0 right-0 left-0 md:left-64 h-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-700 z-40">
      <div className="flex items-center justify-between h-full px-6">
        {/* Left side - Filters */}
        <div className="flex-1">
          <DashboardFilters filters={filters} onFiltersChange={onFiltersChange} />
        </div>

        {/* Right side - Actions */}
        <div className="flex items-center space-x-3">
          {/* File Upload */}
          <div className="relative">
            <input
              type="file"
              accept=".csv,.xlsx,.json,.sql"
              onChange={handleFileUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <Button
              variant="outline"
              size="sm"
              className="bg-gradient-to-r from-indigo-500 to-cyan-500 text-white border-0 hover:from-indigo-600 hover:to-cyan-600"
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload Data
            </Button>
          </div>

          {/* Export */}
          <Button
            variant="outline"
            size="sm"
            onClick={onExport}
            className="border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 bg-transparent"
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>

          {/* Theme Toggle */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
        </div>
      </div>
    </div>
  )
}
