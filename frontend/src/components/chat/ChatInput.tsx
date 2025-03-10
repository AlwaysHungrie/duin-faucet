import { useCallback, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Send, Paperclip, X } from 'lucide-react'
import axios from 'axios'
import { usePrivyAuth } from '@/hooks/usePrivyAuth'

export default function ChatInput({
  value,
  onChange,
  onSubmit,
  disabled,
  allowAttestations,
}: {
  value: string
  onChange: (value: string) => void
  onSubmit: (
    e: React.FormEvent<HTMLFormElement>,
    filesData: { name: string; url: string }[]
  ) => void
  disabled: boolean
  allowAttestations: boolean
}) {
  const { jwtToken } = usePrivyAuth()
  const [files, setFiles] = useState<File[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<
    { name: string; url: string }[]
  >([])
  const [uploadProgress, setUploadProgress] = useState<{
    [key: string]: number
  }>({})

  const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      e.preventDefault()
      if (!e.target.files || e.target.files.length === 0) return

      const selectedFiles = Array.from(e.target.files)
      setFiles((prev) => [...prev, ...selectedFiles])

      // Initialize progress for each file
      const initialProgress = selectedFiles.reduce((acc, file) => {
        acc[file.name] = 0
        return acc
      }, {} as { [key: string]: number })

      setUploadProgress((prev) => ({ ...prev, ...initialProgress }))

      const uploadUrls = await Promise.all(
        selectedFiles.map(async (file) => {
          const fileType = file.type || 'application/octet-stream'
          console.log('fileType', fileType)
          const response = await axios.get(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/chat/upload-url?fileKey=${file.name}&fileType=${fileType}`,
            {
              headers: {
                Authorization: `Bearer ${jwtToken}`,
              },
            }
          )
          return response.data.url
        })
      )

      console.log('uploadUrls', uploadUrls)

      // Start upload process
      setIsUploading(true)

      try {
        const uploadPromises = uploadUrls.map(async (url, index) => {
          const file = selectedFiles[index]
          const fileType = file.type ?? 'application/octet-stream'
          const response = await axios.put(url.uploadUrl, file, {
            headers: {
              'Content-Type': fileType,
            },
            // This is important to show upload progress and handle timeouts for large files
            onUploadProgress: (progressEvent) => {
              const percentCompleted = Math.round(
                (progressEvent.loaded * 100) / (progressEvent.total ?? 1)
              )
              console.log(
                `Upload progress for ${file.name}: ${percentCompleted}%`
              )
              setUploadProgress((prev) => ({
                ...prev,
                [file.name]: percentCompleted,
              }))
            },
          })

          // Add to uploaded files when complete
          setUploadedFiles((prev) => [
            ...prev,
            {
              name: file.name,
              url: url.publicUrl || url.uploadUrl.split('?')[0],
            },
          ])

          return response.data
        })

        await Promise.all(uploadPromises)
        console.log('Files uploaded successfully')

        // Clear files array since they're now in uploadedFiles
        setFiles([])
      } catch (error) {
        console.error('Error uploading files:', error)
      } finally {
        setIsUploading(false)
      }
    },
    [jwtToken]
  )

  const removeFile = (fileName: string, isUploaded: boolean) => {
    if (isUploaded) {
      setUploadedFiles((prev) => prev.filter((file) => file.name !== fileName))
    } else {
      setFiles((prev) => prev.filter((file) => file.name !== fileName))
      setUploadProgress((prev) => {
        const newProgress = { ...prev }
        delete newProgress[fileName]
        return newProgress
      })
    }
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (disabled || isUploading) return

    // Now we pass both the message and the uploaded file URLs
    const filesData = uploadedFiles.map((file) => ({
      name: file.name,
      url: file.url,
    }))
    onSubmit(e, filesData)

    // Clear uploaded files after submission if needed
    setUploadedFiles([])
  }

  const getFilePreviewContent = (file: File) => {
    // Default preview for other file types
    return (
      <div className="h-16 w-16 flex items-center justify-center bg-gray-100 rounded">
        <span className="text-xs font-medium">
          {file.name.split('.').pop()?.toUpperCase()}
        </span>
      </div>
    )
  }

  return (
    <div className="p-2 sm:p-3 bg-white border-t sticky bottom-0 z-10">
      {/* File Preview Area */}
      {(files.length > 0 || uploadedFiles.length > 0) && (
        <div className="flex flex-wrap gap-3 mb-3 max-h-32 overflow-y-auto p-2">
          {/* Files being uploaded */}
          {files.map((file) => (
            <div key={`uploading-${file.name}`} className="relative group">
              <div className="relative">
                {getFilePreviewContent(file)}
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded">
                  <div className="w-12 h-12 relative">
                    {/* Circular progress indicator */}
                    <svg className="w-full h-full" viewBox="0 0 36 36">
                      <circle
                        cx="18"
                        cy="18"
                        r="16"
                        fill="none"
                        className="stroke-gray-200"
                        strokeWidth="2"
                      />
                      <circle
                        cx="18"
                        cy="18"
                        r="16"
                        fill="none"
                        className="stroke-blue-500"
                        strokeWidth="2"
                        strokeDasharray="100"
                        strokeDashoffset={
                          100 - (uploadProgress[file.name] || 0)
                        }
                        transform="rotate(-90 18 18)"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-white text-xs font-medium">
                        {uploadProgress[file.name] || 0}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => removeFile(file.name, false)}
              >
                <X className="h-3 w-3" />
              </Button>
              <div className="mt-1 text-xs text-center truncate max-w-16">
                {file.name.length > 15
                  ? `${file.name.substring(0, 12)}...`
                  : file.name}
              </div>
            </div>
          ))}

          {/* Uploaded files */}
          {uploadedFiles.map((file) => (
            <div key={`uploaded-${file.name}`} className="relative group">
              <div className="h-16 w-16 flex items-center justify-center bg-gray-100 rounded">
                <span className="text-xs font-medium">
                  {file.name.split('.').pop()?.toUpperCase()}
                </span>
              </div>
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => removeFile(file.name, true)}
              >
                <X className="h-3 w-3" />
              </Button>
              <div className="mt-1 text-xs text-center truncate max-w-16">
                {file.name.length > 15
                  ? `${file.name.substring(0, 12)}...`
                  : file.name}
              </div>
            </div>
          ))}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="flex items-center gap-1 sm:gap-2"
      >
        {allowAttestations && (
          <>
            <input
              type="file"
              id="file-upload"
              multiple
              className="hidden"
              onChange={handleFileChange}
              disabled={disabled || isUploading}
            />
            <label htmlFor="file-upload">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className={`${isUploading ? 'opacity-50' : ''} flex`}
                disabled={disabled || isUploading}
                onClick={() => {
                  document.getElementById('file-upload')?.click()
                }}
              >
                <Paperclip className="h-5 w-5 text-gray-500" />
              </Button>
            </label>
          </>
        )}

        <Input
          placeholder={isUploading ? 'Uploading files...' : 'Type a message'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 rounded-full text-sm sm:text-base h-9 sm:h-10 focus-visible:ring-0 focus-visible:border-gray-400"
          disabled={disabled || isUploading}
        />

        <Button
          type="submit"
          variant="ghost"
          size="icon"
          className={`rounded-full h-9 w-9 sm:h-10 sm:w-10 ${
            value.trim() && !isUploading
              ? 'bg-blue-500 text-white hover:bg-blue-600 hover:text-white'
              : 'bg-transparent text-gray-500 hover:bg-gray-100 hover:text-gray-600'
          }`}
          disabled={disabled || isUploading || value.trim() === ''}
        >
          <Send className="h-4 w-4 sm:h-5 sm:w-5" />
        </Button>
      </form>
    </div>
  )
}
