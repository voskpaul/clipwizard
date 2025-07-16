import { supabase } from "./supabase"

export class StorageService {
  private bucketName = "videos"

  async uploadVideo(file: File, userId: string): Promise<{ path: string; error?: string }> {
    try {
      const fileExt = file.name.split(".").pop()
      const fileName = `${userId}/${Date.now()}.${fileExt}`

      const { data, error } = await supabase.storage.from(this.bucketName).upload(fileName, file, {
        cacheControl: "3600",
        upsert: false,
      })

      if (error) {
        throw error
      }

      return { path: data.path }
    } catch (error) {
      console.error("Upload error:", error)
      return { path: "", error: error instanceof Error ? error.message : "Upload failed" }
    }
  }

  async uploadClip(file: Blob, videoId: string, clipName: string): Promise<{ path: string; error?: string }> {
    try {
      const fileName = `clips/${videoId}/${clipName}.mp4`

      const { data, error } = await supabase.storage.from(this.bucketName).upload(fileName, file, {
        cacheControl: "3600",
        upsert: true,
      })

      if (error) {
        throw error
      }

      return { path: data.path }
    } catch (error) {
      console.error("Clip upload error:", error)
      return { path: "", error: error instanceof Error ? error.message : "Upload failed" }
    }
  }

  async uploadThumbnail(file: Blob, videoId: string, clipName: string): Promise<{ path: string; error?: string }> {
    try {
      const fileName = `thumbnails/${videoId}/${clipName}.jpg`

      const { data, error } = await supabase.storage.from(this.bucketName).upload(fileName, file, {
        cacheControl: "3600",
        upsert: true,
      })

      if (error) {
        throw error
      }

      return { path: data.path }
    } catch (error) {
      console.error("Thumbnail upload error:", error)
      return { path: "", error: error instanceof Error ? error.message : "Upload failed" }
    }
  }

  getPublicUrl(path: string): string {
    const { data } = supabase.storage.from(this.bucketName).getPublicUrl(path)

    return data.publicUrl
  }

  async deleteFile(path: string): Promise<{ error?: string }> {
    try {
      const { error } = await supabase.storage.from(this.bucketName).remove([path])

      if (error) {
        throw error
      }

      return {}
    } catch (error) {
      console.error("Delete error:", error)
      return { error: error instanceof Error ? error.message : "Delete failed" }
    }
  }

  async createSignedUrl(path: string, expiresIn = 3600): Promise<{ url?: string; error?: string }> {
    try {
      const { data, error } = await supabase.storage.from(this.bucketName).createSignedUrl(path, expiresIn)

      if (error) {
        throw error
      }

      return { url: data.signedUrl }
    } catch (error) {
      console.error("Signed URL error:", error)
      return { error: error instanceof Error ? error.message : "Failed to create signed URL" }
    }
  }
}

export const storageService = new StorageService()
