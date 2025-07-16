"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent } from "@/components/ui/card"
import { Upload, FileVideo, X, CheckCircle, AlertCircle } from "lucide-react"
import { storageService } from "@/lib/storage"
import { videoOperations } from "@/lib/supabase"

interface VideoUploadProps {
  userId: string
  onUploadComplete: (videoId: string) => void
  onUploadError: (error: string) => void
}

interface UploadProgress {
  file: File
  progress: number
  status: "uploading" | "processing" | "completed" | "error"
  error?: string
  videoId?: string
}

export function VideoUpload({ userId, onUploadComplete, onUploadError }: VideoUploadProps) {
  const [uploads, setUploads] = useState<UploadProgress[]>([])

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const newUploads: UploadProgress[] = acceptedFiles.map((file) => ({
        file,
        progress: 0,
        status: "uploading" as const,
      }))

      setUploads((prev) => [...prev, ...newUploads])

      // Process each file
      for (let i = 0; i < acceptedFiles.length; i++) {
        const file = acceptedFiles[i]
        const uploadIndex = uploads.length + i

        try {
          // Simulate upload progress
          const progressInterval = setInterval(() => {
            setUploads((prev) =>
              prev.map((upload, index) =>
                index === uploadIndex && upload.status === "uploading"
                  ? { ...upload, progress: Math.min(upload.progress + 10, 90) }
                  : upload,
              ),
            )
          }, 200)

          // Upload to Supabase Storage
          const { path, error } = await storageService.uploadVideo(file, userId)

          clearInterval(progressInterval)

          if (error) {
            throw new Error(error)
          }

          // Create video record in database
          const { data: video, error: dbError } = await videoOperations.create({
            user_id: userId,
            title: file.name.replace(/\.[^/.]+$/, ""),
            original_filename: file.name,
            file_path: path,
            file_size: file.size,
            status: "uploaded",
            processing_progress: 0,
          })

          if (dbError) {
            throw new Error(dbError.message)
          }

          // Update upload status
          setUploads((prev) =>
            prev.map((upload, index) =>
              index === uploadIndex
                ? {
                    ...upload,
                    progress: 100,
                    status: "completed" as const,
                    videoId: video.id,
                  }
                : upload,
            ),
          )

          onUploadComplete(video.id)
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : "Upload failed"

          setUploads((prev) =>
            prev.map((upload, index) =>
              index === uploadIndex
                ? {
                    ...upload,
                    status: "error" as const,
                    error: errorMessage,
                  }
                : upload,
            ),
          )

          onUploadError(errorMessage)
        }
      }
    },
    [userId, uploads.length, onUploadComplete, onUploadError],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "video/*": [".mp4", ".mov", ".avi", ".mkv", ".webm"],
    },
    maxSize: 2 * 1024 * 1024 * 1024, // 2GB
    multiple: true,
  })

  const removeUpload = (index: number) => {
    setUploads((prev) => prev.filter((_, i) => i !== index))
  }

  const getStatusIcon = (status: UploadProgress["status"]) => {
    switch (status) {
      case "uploading":
      case "processing":
        return <Upload className="w-4 h-4 animate-spin" />
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case "error":
        return <AlertCircle className="w-4 h-4 text-red-500" />
    }
  }

  const getStatusColor = (status: UploadProgress["status"]) => {
    switch (status) {
      case "uploading":
      case "processing":
        return "bg-blue-500"
      case "completed":
        return "bg-green-500"
      case "error":
        return "bg-red-500"
    }
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-6">
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragActive
                ? "border-purple-400 bg-purple-50"
                : "border-gray-300 hover:border-purple-400 hover:bg-gray-50"
            }`}
          >
            <input {...getInputProps()} />
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <div className="space-y-2">
              <p className="text-lg font-medium">{isDragActive ? "Drop your videos here" : "Drop your videos here"}</p>
              <p className="text-sm text-gray-500">or click to browse files</p>
              <p className="text-xs text-gray-400">Supports MP4, MOV, AVI, MKV, WebM up to 2GB each</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {uploads.length > 0 && (
        <div className="space-y-3">
          {uploads.map((upload, index) => (
            <Card key={index}>
              <CardContent className="p-4">
                <div className="flex items-center space-x-4">
                  <FileVideo className="w-8 h-8 text-purple-600 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium truncate">{upload.file.name}</p>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(upload.status)}
                        <Button variant="ghost" size="sm" onClick={() => removeUpload(index)} className="h-6 w-6 p-0">
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>{(upload.file.size / (1024 * 1024)).toFixed(1)} MB</span>
                        <span>
                          {upload.status === "completed"
                            ? "Upload complete"
                            : upload.status === "error"
                              ? "Upload failed"
                              : `${upload.progress}%`}
                        </span>
                      </div>
                      <Progress value={upload.status === "completed" ? 100 : upload.progress} className="h-1" />
                      {upload.error && <p className="text-xs text-red-500 mt-1">{upload.error}</p>}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
