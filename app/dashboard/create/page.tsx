"use client"
import { DashboardLayout } from "@/components/dashboard-layout"
import { VideoCreator } from "@/components/video-creator"
import { AnimatedBackground } from "@/components/animated-background"

const mockClips = [
  {
    id: "1",
    title: "Marketing Strategy Highlight",
    startTime: 45,
    endTime: 75,
    thumbnail: "/placeholder.svg?height=200&width=300",
  },
  {
    id: "2",
    title: "Key Performance Metrics",
    startTime: 120,
    endTime: 165,
    thumbnail: "/placeholder.svg?height=200&width=300",
  },
  {
    id: "3",
    title: "Action Items Summary",
    startTime: 200,
    endTime: 230,
    thumbnail: "/placeholder.svg?height=200&width=300",
  },
  {
    id: "4",
    title: "Team Collaboration Tips",
    startTime: 300,
    endTime: 345,
    thumbnail: "/placeholder.svg?height=200&width=300",
  },
]

export default function CreatePage() {
  return (
    <DashboardLayout>
      <div className="space-y-8 relative">
        <AnimatedBackground variant="geometric" />

        {/* Header */}
        <div className="relative">
          <h1 className="text-3xl font-bold">Video Creator</h1>
          <p className="text-muted-foreground mt-1">Customize and create your perfect video clips</p>
        </div>

        {/* Video Creator Component */}
        <div className="relative">
          <VideoCreator videoId="sample-video-id" clips={mockClips} />
        </div>
      </div>
    </DashboardLayout>
  )
}
