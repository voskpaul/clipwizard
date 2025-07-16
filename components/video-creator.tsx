"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Play, Pause, SkipBack, SkipForward, Volume2, Scissors, Sparkles, Download, Share2, Eye } from "lucide-react"

interface VideoCreatorProps {
  videoId: string
  clips: Array<{
    id: string
    title: string
    startTime: number
    endTime: number
    thumbnail: string
  }>
}

export function VideoCreator({ videoId, clips }: VideoCreatorProps) {
  const [selectedClip, setSelectedClip] = useState(clips[0])
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [volume, setVolume] = useState([80])
  const [settings, setSettings] = useState({
    title: selectedClip?.title || "",
    description: "",
    aspectRatio: "9:16",
    quality: "1080p",
    addCaptions: true,
    addMusic: false,
    musicVolume: 30,
    captionStyle: "modern",
    backgroundColor: "#000000",
    textColor: "#ffffff",
    fontFamily: "Inter",
    fontSize: 24,
  })

  const aspectRatios = [
    { value: "9:16", label: "9:16 (TikTok, Instagram Reels)", icon: "📱" },
    { value: "16:9", label: "16:9 (YouTube, Landscape)", icon: "🖥️" },
    { value: "1:1", label: "1:1 (Instagram Square)", icon: "⬜" },
    { value: "4:5", label: "4:5 (Instagram Portrait)", icon: "📐" },
  ]

  const captionStyles = [
    { value: "modern", label: "Modern", preview: "Clean and minimal" },
    { value: "bold", label: "Bold", preview: "Large and impactful" },
    { value: "neon", label: "Neon", preview: "Glowing effects" },
    { value: "classic", label: "Classic", preview: "Traditional style" },
  ]

  const musicTracks = [
    { value: "upbeat", label: "Upbeat Energy", duration: "2:30" },
    { value: "corporate", label: "Corporate Motivation", duration: "3:15" },
    { value: "chill", label: "Chill Vibes", duration: "2:45" },
    { value: "dramatic", label: "Dramatic Build", duration: "2:20" },
  ]

  const handleExport = async () => {
    // Export logic here
    console.log("Exporting video with settings:", settings)
  }

  const duration = selectedClip ? selectedClip.endTime - selectedClip.startTime : 0

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      {/* Video Preview */}
      <div className="lg:col-span-2 space-y-6">
        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Video Preview</span>
              <div className="flex items-center space-x-2">
                <Badge variant="outline">{settings.aspectRatio}</Badge>
                <Badge variant="outline">{settings.quality}</Badge>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              {/* Video Player */}
              <div
                className="relative mx-auto bg-black rounded-lg overflow-hidden shadow-2xl"
                style={{
                  aspectRatio:
                    settings.aspectRatio === "9:16"
                      ? "9/16"
                      : settings.aspectRatio === "16:9"
                        ? "16/9"
                        : settings.aspectRatio === "1:1"
                          ? "1/1"
                          : "4/5",
                  maxHeight: "500px",
                }}
              >
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-purple-900/20 to-blue-900/20">
                  <div className="text-center text-white">
                    <Play className="w-16 h-16 mx-auto mb-4 opacity-80" />
                    <p className="text-lg font-medium">{selectedClip?.title}</p>
                    <p className="text-sm opacity-60">
                      {Math.floor(duration / 60)}:{(duration % 60).toString().padStart(2, "0")}
                    </p>
                  </div>
                </div>

                {/* Caption Preview */}
                {settings.addCaptions && (
                  <div className="absolute bottom-4 left-4 right-4">
                    <div
                      className={`text-center p-2 rounded ${
                        settings.captionStyle === "modern"
                          ? "bg-black/70 text-white"
                          : settings.captionStyle === "bold"
                            ? "bg-white text-black font-bold text-xl"
                            : settings.captionStyle === "neon"
                              ? "bg-purple-600/80 text-white shadow-lg shadow-purple-500/50"
                              : "bg-gray-800/80 text-white"
                      }`}
                      style={{
                        fontFamily: settings.fontFamily,
                        fontSize: `${settings.fontSize}px`,
                        color: settings.textColor,
                      }}
                    >
                      Sample caption text appears here
                    </div>
                  </div>
                )}
              </div>

              {/* Video Controls */}
              <div className="mt-4 space-y-4">
                <div className="flex items-center space-x-4">
                  <Button size="sm" variant="outline" onClick={() => setIsPlaying(!isPlaying)}>
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </Button>
                  <Button size="sm" variant="outline">
                    <SkipBack className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="outline">
                    <SkipForward className="w-4 h-4" />
                  </Button>
                  <div className="flex-1">
                    <Slider
                      value={[currentTime]}
                      onValueChange={(value) => setCurrentTime(value[0])}
                      max={duration}
                      step={1}
                      className="w-full"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Volume2 className="w-4 h-4" />
                    <Slider value={volume} onValueChange={setVolume} max={100} step={1} className="w-20" />
                  </div>
                </div>
                <div className="text-center text-sm text-muted-foreground">
                  {Math.floor(currentTime / 60)}:{(currentTime % 60).toString().padStart(2, "0")} /{" "}
                  {Math.floor(duration / 60)}:{(duration % 60).toString().padStart(2, "0")}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Clip Selection */}
        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Scissors className="w-5 h-5 mr-2" />
              Available Clips
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {clips.map((clip) => (
                <div
                  key={clip.id}
                  className={`relative cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                    selectedClip?.id === clip.id ? "border-primary shadow-lg" : "border-border hover:border-primary/50"
                  }`}
                  onClick={() => setSelectedClip(clip)}
                >
                  <div className="aspect-video bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/20 dark:to-blue-900/20 flex items-center justify-center">
                    <Play className="w-8 h-8 text-primary" />
                  </div>
                  <div className="p-2">
                    <p className="text-sm font-medium truncate">{clip.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {Math.floor((clip.endTime - clip.startTime) / 60)}:
                      {((clip.endTime - clip.startTime) % 60).toString().padStart(2, "0")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Settings Panel */}
      <div className="space-y-6">
        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
          <CardHeader>
            <CardTitle>Video Settings</CardTitle>
            <CardDescription>Customize your video output</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="basic">Basic</TabsTrigger>
                <TabsTrigger value="style">Style</TabsTrigger>
                <TabsTrigger value="audio">Audio</TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Video Title</Label>
                  <Input
                    id="title"
                    value={settings.title}
                    onChange={(e) => setSettings({ ...settings, title: e.target.value })}
                    placeholder="Enter video title"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={settings.description}
                    onChange={(e) => setSettings({ ...settings, description: e.target.value })}
                    placeholder="Add a description..."
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Aspect Ratio</Label>
                  <Select
                    value={settings.aspectRatio}
                    onValueChange={(value) => setSettings({ ...settings, aspectRatio: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {aspectRatios.map((ratio) => (
                        <SelectItem key={ratio.value} value={ratio.value}>
                          <div className="flex items-center space-x-2">
                            <span>{ratio.icon}</span>
                            <span>{ratio.label}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Quality</Label>
                  <Select
                    value={settings.quality}
                    onValueChange={(value) => setSettings({ ...settings, quality: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="720p">720p HD</SelectItem>
                      <SelectItem value="1080p">1080p Full HD</SelectItem>
                      <SelectItem value="4k">4K Ultra HD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </TabsContent>

              <TabsContent value="style" className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="captions">Add Captions</Label>
                  <Switch
                    id="captions"
                    checked={settings.addCaptions}
                    onCheckedChange={(checked) => setSettings({ ...settings, addCaptions: checked })}
                  />
                </div>

                {settings.addCaptions && (
                  <>
                    <div className="space-y-2">
                      <Label>Caption Style</Label>
                      <Select
                        value={settings.captionStyle}
                        onValueChange={(value) => setSettings({ ...settings, captionStyle: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {captionStyles.map((style) => (
                            <SelectItem key={style.value} value={style.value}>
                              <div>
                                <div className="font-medium">{style.label}</div>
                                <div className="text-xs text-muted-foreground">{style.preview}</div>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Font Size</Label>
                      <Slider
                        value={[settings.fontSize]}
                        onValueChange={(value) => setSettings({ ...settings, fontSize: value[0] })}
                        min={16}
                        max={48}
                        step={2}
                        className="w-full"
                      />
                      <div className="text-xs text-muted-foreground text-center">{settings.fontSize}px</div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="textColor">Text Color</Label>
                        <Input
                          id="textColor"
                          type="color"
                          value={settings.textColor}
                          onChange={(e) => setSettings({ ...settings, textColor: e.target.value })}
                          className="h-10"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="backgroundColor">Background</Label>
                        <Input
                          id="backgroundColor"
                          type="color"
                          value={settings.backgroundColor}
                          onChange={(e) => setSettings({ ...settings, backgroundColor: e.target.value })}
                          className="h-10"
                        />
                      </div>
                    </div>
                  </>
                )}
              </TabsContent>

              <TabsContent value="audio" className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="music">Add Background Music</Label>
                  <Switch
                    id="music"
                    checked={settings.addMusic}
                    onCheckedChange={(checked) => setSettings({ ...settings, addMusic: checked })}
                  />
                </div>

                {settings.addMusic && (
                  <>
                    <div className="space-y-2">
                      <Label>Music Track</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose a track" />
                        </SelectTrigger>
                        <SelectContent>
                          {musicTracks.map((track) => (
                            <SelectItem key={track.value} value={track.value}>
                              <div className="flex justify-between w-full">
                                <span>{track.label}</span>
                                <span className="text-xs text-muted-foreground ml-2">{track.duration}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Music Volume</Label>
                      <Slider
                        value={[settings.musicVolume]}
                        onValueChange={(value) => setSettings({ ...settings, musicVolume: value[0] })}
                        max={100}
                        step={5}
                        className="w-full"
                      />
                      <div className="text-xs text-muted-foreground text-center">{settings.musicVolume}%</div>
                    </div>
                  </>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Export Actions */}
        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
          <CardHeader>
            <CardTitle>Export & Share</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={handleExport}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Generate Video
            </Button>

            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" size="sm">
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </Button>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            </div>

            <Button variant="outline" className="w-full">
              <Share2 className="w-4 h-4 mr-2" />
              Share to Social Media
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
