"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LinkIcon, Video, Download, Settings, Zap, FileVideo, Scissors } from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { VideoUpload } from "@/components/video-upload"
import { RealTimeProcessing } from "@/components/real-time-processing"
import { getCurrentUser } from "@/lib/supabase"

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [videoUrl, setVideoUrl] = useState("")
  const [selectedTone, setSelectedTone] = useState("")
  const [customPrompt, setCustomPrompt] = useState("")
  const [processingVideoId, setProcessingVideoId] = useState<string | null>(null)

  useEffect(() => {
    const loadUser = async () => {
      const currentUser = await getCurrentUser()
      setUser(currentUser)
    }
    loadUser()
  }, [])

  const handleUploadComplete = (videoId: string) => {
    setProcessingVideoId(videoId)
    // Start processing the video
    startVideoProcessing(videoId)
  }

  const handleUploadError = (error: string) => {
    console.error("Upload error:", error)
    // Handle error (show toast, etc.)
  }

  const startVideoProcessing = async (videoId: string) => {
    try {
      const response = await fetch("/api/videos/process", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          videoId,
          tone: selectedTone,
          customPrompt,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to start processing")
      }

      const result = await response.json()
      console.log("Processing started:", result)
    } catch (error) {
      console.error("Processing error:", error)
    }
  }

  const handleProcessingComplete = (clips: any[]) => {
    console.log("Processing complete:", clips)
    setProcessingVideoId(null)
    // Redirect to library or show success message
  }

  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Create New Clips</h1>
            <p className="text-gray-600 mt-1">Transform your long-form content into engaging short clips</p>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="secondary" className="bg-green-100 text-green-700">
              <Zap className="w-4 h-4 mr-1" />5 credits remaining
            </Badge>
          </div>
        </div>

        {processingVideoId ? (
          /* Show real-time processing */
          <RealTimeProcessing videoId={processingVideoId} onProcessingComplete={handleProcessingComplete} />
        ) : (
          /* Show upload and settings */
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Input Section */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Video className="w-5 h-5 mr-2" />
                    Video Input
                  </CardTitle>
                  <CardDescription>Upload a video file or provide a URL to get started</CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="upload" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="upload">Upload File</TabsTrigger>
                      <TabsTrigger value="url">Video URL</TabsTrigger>
                    </TabsList>
                    <TabsContent value="upload" className="space-y-4">
                      <VideoUpload
                        userId={user.id}
                        onUploadComplete={handleUploadComplete}
                        onUploadError={handleUploadError}
                      />
                    </TabsContent>
                    <TabsContent value="url" className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="video-url">Video URL</Label>
                        <div className="relative">
                          <LinkIcon className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            id="video-url"
                            placeholder="https://youtube.com/watch?v=..."
                            value={videoUrl}
                            onChange={(e) => setVideoUrl(e.target.value)}
                            className="pl-10"
                          />
                        </div>
                        <p className="text-xs text-gray-500">Supports YouTube, Vimeo, and direct video links</p>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Settings className="w-5 h-5 mr-2" />
                    Clip Settings
                  </CardTitle>
                  <CardDescription>Customize how your clips are generated</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="tone">Content Tone</Label>
                      <Select value={selectedTone} onValueChange={setSelectedTone}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select tone" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="professional">Professional</SelectItem>
                          <SelectItem value="casual">Casual</SelectItem>
                          <SelectItem value="energetic">Energetic</SelectItem>
                          <SelectItem value="educational">Educational</SelectItem>
                          <SelectItem value="entertaining">Entertaining</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="duration">Clip Duration</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select duration" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="15">15 seconds</SelectItem>
                          <SelectItem value="30">30 seconds</SelectItem>
                          <SelectItem value="60">60 seconds</SelectItem>
                          <SelectItem value="90">90 seconds</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="custom-prompt">Custom Instructions (Optional)</Label>
                    <Textarea
                      id="custom-prompt"
                      placeholder="Describe what kind of clips you want to create..."
                      value={customPrompt}
                      onChange={(e) => setCustomPrompt(e.target.value)}
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Quick Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Videos Processed</span>
                    <span className="font-semibold">12</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Clips Generated</span>
                    <span className="font-semibold">48</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Total Downloads</span>
                    <span className="font-semibold">156</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Recent Activity</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <FileVideo className="w-4 h-4 text-green-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">Marketing Video.mp4</p>
                      <p className="text-xs text-gray-500">3 clips generated</p>
                    </div>
                    <span className="text-xs text-gray-400">2h ago</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <Download className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">Podcast Episode 12</p>
                      <p className="text-xs text-gray-500">Downloaded 5 clips</p>
                    </div>
                    <span className="text-xs text-gray-400">1d ago</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                      <Scissors className="w-4 h-4 text-purple-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">Tutorial Series</p>
                      <p className="text-xs text-gray-500">8 clips generated</p>
                    </div>
                    <span className="text-xs text-gray-400">3d ago</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Tips & Tricks</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-start space-x-2">
                      <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 flex-shrink-0" />
                      <p>Upload videos with clear audio for better caption accuracy</p>
                    </div>
                    <div className="flex items-start space-x-2">
                      <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 flex-shrink-0" />
                      <p>Use custom instructions to guide AI towards specific moments</p>
                    </div>
                    <div className="flex items-start space-x-2">
                      <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 flex-shrink-0" />
                      <p>Longer videos typically generate more diverse clips</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
