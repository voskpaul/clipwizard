import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export interface TranscriptionSegment {
  start: number
  end: number
  text: string
}

export interface VideoAnalysis {
  keyMoments: Array<{
    startTime: number
    endTime: number
    title: string
    description: string
    confidence: number
    reason: string
  }>
  summary: string
  tags: string[]
  sentiment: "positive" | "neutral" | "negative"
}

export class OpenAIService {
  async transcribeAudio(audioBuffer: ArrayBuffer): Promise<{ text: string; segments: TranscriptionSegment[] }> {
    try {
      // Note: This is a simplified example. In production, you'd use OpenAI's Whisper API
      // or a similar service that accepts audio files directly

      const response = await fetch("https://api.openai.com/v1/audio/transcriptions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "multipart/form-data",
        },
        body: new FormData(),
      })

      // Mock response for demo
      const mockTranscription = {
        text: "Welcome to our marketing strategy session. Today we'll be discussing our Q1 goals and objectives. First, let's look at our current market position. We've seen a 15% increase in user engagement. Our main focus should be on customer acquisition and retention strategies.",
        segments: [
          {
            start: 0,
            end: 30,
            text: "Welcome to our marketing strategy session. Today we'll be discussing our Q1 goals and objectives.",
          },
          {
            start: 30,
            end: 60,
            text: "First, let's look at our current market position. We've seen a 15% increase in user engagement.",
          },
          { start: 60, end: 90, text: "Our main focus should be on customer acquisition and retention strategies." },
        ],
      }

      return mockTranscription
    } catch (error) {
      console.error("Transcription error:", error)
      throw new Error("Failed to transcribe audio")
    }
  }

  async analyzeContent(
    transcript: string,
    options: {
      tone?: string
      duration?: number
      customPrompt?: string
    } = {},
  ): Promise<VideoAnalysis> {
    try {
      const prompt = `
        Analyze the following video transcript and identify the most engaging moments for short-form social media content.
        
        Requirements:
        - Target tone: ${options.tone || "professional"}
        - Target clip duration: ${options.duration || 60} seconds
        - Additional instructions: ${options.customPrompt || "Focus on key insights and actionable content"}
        
        Transcript: "${transcript}"
        
        Please provide a JSON response with:
        1. keyMoments: Array of 3-5 key moments with startTime, endTime, title, description, confidence (0-1), and reason
        2. summary: Brief summary of the content
        3. tags: Relevant tags for the content
        4. sentiment: Overall sentiment (positive/neutral/negative)
        
        Focus on moments that would be most engaging for social media audiences.
      `

      const { text } = await generateText({
        model: openai("gpt-4o"),
        prompt,
        temperature: 0.7,
      })

      // Parse the response
      try {
        const analysis = JSON.parse(text)
        return analysis
      } catch (parseError) {
        // Fallback if JSON parsing fails
        return this.createFallbackAnalysis(transcript)
      }
    } catch (error) {
      console.error("Content analysis error:", error)
      return this.createFallbackAnalysis(transcript)
    }
  }

  async generateClipTitles(segments: Array<{ startTime: number; endTime: number; text: string }>): Promise<string[]> {
    try {
      const prompt = `
        Generate engaging, clickable titles for these video segments. Make them concise, attention-grabbing, and suitable for social media.
        
        Segments:
        ${segments.map((seg, i) => `${i + 1}. "${seg.text}"`).join("\n")}
        
        Return only the titles, one per line.
      `

      const { text } = await generateText({
        model: openai("gpt-4o"),
        prompt,
        temperature: 0.8,
      })

      return text.split("\n").filter((title) => title.trim().length > 0)
    } catch (error) {
      console.error("Title generation error:", error)
      return segments.map((_, i) => `Clip ${i + 1}`)
    }
  }

  async generateCaptions(text: string, style: "minimal" | "engaging" | "professional" = "engaging"): Promise<string> {
    try {
      const stylePrompts = {
        minimal: "Create simple, clean captions with minimal text",
        engaging: "Create dynamic, engaging captions with emojis and emphasis",
        professional: "Create professional, clear captions suitable for business content",
      }

      const prompt = `
        Convert this text into engaging video captions suitable for short-form content.
        Style: ${stylePrompts[style]}
        
        Text: "${text}"
        
        Format the captions with proper timing and visual appeal. Use line breaks for readability.
      `

      const { text: captions } = await generateText({
        model: openai("gpt-4o"),
        prompt,
        temperature: 0.6,
      })

      return captions
    } catch (error) {
      console.error("Caption generation error:", error)
      return text // Fallback to original text
    }
  }

  private createFallbackAnalysis(transcript: string): VideoAnalysis {
    const words = transcript.split(" ")
    const duration = Math.min(words.length * 0.5, 300) // Estimate duration

    return {
      keyMoments: [
        {
          startTime: 0,
          endTime: Math.min(30, duration),
          title: "Opening Statement",
          description: "Key opening points",
          confidence: 0.7,
          reason: "Strong opening content",
        },
        {
          startTime: Math.floor(duration * 0.3),
          endTime: Math.floor(duration * 0.6),
          title: "Main Content",
          description: "Core message delivery",
          confidence: 0.8,
          reason: "Central content focus",
        },
        {
          startTime: Math.floor(duration * 0.7),
          endTime: Math.floor(duration),
          title: "Key Takeaway",
          description: "Important conclusion",
          confidence: 0.75,
          reason: "Strong closing message",
        },
      ],
      summary: transcript.substring(0, 200) + "...",
      tags: ["business", "strategy", "insights"],
      sentiment: "positive",
    }
  }
}

export const openaiService = new OpenAIService()
