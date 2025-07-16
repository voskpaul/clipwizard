"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Search, Filter, Download, Play, MoreVertical, Calendar, Eye, Trash2, Share2, Edit } from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"

const mockVideos = [
  {
    id: 1,
    title: "Marketing Strategy Deep Dive",
    thumbnail: "/placeholder.svg?height=200&width=300",
    duration: "0:45",
    createdAt: "2024-01-15",
    status: "completed",
    clips: 5,
    views: 1240,
  },
  {
    id: 2,
    title: "Product Launch Presentation",
    thumbnail: "/placeholder.svg?height=200&width=300",
    duration: "1:20",
    createdAt: "2024-01-14",
    status: "completed",
    clips: 8,
    views: 856,
  },
  {
    id: 3,
    title: "Team Meeting Highlights",
    thumbnail: "/placeholder.svg?height=200&width=300",
    duration: "0:30",
    createdAt: "2024-01-13",
    status: "processing",
    clips: 0,
    views: 0,
  },
  {
    id: 4,
    title: "Customer Success Stories",
    thumbnail: "/placeholder.svg?height=200&width=300",
    duration: "2:15",
    createdAt: "2024-01-12",
    status: "completed",
    clips: 12,
    views: 2340,
  },
  {
    id: 5,
    title: "Quarterly Review",
    thumbnail: "/placeholder.svg?height=200&width=300",
    duration: "1:45",
    createdAt: "2024-01-11",
    status: "completed",
    clips: 7,
    views: 567,
  },
  {
    id: 6,
    title: "Training Workshop",
    thumbnail: "/placeholder.svg?height=200&width=300",
    duration: "3:20",
    createdAt: "2024-01-10",
    status: "completed",
    clips: 15,
    views: 1890,
  },
]

export default function LibraryPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedFilter, setSelectedFilter] = useState("all")

  const filteredVideos = mockVideos.filter((video) => {
    const matchesSearch = video.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = selectedFilter === "all" || video.status === selectedFilter
    return matchesSearch && matchesFilter
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Completed</Badge>
      case "processing":
        return <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">Processing</Badge>
      case "failed":
        return <Badge className="bg-red-100 text-red-700 hover:bg-red-100">Failed</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Video Library</h1>
            <p className="text-gray-600 mt-1">Manage and download your generated clips</p>
          </div>
          <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
            Create New Project
          </Button>
        </div>

        {/* Search and Filter */}
        <div className="flex items-center space-x-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search videos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setSelectedFilter("all")}>All Videos</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSelectedFilter("completed")}>Completed</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSelectedFilter("processing")}>Processing</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSelectedFilter("failed")}>Failed</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Video Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVideos.map((video) => (
            <Card key={video.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative">
                <img
                  src={video.thumbnail || "/placeholder.svg"}
                  alt={video.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                  <Button size="sm" className="bg-white/90 text-black hover:bg-white">
                    <Play className="w-4 h-4 mr-1" />
                    Preview
                  </Button>
                </div>
                <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                  {video.duration}
                </div>
                <div className="absolute top-2 left-2">{getStatusBadge(video.status)}</div>
              </div>
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-lg leading-tight line-clamp-2">{video.title}</h3>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Share2 className="w-4 h-4 mr-2" />
                        Share
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Download className="w-4 h-4 mr-2" />
                        Download All
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="flex items-center text-sm text-gray-500 space-x-4 mb-3">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {new Date(video.createdAt).toLocaleDateString()}
                  </div>
                  <div className="flex items-center">
                    <Eye className="w-4 h-4 mr-1" />
                    {video.views.toLocaleString()}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{video.clips} clips generated</span>
                  {video.status === "completed" && (
                    <Button size="sm" variant="outline">
                      <Download className="w-4 h-4 mr-1" />
                      Download
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredVideos.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium mb-2">No videos found</h3>
            <p className="text-gray-500 mb-4">
              {searchQuery ? "Try adjusting your search terms" : "Start by creating your first video project"}
            </p>
            <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
              Create New Project
            </Button>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
