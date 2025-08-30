"use client"

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { DashboardStats, RedditPost } from "@/lib/types"

const COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
]

interface OverviewChartsProps {
  stats: DashboardStats
  posts: RedditPost[]
}

export function SubredditDistributionChart({ stats }: { stats: DashboardStats }) {
  const data = stats.topSubreddits.slice(0, 8).map((subreddit, index) => ({
    name: `r/${subreddit.name}`,
    posts: subreddit.count,
    fill: COLORS[index % COLORS.length],
  }))

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border border-orange-200 dark:border-orange-700 rounded-lg p-4 shadow-xl">
          <p className="font-semibold text-orange-700 dark:text-orange-300 mb-2">{data.name}</p>
          <p className="text-sm text-orange-600 dark:text-orange-400">
            <span className="font-medium">Posts:</span> {data.posts.toLocaleString()}
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <Card className="bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 dark:from-orange-950/50 dark:via-amber-950/50 dark:to-yellow-950/50 border-orange-200 dark:border-orange-800 shadow-lg hover:shadow-xl transition-all duration-300">
      <CardHeader className="pb-4">
        <CardTitle className="text-2xl font-bold bg-gradient-to-r from-orange-600 via-amber-600 to-yellow-600 bg-clip-text text-transparent">
          🥧 Subreddit Distribution
        </CardTitle>
        <CardDescription className="text-orange-600/70 dark:text-orange-400/70 text-base mt-1">
          Posts by community with interactive pie chart
        </CardDescription>
      </CardHeader>
      <CardContent className="bg-white/80 dark:bg-gray-900/80 rounded-xl backdrop-blur-sm border border-white/20 dark:border-gray-700/20">
        <ResponsiveContainer width="100%" height={320}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={90}
              innerRadius={30}
              fill="#8884d8"
              dataKey="posts"
              animationDuration={1000}
              animationBegin={0}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} stroke="white" strokeWidth={2} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

export function ActivityHoursChart({ stats }: { stats: DashboardStats }) {
  const hourlyData = Array.from({ length: 24 }, (_, hour) => {
    const found = stats.activePeriods.find((p) => p.hour === hour)
    return {
      hour: `${hour.toString().padStart(2, "0")}:00`,
      posts: found ? found.count : 0,
      isActive: found ? found.count > 0 : false,
    }
  })

  const ActivityTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border border-cyan-200 dark:border-cyan-700 rounded-lg p-4 shadow-xl">
          <p className="font-semibold text-cyan-700 dark:text-cyan-300 mb-2">Time: {label}</p>
          <p className="text-sm text-cyan-600 dark:text-cyan-400">
            <span className="font-medium">Posts:</span> {payload[0].value.toLocaleString()}
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <Card className="bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-50 dark:from-cyan-950/50 dark:via-blue-950/50 dark:to-indigo-950/50 border-cyan-200 dark:border-cyan-800 shadow-lg hover:shadow-xl transition-all duration-300">
      <CardHeader className="pb-4">
        <CardTitle className="text-2xl font-bold bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
          🕐 Activity by Hour
        </CardTitle>
        <CardDescription className="text-cyan-600/70 dark:text-cyan-400/70 text-base mt-1">
          Posts throughout the day with gradient bars
        </CardDescription>
      </CardHeader>
      <CardContent className="bg-white/80 dark:bg-gray-900/80 rounded-xl backdrop-blur-sm border border-white/20 dark:border-gray-700/20">
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={hourlyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <defs>
              <linearGradient id="activityGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(var(--chart-1))" stopOpacity={0.8} />
                <stop offset="100%" stopColor="hsl(var(--chart-1))" stopOpacity={0.3} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted-foreground))" strokeOpacity={0.3} />
            <XAxis
              dataKey="hour"
              fontSize={11}
              interval={2}
              stroke="hsl(var(--muted-foreground))"
              tick={{ fill: "hsl(var(--muted-foreground))" }}
            />
            <YAxis
              fontSize={12}
              stroke="hsl(var(--muted-foreground))"
              tick={{ fill: "hsl(var(--muted-foreground))" }}
            />
            <Tooltip content={<ActivityTooltip />} />
            <Bar dataKey="posts" fill="url(#activityGradient)" radius={[4, 4, 0, 0]} animationDuration={1000} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

export function EngagementMetrics({ posts }: { posts: RedditPost[] }) {
  if (posts.length === 0) return null

  const totalScore = posts.reduce((sum, post) => sum + post.score, 0)
  const totalComments = posts.reduce((sum, post) => sum + post.num_comments, 0)
  const totalAwards = posts.reduce((sum, post) => sum + post.awards, 0)

  const avgUpvoteRatio = posts.reduce((sum, post) => sum + post.upvote_ratio, 0) / posts.length
  const nsfwCount = posts.filter((post) => post.is_nsfw).length
  const spoilerCount = posts.filter((post) => post.is_spoiler).length
  const editedCount = posts.filter((post) => post.edited).length
  const videoCount = posts.filter((post) => post.is_video).length

  const engagementRate = (totalComments / totalScore) * 100 || 0
  const awardRate = (totalAwards / posts.length) * 100 || 0

  return (
    <Card className="bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 dark:from-rose-950/50 dark:via-pink-950/50 dark:to-purple-950/50 border-rose-200 dark:border-rose-800 shadow-lg hover:shadow-xl transition-all duration-300">
      <CardHeader className="pb-4">
        <CardTitle className="text-2xl font-bold bg-gradient-to-r from-rose-600 via-pink-600 to-purple-600 bg-clip-text text-transparent">
          💯 Engagement Metrics
        </CardTitle>
        <CardDescription className="text-rose-600/70 dark:text-rose-400/70 text-base mt-1">
          Content quality and interaction rates with enhanced progress bars
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 bg-white/80 dark:bg-gray-900/80 rounded-xl backdrop-blur-sm border border-white/20 dark:border-gray-700/20 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="font-medium text-rose-700 dark:text-rose-300">Avg Upvote Ratio</span>
              <span className="font-bold text-rose-600 dark:text-rose-400">{(avgUpvoteRatio * 100).toFixed(1)}%</span>
            </div>
            <div className="w-full bg-rose-100 dark:bg-rose-900/30 rounded-full h-3 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-rose-400 to-pink-500 rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${avgUpvoteRatio * 100}%` }}
              />
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="font-medium text-rose-700 dark:text-rose-300">Engagement Rate</span>
              <span className="font-bold text-rose-600 dark:text-rose-400">{engagementRate.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-rose-100 dark:bg-rose-900/30 rounded-full h-3 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-pink-400 to-purple-500 rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${Math.min(engagementRate, 100)}%` }}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-4">
          <div className="flex items-center justify-between p-3 bg-gradient-to-r from-rose-50 to-pink-50 dark:from-rose-900/20 dark:to-pink-900/20 rounded-lg border border-rose-200 dark:border-rose-700">
            <span className="text-sm font-medium text-rose-700 dark:text-rose-300">🎥 Video Posts</span>
            <Badge className="bg-gradient-to-r from-rose-500 to-pink-500 text-white border-0">
              {videoCount} ({((videoCount / posts.length) * 100).toFixed(1)}%)
            </Badge>
          </div>

          <div className="flex items-center justify-between p-3 bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20 rounded-lg border border-pink-200 dark:border-pink-700">
            <span className="text-sm font-medium text-pink-700 dark:text-pink-300">✏️ Edited Posts</span>
            <Badge className="bg-gradient-to-r from-pink-500 to-purple-500 text-white border-0">
              {editedCount} ({((editedCount / posts.length) * 100).toFixed(1)}%)
            </Badge>
          </div>

          <div className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 rounded-lg border border-purple-200 dark:border-purple-700">
            <span className="text-sm font-medium text-purple-700 dark:text-purple-300">🔞 NSFW Content</span>
            <Badge className="bg-gradient-to-r from-purple-500 to-violet-500 text-white border-0">
              {nsfwCount} ({((nsfwCount / posts.length) * 100).toFixed(1)}%)
            </Badge>
          </div>

          <div className="flex items-center justify-between p-3 bg-gradient-to-r from-violet-50 to-indigo-50 dark:from-violet-900/20 dark:to-indigo-900/20 rounded-lg border border-violet-200 dark:border-violet-700">
            <span className="text-sm font-medium text-violet-700 dark:text-violet-300">⚠️ Spoiler Posts</span>
            <Badge className="bg-gradient-to-r from-violet-500 to-indigo-500 text-white border-0">
              {spoilerCount} ({((spoilerCount / posts.length) * 100).toFixed(1)}%)
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function TopAuthorsChart({ posts }: { posts: RedditPost[] }) {
  // Calculate top authors by post count and total score
  const authorStats = new Map<string, { posts: number; totalScore: number; totalComments: number }>()

  posts.forEach((post) => {
    const current = authorStats.get(post.author_username) || { posts: 0, totalScore: 0, totalComments: 0 }
    current.posts += 1
    current.totalScore += post.score
    current.totalComments += post.num_comments
    authorStats.set(post.author_username, current)
  })

  const topAuthors = Array.from(authorStats.entries())
    .map(([username, stats]) => ({
      username: username.length > 15 ? `${username.slice(0, 15)}...` : username,
      posts: stats.posts,
      avgScore: Math.round(stats.totalScore / stats.posts),
      totalScore: stats.totalScore,
    }))
    .sort((a, b) => b.totalScore - a.totalScore)
    .slice(0, 10)

  return (
    <Card className="bg-gradient-to-br from-violet-50 to-purple-100 dark:from-violet-950/50 dark:to-purple-900/50 border-violet-200 dark:border-violet-800">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
          Top Contributors
        </CardTitle>
        <CardDescription className="text-violet-600/70 dark:text-violet-400/70">
          Most active authors by total score
        </CardDescription>
      </CardHeader>
      <CardContent className="bg-white/60 dark:bg-gray-900/60 rounded-lg backdrop-blur-sm">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={topAuthors} layout="horizontal">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" fontSize={12} />
            <YAxis dataKey="username" type="category" width={100} fontSize={11} />
            <Tooltip
              formatter={(value, name) => [
                name === "totalScore" ? `${value} total score` : value,
                name === "totalScore" ? "Total Score" : name,
              ]}
            />
            <Bar dataKey="totalScore" fill="hsl(var(--chart-2))" radius={[0, 2, 2, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

export function RecentActivityTimeline({ posts }: { posts: RedditPost[] }) {
  // Group posts by day for the last 7 days
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - i)
    return date.toISOString().split("T")[0]
  }).reverse()

  const dailyActivity = last7Days.map((date) => {
    const dayPosts = posts.filter((post) => {
      const postDate = new Date(post.created_utc_timestamp * 1000).toISOString().split("T")[0]
      return postDate === date
    })

    return {
      date: new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      posts: dayPosts.length,
      totalScore: dayPosts.reduce((sum, post) => sum + post.score, 0),
      totalComments: dayPosts.reduce((sum, post) => sum + post.num_comments, 0),
    }
  })

  return (
    <Card className="bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-950/50 dark:to-emerald-900/50 border-green-200 dark:border-green-800">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
          Recent Activity
        </CardTitle>
        <CardDescription className="text-green-600/70 dark:text-green-400/70">
          Last 7 days activity trend
        </CardDescription>
      </CardHeader>
      <CardContent className="bg-white/60 dark:bg-gray-900/60 rounded-lg backdrop-blur-sm">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={dailyActivity}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" fontSize={12} />
            <YAxis fontSize={12} />
            <Tooltip />
            <Line type="monotone" dataKey="posts" stroke="hsl(var(--chart-1))" strokeWidth={2} name="Posts" />
            <Line
              type="monotone"
              dataKey="totalScore"
              stroke="hsl(var(--chart-2))"
              strokeWidth={2}
              name="Total Score"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
