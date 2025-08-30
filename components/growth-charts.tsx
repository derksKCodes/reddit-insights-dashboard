"use client"

import { useState, useMemo } from "react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Bar,
  ComposedChart,
  Area,
  AreaChart,
} from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { RedditPost } from "@/lib/types"

interface GrowthChartsProps {
  posts: RedditPost[]
}

type TimeRange = "7d" | "30d" | "90d" | "all"
type GroupBy = "day" | "week" | "month"

export function PostGrowthChart({ posts }: GrowthChartsProps) {
  const [timeRange, setTimeRange] = useState<TimeRange>("30d")
  const [groupBy, setGroupBy] = useState<GroupBy>("day")

  const formatDateLabel = (dateStr: string, groupBy: GroupBy) => {
    const date = new Date(dateStr)
    if (groupBy === "day") {
      return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
    } else if (groupBy === "week") {
      return `Week of ${date.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`
    } else {
      return date.toLocaleDateString("en-US", { month: "short", year: "numeric" })
    }
  }

  const growthData = useMemo(() => {
    // Filter posts by time range
    const now = Date.now()
    const cutoffDays = timeRange === "7d" ? 7 : timeRange === "30d" ? 30 : timeRange === "90d" ? 90 : 365
    const cutoff = now - cutoffDays * 24 * 60 * 60 * 1000

    const filteredPosts =
      timeRange === "all" ? posts : posts.filter((post) => post.created_utc_timestamp * 1000 >= cutoff)

    // Group posts by time period
    const grouped = new Map<string, { posts: number; totalScore: number; totalComments: number; totalAwards: number }>()

    filteredPosts.forEach((post) => {
      const date = new Date(post.created_utc_timestamp * 1000)
      let key: string

      if (groupBy === "day") {
        key = date.toISOString().split("T")[0]
      } else if (groupBy === "week") {
        const weekStart = new Date(date)
        weekStart.setDate(date.getDate() - date.getDay())
        key = weekStart.toISOString().split("T")[0]
      } else {
        key = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}`
      }

      const current = grouped.get(key) || { posts: 0, totalScore: 0, totalComments: 0, totalAwards: 0 }
      current.posts += 1
      current.totalScore += post.score
      current.totalComments += post.num_comments
      current.totalAwards += post.awards
      grouped.set(key, current)
    })

    return Array.from(grouped.entries())
      .map(([date, data]) => ({
        date: formatDateLabel(date, groupBy),
        posts: data.posts,
        totalScore: data.totalScore,
        totalComments: data.totalComments,
        totalAwards: data.totalAwards,
        avgScore: Math.round(data.totalScore / data.posts),
        avgComments: Math.round(data.totalComments / data.posts),
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  }, [posts, timeRange, groupBy])

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border border-blue-200 dark:border-blue-700 rounded-lg p-4 shadow-xl">
          <p className="font-semibold text-blue-700 dark:text-blue-300 mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              <span className="font-medium">{entry.name}:</span> {entry.value.toLocaleString()}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <Card className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950/50 dark:via-indigo-950/50 dark:to-purple-950/50 border-blue-200 dark:border-blue-800 shadow-lg hover:shadow-xl transition-all duration-300">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              📈 Post Growth Over Time
            </CardTitle>
            <CardDescription className="text-blue-600/70 dark:text-blue-400/70 text-base mt-1">
              Track posting activity and engagement trends with smooth animations
            </CardDescription>
          </div>
          <div className="flex items-center gap-3">
            <Select value={timeRange} onValueChange={(value: TimeRange) => setTimeRange(value)}>
              <SelectTrigger className="w-28 bg-white/90 dark:bg-gray-800/90 border-blue-200 dark:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">7 days</SelectItem>
                <SelectItem value="30d">30 days</SelectItem>
                <SelectItem value="90d">90 days</SelectItem>
                <SelectItem value="all">All time</SelectItem>
              </SelectContent>
            </Select>
            <Select value={groupBy} onValueChange={(value: GroupBy) => setGroupBy(value)}>
              <SelectTrigger className="w-24 bg-white/90 dark:bg-gray-800/90 border-blue-200 dark:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="day">Daily</SelectItem>
                <SelectItem value="week">Weekly</SelectItem>
                <SelectItem value="month">Monthly</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent className="bg-white/80 dark:bg-gray-900/80 rounded-xl backdrop-blur-sm border border-white/20 dark:border-gray-700/20">
        <ResponsiveContainer width="100%" height={420}>
          <ComposedChart data={growthData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <defs>
              <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(var(--chart-1))" stopOpacity={0.8} />
                <stop offset="100%" stopColor="hsl(var(--chart-1))" stopOpacity={0.3} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted-foreground))" strokeOpacity={0.3} />
            <XAxis
              dataKey="date"
              fontSize={12}
              angle={-45}
              textAnchor="end"
              height={80}
              stroke="hsl(var(--muted-foreground))"
              tick={{ fill: "hsl(var(--muted-foreground))" }}
            />
            <YAxis
              yAxisId="left"
              fontSize={12}
              stroke="hsl(var(--muted-foreground))"
              tick={{ fill: "hsl(var(--muted-foreground))" }}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              fontSize={12}
              stroke="hsl(var(--muted-foreground))"
              tick={{ fill: "hsl(var(--muted-foreground))" }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar
              yAxisId="left"
              dataKey="posts"
              fill="url(#barGradient)"
              name="Posts"
              radius={[4, 4, 0, 0]}
              animationDuration={1000}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="totalScore"
              stroke="hsl(var(--chart-2))"
              strokeWidth={3}
              name="Total Score"
              dot={{ fill: "hsl(var(--chart-2))", strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: "hsl(var(--chart-2))", strokeWidth: 2 }}
              animationDuration={1500}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="totalComments"
              stroke="hsl(var(--chart-3))"
              strokeWidth={3}
              name="Total Comments"
              dot={{ fill: "hsl(var(--chart-3))", strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: "hsl(var(--chart-3))", strokeWidth: 2 }}
              animationDuration={2000}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

export function EngagementTrendsChart({ posts }: GrowthChartsProps) {
  const [timeRange, setTimeRange] = useState<TimeRange>("30d")

  const engagementData = useMemo(() => {
    const now = Date.now()
    const cutoffDays = timeRange === "7d" ? 7 : timeRange === "30d" ? 30 : timeRange === "90d" ? 90 : 365
    const cutoff = now - cutoffDays * 24 * 60 * 60 * 1000

    const filteredPosts =
      timeRange === "all" ? posts : posts.filter((post) => post.created_utc_timestamp * 1000 >= cutoff)

    const dailyData = new Map<
      string,
      { posts: number; totalScore: number; totalComments: number; totalRatio: number }
    >()

    filteredPosts.forEach((post) => {
      const date = new Date(post.created_utc_timestamp * 1000).toISOString().split("T")[0]
      const current = dailyData.get(date) || { posts: 0, totalScore: 0, totalComments: 0, totalRatio: 0 }

      current.posts += 1
      current.totalScore += post.score
      current.totalComments += post.num_comments
      current.totalRatio += post.upvote_ratio

      dailyData.set(date, current)
    })

    return Array.from(dailyData.entries())
      .map(([date, data]) => ({
        date: new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        avgScore: Math.round(data.totalScore / data.posts),
        avgComments: Math.round(data.totalComments / data.posts),
        avgUpvoteRatio: Math.round((data.totalRatio / data.posts) * 100),
        engagementRate: Math.round((data.totalComments / data.totalScore) * 100) || 0,
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  }, [posts, timeRange])

  const EngagementTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border border-purple-200 dark:border-purple-700 rounded-lg p-4 shadow-xl">
          <p className="font-semibold text-purple-700 dark:text-purple-300 mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm flex items-center gap-2" style={{ color: entry.color }}>
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }}></div>
              <span className="font-medium">{entry.name}:</span> {entry.value}
              {entry.name.includes("Ratio") || entry.name.includes("Rate") ? "%" : ""}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <Card className="bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 dark:from-purple-950/50 dark:via-pink-950/50 dark:to-rose-950/50 border-purple-200 dark:border-purple-800 shadow-lg hover:shadow-xl transition-all duration-300">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 bg-clip-text text-transparent">
              💬 Engagement Trends
            </CardTitle>
            <CardDescription className="text-purple-600/70 dark:text-purple-400/70 text-base mt-1">
              Average scores, comments, and engagement rates with smooth curves
            </CardDescription>
          </div>
          <Select value={timeRange} onValueChange={(value: TimeRange) => setTimeRange(value)}>
            <SelectTrigger className="w-28 bg-white/90 dark:bg-gray-800/90 border-purple-200 dark:border-purple-700 hover:bg-purple-50 dark:hover:bg-purple-900/30 transition-colors">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">7 days</SelectItem>
              <SelectItem value="30d">30 days</SelectItem>
              <SelectItem value="90d">90 days</SelectItem>
              <SelectItem value="all">All time</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="bg-white/80 dark:bg-gray-900/80 rounded-xl backdrop-blur-sm border border-white/20 dark:border-gray-700/20">
        <ResponsiveContainer width="100%" height={420}>
          <LineChart data={engagementData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <defs>
              <linearGradient id="scoreGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="hsl(var(--chart-1))" />
                <stop offset="100%" stopColor="hsl(var(--chart-2))" />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted-foreground))" strokeOpacity={0.3} />
            <XAxis
              dataKey="date"
              fontSize={12}
              angle={-45}
              textAnchor="end"
              height={80}
              stroke="hsl(var(--muted-foreground))"
              tick={{ fill: "hsl(var(--muted-foreground))" }}
            />
            <YAxis
              fontSize={12}
              stroke="hsl(var(--muted-foreground))"
              tick={{ fill: "hsl(var(--muted-foreground))" }}
            />
            <Tooltip content={<EngagementTooltip />} />
            <Line
              type="monotone"
              dataKey="avgScore"
              stroke="url(#scoreGradient)"
              strokeWidth={3}
              name="Avg Score"
              dot={{ fill: "hsl(var(--chart-1))", strokeWidth: 2, r: 5 }}
              activeDot={{ r: 7, stroke: "hsl(var(--chart-1))", strokeWidth: 3, fill: "white" }}
              animationDuration={1000}
            />
            <Line
              type="monotone"
              dataKey="avgComments"
              stroke="hsl(var(--chart-2))"
              strokeWidth={3}
              name="Avg Comments"
              dot={{ fill: "hsl(var(--chart-2))", strokeWidth: 2, r: 5 }}
              activeDot={{ r: 7, stroke: "hsl(var(--chart-2))", strokeWidth: 3, fill: "white" }}
              animationDuration={1200}
            />
            <Line
              type="monotone"
              dataKey="avgUpvoteRatio"
              stroke="hsl(var(--chart-3))"
              strokeWidth={3}
              name="Avg Upvote %"
              dot={{ fill: "hsl(var(--chart-3))", strokeWidth: 2, r: 5 }}
              activeDot={{ r: 7, stroke: "hsl(var(--chart-3))", strokeWidth: 3, fill: "white" }}
              animationDuration={1400}
            />
            <Line
              type="monotone"
              dataKey="engagementRate"
              stroke="hsl(var(--chart-4))"
              strokeWidth={3}
              name="Engagement Rate"
              dot={{ fill: "hsl(var(--chart-4))", strokeWidth: 2, r: 5 }}
              activeDot={{ r: 7, stroke: "hsl(var(--chart-4))", strokeWidth: 3, fill: "white" }}
              animationDuration={1600}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

export function CumulativeGrowthChart({ posts }: GrowthChartsProps) {
  const cumulativeData = useMemo(() => {
    const sortedPosts = [...posts].sort((a, b) => a.created_utc_timestamp - b.created_utc_timestamp)

    let cumulativePosts = 0
    let cumulativeScore = 0
    let cumulativeComments = 0

    const data = []
    const dailyData = new Map<string, { posts: number; score: number; comments: number }>()

    sortedPosts.forEach((post) => {
      const date = new Date(post.created_utc_timestamp * 1000).toISOString().split("T")[0]
      const current = dailyData.get(date) || { posts: 0, score: 0, comments: 0 }

      current.posts += 1
      current.score += post.score
      current.comments += post.num_comments

      dailyData.set(date, current)
    })

    Array.from(dailyData.entries())
      .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
      .forEach(([date, dayData]) => {
        cumulativePosts += dayData.posts
        cumulativeScore += dayData.score
        cumulativeComments += dayData.comments

        data.push({
          date: new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
          cumulativePosts,
          cumulativeScore,
          cumulativeComments,
        })
      })

    return data
  }, [posts])

  const CumulativeTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border border-emerald-200 dark:border-emerald-700 rounded-lg p-4 shadow-xl">
          <p className="font-semibold text-emerald-700 dark:text-emerald-300 mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm flex items-center gap-2" style={{ color: entry.color }}>
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }}></div>
              <span className="font-medium">{entry.name}:</span> {entry.value.toLocaleString()}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <Card className="bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-emerald-950/50 dark:via-teal-950/50 dark:to-cyan-950/50 border-emerald-200 dark:border-emerald-800 shadow-lg hover:shadow-xl transition-all duration-300">
      <CardHeader className="pb-4">
        <CardTitle className="text-2xl font-bold bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent">
          📊 Cumulative Growth
        </CardTitle>
        <CardDescription className="text-emerald-600/70 dark:text-emerald-400/70 text-base mt-1">
          Total posts, scores, and comments over time with smooth area fills
        </CardDescription>
      </CardHeader>
      <CardContent className="bg-white/80 dark:bg-gray-900/80 rounded-xl backdrop-blur-sm border border-white/20 dark:border-gray-700/20">
        <ResponsiveContainer width="100%" height={420}>
          <AreaChart data={cumulativeData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <defs>
              <linearGradient id="postsGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(var(--chart-1))" stopOpacity={0.8} />
                <stop offset="100%" stopColor="hsl(var(--chart-1))" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="scoreGradient2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(var(--chart-2))" stopOpacity={0.8} />
                <stop offset="100%" stopColor="hsl(var(--chart-2))" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted-foreground))" strokeOpacity={0.3} />
            <XAxis
              dataKey="date"
              fontSize={12}
              angle={-45}
              textAnchor="end"
              height={80}
              stroke="hsl(var(--muted-foreground))"
              tick={{ fill: "hsl(var(--muted-foreground))" }}
            />
            <YAxis
              fontSize={12}
              stroke="hsl(var(--muted-foreground))"
              tick={{ fill: "hsl(var(--muted-foreground))" }}
            />
            <Tooltip content={<CumulativeTooltip />} />
            <Area
              type="monotone"
              dataKey="cumulativePosts"
              stackId="1"
              stroke="hsl(var(--chart-1))"
              fill="url(#postsGradient)"
              strokeWidth={2}
              name="Posts"
              animationDuration={1000}
            />
            <Area
              type="monotone"
              dataKey="cumulativeScore"
              stackId="2"
              stroke="hsl(var(--chart-2))"
              fill="url(#scoreGradient2)"
              strokeWidth={2}
              name="Total Score"
              animationDuration={1500}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
