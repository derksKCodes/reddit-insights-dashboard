"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ExternalLink, ArrowUpDown, ArrowUp, ArrowDown, MessageSquare } from "lucide-react"
import type { RedditPost } from "@/lib/types"

interface TopPostsTableProps {
  posts: RedditPost[]
}

type SortField = "score" | "num_comments" | "created_utc_timestamp" | "upvote_ratio" | "awards"
type SortDirection = "asc" | "desc"

export function TopPostsTable({ posts }: TopPostsTableProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [sortField, setSortField] = useState<SortField>("score")
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc")
  const [selectedSubreddit, setSelectedSubreddit] = useState<string>("all")
  const [currentPage, setCurrentPage] = useState(1)
  const postsPerPage = 20

  // Get unique subreddits for filter
  const subreddits = useMemo(() => {
    const unique = Array.from(new Set(posts.map((post) => post.subreddit_name)))
    return unique.sort()
  }, [posts])

  // Filter and sort posts
  const filteredAndSortedPosts = useMemo(() => {
    let filtered = posts

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (post) =>
          post.title.toLowerCase().includes(query) ||
          post.author_username.toLowerCase().includes(query) ||
          post.subreddit_name.toLowerCase().includes(query) ||
          post.post_content.toLowerCase().includes(query),
      )
    }

    // Filter by subreddit
    if (selectedSubreddit !== "all") {
      filtered = filtered.filter((post) => post.subreddit_name === selectedSubreddit)
    }

    // Sort posts
    filtered.sort((a, b) => {
      let aValue = a[sortField]
      let bValue = b[sortField]

      if (typeof aValue === "string") {
        aValue = aValue.toLowerCase()
        bValue = (bValue as string).toLowerCase()
      }

      if (sortDirection === "asc") {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
      }
    })

    return filtered
  }, [posts, searchQuery, selectedSubreddit, sortField, sortDirection])

  // Paginate posts
  const paginatedPosts = useMemo(() => {
    const startIndex = (currentPage - 1) * postsPerPage
    return filteredAndSortedPosts.slice(startIndex, startIndex + postsPerPage)
  }, [filteredAndSortedPosts, currentPage])

  const totalPages = Math.ceil(filteredAndSortedPosts.length / postsPerPage)

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("desc")
    }
    setCurrentPage(1)
  }

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return <ArrowUpDown className="w-4 h-4" />
    return sortDirection === "asc" ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const truncateTitle = (title: string, maxLength = 80) => {
    return title.length > maxLength ? `${title.slice(0, maxLength)}...` : title
  }

  return (
    <Card className="bg-gradient-to-br from-indigo-50 via-blue-50 to-cyan-50 dark:from-indigo-950/50 dark:via-blue-950/50 dark:to-cyan-950/50 border-indigo-200 dark:border-indigo-800 shadow-lg hover:shadow-xl transition-all duration-300">
      <CardHeader className="pb-4">
        <CardTitle className="text-2xl font-bold bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent">
          📋 Top Posts
        </CardTitle>
        <CardDescription className="text-indigo-600/70 dark:text-indigo-400/70 text-base mt-1">
          Sortable table with enhanced hover effects and alternating row colors
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 bg-white/80 dark:bg-gray-900/80 rounded-xl backdrop-blur-sm border border-white/20 dark:border-gray-700/20 p-6">
        {/* Filters */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          <div className="flex-1">
            <Input
              placeholder="🔍 Search posts, authors, or subreddits..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setCurrentPage(1)
              }}
              className="max-w-sm bg-white/90 dark:bg-gray-800/90 border-indigo-200 dark:border-indigo-700 focus:border-indigo-400 dark:focus:border-indigo-500 transition-colors"
            />
          </div>
          <Select
            value={selectedSubreddit}
            onValueChange={(value) => {
              setSelectedSubreddit(value)
              setCurrentPage(1)
            }}
          >
            <SelectTrigger className="w-48 bg-white/90 dark:bg-gray-800/90 border-indigo-200 dark:border-indigo-700 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors">
              <SelectValue placeholder="Filter by subreddit" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Subreddits</SelectItem>
              {subreddits.map((subreddit) => (
                <SelectItem key={subreddit} value={subreddit}>
                  r/{subreddit}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Results count */}
        <div className="text-sm text-indigo-600/70 dark:text-indigo-400/70 font-medium bg-indigo-50 dark:bg-indigo-900/20 px-3 py-2 rounded-lg">
          📊 Showing {paginatedPosts.length} of {filteredAndSortedPosts.length} posts
        </div>

        <div className="rounded-xl border border-indigo-200 dark:border-indigo-700 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm overflow-hidden shadow-lg">
          <Table>
            <TableHeader>
              <TableRow className="bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-900/50 dark:to-blue-900/50 hover:from-indigo-100 hover:to-blue-100 dark:hover:from-indigo-800/50 dark:hover:to-blue-800/50">
                <TableHead className="w-[50%] font-semibold text-indigo-700 dark:text-indigo-300">Title</TableHead>
                <TableHead className="font-semibold text-indigo-700 dark:text-indigo-300">Subreddit</TableHead>
                <TableHead className="font-semibold text-indigo-700 dark:text-indigo-300">Author</TableHead>
                <TableHead
                  className="cursor-pointer font-semibold text-indigo-700 dark:text-indigo-300 hover:text-indigo-800 dark:hover:text-indigo-200 transition-colors"
                  onClick={() => handleSort("score")}
                >
                  <div className="flex items-center gap-1">Score {getSortIcon("score")}</div>
                </TableHead>
                <TableHead
                  className="cursor-pointer font-semibold text-indigo-700 dark:text-indigo-300 hover:text-indigo-800 dark:hover:text-indigo-200 transition-colors"
                  onClick={() => handleSort("num_comments")}
                >
                  <div className="flex items-center gap-1">Comments {getSortIcon("num_comments")}</div>
                </TableHead>
                <TableHead
                  className="cursor-pointer font-semibold text-indigo-700 dark:text-indigo-300 hover:text-indigo-800 dark:hover:text-indigo-200 transition-colors"
                  onClick={() => handleSort("created_utc_timestamp")}
                >
                  <div className="flex items-center gap-1">Date {getSortIcon("created_utc_timestamp")}</div>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedPosts.map((post, index) => (
                <TableRow
                  key={post.post_id}
                  className={`
                    ${index % 2 === 0 ? "bg-white/50 dark:bg-gray-800/30" : "bg-indigo-50/30 dark:bg-indigo-900/10"}
                    hover:bg-gradient-to-r hover:from-indigo-100/50 hover:to-blue-100/50 
                    dark:hover:from-indigo-800/30 dark:hover:to-blue-800/30 
                    transition-all duration-200 border-b border-indigo-100 dark:border-indigo-800/50
                  `}
                >
                  <TableCell className="py-4">
                    <div className="space-y-2">
                      <a
                        href={post.post_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium hover:underline text-indigo-700 dark:text-indigo-300 hover:text-indigo-800 dark:hover:text-indigo-200 flex items-start gap-2 transition-colors"
                      >
                        {truncateTitle(post.title)}
                        <ExternalLink className="w-4 h-4 mt-0.5 flex-shrink-0 text-indigo-500" />
                      </a>
                      <div className="flex items-center gap-2 text-xs">
                        {post.post_flair && (
                          <Badge
                            variant="outline"
                            className="text-xs bg-indigo-50 dark:bg-indigo-900/30 border-indigo-200 dark:border-indigo-700 text-indigo-700 dark:text-indigo-300"
                          >
                            {post.post_flair}
                          </Badge>
                        )}
                        {post.is_nsfw && (
                          <Badge className="text-xs bg-gradient-to-r from-red-500 to-pink-500 text-white border-0">
                            NSFW
                          </Badge>
                        )}
                        {post.is_spoiler && (
                          <Badge className="text-xs bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0">
                            Spoiler
                          </Badge>
                        )}
                        {post.is_video && (
                          <Badge className="text-xs bg-gradient-to-r from-purple-500 to-violet-500 text-white border-0">
                            🎥 Video
                          </Badge>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white border-0">
                      r/{post.subreddit_name}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <a
                      href={post.author_profile_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm hover:underline text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
                    >
                      u/{post.author_username}
                    </a>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <ArrowUp className="w-4 h-4 text-green-600 dark:text-green-400" />
                      <span className="font-bold text-green-700 dark:text-green-300">
                        {post.score.toLocaleString()}
                      </span>
                      <span className="text-xs text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-800/30 px-2 py-1 rounded-full">
                        {(post.upvote_ratio * 100).toFixed(0)}%
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <MessageSquare className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      <span className="font-bold text-blue-700 dark:text-blue-300">
                        {post.num_comments.toLocaleString()}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/30 px-3 py-2 rounded-lg">
                      {formatDate(post.created_utc_timestamp)}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-lg">
            <div className="text-sm text-indigo-600/70 dark:text-indigo-400/70 font-medium">
              📄 Page {currentPage} of {totalPages}
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white border-0 hover:from-indigo-600 hover:to-blue-600 disabled:from-gray-300 disabled:to-gray-400 transition-all duration-200"
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white border-0 hover:from-blue-600 hover:to-indigo-600 disabled:from-gray-300 disabled:to-gray-400 transition-all duration-200"
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
