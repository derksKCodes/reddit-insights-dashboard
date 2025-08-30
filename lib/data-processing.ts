import type { RedditPost, DashboardStats, TrendingWord, GrowthData } from "./types"

// Stop words to filter out from trending analysis
const STOP_WORDS = new Set([
  "the",
  "a",
  "an",
  "and",
  "or",
  "but",
  "in",
  "on",
  "at",
  "to",
  "for",
  "of",
  "with",
  "by",
  "is",
  "are",
  "was",
  "were",
  "be",
  "been",
  "being",
  "have",
  "has",
  "had",
  "do",
  "does",
  "did",
  "will",
  "would",
  "could",
  "should",
  "may",
  "might",
  "must",
  "can",
  "this",
  "that",
  "these",
  "those",
  "i",
  "you",
  "he",
  "she",
  "it",
  "we",
  "they",
  "me",
  "him",
  "her",
  "us",
  "them",
  "my",
  "your",
  "his",
  "her",
  "its",
  "our",
  "their",
])

export function calculateDashboardStats(posts: RedditPost[]): DashboardStats {
  if (posts.length === 0) {
    return {
      totalPosts: 0,
      totalAuthors: 0,
      avgUpvotes: 0,
      avgComments: 0,
      avgAwards: 0,
      topSubreddits: [],
      activePeriods: [],
    }
  }

  const uniqueAuthors = new Set(posts.map((p) => p.author_username))
  const subredditCounts = new Map<string, number>()
  const hourCounts = new Map<number, number>()

  let totalUpvotes = 0
  let totalComments = 0
  let totalAwards = 0

  posts.forEach((post) => {
    totalUpvotes += post.score
    totalComments += post.num_comments
    totalAwards += post.awards

    // Count subreddits
    const current = subredditCounts.get(post.subreddit_name) || 0
    subredditCounts.set(post.subreddit_name, current + 1)

    // Count active hours
    const hour = new Date(post.created_utc_timestamp * 1000).getHours()
    const currentHour = hourCounts.get(hour) || 0
    hourCounts.set(hour, currentHour + 1)
  })

  const topSubreddits = Array.from(subredditCounts.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10)

  const activePeriods = Array.from(hourCounts.entries())
    .map(([hour, count]) => ({ hour, count }))
    .sort((a, b) => b.count - a.count)

  return {
    totalPosts: posts.length,
    totalAuthors: uniqueAuthors.size,
    avgUpvotes: Math.round(totalUpvotes / posts.length),
    avgComments: Math.round(totalComments / posts.length),
    avgAwards: Math.round(totalAwards / posts.length),
    topSubreddits,
    activePeriods,
  }
}

export function extractTrendingWords(posts: RedditPost[], limit = 50): TrendingWord[] {
  const wordCounts = new Map<string, { count: number; subreddits: Set<string> }>()

  posts.forEach((post) => {
    const text = `${post.title} ${post.post_content}`.toLowerCase()
    const words = text.match(/\b[a-zA-Z]{3,}\b/g) || []

    words.forEach((word) => {
      if (!STOP_WORDS.has(word)) {
        const current = wordCounts.get(word) || { count: 0, subreddits: new Set() }
        current.count += 1
        current.subreddits.add(post.subreddit_name)
        wordCounts.set(word, current)
      }
    })
  })

  return Array.from(wordCounts.entries())
    .map(([word, data]) => ({
      word,
      count: data.count,
      subreddits: Array.from(data.subreddits),
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit)
}

export function generateGrowthData(posts: RedditPost[]): GrowthData[] {
  const dailyData = new Map<string, { posts: number; upvotes: number; comments: number }>()

  posts.forEach((post) => {
    const date = new Date(post.created_utc_timestamp * 1000).toISOString().split("T")[0]
    const current = dailyData.get(date) || { posts: 0, upvotes: 0, comments: 0 }

    current.posts += 1
    current.upvotes += post.score
    current.comments += post.num_comments

    dailyData.set(date, current)
  })

  return Array.from(dailyData.entries())
    .map(([date, data]) => ({
      date,
      posts: data.posts,
      upvotes: data.upvotes,
      comments: data.comments,
    }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
}

export function filterPostsByDateRange(posts: RedditPost[], range: string): RedditPost[] {
  if (range === "all") return posts

  const now = Date.now()
  const days = range === "7d" ? 7 : range === "30d" ? 30 : 90
  const cutoff = now - days * 24 * 60 * 60 * 1000

  return posts.filter((post) => post.created_utc_timestamp * 1000 >= cutoff)
}

export function filterPostsBySubreddits(posts: RedditPost[], subreddits: string[]): RedditPost[] {
  if (subreddits.length === 0) return posts
  return posts.filter((post) => subreddits.includes(post.subreddit_name))
}

export function searchPosts(posts: RedditPost[], query: string): RedditPost[] {
  if (!query.trim()) return posts

  const searchTerm = query.toLowerCase()
  return posts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchTerm) ||
      post.post_content.toLowerCase().includes(searchTerm) ||
      post.author_username.toLowerCase().includes(searchTerm) ||
      post.subreddit_name.toLowerCase().includes(searchTerm),
  )
}
