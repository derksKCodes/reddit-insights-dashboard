import type { RedditPost } from "./types"

export async function parseCSVFile(file: File): Promise<RedditPost[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = (e) => {
      try {
        const text = e.target?.result as string
        const posts = parseCSVText(text)
        resolve(posts)
      } catch (error) {
        reject(error)
      }
    }

    reader.onerror = () => reject(new Error("Failed to read file"))
    reader.readAsText(file)
  })
}

function parseCSVText(text: string): RedditPost[] {
  const lines = text.split("\n").filter((line) => line.trim())
  if (lines.length < 2) throw new Error("Invalid CSV format")

  const headers = lines[0].split(",").map((h) => h.trim().replace(/"/g, ""))
  const posts: RedditPost[] = []

  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i])
    if (values.length !== headers.length) continue

    const post: any = {}
    headers.forEach((header, index) => {
      post[header] = values[index]
    })

    // Convert data types
    const redditPost: RedditPost = {
      post_id: post.post_id || "",
      title: post.title || "",
      author_username: post.author_username || "",
      author_profile_link: post.author_profile_link || "",
      author_flair: post.author_flair || null,
      subreddit_name: post.subreddit_name || "",
      post_url: post.post_url || "",
      post_content: post.post_content || "",
      post_flair: post.post_flair || null,
      score: Number.parseInt(post.score) || 0,
      num_comments: Number.parseInt(post.num_comments) || 0,
      upvote_ratio: Number.parseFloat(post.upvote_ratio) || 0,
      awards: Number.parseInt(post.awards) || 0,
      is_nsfw: post.is_nsfw === "true" || post.is_nsfw === "1",
      is_spoiler: post.is_spoiler === "true" || post.is_spoiler === "1",
      edited: post.edited === "true" || post.edited === "1",
      media_links: post.media_links ? post.media_links.split("|") : [],
      permalink: post.permalink || "",
      distinguished: post.distinguished || null,
      url: post.url || "",
      domain: post.domain || "",
      is_self: post.is_self === "true" || post.is_self === "1",
      is_video: post.is_video === "true" || post.is_video === "1",
      crosspost_parent: post.crosspost_parent || null,
      locked: post.locked === "true" || post.locked === "1",
      stickied: post.stickied === "true" || post.stickied === "1",
      suggested_sort: post.suggested_sort || null,
      view_count: post.view_count ? Number.parseInt(post.view_count) : null,
      created_utc_timestamp: Number.parseInt(post.created_utc_timestamp) || 0,
      created_utc_human: post.created_utc_human || "",
    }

    posts.push(redditPost)
  }

  return posts
}

function parseCSVLine(line: string): string[] {
  const result: string[] = []
  let current = ""
  let inQuotes = false

  for (let i = 0; i < line.length; i++) {
    const char = line[i]

    if (char === '"') {
      inQuotes = !inQuotes
    } else if (char === "," && !inQuotes) {
      result.push(current.trim())
      current = ""
    } else {
      current += char
    }
  }

  result.push(current.trim())
  return result
}

// Generate sample data for testing
export function generateSampleData(): RedditPost[] {
  const subreddits = ["technology", "programming", "webdev", "javascript", "react"]
  const authors = ["user1", "user2", "user3", "user4", "user5", "developer123", "coder456"]
  const sampleTitles = [
    "New React 19 features are amazing!",
    "How to optimize your Next.js app",
    "JavaScript performance tips",
    "Building scalable web applications",
    "The future of web development",
    "CSS Grid vs Flexbox comparison",
    "TypeScript best practices",
    "API design principles",
    "Database optimization techniques",
    "Mobile-first development approach",
  ]

  const posts: RedditPost[] = []
  const now = Date.now() / 1000

  for (let i = 0; i < 100; i++) {
    const createdTime = now - Math.random() * 30 * 24 * 60 * 60 // Last 30 days
    const post: RedditPost = {
      post_id: `post_${i}`,
      title: sampleTitles[Math.floor(Math.random() * sampleTitles.length)],
      author_username: authors[Math.floor(Math.random() * authors.length)],
      author_profile_link: `https://reddit.com/u/${authors[Math.floor(Math.random() * authors.length)]}`,
      author_flair: Math.random() > 0.7 ? "Verified Developer" : null,
      subreddit_name: subreddits[Math.floor(Math.random() * subreddits.length)],
      post_url: `https://reddit.com/r/technology/comments/post_${i}`,
      post_content: "This is sample post content for testing the dashboard.",
      post_flair: Math.random() > 0.6 ? "Discussion" : null,
      score: Math.floor(Math.random() * 1000) + 1,
      num_comments: Math.floor(Math.random() * 200),
      upvote_ratio: 0.7 + Math.random() * 0.3,
      awards: Math.floor(Math.random() * 10),
      is_nsfw: false,
      is_spoiler: false,
      edited: Math.random() > 0.8,
      media_links: [],
      permalink: `/r/technology/comments/post_${i}`,
      distinguished: null,
      url: `https://reddit.com/r/technology/comments/post_${i}`,
      domain: "self.technology",
      is_self: true,
      is_video: false,
      crosspost_parent: null,
      locked: false,
      stickied: false,
      suggested_sort: null,
      view_count: Math.floor(Math.random() * 5000),
      created_utc_timestamp: Math.floor(createdTime),
      created_utc_human: new Date(createdTime * 1000).toISOString(),
    }
    posts.push(post)
  }

  return posts
}

export async function parseXLSXFile(file: File): Promise<RedditPost[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer)
        // Simple XLSX parsing - convert to CSV-like format
        const text = new TextDecoder().decode(data)
        // For now, treat as CSV if it contains comma-separated values
        if (text.includes(",")) {
          const posts = parseCSVText(text)
          resolve(posts)
        } else {
          throw new Error("Invalid XLSX format")
        }
      } catch (error) {
        reject(error)
      }
    }

    reader.onerror = () => reject(new Error("Failed to read XLSX file"))
    reader.readAsArrayBuffer(file)
  })
}

export async function parseJSONFile(file: File): Promise<RedditPost[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = (e) => {
      try {
        const text = e.target?.result as string
        const data = JSON.parse(text)

        // Handle array of posts or single post
        const postsArray = Array.isArray(data) ? data : [data]

        const posts: RedditPost[] = postsArray.map((item: any) => ({
          post_id: item.post_id || item.id || "",
          title: item.title || "",
          author_username: item.author_username || item.author || "",
          author_profile_link: item.author_profile_link || "",
          author_flair: item.author_flair || null,
          subreddit_name: item.subreddit_name || item.subreddit || "",
          post_url: item.post_url || item.url || "",
          post_content: item.post_content || item.content || item.selftext || "",
          post_flair: item.post_flair || item.flair || null,
          score: Number(item.score) || 0,
          num_comments: Number(item.num_comments) || Number(item.comments) || 0,
          upvote_ratio: Number(item.upvote_ratio) || 0,
          awards: Number(item.awards) || 0,
          is_nsfw: Boolean(item.is_nsfw || item.nsfw),
          is_spoiler: Boolean(item.is_spoiler || item.spoiler),
          edited: Boolean(item.edited),
          media_links: Array.isArray(item.media_links) ? item.media_links : [],
          permalink: item.permalink || "",
          distinguished: item.distinguished || null,
          url: item.url || "",
          domain: item.domain || "",
          is_self: Boolean(item.is_self),
          is_video: Boolean(item.is_video),
          crosspost_parent: item.crosspost_parent || null,
          locked: Boolean(item.locked),
          stickied: Boolean(item.stickied),
          suggested_sort: item.suggested_sort || null,
          view_count: item.view_count ? Number(item.view_count) : null,
          created_utc_timestamp: Number(item.created_utc_timestamp) || Number(item.created_utc) || 0,
          created_utc_human: item.created_utc_human || new Date(Number(item.created_utc) * 1000).toISOString(),
        }))

        resolve(posts)
      } catch (error) {
        reject(error)
      }
    }

    reader.onerror = () => reject(new Error("Failed to read JSON file"))
    reader.readAsText(file)
  })
}

export async function parseSQLFile(file: File): Promise<RedditPost[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = (e) => {
      try {
        const text = e.target?.result as string

        // Simple SQL parsing - extract INSERT statements
        const insertRegex = /INSERT INTO.*?VALUES\s*$$(.*?)$$/gi
        const matches = text.match(insertRegex)

        if (!matches) {
          throw new Error("No INSERT statements found in SQL file")
        }

        const posts: RedditPost[] = []

        matches.forEach((match) => {
          const valuesMatch = match.match(/VALUES\s*$$(.*?)$$/i)
          if (valuesMatch) {
            const values = valuesMatch[1].split(",").map((v) => v.trim().replace(/['"]/g, ""))

            // Assuming standard column order
            if (values.length >= 10) {
              const post: RedditPost = {
                post_id: values[0] || "",
                title: values[1] || "",
                author_username: values[2] || "",
                author_profile_link: values[3] || "",
                author_flair: values[4] || null,
                subreddit_name: values[5] || "",
                post_url: values[6] || "",
                post_content: values[7] || "",
                post_flair: values[8] || null,
                score: Number(values[9]) || 0,
                num_comments: Number(values[10]) || 0,
                upvote_ratio: Number(values[11]) || 0,
                awards: Number(values[12]) || 0,
                is_nsfw: values[13] === "true" || values[13] === "1",
                is_spoiler: values[14] === "true" || values[14] === "1",
                edited: values[15] === "true" || values[15] === "1",
                media_links: values[16] ? values[16].split("|") : [],
                permalink: values[17] || "",
                distinguished: values[18] || null,
                url: values[19] || "",
                domain: values[20] || "",
                is_self: values[21] === "true" || values[21] === "1",
                is_video: values[22] === "true" || values[22] === "1",
                crosspost_parent: values[23] || null,
                locked: values[24] === "true" || values[24] === "1",
                stickied: values[25] === "true" || values[25] === "1",
                suggested_sort: values[26] || null,
                view_count: values[27] ? Number(values[27]) : null,
                created_utc_timestamp: Number(values[28]) || 0,
                created_utc_human: values[29] || "",
              }
              posts.push(post)
            }
          }
        })

        resolve(posts)
      } catch (error) {
        reject(error)
      }
    }

    reader.onerror = () => reject(new Error("Failed to read SQL file"))
    reader.readAsText(file)
  })
}

export async function parseFile(file: File): Promise<RedditPost[]> {
  const extension = file.name.toLowerCase().split(".").pop()

  switch (extension) {
    case "csv":
      return parseCSVFile(file)
    case "xlsx":
    case "xls":
      return parseXLSXFile(file)
    case "json":
      return parseJSONFile(file)
    case "sql":
      return parseSQLFile(file)
    default:
      throw new Error(`Unsupported file format: ${extension}. Supported formats: CSV, XLSX, JSON, SQL`)
  }
}
