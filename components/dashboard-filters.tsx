"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { Download, FileText, ImageIcon, X, Filter } from "lucide-react"
import type { DashboardFilters, RedditPost } from "@/lib/types"

interface DashboardFiltersProps {
  posts: RedditPost[]
  filters: DashboardFilters
  onFiltersChange: (filters: DashboardFilters) => void
  onExport: (type: "csv" | "xlsx" | "pdf" | "screenshot") => void
}

export function DashboardFiltersPanel({ posts, filters, onFiltersChange, onExport }: DashboardFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({})

  // Get unique subreddits
  const availableSubreddits = Array.from(new Set(posts.map((post) => post.subreddit_name))).sort()

  const handleSubredditToggle = (subreddit: string, checked: boolean) => {
    const newSubreddits = checked
      ? [...filters.subreddits, subreddit]
      : filters.subreddits.filter((s) => s !== subreddit)

    onFiltersChange({ ...filters, subreddits: newSubreddits })
  }

  const handleDateRangeChange = (range: string) => {
    onFiltersChange({ ...filters, dateRange: range as any })
  }

  const handleSearchChange = (query: string) => {
    onFiltersChange({ ...filters, searchQuery: query })
  }

  const handleSortChange = (sortBy: string) => {
    onFiltersChange({ ...filters, sortBy: sortBy as any })
  }

  const clearAllFilters = () => {
    onFiltersChange({
      dateRange: "all",
      subreddits: [],
      sortBy: "top",
      searchQuery: "",
    })
  }

  const activeFiltersCount = [
    filters.dateRange !== "all" ? 1 : 0,
    filters.subreddits.length,
    filters.searchQuery.trim() ? 1 : 0,
    filters.sortBy !== "top" ? 1 : 0,
  ].reduce((sum, count) => sum + count, 0)

  return (
    <Card className="bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-50 dark:from-slate-950/50 dark:via-gray-950/50 dark:to-zinc-950/50 border-slate-200 dark:border-slate-800 shadow-lg hover:shadow-xl transition-all duration-300">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-slate-600 via-gray-600 to-zinc-600 bg-clip-text text-transparent">
              🎛️ Filters & Export
            </CardTitle>
            {activeFiltersCount > 0 && (
              <Badge className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white border-0 shadow-sm animate-pulse">
                {activeFiltersCount} active
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="bg-gradient-to-r from-slate-100 to-gray-100 dark:from-slate-800 dark:to-slate-800 border-slate-200 dark:border-slate-700 hover:from-slate-200 hover:to-gray-200 dark:hover:from-slate-700 dark:hover:to-gray-700 transition-all duration-200 shadow-sm"
            >
              <Filter className="w-4 h-4 mr-2" />
              {isExpanded ? "Hide" : "Show"} Filters
            </Button>
            {activeFiltersCount > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={clearAllFilters}
                className="bg-gradient-to-r from-red-100 to-pink-100 dark:from-red-900/30 dark:to-pink-900/30 border-red-200 dark:border-red-700 hover:from-red-200 hover:to-pink-200 dark:hover:from-red-800/40 dark:hover:to-pink-800/40 text-red-700 dark:text-red-300 transition-all duration-200 shadow-sm"
              >
                <X className="w-4 h-4 mr-2" />
                Clear All
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent className="space-y-6 bg-white/80 dark:bg-gray-900/80 rounded-xl backdrop-blur-sm border border-white/20 dark:border-gray-700/20 p-6">
          <div className="space-y-3">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
              🔍 Search
            </label>
            <Input
              placeholder="Search posts, authors, or content..."
              value={filters.searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="bg-gradient-to-r from-white to-slate-50 dark:from-gray-800 dark:to-slate-800 border-slate-200 dark:border-slate-700 focus:border-blue-400 dark:focus:border-blue-500 transition-all duration-200 shadow-sm"
            />
          </div>

          <Separator className="bg-gradient-to-r from-slate-200 via-gray-300 to-slate-200 dark:from-slate-700 dark:via-gray-600 dark:to-slate-700 h-px" />

          <div className="space-y-3">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
              📅 Date Range
            </label>
            <Select value={filters.dateRange} onValueChange={handleDateRangeChange}>
              <SelectTrigger className="bg-gradient-to-r from-white to-slate-50 dark:from-gray-800 dark:to-slate-800 border-slate-200 dark:border-slate-700 hover:from-slate-50 hover:to-slate-100 dark:hover:from-slate-700 dark:hover:to-slate-700 transition-all duration-200 shadow-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="7d">Last 7 Days</SelectItem>
                <SelectItem value="30d">Last 30 Days</SelectItem>
                <SelectItem value="90d">Last 90 Days</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Separator className="bg-gradient-to-r from-slate-200 via-gray-300 to-slate-200 dark:from-slate-700 dark:via-gray-600 dark:to-slate-700 h-px" />

          <div className="space-y-3">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
              📊 Sort By
            </label>
            <Select value={filters.sortBy} onValueChange={handleSortChange}>
              <SelectTrigger className="bg-gradient-to-r from-white to-slate-50 dark:from-gray-800 dark:to-slate-800 border-slate-200 dark:border-slate-700 hover:from-slate-50 hover:to-slate-100 dark:hover:from-slate-700 dark:hover:to-slate-700 transition-all duration-200 shadow-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="top">🏆 Top (Score)</SelectItem>
                <SelectItem value="hot">🔥 Hot (Trending)</SelectItem>
                <SelectItem value="new">🆕 New (Recent)</SelectItem>
                <SelectItem value="rising">📈 Rising (Growing)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Separator className="bg-gradient-to-r from-slate-200 via-gray-300 to-slate-200 dark:from-slate-700 dark:via-gray-600 dark:to-slate-700 h-px" />

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                🏘️ Subreddits
              </label>
              <span className="text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">
                {filters.subreddits.length} of {availableSubreddits.length} selected
              </span>
            </div>

            {filters.subreddits.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {filters.subreddits.map((subreddit) => (
                  <Badge
                    key={subreddit}
                    className="text-xs bg-gradient-to-r from-blue-500 to-indigo-500 text-white border-0 shadow-sm hover:from-blue-600 hover:to-indigo-600 transition-all duration-200"
                  >
                    r/{subreddit}
                    <button
                      onClick={() => handleSubredditToggle(subreddit, false)}
                      className="ml-2 hover:bg-white/20 rounded-full p-1 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}

            <div className="max-h-40 overflow-y-auto space-y-2 border border-slate-200 dark:border-slate-700 rounded-xl p-4 bg-gradient-to-br from-white to-slate-50 dark:from-gray-800 dark:to-slate-800 shadow-inner">
              {availableSubreddits.map((subreddit) => (
                <div
                  key={subreddit}
                  className="flex items-center space-x-3 p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                >
                  <Checkbox
                    id={`filter-${subreddit}`}
                    checked={filters.subreddits.includes(subreddit)}
                    onCheckedChange={(checked) => handleSubredditToggle(subreddit, checked as boolean)}
                    className="border-slate-300 dark:border-slate-600"
                  />
                  <label
                    htmlFor={`filter-${subreddit}`}
                    className="text-sm flex-1 font-medium text-slate-700 dark:text-slate-300"
                  >
                    r/{subreddit}
                  </label>
                  <Badge
                    variant="outline"
                    className="text-xs border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-400"
                  >
                    {posts.filter((p) => p.subreddit_name === subreddit).length}
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          <Separator className="bg-gradient-to-r from-slate-200 via-gray-300 to-slate-200 dark:from-slate-700 dark:via-gray-600 dark:to-slate-700 h-px" />

          <div className="space-y-4">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
              📤 Export Data
            </label>
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onExport("csv")}
                className="justify-start bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-700 hover:from-green-100 hover:to-emerald-100 dark:hover:from-green-800/30 dark:hover:to-emerald-800/30 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <FileText className="w-4 h-4 mr-2 text-green-600 dark:text-green-400" />
                Export CSV
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onExport("xlsx")}
                className="justify-start bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-700 hover:from-blue-100 hover:to-indigo-100 dark:hover:from-blue-800/30 dark:hover:to-indigo-800/30 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <FileText className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" />
                Export Excel
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onExport("pdf")}
                className="justify-start bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 border-red-200 dark:border-red-700 hover:from-red-100 hover:to-pink-100 dark:hover:from-red-800/30 dark:hover:to-pink-800/30 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <Download className="w-4 h-4 mr-2 text-red-600 dark:text-red-400" />
                Export PDF
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onExport("screenshot")}
                className="justify-start bg-gradient-to-r from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 border-purple-200 dark:border-purple-700 hover:from-purple-100 hover:to-violet-100 dark:hover:from-purple-800/30 dark:hover:to-violet-800/30 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <ImageIcon className="w-4 h-4 mr-2 text-purple-600 dark:text-purple-400" />
                Screenshot
              </Button>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  )
}

export { DashboardFiltersPanel as DashboardFilters }
