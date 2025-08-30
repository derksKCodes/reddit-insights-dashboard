import type { RedditPost } from "./types"

export function exportToCSV(posts: RedditPost[], filename = "reddit-data.csv") {
  const headers = [
    "post_id",
    "title",
    "author_username",
    "subreddit_name",
    "score",
    "num_comments",
    "upvote_ratio",
    "awards",
    "created_utc_human",
    "post_url",
  ]

  const csvContent = [
    headers.join(","),
    ...posts.map((post) =>
      [
        post.post_id,
        `"${post.title.replace(/"/g, '""')}"`,
        post.author_username,
        post.subreddit_name,
        post.score,
        post.num_comments,
        post.upvote_ratio,
        post.awards,
        post.created_utc_human,
        post.post_url,
      ].join(","),
    ),
  ].join("\n")

  downloadFile(csvContent, filename, "text/csv")
}

export function exportToJSON(posts: RedditPost[], filename = "reddit-data.json") {
  const jsonContent = JSON.stringify(posts, null, 2)
  downloadFile(jsonContent, filename, "application/json")
}

export function generateSummaryReport(posts: RedditPost[]): string {
  const totalPosts = posts.length
  const totalAuthors = new Set(posts.map((p) => p.author_username)).size
  const totalScore = posts.reduce((sum, p) => sum + p.score, 0)
  const totalComments = posts.reduce((sum, p) => sum + p.num_comments, 0)
  const avgScore = Math.round(totalScore / totalPosts)
  const avgComments = Math.round(totalComments / totalPosts)

  const subredditStats = new Map<string, number>()
  posts.forEach((post) => {
    subredditStats.set(post.subreddit_name, (subredditStats.get(post.subreddit_name) || 0) + 1)
  })

  const topSubreddits = Array.from(subredditStats.entries())
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)

  const topPosts = [...posts].sort((a, b) => b.score - a.score).slice(0, 5)

  return `
Reddit Insights Dashboard Report
Generated: ${new Date().toLocaleString()}

OVERVIEW STATISTICS
==================
Total Posts: ${totalPosts.toLocaleString()}
Unique Authors: ${totalAuthors.toLocaleString()}
Average Score: ${avgScore}
Average Comments: ${avgComments}
Total Score: ${totalScore.toLocaleString()}
Total Comments: ${totalComments.toLocaleString()}

TOP SUBREDDITS
==============
${topSubreddits.map(([name, count], i) => `${i + 1}. r/${name}: ${count} posts`).join("\n")}

TOP POSTS BY SCORE
==================
${topPosts.map((post, i) => `${i + 1}. ${post.title} (${post.score} points) - r/${post.subreddit_name}`).join("\n")}

DATA RANGE
==========
Earliest Post: ${new Date(Math.min(...posts.map((p) => p.created_utc_timestamp * 1000))).toLocaleString()}
Latest Post: ${new Date(Math.max(...posts.map((p) => p.created_utc_timestamp * 1000))).toLocaleString()}
  `.trim()
}

export async function exportToPDF(posts: RedditPost[], filename = "reddit-report.pdf") {
  // For a real implementation, you'd use a library like jsPDF
  // For now, we'll export the summary as a text file
  const report = generateSummaryReport(posts)
  downloadFile(report, filename.replace(".pdf", ".txt"), "text/plain")
}

export async function captureScreenshot(elementId: string, filename = "dashboard-screenshot.png") {
  try {
    // For a real implementation, you'd use html2canvas
    // For now, we'll show an alert
    alert(
      "Screenshot feature would capture the dashboard. In a real implementation, this would use html2canvas library.",
    )
  } catch (error) {
    console.error("Screenshot failed:", error)
    alert("Screenshot failed. Please try again.")
  }
}

function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export function applyFilters(posts: RedditPost[], filters: any): RedditPost[] {
  let filtered = [...posts]

  // Apply search filter
  if (filters.searchQuery?.trim()) {
    const query = filters.searchQuery.toLowerCase()
    filtered = filtered.filter(
      (post) =>
        post.title.toLowerCase().includes(query) ||
        post.author_username.toLowerCase().includes(query) ||
        post.subreddit_name.toLowerCase().includes(query) ||
        post.post_content.toLowerCase().includes(query),
    )
  }

  // Apply date range filter
  if (filters.dateRange && filters.dateRange !== "all") {
    const now = Date.now()
    const days = filters.dateRange === "7d" ? 7 : filters.dateRange === "30d" ? 30 : 90
    const cutoff = now - days * 24 * 60 * 60 * 1000
    filtered = filtered.filter((post) => post.created_utc_timestamp * 1000 >= cutoff)
  }

  // Apply subreddit filter
  if (filters.subreddits?.length > 0) {
    filtered = filtered.filter((post) => filters.subreddits.includes(post.subreddit_name))
  }

  // Apply sorting
  if (filters.sortBy) {
    switch (filters.sortBy) {
      case "top":
        filtered.sort((a, b) => b.score - a.score)
        break
      case "hot":
        // Hot algorithm approximation: score / age
        filtered.sort((a, b) => {
          const aHot = a.score / Math.max(1, (Date.now() / 1000 - a.created_utc_timestamp) / 3600)
          const bHot = b.score / Math.max(1, (Date.now() / 1000 - b.created_utc_timestamp) / 3600)
          return bHot - aHot
        })
        break
      case "new":
        filtered.sort((a, b) => b.created_utc_timestamp - a.created_utc_timestamp)
        break
      case "rising":
        // Rising algorithm approximation: comments/score ratio with recency boost
        filtered.sort((a, b) => {
          const aRising =
            (a.num_comments / Math.max(1, a.score)) *
            Math.max(1, 1 / ((Date.now() / 1000 - a.created_utc_timestamp) / 3600))
          const bRising =
            (b.num_comments / Math.max(1, b.score)) *
            Math.max(1, 1 / ((Date.now() / 1000 - b.created_utc_timestamp) / 3600))
          return bRising - aRising
        })
        break
    }
  }

  return filtered
}
