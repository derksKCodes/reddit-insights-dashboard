"use client"

import type React from "react"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Upload, FileText, TrendingUp, Users, MessageSquare, Award } from "lucide-react"
import type { RedditPost, DashboardFilters } from "@/lib/types"
import { generateSampleData, parseFile } from "@/lib/file-processing"
import { calculateDashboardStats } from "@/lib/data-processing"
import { exportToCSV, exportToPDF, captureScreenshot, applyFilters } from "@/lib/export-utils"
import {
  SubredditDistributionChart,
  ActivityHoursChart,
  EngagementMetrics,
  TopAuthorsChart,
  RecentActivityTimeline,
} from "./overview-charts"
import { TopPostsTable } from "./top-posts-table"
import { TrendingWordsChart, WordCloudAlternative, TopicDistribution, SubredditWordAnalysis } from "./trending-analysis"
import { PostGrowthChart, EngagementTrendsChart, CumulativeGrowthChart } from "./growth-charts"
import { SubredditComparison, PerformanceRadar, TimelineComparison } from "./comparison-charts"
import { DashboardFiltersPanel } from "./dashboard-filters"

export function RedditDashboard() {
  const [allPosts, setAllPosts] = useState<RedditPost[]>([])
  const [loading, setLoading] = useState(false)
  const [filters, setFilters] = useState<DashboardFilters>({
    dateRange: "all",
    subreddits: [],
    sortBy: "top",
    searchQuery: "",
  })

  // Load sample data on mount
  useEffect(() => {
    const sampleData = generateSampleData()
    setAllPosts(sampleData)
  }, [])

  // Apply filters to get filtered posts
  const filteredPosts = useMemo(() => {
    return applyFilters(allPosts, filters)
  }, [allPosts, filters])

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || files.length === 0) return

    setLoading(true)
    try {
      const allParsedPosts: RedditPost[] = []

      // Process each file
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        console.log(`[v0] Processing file ${i + 1}/${files.length}: ${file.name}`)

        const parsedPosts = await parseFile(file)
        allParsedPosts.push(...parsedPosts)
        console.log(`[v0] Parsed ${parsedPosts.length} posts from ${file.name}`)
      }

      console.log(`[v0] Total posts loaded: ${allParsedPosts.length}`)
      setAllPosts(allParsedPosts)

      // Reset filters when new data is loaded
      setFilters({
        dateRange: "all",
        subreddits: [],
        sortBy: "top",
        searchQuery: "",
      })
    } catch (error) {
      console.error("Error parsing file:", error)
      alert(`Error parsing file: ${error instanceof Error ? error.message : "Unknown error"}`)
    } finally {
      setLoading(false)
    }
  }

  const handleExport = async (type: "csv" | "xlsx" | "pdf" | "screenshot") => {
    try {
      switch (type) {
        case "csv":
          exportToCSV(filteredPosts)
          break
        case "xlsx":
          // For Excel export, we'll use CSV format for now
          exportToCSV(filteredPosts, "reddit-data.xlsx")
          break
        case "pdf":
          await exportToPDF(filteredPosts)
          break
        case "screenshot":
          await captureScreenshot("dashboard-container")
          break
      }
    } catch (error) {
      console.error("Export failed:", error)
      alert("Export failed. Please try again.")
    }
  }

  const stats = calculateDashboardStats(filteredPosts)

  return (
    <div id="dashboard-container" className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto p-6 space-y-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 p-8 text-white shadow-2xl">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold tracking-tight">Reddit Insights Dashboard</h1>
              <p className="text-blue-100 text-lg">
                Analyze and visualize subreddit data with interactive charts and insights
              </p>
            </div>

            <div className="flex items-center gap-4">
              <Input
                type="file"
                accept=".csv,.xlsx,.xls,.json,.sql"
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
                multiple
              />
              <Button
                asChild
                variant="secondary"
                disabled={loading}
                className="bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm"
              >
                <label htmlFor="file-upload" className="cursor-pointer">
                  <Upload className="w-4 h-4 mr-2" />
                  {loading ? "Processing..." : "Upload Files"}
                </label>
              </Button>
              <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm px-4 py-2">
                {filteredPosts.length} of {allPosts.length} posts
              </Badge>
            </div>
          </div>
        </div>

        <DashboardFiltersPanel
          posts={allPosts}
          filters={filters}
          onFiltersChange={setFilters}
          onExport={handleExport}
        />

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
          <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-emerald-500 to-teal-600 text-white">
            <div className="absolute inset-0 bg-white/10"></div>
            <CardHeader className="relative z-10 flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-emerald-100">Total Posts</CardTitle>
              <FileText className="h-5 w-5 text-emerald-200" />
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-3xl font-bold">{stats.totalPosts.toLocaleString()}</div>
              <p className="text-xs text-emerald-100">Across {stats.topSubreddits.length} subreddits</p>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-blue-500 to-cyan-600 text-white">
            <div className="absolute inset-0 bg-white/10"></div>
            <CardHeader className="relative z-10 flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-100">Total Authors</CardTitle>
              <Users className="h-5 w-5 text-blue-200" />
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-3xl font-bold">{stats.totalAuthors.toLocaleString()}</div>
              <p className="text-xs text-blue-100">Unique contributors</p>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-purple-500 to-pink-600 text-white">
            <div className="absolute inset-0 bg-white/10"></div>
            <CardHeader className="relative z-10 flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-100">Avg Upvotes</CardTitle>
              <TrendingUp className="h-5 w-5 text-purple-200" />
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-3xl font-bold">{stats.avgUpvotes}</div>
              <p className="text-xs text-purple-100">Per post</p>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-orange-500 to-red-600 text-white">
            <div className="absolute inset-0 bg-white/10"></div>
            <CardHeader className="relative z-10 flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-orange-100">Avg Comments</CardTitle>
              <MessageSquare className="h-5 w-5 text-orange-200" />
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-3xl font-bold">{stats.avgComments}</div>
              <p className="text-xs text-orange-100">Per post</p>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
            <div className="absolute inset-0 bg-white/10"></div>
            <CardHeader className="relative z-10 flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-indigo-100">Avg Awards</CardTitle>
              <Award className="h-5 w-5 text-indigo-200" />
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-3xl font-bold">{stats.avgAwards}</div>
              <p className="text-xs text-indigo-100">Per post</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-white/80 backdrop-blur-sm border-0 shadow-lg rounded-2xl p-2">
            <TabsTrigger
              value="overview"
              className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="posts"
              className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300"
            >
              Top Posts
            </TabsTrigger>
            <TabsTrigger
              value="trends"
              className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300"
            >
              Trends
            </TabsTrigger>
            <TabsTrigger
              value="growth"
              className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300"
            >
              Growth
            </TabsTrigger>
            <TabsTrigger
              value="compare"
              className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300"
            >
              Compare
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border-0 overflow-hidden">
                <SubredditDistributionChart stats={stats} />
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border-0 overflow-hidden">
                <ActivityHoursChart stats={stats} />
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border-0 overflow-hidden">
                <EngagementMetrics posts={filteredPosts} />
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border-0 overflow-hidden">
                <TopAuthorsChart posts={filteredPosts} />
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border-0 overflow-hidden">
              <RecentActivityTimeline posts={filteredPosts} />
            </div>
          </TabsContent>

          <TabsContent value="posts">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border-0 overflow-hidden">
              <TopPostsTable posts={filteredPosts} />
            </div>
          </TabsContent>

          <TabsContent value="trends" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border-0 overflow-hidden">
                <TrendingWordsChart posts={filteredPosts} />
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border-0 overflow-hidden">
                <TopicDistribution posts={filteredPosts} />
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border-0 overflow-hidden">
              <WordCloudAlternative posts={filteredPosts} />
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border-0 overflow-hidden">
              <SubredditWordAnalysis posts={filteredPosts} />
            </div>
          </TabsContent>

          <TabsContent value="growth" className="space-y-6">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border-0 overflow-hidden">
              <PostGrowthChart posts={filteredPosts} />
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border-0 overflow-hidden">
                <EngagementTrendsChart posts={filteredPosts} />
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border-0 overflow-hidden">
                <CumulativeGrowthChart posts={filteredPosts} />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="compare" className="space-y-6">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border-0 overflow-hidden">
              <SubredditComparison posts={filteredPosts} />
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border-0 overflow-hidden">
                <PerformanceRadar posts={filteredPosts} />
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border-0 overflow-hidden">
                <TimelineComparison posts={filteredPosts} />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
