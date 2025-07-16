import { type NextRequest, NextResponse } from "next/server"
import { videoOperations, clipOperations } from "@/lib/supabase"
import { openaiService } from "@/lib/openai"

export async function POST(request: NextRequest) {
  try {
    const { videoId, tone, customPrompt } = await request.json()

    if (!videoId) {
      return NextResponse.json({ error: "Video ID is required" }, { status: 400 })
    }

    // Update video status to processing
    await videoOperations.updateStatus(videoId, "processing", 0)

    // Start background processing
    processVideoInBackground(videoId, { tone, customPrompt })

    return NextResponse.json({
      success: true,
      message: "Video processing started",
      videoId,
    })
  } catch (error) {
    console.error("Video processing error:", error)
    return NextResponse.json({ error: "Failed to start processing" }, { status: 500 })
  }
}

async function processVideoInBackground(videoId: string, options: { tone?: string; customPrompt?: string }) {
  try {
    // Simulate processing stages with real-time updates

    // Stage 1: Transcription (0-30%)
    await videoOperations.updateStatus(videoId, "processing", 10)
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Mock transcription
    const transcription = await openaiService.transcribeAudio(new ArrayBuffer(0))
    await videoOperations.updateStatus(videoId, "processing", 30)

    // Stage 2: Analysis (30-70%)
    await new Promise((resolve) => setTimeout(resolve, 3000))
    const analysis = await openaiService.analyzeContent(transcription.text, options)
    await videoOperations.updateStatus(videoId, "processing", 70)

    // Stage 3: Clip Generation (70-100%)
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Create clips in database
    for (const moment of analysis.keyMoments) {
      await clipOperations.create({
        video_id: videoId,
        title: moment.title,
        start_time: moment.startTime,
        end_time: moment.endTime,
        file_path: `clips/${videoId}/${moment.title.replace(/\s+/g, "_")}.mp4`,
        thumbnail_path: `thumbnails/${videoId}/${moment.title.replace(/\s+/g, "_")}.jpg`,
        download_count: 0,
      })
    }

    // Mark as completed
    await videoOperations.updateStatus(videoId, "completed", 100)
  } catch (error) {
    console.error("Background processing error:", error)
    await videoOperations.updateStatus(videoId, "failed", 0)
  }
}
