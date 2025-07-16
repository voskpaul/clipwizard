import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Server-side client for admin operations
export const createServerClient = () => {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
}

// Database types
export interface User {
  id: string
  email: string
  name: string
  plan: "free" | "pro"
  credits_remaining: number
  stripe_customer_id?: string
  created_at: string
  updated_at: string
}

export interface Video {
  id: string
  user_id: string
  title: string
  original_filename: string
  file_path: string
  file_size: number
  duration?: number
  status: "uploaded" | "processing" | "completed" | "failed"
  processing_progress: number
  created_at: string
  updated_at: string
}

export interface Clip {
  id: string
  video_id: string
  title: string
  start_time: number
  end_time: number
  file_path: string
  thumbnail_path?: string
  download_count: number
  created_at: string
}

export interface ProcessingJob {
  id: string
  video_id: string
  job_type: "transcription" | "analysis" | "clipping"
  status: "pending" | "running" | "completed" | "failed"
  progress: number
  error_message?: string
  result_data?: any
  created_at: string
  updated_at: string
}

// Auth helpers
export const signUp = async (email: string, password: string, name: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
      },
    },
  })
  return { data, error }
}

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  return { data, error }
}

export const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  return { error }
}

export const getCurrentUser = async () => {
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return user
}

// Database operations
export const userOperations = {
  async create(userData: Omit<User, "id" | "created_at" | "updated_at">) {
    const { data, error } = await supabase.from("users").insert([userData]).select().single()
    return { data, error }
  },

  async findById(id: string) {
    const { data, error } = await supabase.from("users").select("*").eq("id", id).single()
    return { data, error }
  },

  async updateCredits(userId: string, credits: number) {
    const { data, error } = await supabase.from("users").update({ credits_remaining: credits }).eq("id", userId)
    return { data, error }
  },
}

export const videoOperations = {
  async create(videoData: Omit<Video, "id" | "created_at" | "updated_at">) {
    const { data, error } = await supabase.from("videos").insert([videoData]).select().single()
    return { data, error }
  },

  async findByUserId(userId: string) {
    const { data, error } = await supabase
      .from("videos")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
    return { data, error }
  },

  async updateStatus(videoId: string, status: Video["status"], progress?: number) {
    const updateData: any = { status, updated_at: new Date().toISOString() }
    if (progress !== undefined) {
      updateData.processing_progress = progress
    }

    const { data, error } = await supabase.from("videos").update(updateData).eq("id", videoId)
    return { data, error }
  },
}

export const clipOperations = {
  async create(clipData: Omit<Clip, "id" | "created_at">) {
    const { data, error } = await supabase.from("clips").insert([clipData]).select().single()
    return { data, error }
  },

  async findByVideoId(videoId: string) {
    const { data, error } = await supabase
      .from("clips")
      .select("*")
      .eq("video_id", videoId)
      .order("start_time", { ascending: true })
    return { data, error }
  },

  async incrementDownloadCount(clipId: string) {
    const { data, error } = await supabase.rpc("increment_download_count", { clip_id: clipId })
    return { data, error }
  },
}

// Real-time subscriptions
export const subscribeToVideoUpdates = (videoId: string, callback: (payload: any) => void) => {
  return supabase
    .channel(`video-${videoId}`)
    .on(
      "postgres_changes",
      {
        event: "UPDATE",
        schema: "public",
        table: "videos",
        filter: `id=eq.${videoId}`,
      },
      callback,
    )
    .subscribe()
}

export const subscribeToProcessingJobs = (videoId: string, callback: (payload: any) => void) => {
  return supabase
    .channel(`processing-${videoId}`)
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "processing_jobs",
        filter: `video_id=eq.${videoId}`,
      },
      callback,
    )
    .subscribe()
}
