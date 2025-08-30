"use client"

import { useState, useMemo } from "react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  LineChart,
  Line,
} from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import type { RedditPost } from "@/lib/types"

interface ComparisonChartsProps {
  posts: RedditPost[]
}

export function SubredditComparison({ posts }: ComparisonChartsProps) {
  const [selectedSubreddits, setSelectedSubreddits] = useState<string[]>([])
  const [metric, setMetric] = useState<"avgScore" | "avgComments" | "postCount" | "avgAwards">("avgScore")

  const subreddits = useMemo(() => {
    return Array.from(new Set(posts.map((post) => post.subreddit_name))).sort()
  }, [posts])

  const comparisonData = useMemo(() => {
    const subredditStats = new Map<
      string,
      { posts: number; totalScore: number; totalComments: number; totalAwards: number; totalRatio: number }
    >()

    posts.forEach((post) => {
      const current = subredditStats.get(post.subreddit_name) || {
        posts: 0,
        totalScore: 0,
        totalComments: 0,
        totalAwards: 0,
        totalRatio: 0,
      }
      current.posts += 1
      current.totalScore += post.score
      current.totalComments += post.num_comments
      current.totalAwards += post.awards
      current.totalRatio += post.upvote_ratio
      subredditStats.set(post.subreddit_name, current)
    })

    const filteredSubreddits = selectedSubreddits.length > 0 ? selectedSubreddits : subreddits.slice(0, 6)

    return filteredSubreddits
      .map((subreddit) => {
        const stats = subredditStats.get(subreddit)!
        return {
          subreddit: `r/${subreddit}`,
          postCount: stats.posts,
          avgScore: Math.round(stats.totalScore / stats.posts),
          avgComments: Math.round(stats.totalComments / stats.posts),
          avgAwards: Math.round(stats.totalAwards / stats.posts),
          avgUpvoteRatio: Math.round((stats.totalRatio / stats.posts) * 100),
          totalScore: stats.totalScore,
          totalComments: stats.totalComments,
        }
      })
      .sort((a, b) => b[metric] - a[metric])
  }, [posts, selectedSubreddits, subreddits, metric])

  const handleSubredditToggle = (subreddit: string, checked: boolean) => {
    if (checked) {
      setSelectedSubreddits((prev) => [...prev, subreddit])
    } else {
      setSelectedSubreddits((prev) => prev.filter((s) => s !== subreddit))
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Subreddit Comparison</CardTitle>
            <CardDescription>Compare performance metrics across communities</CardDescription>
          </div>
          <Select value={metric} onValueChange={(value: any) => setMetric(value)}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="avgScore">Avg Score</SelectItem>
              <SelectItem value="avgComments">Avg Comments</SelectItem>
              <SelectItem value="postCount">Post Count</SelectItem>
              <SelectItem value="avgAwards">Avg Awards</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Subreddit Selection */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Select Subreddits to Compare (leave empty for top 6)</h4>
          <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
            {subreddits.map((subreddit) => (
              <div key={subreddit} className="flex items-center space-x-2">
                <Checkbox
                  id={subreddit}
                  checked={selectedSubreddits.includes(subreddit)}
                  onCheckedChange={(checked) => handleSubredditToggle(subreddit, checked as boolean)}
                />
                <label htmlFor={subreddit} className="text-sm">
                  r/{subreddit}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Comparison Chart */}
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={comparisonData} layout="horizontal">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" fontSize={12} />
            <YAxis dataKey="subreddit" type="category" width={100} fontSize={11} />
            <Tooltip />
            <Bar dataKey={metric} fill="hsl(var(--chart-1))" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>

        {/* Stats Table */}
        <div className="grid gap-2">
          <h4 className="text-sm font-medium">Detailed Comparison</h4>
          <div className="space-y-2">
            {comparisonData.map((data) => (
              <div key={data.subreddit} className="flex items-center justify-between p-2 border rounded">
                <Badge variant="secondary">{data.subreddit}</Badge>
                <div className="flex items-center gap-4 text-sm">
                  <span>{data.postCount} posts</span>
                  <span>{data.avgScore} avg score</span>
                  <span>{data.avgComments} avg comments</span>
                  <span>{data.avgUpvoteRatio}% upvote ratio</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function PerformanceRadar({ posts }: ComparisonChartsProps) {
  const [selectedSubreddits, setSelectedSubreddits] = useState<string[]>([])

  const subreddits = useMemo(() => {
    return Array.from(new Set(posts.map((post) => post.subreddit_name))).sort()
  }, [posts])

  const radarData = useMemo(() => {
    const subredditStats = new Map<
      string,
      { posts: number; totalScore: number; totalComments: number; totalAwards: number; totalRatio: number }
    >()

    posts.forEach((post) => {
      const current = subredditStats.get(post.subreddit_name) || {
        posts: 0,
        totalScore: 0,
        totalComments: 0,
        totalAwards: 0,
        totalRatio: 0,
      }
      current.posts += 1
      current.totalScore += post.score
      current.totalComments += post.num_comments
      current.totalAwards += post.awards
      current.totalRatio += post.upvote_ratio
      subredditStats.set(post.subreddit_name, current)
    })

    const filteredSubreddits = selectedSubreddits.length > 0 ? selectedSubreddits : subreddits.slice(0, 3)

    // Calculate max values for normalization
    const allStats = Array.from(subredditStats.values())
    const maxScore = Math.max(...allStats.map((s) => s.totalScore / s.posts))
    const maxComments = Math.max(...allStats.map((s) => s.totalComments / s.posts))
    const maxAwards = Math.max(...allStats.map((s) => s.totalAwards / s.posts))
    const maxPosts = Math.max(...allStats.map((s) => s.posts))

    const metrics = [
      { metric: "Avg Score", key: "avgScore" },
      { metric: "Avg Comments", key: "avgComments" },
      { metric: "Avg Awards", key: "avgAwards" },
      { metric: "Post Volume", key: "postVolume" },
      { metric: "Upvote Ratio", key: "upvoteRatio" },
    ]

    return metrics.map(({ metric }) => {
      const dataPoint: any = { metric }

      filteredSubreddits.forEach((subreddit) => {
        const stats = subredditStats.get(subreddit)!
        const avgScore = stats.totalScore / stats.posts
        const avgComments = stats.totalComments / stats.posts
        const avgAwards = stats.totalAwards / stats.posts
        const avgRatio = stats.totalRatio / stats.posts

        switch (metric) {
          case "Avg Score":
            dataPoint[subreddit] = Math.round((avgScore / maxScore) * 100)
            break
          case "Avg Comments":
            dataPoint[subreddit] = Math.round((avgComments / maxComments) * 100)
            break
          case "Avg Awards":
            dataPoint[subreddit] = Math.round((avgAwards / maxAwards) * 100)
            break
          case "Post Volume":
            dataPoint[subreddit] = Math.round((stats.posts / maxPosts) * 100)
            break
          case "Upvote Ratio":
            dataPoint[subreddit] = Math.round(avgRatio * 100)
            break
        }
      })

      return dataPoint
    })
  }, [posts, selectedSubreddits, subreddits])

  const colors = ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))"]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Performance Radar</CardTitle>
        <CardDescription>Multi-dimensional comparison of subreddit performance</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Subreddit Selection */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Select up to 3 Subreddits (leave empty for top 3)</h4>
          <div className="flex flex-wrap gap-2">
            {subreddits.slice(0, 8).map((subreddit) => (
              <div key={subreddit} className="flex items-center space-x-2">
                <Checkbox
                  id={`radar-${subreddit}`}
                  checked={selectedSubreddits.includes(subreddit)}
                  onCheckedChange={(checked) => {
                    if (checked && selectedSubreddits.length < 3) {
                      setSelectedSubreddits((prev) => [...prev, subreddit])
                    } else if (!checked) {
                      setSelectedSubreddits((prev) => prev.filter((s) => s !== subreddit))
                    }
                  }}
                  disabled={!selectedSubreddits.includes(subreddit) && selectedSubreddits.length >= 3}
                />
                <label htmlFor={`radar-${subreddit}`} className="text-sm">
                  r/{subreddit}
                </label>
              </div>
            ))}
          </div>
        </div>

        <ResponsiveContainer width="100%" height={400}>
          <RadarChart data={radarData}>
            <PolarGrid />
            <PolarAngleAxis dataKey="metric" fontSize={12} />
            <PolarRadiusAxis angle={90} domain={[0, 100]} fontSize={10} />
            <Tooltip />
            {(selectedSubreddits.length > 0 ? selectedSubreddits : subreddits.slice(0, 3)).map((subreddit, index) => (
              <Radar
                key={subreddit}
                name={`r/${subreddit}`}
                dataKey={subreddit}
                stroke={colors[index]}
                fill={colors[index]}
                fillOpacity={0.1}
                strokeWidth={2}
              />
            ))}
          </RadarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

export function TimelineComparison({ posts }: ComparisonChartsProps) {
  const [selectedSubreddits, setSelectedSubreddits] = useState<string[]>([])

  const subreddits = useMemo(() => {
    return Array.from(new Set(posts.map((post) => post.subreddit_name))).sort()
  }, [posts])

  const timelineData = useMemo(() => {
    const filteredSubreddits = selectedSubreddits.length > 0 ? selectedSubreddits : subreddits.slice(0, 3)

    // Group posts by date and subreddit
    const dailyData = new Map<string, Map<string, number>>()

    posts.forEach((post) => {
      if (!filteredSubreddits.includes(post.subreddit_name)) return

      const date = new Date(post.created_utc_timestamp * 1000).toISOString().split("T")[0]

      if (!dailyData.has(date)) {
        dailyData.set(date, new Map())
      }

      const dayData = dailyData.get(date)!
      const current = dayData.get(post.subreddit_name) || 0
      dayData.set(post.subreddit_name, current + 1)
    })

    return Array.from(dailyData.entries())
      .map(([date, subredditCounts]) => {
        const dataPoint: any = {
          date: new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        }

        filteredSubreddits.forEach((subreddit) => {
          dataPoint[subreddit] = subredditCounts.get(subreddit) || 0
        })

        return dataPoint
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(-30) // Last 30 days
  }, [posts, selectedSubreddits, subreddits])

  const colors = ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))"]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Activity Timeline Comparison</CardTitle>
        <CardDescription>Compare posting activity over time (last 30 days)</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Subreddit Selection */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Select up to 3 Subreddits (leave empty for top 3)</h4>
          <div className="flex flex-wrap gap-2">
            {subreddits.slice(0, 8).map((subreddit) => (
              <div key={subreddit} className="flex items-center space-x-2">
                <Checkbox
                  id={`timeline-${subreddit}`}
                  checked={selectedSubreddits.includes(subreddit)}
                  onCheckedChange={(checked) => {
                    if (checked && selectedSubreddits.length < 3) {
                      setSelectedSubreddits((prev) => [...prev, subreddit])
                    } else if (!checked) {
                      setSelectedSubreddits((prev) => prev.filter((s) => s !== subreddit))
                    }
                  }}
                  disabled={!selectedSubreddits.includes(subreddit) && selectedSubreddits.length >= 3}
                />
                <label htmlFor={`timeline-${subreddit}`} className="text-sm">
                  r/{subreddit}
                </label>
              </div>
            ))}
          </div>
        </div>

        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={timelineData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" fontSize={12} angle={-45} textAnchor="end" height={80} />
            <YAxis fontSize={12} />
            <Tooltip />
            {(selectedSubreddits.length > 0 ? selectedSubreddits : subreddits.slice(0, 3)).map((subreddit, index) => (
              <Line
                key={subreddit}
                type="monotone"
                dataKey={subreddit}
                stroke={colors[index]}
                strokeWidth={2}
                name={`r/${subreddit}`}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
