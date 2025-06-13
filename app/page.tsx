"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useIOSDetection } from "@/hooks/use-ios-detection"
import {
  Download,
  Search,
  Music,
  Video,
  Camera,
  Share2,
  Play,
  Headphones,
  ExternalLink,
  Eye,
  Share,
  User,
  FileVideo,
  FileAudio,
  Loader2,
  QrCode,
  Palette,
  FileText,
  Users,
  Sticker,
  Calendar,
  Heart,
  Globe,
  MessageCircle,
  Info,
} from "lucide-react"
// Import the CopyLinkButton component
import { CopyLinkButton } from "@/components/copy-link-button"
// Import the IOSSaveInstructions component
import { IOSSaveInstructions } from "@/components/ios-save-instructions"

interface DownloadResult {
  success: boolean
  status: number
  author: string
  data?: {
    title?: string
    cover?: string
    play?: string
    music?: string
    size?: number
    play_count?: number
    share_count?: number
    download_count?: number
    author?: {
      id?: string
      unique_id?: string
      nickname?: string
      avatar?: string
      name?: string
      avatarUrl?: string
    }
    videoUrl?: string
    posterUrl?: string
    date?: string
    pengguna?: string
    likes?: string
    url?: string
  }
  result?: string | any[]
}

interface SearchResultItem {
  title?: string
  url?: string
  link?: string
  description?: string
  thumbnail?: string
  image?: string
  author?: string
  duration?: string
  views?: string
  members?: string
  category?: string
}

const downloadItems = [
  {
    name: "CapCut",
    icon: Video,
    category: "Video Editor",
    color: "from-slate-600 to-slate-800",
    endpoint: "capcut",
    type: "downloader",
  },
  {
    name: "Instagram",
    icon: Camera,
    category: "Social Media",
    color: "from-pink-600 to-pink-800",
    endpoint: "instagram",
    type: "downloader",
  },
  {
    name: "Spotify",
    icon: Music,
    category: "Music Streaming",
    color: "from-green-600 to-green-800",
    endpoint: "spotify",
    type: "downloader",
  },
  {
    name: "SnackVideo",
    icon: Play,
    category: "Video Platform",
    color: "from-rose-600 to-rose-800",
    endpoint: "snackvideo",
    type: "downloader",
  },
  {
    name: "SoundCloud",
    icon: Headphones,
    category: "Music Platform",
    color: "from-orange-600 to-orange-800",
    endpoint: "soundcloud",
    type: "downloader",
  },
  {
    name: "TikTok",
    icon: Video,
    category: "Social Media",
    color: "from-gray-800 to-black",
    endpoint: "tiktok",
    type: "downloader",
  },
  {
    name: "Twitter",
    icon: Share2,
    category: "Social Media",
    color: "from-sky-600 to-sky-800",
    endpoint: "twitter",
    type: "downloader",
  },
  {
    name: "Anime Search",
    icon: Video,
    category: "Entertainment",
    color: "from-purple-600 to-purple-800",
    endpoint: "bstation",
    type: "search",
    placeholder: "Search anime titles...",
  },
  {
    name: "Sticker Search",
    icon: Sticker,
    category: "Entertainment",
    color: "from-yellow-600 to-yellow-800",
    endpoint: "gif",
    type: "sticker",
    placeholder: "Search stickers...",
  },
  {
    name: "WhatsApp Groups",
    icon: Users,
    category: "Social Media",
    color: "from-green-600 to-green-800",
    endpoint: "grupwa",
    type: "search",
    placeholder: "Search WhatsApp groups...",
  },
  {
    name: "Text to QR",
    icon: QrCode,
    category: "Tools",
    color: "from-indigo-600 to-indigo-800",
    endpoint: "text2qr",
    type: "tools",
    placeholder: "Enter text to convert to QR code...",
  },
  {
    name: "Text to Ghibli",
    icon: Palette,
    category: "AI Tools",
    color: "from-emerald-600 to-emerald-800",
    endpoint: "text2ghibli",
    type: "tools",
    placeholder: "Describe your Ghibli-style image...",
  },
  {
    name: "YouTube Transcript",
    icon: FileText,
    category: "Tools",
    color: "from-red-600 to-red-800",
    endpoint: "yttranscript",
    type: "tools",
    placeholder: "Enter YouTube URL...",
  },
]

export default function FuturisticDownloadSite() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedApp, setSelectedApp] = useState<(typeof downloadItems)[0] | null>(null)
  const [downloadUrl, setDownloadUrl] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [downloadResult, setDownloadResult] = useState<DownloadResult | null>(null)
  const [searchResults, setSearchResults] = useState<SearchResultItem[]>([])
  const [error, setError] = useState("")
  const [imageResult, setImageResult] = useState("")

  const isIOS = useIOSDetection()

  const categories = ["All", ...Array.from(new Set(downloadItems.map((item) => item.category)))]

  const filteredItems = downloadItems.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleDownloadClick = (app: (typeof downloadItems)[0]) => {
    setSelectedApp(app)
    setIsModalOpen(true)
    setDownloadResult(null)
    setSearchResults([])
    setError("")
    setDownloadUrl("")
    setImageResult("")
  }

  const handleDownload = async () => {
    if (!downloadUrl || !selectedApp) return

    if (isIOS && selectedApp?.type === "downloader") {
      setError("iOS devices cannot download files directly. You'll be able to view the content instead.")
    }

    setIsLoading(true)
    setError("")
    setDownloadResult(null)
    setSearchResults([])
    setImageResult("")

    try {
      let apiUrl = ""

      if (selectedApp.type === "downloader") {
        const encodedUrl = encodeURIComponent(downloadUrl)
        apiUrl = `https://api.ferdev.my.id/downloader/${selectedApp.endpoint}?link=${encodedUrl}`
      } else if (selectedApp.type === "search") {
        const encodedQuery = encodeURIComponent(downloadUrl)
        apiUrl = `https://api.ferdev.my.id/search/${selectedApp.endpoint}?query=${encodedQuery}`
      } else if (selectedApp.type === "sticker") {
        const encodedQuery = encodeURIComponent(downloadUrl)
        apiUrl = `https://api.ferdev.my.id/sticker/${selectedApp.endpoint}?query=${encodedQuery}`
      } else if (selectedApp.type === "tools") {
        if (selectedApp.endpoint === "text2qr") {
          const encodedText = encodeURIComponent(downloadUrl)
          apiUrl = `https://api.ferdev.my.id/tools/${selectedApp.endpoint}?text=${encodedText}`
          setImageResult(apiUrl)
          setIsLoading(false)
          return
        } else if (selectedApp.endpoint === "text2ghibli") {
          const encodedPrompt = encodeURIComponent(downloadUrl)
          apiUrl = `https://api.ferdev.my.id/tools/${selectedApp.endpoint}?prompt=${encodedPrompt}`
          setImageResult(apiUrl)
          setIsLoading(false)
          return
        } else if (selectedApp.endpoint === "yttranscript") {
          const encodedLink = encodeURIComponent(downloadUrl)
          apiUrl = `https://api.ferdev.my.id/tools/${selectedApp.endpoint}?link=${encodedLink}`
        }
      }

      const response = await fetch(apiUrl)
      const data = await response.json()

      if (data.success || response.ok) {
        // Handle search results with proper mapping
        if (selectedApp.type === "search" || selectedApp.type === "sticker") {
          let results = []

          if (selectedApp.endpoint === "bstation" && data.result) {
            // Anime search - map to standard format
            results = data.result.map((item: any) => ({
              title: item.search || "Anime",
              url: item.videoUrl,
              link: item.videoUrl,
              description: item.description,
              thumbnail: item.imageUrl,
              image: item.imageUrl,
              views: item.views,
            }))
          } else if (selectedApp.endpoint === "gif" && data.result) {
            // Sticker search - map to standard format
            results = data.result.map((item: any) => ({
              title: item.alt || "GIF Sticker",
              url: item.link,
              link: item.link,
              description: item.alt,
              thumbnail: item.gif,
              image: item.gif,
            }))
          } else if (selectedApp.endpoint === "grupwa" && data.data) {
            // WhatsApp groups - map to standard format
            results = data.data.map((item: any) => ({
              title: item.title,
              url: item.link,
              link: item.link,
              description: item.desc,
              thumbnail: item.thumb,
              image: item.thumb,
            }))
          }

          if (results.length > 0) {
            setSearchResults(results)
          } else {
            setError("No results found for your search query.")
          }
        } else {
          setDownloadResult(data)
        }
      } else {
        setError("Failed to process the request. Please check your input and try again.")
      }
    } catch (err) {
      setError("Network error. Please check your connection and try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const getIOSMessage = (type: string) => {
    switch (type) {
      case "video":
        return "iOS devices cannot download videos directly. You can view the video in your browser or copy the link."
      case "audio":
        return "iOS devices cannot download audio directly. You can listen to the audio in your browser or copy the link."
      default:
        return "iOS devices have limited download capabilities. You can view the content in your browser."
    }
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedApp(null)
    setDownloadUrl("")
    setDownloadResult(null)
    setSearchResults([])
    setError("")
    setImageResult("")
  }

  const getInputLabel = () => {
    if (!selectedApp) return "Enter URL or text:"

    switch (selectedApp.type) {
      case "downloader":
        return `Paste your ${selectedApp.name} link here:`
      case "search":
        return `Search ${selectedApp.name.toLowerCase()}:`
      case "sticker":
        return "Search stickers:"
      case "tools":
        if (selectedApp.endpoint === "yttranscript") return "Enter YouTube URL:"
        return "Enter text:"
      default:
        return "Enter URL or text:"
    }
  }

  const openLink = (url: string) => {
    if (url && url !== "#") {
      window.open(url, "_blank", "noopener,noreferrer")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 to-black text-white">
      {/* Subtle Background Pattern */}
      <div className="fixed inset-0 opacity-30">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
                           radial-gradient(circle at 75% 75%, rgba(139, 92, 246, 0.1) 0%, transparent 50%)`,
          }}
        ></div>
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-white/5 bg-black/20 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="flex flex-col gap-6 sm:gap-8">
            {/* Title */}
            <div className="text-center">
              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-light tracking-tight text-white mb-2 sm:mb-3">
                Future<span className="font-bold text-blue-400">Load</span>
              </h1>
              <p className="text-gray-400 text-base sm:text-lg font-light">Premium app downloads, reimagined</p>
            </div>

            {/* Search */}
            <div className="relative max-w-md mx-auto w-full">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search applications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 h-12 bg-white/5 backdrop-blur-md border-white/10 text-white placeholder-gray-500 focus:border-blue-400/50 focus:ring-1 focus:ring-blue-400/25 rounded-xl"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Category Filter */}
      <div className="relative z-10 px-4 sm:px-6 lg:px-8 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap gap-2 sm:gap-3 justify-center">
            {categories.map((category) => (
              <Button
                key={category}
                variant="ghost"
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className={`
                  h-9 sm:h-10 px-4 sm:px-6 rounded-full border transition-all duration-200 font-medium text-sm
                  ${
                    selectedCategory === category
                      ? "bg-blue-500/20 text-blue-300 border-blue-400/50"
                      : "bg-white/5 text-gray-400 border-white/10 hover:bg-white/10 hover:text-white hover:border-white/20"
                  }
                `}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Download Grid */}
      <main className="relative z-10 px-4 sm:px-6 lg:px-8 pb-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
            {filteredItems.map((item, index) => {
              const IconComponent = item.icon
              return (
                <Card
                  key={item.name}
                  className="group relative overflow-hidden bg-white/5 backdrop-blur-sm border-white/10 hover:border-white/20 transition-all duration-300 hover:bg-white/10 rounded-xl sm:rounded-2xl"
                >
                  <CardContent className="p-4 sm:p-6 lg:p-8">
                    <div className="flex flex-col items-center text-center space-y-3 sm:space-y-4">
                      {/* Icon */}
                      <div
                        className={`w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-br ${item.color} p-3 sm:p-4 group-hover:scale-105 transition-transform duration-200`}
                      >
                        <IconComponent className="w-full h-full text-white" />
                      </div>

                      {/* Content */}
                      <div className="space-y-1 sm:space-y-2">
                        <h3 className="text-sm sm:text-lg lg:text-xl font-semibold text-white leading-tight">
                          {item.name}
                        </h3>
                        <p className="text-gray-500 text-xs sm:text-sm">{item.category}</p>
                      </div>

                      {/* Action Button */}
                      <Button
                        size="sm"
                        onClick={() => handleDownloadClick(item)}
                        className="w-full h-8 sm:h-9 lg:h-10 bg-blue-600 hover:bg-blue-700 text-white border-0 rounded-lg sm:rounded-xl font-medium transition-colors duration-200 text-xs sm:text-sm"
                      >
                        {item.type === "downloader" ? (
                          <>
                            <Download className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                            <span className="hidden sm:inline">Download</span>
                            <span className="sm:hidden">Get</span>
                          </>
                        ) : item.type === "search" || item.type === "sticker" ? (
                          <>
                            <Search className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                            Search
                          </>
                        ) : (
                          <>
                            <Play className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                            <span className="hidden sm:inline">Generate</span>
                            <span className="sm:hidden">Gen</span>
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* No Results */}
          {filteredItems.length === 0 && (
            <div className="text-center py-16">
              <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-6 rounded-2xl bg-white/5 p-4 sm:p-5">
                <Search className="w-full h-full text-gray-600" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-300 mb-2">No applications found</h3>
              <p className="text-gray-500 text-sm sm:text-base">Try adjusting your search criteria</p>
            </div>
          )}
        </div>
      </main>

      {/* Modal */}
      <Dialog open={isModalOpen} onOpenChange={closeModal}>
        <DialogContent className="bg-gray-900/95 backdrop-blur-xl border-white/10 text-white w-[95vw] max-w-4xl max-h-[90vh] overflow-y-auto mx-auto">
          <DialogHeader className="pb-4">
            <DialogTitle className="text-xl sm:text-2xl font-semibold flex items-center gap-3">
              {selectedApp && (
                <>
                  <div
                    className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-br ${selectedApp.color} p-2`}
                  >
                    <selectedApp.icon className="w-full h-full text-white" />
                  </div>
                  <span className="truncate">{selectedApp.name}</span>
                </>
              )}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 sm:space-y-6">
            {/* Input */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-300">{getInputLabel()}</label>
              <Input
                type="text"
                placeholder={selectedApp?.placeholder || "Enter URL or text..."}
                value={downloadUrl}
                onChange={(e) => setDownloadUrl(e.target.value)}
                className="h-12 bg-white/5 border-white/10 text-white placeholder-gray-500 focus:border-blue-400/50 focus:ring-1 focus:ring-blue-400/25 rounded-xl"
              />
            </div>

            {/* Action Button */}
            <Button
              onClick={handleDownload}
              disabled={!downloadUrl || isLoading}
              className="w-full h-12 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl font-medium"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Processing...
                </>
              ) : selectedApp?.type === "downloader" ? (
                <>
                  <Download className="w-5 h-5 mr-2" />
                  Download
                </>
              ) : selectedApp?.type === "search" || selectedApp?.type === "sticker" ? (
                <>
                  <Search className="w-5 h-5 mr-2" />
                  Search
                </>
              ) : (
                <>
                  <Play className="w-5 h-5 mr-2" />
                  Generate
                </>
              )}
            </Button>

            {/* Error Message */}
            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            {/* iOS Instructions */}
            {isIOS && selectedApp?.type === "downloader" && <IOSSaveInstructions />}

            {/* Search Results */}
            {searchResults.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Search className="w-5 h-5" />
                  Search Results ({searchResults.length})
                </h3>
                <div className="space-y-3 max-h-80 sm:max-h-96 overflow-y-auto">
                  {searchResults.map((result, index) => (
                    <Card
                      key={index}
                      className="bg-white/5 border-white/10 hover:border-white/20 transition-all duration-200 hover:bg-white/10"
                    >
                      <CardContent className="p-3 sm:p-4">
                        <div className="flex gap-3 sm:gap-4">
                          {/* Thumbnail */}
                          {(result.thumbnail || result.image) && (
                            <img
                              src={result.thumbnail || result.image || "/placeholder.svg"}
                              alt={result.title || "Result"}
                              className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg object-cover flex-shrink-0"
                              onError={(e) => {
                                e.currentTarget.src = "/placeholder.svg?height=64&width=64"
                              }}
                            />
                          )}

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-white text-sm sm:text-base mb-1 line-clamp-2">
                              {result.title || "Untitled"}
                            </h4>
                            {result.description && (
                              <p className="text-gray-400 text-xs sm:text-sm mb-2 line-clamp-2">{result.description}</p>
                            )}

                            {/* Metadata */}
                            {result.views && (
                              <div className="flex items-center gap-1 text-xs text-gray-500 mb-3">
                                <Eye className="w-3 h-3" />
                                <span>{result.views}</span>
                              </div>
                            )}

                            {/* Visit Button */}
                            <Button
                              size="sm"
                              onClick={() => openLink(result.url || result.link || "#")}
                              disabled={!result.url && !result.link}
                              className="h-7 sm:h-8 px-3 sm:px-4 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {selectedApp?.endpoint === "grupwa" ? (
                                <>
                                  <MessageCircle className="w-3 h-3 mr-1" />
                                  <span className="hidden sm:inline">Join Group</span>
                                  <span className="sm:hidden">Join</span>
                                </>
                              ) : selectedApp?.endpoint === "gif" ? (
                                <>
                                  <ExternalLink className="w-3 h-3 mr-1" />
                                  <span className="hidden sm:inline">View GIF</span>
                                  <span className="sm:hidden">View</span>
                                </>
                              ) : (
                                <>
                                  <Globe className="w-3 h-3 mr-1" />
                                  <span className="hidden sm:inline">Watch Anime</span>
                                  <span className="sm:hidden">Watch</span>
                                </>
                              )}
                              <ExternalLink className="w-3 h-3 ml-1" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Image Result */}
            {imageResult && (
              <div className="space-y-4 p-4 sm:p-6 bg-white/5 rounded-2xl border border-white/10">
                <h3 className="font-semibold text-white">Generated Result:</h3>
                <div className="flex flex-col items-center space-y-4">
                  <img
                    src={imageResult || "/placeholder.svg"}
                    alt="Generated result"
                    className="max-w-full h-auto rounded-xl"
                    onError={(e) => {
                      e.currentTarget.style.display = "none"
                      setError("Failed to load the generated image.")
                    }}
                  />
                  <Button asChild className="w-full h-12 bg-green-600 hover:bg-green-700 rounded-xl">
                    <a href={imageResult} target="_blank" rel="noopener noreferrer" download={!isIOS}>
                      <Download className="w-5 h-5 mr-2" />
                      {isIOS ? "View Image" : "Download Image"}
                      <ExternalLink className="w-4 h-4 ml-2" />
                    </a>
                  </Button>
                  {isIOS && (
                    <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                      <p className="text-blue-400 text-sm flex items-start gap-2">
                        <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        To save this image on iOS, press and hold the image, then tap "Add to Photos".
                      </p>
                    </div>
                  )}
                  {imageResult && (
                    <div className="flex gap-3 mt-3">
                      <CopyLinkButton url={imageResult} className="flex-1" />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Download Result */}
            {downloadResult && (
              <div className="space-y-4 sm:space-y-6 p-4 sm:p-6 bg-white/5 rounded-2xl border border-white/10">
                {/* CapCut specific result */}
                {selectedApp?.endpoint === "capcut" && downloadResult.data && (
                  <>
                    <div className="flex items-start gap-3 sm:gap-4">
                      {downloadResult.data.posterUrl && (
                        <img
                          src={downloadResult.data.posterUrl || "/placeholder.svg"}
                          alt="Cover"
                          className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover flex-shrink-0"
                        />
                      )}
                      <div className="flex-1 space-y-2">
                        <h3 className="font-semibold text-white text-sm sm:text-base">{downloadResult.data.title}</h3>
                        {downloadResult.data.author && (
                          <div className="flex items-center gap-2 text-sm text-gray-400">
                            <User className="w-4 h-4" />
                            <span>{downloadResult.data.author.name}</span>
                          </div>
                        )}
                        <div className="flex flex-wrap gap-3 sm:gap-4 text-xs sm:text-sm text-gray-400">
                          {downloadResult.data.date && (
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                              <span>{downloadResult.data.date}</span>
                            </div>
                          )}
                          {downloadResult.data.likes && (
                            <div className="flex items-center gap-1">
                              <Heart className="w-3 h-3 sm:w-4 sm:h-4" />
                              <span>{downloadResult.data.likes}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {downloadResult.data.videoUrl && (
                      <>
                        <Button asChild className="w-full h-12 bg-green-600 hover:bg-green-700 rounded-xl">
                          <a href={downloadResult.data.videoUrl} target="_blank" rel="noopener noreferrer">
                            <FileVideo className="w-5 h-5 mr-2" />
                            {isIOS ? "View Video" : "Download Video"}
                            <ExternalLink className="w-4 h-4 ml-2" />
                          </a>
                        </Button>
                        {isIOS && (
                          <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl mt-3">
                            <p className="text-blue-400 text-sm flex items-start gap-2">
                              <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
                              {getIOSMessage("video")}
                            </p>
                          </div>
                        )}
                        {downloadResult.data.videoUrl && (
                          <div className="flex gap-3 mt-3">
                            <CopyLinkButton url={downloadResult.data.videoUrl} className="flex-1" />
                          </div>
                        )}
                      </>
                    )}
                  </>
                )}

                {/* TikTok specific result */}
                {selectedApp?.endpoint === "tiktok" && downloadResult.data && (
                  <>
                    <div className="flex items-start gap-3 sm:gap-4">
                      {downloadResult.data.cover && (
                        <img
                          src={downloadResult.data.cover || "/placeholder.svg"}
                          alt="Cover"
                          className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover flex-shrink-0"
                        />
                      )}
                      <div className="flex-1 space-y-2">
                        <h3 className="font-semibold text-white text-sm sm:text-base">{downloadResult.data.title}</h3>
                        {downloadResult.data.author && (
                          <div className="flex items-center gap-2 text-sm text-gray-400">
                            <User className="w-4 h-4" />
                            <span>{downloadResult.data.author.nickname}</span>
                            <span className="text-gray-600">@{downloadResult.data.author.unique_id}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Stats */}
                    {(downloadResult.data.play_count || downloadResult.data.share_count) && (
                      <div className="flex flex-wrap gap-3 sm:gap-4 text-xs sm:text-sm text-gray-400">
                        {downloadResult.data.play_count && (
                          <div className="flex items-center gap-1">
                            <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                            <span>{downloadResult.data.play_count.toLocaleString()}</span>
                          </div>
                        )}
                        {downloadResult.data.share_count && (
                          <div className="flex items-center gap-1">
                            <Share className="w-3 h-3 sm:w-4 sm:h-4" />
                            <span>{downloadResult.data.share_count.toLocaleString()}</span>
                          </div>
                        )}
                        {downloadResult.data.size && (
                          <div className="flex items-center gap-1">
                            <FileVideo className="w-3 h-3 sm:w-4 sm:h-4" />
                            <span>{formatFileSize(downloadResult.data.size)}</span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Download Links */}
                    <div className="space-y-3">
                      {downloadResult.data.play && (
                        <Button asChild className="w-full h-12 bg-green-600 hover:bg-green-700 rounded-xl">
                          <a href={downloadResult.data.play} target="_blank" rel="noopener noreferrer">
                            <FileVideo className="w-5 h-5 mr-2" />
                            {isIOS ? "View Video" : "Download Video"}
                            <ExternalLink className="w-4 h-4 ml-2" />
                          </a>
                        </Button>
                      )}
                      {isIOS && downloadResult.data.play && (
                        <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                          <p className="text-blue-400 text-sm flex items-start gap-2">
                            <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
                            {getIOSMessage("video")}
                          </p>
                        </div>
                      )}
                      {downloadResult.data.play && (
                        <div className="flex gap-3 mt-3">
                          <CopyLinkButton url={downloadResult.data.play} className="flex-1" />
                        </div>
                      )}
                      {downloadResult.data.music && (
                        <Button
                          asChild
                          variant="outline"
                          className="w-full h-12 border-white/20 text-white hover:bg-white/10 rounded-xl"
                        >
                          <a href={downloadResult.data.music} target="_blank" rel="noopener noreferrer">
                            <FileAudio className="w-5 h-5 mr-2" />
                            {isIOS ? "Listen to Audio" : "Download Audio"}
                            <ExternalLink className="w-4 h-4 ml-2" />
                          </a>
                        </Button>
                      )}
                      {isIOS && downloadResult.data.music && (
                        <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                          <p className="text-blue-400 text-sm flex items-start gap-2">
                            <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
                            {getIOSMessage("audio")}
                          </p>
                        </div>
                      )}
                    </div>
                  </>
                )}

                {/* YouTube Transcript result */}
                {selectedApp?.endpoint === "yttranscript" && downloadResult.result && (
                  <div className="space-y-4">
                    <h3 className="font-semibold text-white">Transcript:</h3>
                    <div className="max-h-60 sm:max-h-96 overflow-y-auto p-4 bg-black/20 rounded-xl border border-white/10">
                      <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
                        {downloadResult.result}
                      </p>
                    </div>
                    <Button
                      onClick={() => {
                        navigator.clipboard.writeText(downloadResult.result || "")
                      }}
                      className="w-full h-12 bg-blue-600 hover:bg-blue-700 rounded-xl"
                    >
                      <FileText className="w-5 h-5 mr-2" />
                      Copy Transcript
                    </Button>
                  </div>
                )}

                {/* Generic result for other platforms */}
                {!["capcut", "tiktok", "yttranscript"].includes(selectedApp?.endpoint || "") &&
                  downloadResult.success && (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-green-500/20 p-4">
                        <Download className="w-full h-full text-green-400" />
                      </div>
                      <h3 className="text-lg font-semibold text-white mb-2">Processing Complete</h3>
                      <p className="text-gray-400 text-sm mb-4">
                        {isIOS
                          ? "Your content is ready. You can view it in your browser."
                          : "Your request has been processed successfully. The download should start automatically."}
                      </p>

                      {isIOS && downloadResult.data && downloadResult.data.url && (
                        <div className="space-y-3">
                          <Button asChild className="w-full h-12 bg-green-600 hover:bg-green-700 rounded-xl">
                            <a href={downloadResult.data.url} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="w-5 h-5 mr-2" />
                              View Content
                            </a>
                          </Button>
                          <CopyLinkButton url={downloadResult.data.url} className="w-full h-12" />
                          <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                            <p className="text-blue-400 text-sm flex items-start gap-2">
                              <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
                              {getIOSMessage("video")}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 bg-black/40 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 items-center">
            {/* Left: Branding */}
            <div className="text-center lg:text-left">
              <h3 className="text-xl sm:text-2xl font-light text-white mb-2">
                Future<span className="font-bold text-blue-400">Load</span>
              </h3>
              <p className="text-gray-500 text-sm">Premium download experience</p>
            </div>

            {/* Center: Credits */}
            <div className="text-center space-y-2 sm:space-y-3">
              <p className="text-gray-400 text-sm">
                Crafted by <span className="text-white font-medium">Mickey Jiyestha</span>
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center space-y-1 sm:space-y-0 sm:space-x-2 text-xs text-gray-500">
                <span>Powered by</span>
                <span className="text-blue-400 font-medium">resitaAPI</span>
                <span className="hidden sm:inline">•</span>
                <span>
                  Thanks to <span className="text-gray-300">Feri Pratama</span>
                </span>
              </div>
            </div>

            {/* Right: Copyright */}
            <div className="text-center lg:text-right">
              <p className="text-gray-500 text-sm">© 2024 All rights reserved</p>
              <p className="text-gray-600 text-xs mt-1">Use responsibly</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
