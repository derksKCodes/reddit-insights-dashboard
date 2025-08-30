export interface RedditPost {
  post_id: string
  title: string
  author_username: string
  author_profile_link: string
  author_flair: string | null
  subreddit_name: string
  post_url: string
  post_content: string
  post_flair: string | null
  score: number
  num_comments: number
  upvote_ratio: number
  awards: number
  is_nsfw: boolean
  is_spoiler: boolean
  edited: boolean
  media_links: string[]
  permalink: string
  distinguished: string | null
  url: string
  domain: string
  is_self: boolean
  is_video: boolean
  crosspost_parent: string | null
  locked: boolean
  stickied: boolean
  suggested_sort: string | null
  view_count: number | null
  created_utc_timestamp: number
  created_utc_human: string
}

export interface DashboardFilters {
  dateRange: "all" | "7d" | "30d" | "90d"
  subreddits: string[]
  sortBy: "top" | "hot" | "new" | "rising"
  searchQuery: string
}

export interface DashboardStats {
  totalPosts: number
  totalAuthors: number
  avgUpvotes: number
  avgComments: number
  avgAwards: number
  topSubreddits: Array<{ name: string; count: number }>
  activePeriods: Array<{ hour: number; count: number }>
}

export interface TrendingWord {
  word: string
  count: number
  subreddits: string[]
}

export interface GrowthData {
  date: string
  posts: number
  upvotes: number
  comments: number
}
