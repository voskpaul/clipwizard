"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Loader2, CheckCircle, AlertCircle, Download, Play, Scissors, Brain, FileText } from "lucide-react"
import {
  subscribeToVideoUpdates,
  subscribeToProcessingJobs,
  type Video as VideoType,
  type ProcessingJob,
} from "@/lib/supabase"

interface ProcessingStage {
  id: string
  name: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  status: "pending" | "running" | "completed" | "failed"
  progress: number
  error?: string
}

interface RealTimeProcessingProps {
  videoId: string
  onProcessingComplete: (clips: any[]) => void
}

export function RealTimeProcessing({ videoId, onProcessingComplete }: RealTimeProcessingProps) {
  const [video, setVideo] = useState<VideoType | null>(null)
  const [stages, setStages] = useState<ProcessingStage[]>([
    {
      id: "upload",
      name: "Upload Complete",
      description: "Video uploaded successfully",
      icon: FileText,
      status: "completed",
      progress: 100,
    },
    {
      id: "transcription",
      name: "Audio Transcription",
      description: "Converting speech to text using AI",
      icon: FileText,
      status: "pending",
      progress: 0,
    },
    {
      id: "analysis",
      name: "Content Analysis",
      description: "Analyzing content for key moments",
      icon: Brain,
      status: "pending",
      progress: 0,
    },
    {
      id: "clipping",
      name: "Clip Generation",
      description: "Creating short clips from video",
      icon: Scissors,
      status: "pending",
      progress: 0,
    },
  ])
  const [overallProgress, setOverallProgress] = useState(0)
  const [estimatedTimeRemaining, setEstimatedTimeRemaining] = useState<string>("")

  useEffect(() => {
    // Subscribe to video updates
    const videoChannel = subscribeToVideoUpdates(videoId, (payload) => {
      console.log("Video update:", payload)
      setVideo(payload.new)

      // Update overall progress based on video status
      if (payload.new.status === "completed") {
        setOverallProgress(100)
        setEstimatedTimeRemaining("Complete")
      } else if (payload.new.processing_progress) {
        setOverallProgress(payload.new.processing_progress)
      }
    })

    // Subscribe to processing job updates
    const jobsChannel = subscribeToProcessingJobs(videoId, (payload) => {
      console.log("Processing job update:", payload)

      const job = payload.new as ProcessingJob

      setStages((prev) =>
        prev.map((stage) => {
          if (stage.id === job.job_type) {
            return {
              ...stage,
              status: job.status,
              progress: job.progress,
              error: job.error_message,
            }
          }
          return stage
        }),
      )

      // Update estimated time
      updateEstimatedTime(job)
    })

    return () => {
      videoChannel.unsubscribe()
      jobsChannel.unsubscribe()
    }
  }, [videoId])

  const updateEstimatedTime = (job: ProcessingJob) => {
    // Simple estimation logic
    const remainingJobs = stages.filter((s) => s.status === "pending" || s.status === "running").length
    const avgTimePerJob = 60 // seconds
    const estimated = remainingJobs * avgTimePerJob

    if (estimated > 0) {
      const minutes = Math.floor(estimated / 60)
      const seconds = estimated % 60
      setEstimatedTimeRemaining(`${minutes}:${seconds.toString().padStart(2, "0")} remaining`)
    } else {
      setEstimatedTimeRemaining("Almost done...")
    }
  }

  const getStageStatusIcon = (stage: ProcessingStage) => {
    switch (stage.status) {
      case "running":
        return <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case "failed":
        return <AlertCircle className="w-4 h-4 text-red-500" />
      default:
        return <div className="w-4 h-4 rounded-full border-2 border-gray-300" />
    }
  }

  const getStageStatusBadge = (status: ProcessingStage["status"]) => {
    switch (status) {
      case "running":
        return <Badge className="bg-blue-100 text-blue-700">Processing</Badge>
      case "completed":
        return <Badge className="bg-green-100 text-green-700">Complete</Badge>
      case "failed":
        return <Badge className="bg-red-100 text-red-700">Failed</Badge>
      default:
        return <Badge variant="outline">Pending</Badge>
    }
  }

  const isProcessingComplete = stages.every((stage) => stage.status === "completed" || stage.id === "upload")

  return (
    <div className="space-y-6">
      {/* Overall Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Processing Progress</span>
            <span className="text-sm font-normal text-gray-500">{estimatedTimeRemaining}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Overall Progress</span>
              <span>{Math.round(overallProgress)}%</span>
            </div>
            <Progress value={overallProgress} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Processing Stages */}
      <Card>
        <CardHeader>
          <CardTitle>Processing Stages</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stages.map((stage, index) => {
              const StageIcon = stage.icon
              return (
                <div key={stage.id} className="flex items-center space-x-4">
                  <div className="flex-shrink-0">{getStageStatusIcon(stage)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-medium">{stage.name}</p>
                      {getStageStatusBadge(stage.status)}
                    </div>
                    <p className="text-xs text-gray-500 mb-2">{stage.description}</p>
                    {stage.status === "running" && (
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span>Progress</span>
                          <span>{stage.progress}%</span>
                        </div>
                        <Progress value={stage.progress} className="h-1" />
                      </div>
                    )}
                    {stage.error && <p className="text-xs text-red-500 mt-1">{stage.error}</p>}
                  </div>
                  <div className="flex-shrink-0">
                    <StageIcon className="w-5 h-5 text-gray-400" />
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {isProcessingComplete && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
              Processing Complete!
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Your video has been successfully processed. Generated clips are ready for download.
              </p>
              <div className="flex space-x-3">
                <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                  <Play className="w-4 h-4 mr-2" />
                  View Clips
                </Button>
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Download All
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Live Activity Feed */}
      <Card>
        <CardHeader>
          <CardTitle>Live Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 max-h-40 overflow-y-auto">
            <div className="flex items-start space-x-3 text-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
              <div>
                <p className="font-medium">Video uploaded successfully</p>
                <p className="text-xs text-gray-500">Just now</p>
              </div>
            </div>
            <div className="flex items-start space-x-3 text-sm">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
              <div>
                <p className="font-medium">Starting audio transcription...</p>
                <p className="text-xs text-gray-500">2 seconds ago</p>
              </div>
            </div>
            <div className="flex items-start space-x-3 text-sm">
              <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0" />
              <div>
                <p className="font-medium">AI analysis in progress</p>
                <p className="text-xs text-gray-500">15 seconds ago</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
