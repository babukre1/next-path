"use client"

import { useEffect, useState } from "react"
import { Avatar } from "./avatar"
import { Star } from "lucide-react"
import { cn } from "@/lib/utils"

interface StargazerInfo {
  login: string
  avatar_url: string
}

export function GitHubStars() {
  const [starCount, setStarCount] = useState<number>(0)
  const [stargazers, setStargazers] = useState<StargazerInfo[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const repoUrl = "https://github.com/najiibmohamed11/Next-Path"

  useEffect(() => {
    const fetchRepoData = async () => {
      try {
        setIsLoading(true)

        // Fetch repository data to get star count
        const repoResponse = await fetch("https://api.github.com/repos/najiibmohamed11/Next-Path")
        const repoData = await repoResponse.json()

        if (repoResponse.status !== 200) {
          throw new Error(repoData.message || "Failed to fetch repository data")
        }

        setStarCount(repoData.stargazers_count)

        // Fetch stargazers (people who starred the repo)
        const stargazersResponse = await fetch("https://api.github.com/repos/najiibmohamed11/Next-Path/stargazers")
        const stargazersData = await stargazersResponse.json()

        if (stargazersResponse.status !== 200) {
          throw new Error(stargazersData.message || "Failed to fetch stargazers")
        }

        // Extract relevant info from stargazers
        const stargazersInfo = stargazersData.map((user: any) => ({
          login: user.login,
          avatar_url: user.avatar_url,
        }))

        setStargazers(stargazersInfo)
      } catch (err) {
        console.error("Error fetching GitHub data:", err)
        setError(err instanceof Error ? err.message : "An unknown error occurred")
      } finally {
        setIsLoading(false)
      }
    }

    fetchRepoData()
  }, [])

  const handleStarClick = () => {
    window.open(repoUrl, "_blank", "noopener,noreferrer")
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center">
        {/* Skeleton loader */}
        <div className="flex -space-x-2 mr-4">
          {[0, 1, 2].map((index) => (
            <div
              key={index}
              className="w-10 h-10 rounded-full bg-gray-800 animate-pulse"
              style={{
                marginLeft: index > 0 ? "-8px" : "0",
                border: "2px solid rgb(17, 24, 39)",
              }}
            />
          ))}
        </div>
        <div className="flex items-center">
          <div className="h-4 w-4 mr-1 bg-gray-800 rounded animate-pulse"></div>
          <div className="h-5 w-20 bg-gray-800 rounded animate-pulse"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center">
        <div className="text-gray-400 text-sm flex items-center">
          <Star className="h-4 w-4 mr-1 text-yellow-400" />
          {starCount > 0 ? `${starCount} stars on GitHub` : "GitHub stats unavailable"}
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center">
      <div className="flex -space-x-2 mr-4">
        {stargazers.length > 0 ? (
          stargazers
            .slice(-3)
            .map((user, index) => (
              <Avatar
                key={user.login}
                initials={user.login.substring(0, 2).toUpperCase()}
                index={index}
                imageUrl={user.avatar_url}
              />
            ))
        ) : (
          // Fallback if no stargazers yet
          <Avatar initials="GH" index={0} />
        )}
      </div>
      <button
        onClick={handleStarClick}
        className="flex items-center bg-gradient-to-r from-gray-900 to-gray-800 px-3 py-1.5 rounded-full shadow-lg border border-gray-700 transition-all hover:shadow-xl hover:from-gray-800 hover:to-gray-700 hover:border-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50"
        aria-label="View GitHub repository"
      >
        <Star className="h-4 w-4 mr-1.5 text-yellow-400" />
        <p
          className={cn(
            "font-medium bg-clip-text text-transparent bg-gradient-to-r",
            starCount > 0
              ? "from-yellow-200 to-yellow-400"
              : "from-gray-200 to-gray-400"
          )}
        >
          {starCount} {starCount === 1 ? "star" : "stars"} on GitHub
        </p>
      </button>
    </div>
  );
}

