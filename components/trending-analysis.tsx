"use client"

import { useMemo } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { RedditPost } from "@/lib/types"
import { extractTrendingWords } from "@/lib/data-processing"

const COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
]

interface TrendingAnalysisProps {
  posts: RedditPost[]
}

export function TrendingWordsChart({ posts }: TrendingAnalysisProps) {
  const trendingWords = useMemo(() => extractTrendingWords(posts, 20), [posts])

  const chartData = trendingWords.slice(0, 10).map((word, index) => ({
    word: word.word,
    count: word.count,
    fill: COLORS[index % COLORS.length],
  }))

  const TrendingTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border border-teal-200 dark:border-teal-700 rounded-lg p-4 shadow-xl">
          <p className="font-semibold text-teal-700 dark:text-teal-300 mb-2">"{label}"</p>
          <p className="text-sm text-teal-600 dark:text-teal-400">
            <span className="font-medium">Frequency:</span> {payload[0].value.toLocaleString()} times
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <Card className="bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50 dark:from-teal-950/50 dark:via-cyan-950/50 dark:to-blue-950/50 border-teal-200 dark:border-teal-800 shadow-lg hover:shadow-xl transition-all duration-300">
      <CardHeader className="pb-4">
        <CardTitle className="text-2xl font-bold bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600 bg-clip-text text-transparent">
          🔥 Trending Words
        </CardTitle>
        <CardDescription className="text-teal-600/70 dark:text-teal-400/70 text-base mt-1">
          Most frequently used words with animated bars and enhanced tooltips
        </CardDescription>
      </CardHeader>
      <CardContent className="bg-white/80 dark:bg-gray-900/80 rounded-xl backdrop-blur-sm border border-white/20 dark:border-gray-700/20">
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 80 }}>
            <defs>
              <linearGradient id="trendingGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(var(--chart-1))" stopOpacity={0.8} />
                <stop offset="100%" stopColor="hsl(var(--chart-1))" stopOpacity={0.3} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted-foreground))" strokeOpacity={0.3} />
            <XAxis
              dataKey="word"
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
            <Tooltip content={<TrendingTooltip />} />
            <Bar dataKey="count" fill="url(#trendingGradient)" radius={[4, 4, 0, 0]} animationDuration={1000} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

export function WordCloudAlternative({ posts }: TrendingAnalysisProps) {
  const trendingWords = useMemo(() => extractTrendingWords(posts, 30), [posts])

  const maxCount = trendingWords[0]?.count || 1

  return (
    <Card className="bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 dark:from-amber-950/50 dark:via-yellow-950/50 dark:to-orange-950/50 border-amber-200 dark:border-amber-800 shadow-lg hover:shadow-xl transition-all duration-300">
      <CardHeader className="pb-4">
        <CardTitle className="text-2xl font-bold bg-gradient-to-r from-amber-600 via-yellow-600 to-orange-600 bg-clip-text text-transparent">
          ☁️ Word Frequency
        </CardTitle>
        <CardDescription className="text-amber-600/70 dark:text-amber-400/70 text-base mt-1">
          Popular terms with dynamic sizing and enhanced hover effects
        </CardDescription>
      </CardHeader>
      <CardContent className="bg-white/80 dark:bg-gray-900/80 rounded-xl backdrop-blur-sm border border-white/20 dark:border-gray-700/20 p-6">
        <div className="flex flex-wrap gap-3">
          {trendingWords.slice(0, 30).map((word, index) => {
            const intensity = word.count / maxCount
            const fontSize = Math.max(12, Math.min(24, 12 + intensity * 12))
            const opacity = Math.max(0.6, intensity)

            return (
              <div
                key={word.word}
                className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-amber-100 via-yellow-100 to-orange-100 dark:from-amber-900/50 dark:via-yellow-900/50 dark:to-orange-900/50 hover:from-amber-200 hover:via-yellow-200 hover:to-orange-200 dark:hover:from-amber-800/50 dark:hover:via-yellow-800/50 dark:hover:to-orange-800/50 transition-all duration-300 border border-amber-200 dark:border-amber-700 shadow-sm hover:shadow-md transform hover:scale-105"
                style={{
                  fontSize: `${fontSize}px`,
                  opacity: opacity,
                }}
              >
                <span className="font-bold text-amber-700 dark:text-amber-300">{word.word}</span>
                <Badge className="text-xs bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 shadow-sm">
                  {word.count}
                </Badge>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

export function TopicDistribution({ posts }: TrendingAnalysisProps) {
  const trendingWords = useMemo(() => extractTrendingWords(posts, 50), [posts])

  // Categorize words into topics (simplified approach)
  const topics = useMemo(() => {
    const techWords = [
      "javascript",
      "react",
      "python",
      "code",
      "programming",
      "development",
      "api",
      "web",
      "app",
      "software",
      "tech",
      "technology",
    ]
    const discussionWords = [
      "question",
      "help",
      "discussion",
      "advice",
      "opinion",
      "thoughts",
      "experience",
      "tips",
      "guide",
      "tutorial",
    ]
    const newsWords = ["news", "update", "release", "announcement", "breaking", "report", "article", "story"]
    const communityWords = ["community", "users", "people", "everyone", "reddit", "subreddit", "post", "comment"]

    const topicCounts = {
      Technology: 0,
      Discussion: 0,
      News: 0,
      Community: 0,
      Other: 0,
    }

    trendingWords.forEach((word) => {
      const wordLower = word.word.toLowerCase()
      if (techWords.some((tech) => wordLower.includes(tech))) {
        topicCounts.Technology += word.count
      } else if (discussionWords.some((disc) => wordLower.includes(disc))) {
        topicCounts.Discussion += word.count
      } else if (newsWords.some((news) => wordLower.includes(news))) {
        topicCounts.News += word.count
      } else if (communityWords.some((comm) => wordLower.includes(comm))) {
        topicCounts.Community += word.count
      } else {
        topicCounts.Other += word.count
      }
    })

    return Object.entries(topicCounts)
      .map(([topic, count]) => ({ topic, count }))
      .filter((item) => item.count > 0)
      .sort((a, b) => b.count - a.count)
  }, [trendingWords])

  const pieData = topics.map((item, index) => ({
    name: item.topic,
    value: item.count,
    fill: COLORS[index % COLORS.length],
  }))

  return (
    <Card className="bg-gradient-to-br from-lime-50 to-green-100 dark:from-lime-950/50 dark:to-green-900/50 border-lime-200 dark:border-lime-800">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-bold bg-gradient-to-r from-lime-600 to-green-600 bg-clip-text text-transparent">
          Topic Distribution
        </CardTitle>
        <CardDescription className="text-lime-600/70 dark:text-lime-400/70">
          Content categories based on word analysis
        </CardDescription>
      </CardHeader>
      <CardContent className="bg-white/60 dark:bg-gray-900/60 rounded-lg backdrop-blur-sm">
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

export function SubredditWordAnalysis({ posts }: TrendingAnalysisProps) {
  const subredditWords = useMemo(() => {
    const subredditMap = new Map<string, Map<string, number>>()

    posts.forEach((post) => {
      if (!subredditMap.has(post.subreddit_name)) {
        subredditMap.set(post.subreddit_name, new Map())
      }

      const words = extractTrendingWords([post], 10)
      const subredditWordMap = subredditMap.get(post.subreddit_name)!

      words.forEach((word) => {
        const current = subredditWordMap.get(word.word) || 0
        subredditWordMap.set(word.word, current + word.count)
      })
    })

    return Array.from(subredditMap.entries())
      .map(([subreddit, wordMap]) => ({
        subreddit,
        topWords: Array.from(wordMap.entries())
          .map(([word, count]) => ({ word, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 5),
      }))
      .sort((a, b) => {
        const aTotal = a.topWords.reduce((sum, w) => sum + w.count, 0)
        const bTotal = b.topWords.reduce((sum, w) => sum + w.count, 0)
        return bTotal - aTotal
      })
      .slice(0, 6)
  }, [posts])

  return (
    <Card className="bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-50 dark:from-sky-950/50 dark:via-blue-950/50 dark:to-indigo-950/50 border-sky-200 dark:border-sky-800 shadow-lg hover:shadow-xl transition-all duration-300">
      <CardHeader className="pb-4">
        <CardTitle className="text-2xl font-bold bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
          🏘️ Subreddit Word Analysis
        </CardTitle>
        <CardDescription className="text-sky-600/70 dark:text-sky-400/70 text-base mt-1">
          Top words by community with enhanced card layouts
        </CardDescription>
      </CardHeader>
      <CardContent className="bg-white/80 dark:bg-gray-900/80 rounded-xl backdrop-blur-sm border border-white/20 dark:border-gray-700/20 p-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {subredditWords.map(({ subreddit, topWords }) => (
            <div
              key={subreddit}
              className="space-y-4 p-5 border border-sky-200 dark:border-sky-700 rounded-xl bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-50 dark:from-sky-900/30 dark:via-blue-900/30 dark:to-indigo-900/30 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-300 transform hover:scale-105"
            >
              <h4 className="font-bold text-base text-sky-700 dark:text-sky-300 bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent">
                r/{subreddit}
              </h4>
              <div className="space-y-3">
                {topWords.map((word, index) => (
                  <div
                    key={word.word}
                    className="flex items-center justify-between p-2 bg-white/60 dark:bg-gray-800/60 rounded-lg border border-sky-100 dark:border-sky-800"
                  >
                    <span className="text-sm font-semibold text-sky-600 dark:text-sky-400">{word.word}</span>
                    <Badge className="text-xs bg-gradient-to-r from-sky-500 to-blue-500 text-white border-0 shadow-sm">
                      {word.count}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
