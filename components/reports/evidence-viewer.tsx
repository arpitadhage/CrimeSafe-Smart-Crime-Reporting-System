"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ImageIcon, Video, FileText, Download, Eye, Volume2 } from "lucide-react"
import type { Evidence } from "@/lib/types"

interface EvidenceViewerProps {
  evidence: Evidence[]
}

export function EvidenceViewer({ evidence }: EvidenceViewerProps) {
  const [selectedEvidence, setSelectedEvidence] = useState<Evidence | null>(null)

  const getEvidenceIcon = (type: string) => {
    switch (type) {
      case "image":
        return <ImageIcon className="h-5 w-5" />
      case "video":
        return <Video className="h-5 w-5" />
      case "audio":
        return <Volume2 className="h-5 w-5" />
      default:
        return <FileText className="h-5 w-5" />
    }
  }

  const getEvidenceTypeColor = (type: string) => {
    switch (type) {
      case "image":
        return "bg-blue-100 text-blue-800"
      case "video":
        return "bg-purple-100 text-purple-800"
      case "audio":
        return "bg-green-100 text-green-800"
      case "document":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleDownload = (evidence: Evidence) => {
    // Create a temporary link to download the file
    const link = document.createElement("a")
    link.href = evidence.url
    link.download = evidence.filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const renderEvidencePreview = (evidence: Evidence) => {
    switch (evidence.type) {
      case "image":
        return (
          <img
            src={evidence.url || "/placeholder.svg"}
            alt={evidence.filename}
            className="max-w-full max-h-96 object-contain rounded-lg"
            onError={(e) => {
              const target = e.target as HTMLImageElement
              target.src = "/broken-image-icon.png"
            }}
          />
        )
      case "video":
        return (
          <video controls className="max-w-full max-h-96 rounded-lg" preload="metadata">
            <source src={evidence.url} type="video/mp4" />
            <source src={evidence.url} type="video/webm" />
            <source src={evidence.url} type="video/ogg" />
            Your browser does not support the video tag.
          </video>
        )
      case "audio":
        return (
          <div className="w-full max-w-md">
            <audio controls className="w-full">
              <source src={evidence.url} type="audio/mpeg" />
              <source src={evidence.url} type="audio/ogg" />
              <source src={evidence.url} type="audio/wav" />
              Your browser does not support the audio tag.
            </audio>
          </div>
        )
      case "document":
        return (
          <div className="text-center p-8">
            <FileText className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <p className="text-sm text-muted-foreground mb-4">
              Document preview not available. Click download to view the file.
            </p>
            <Button onClick={() => handleDownload(evidence)} variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Download Document
            </Button>
          </div>
        )
      default:
        return (
          <div className="text-center p-8">
            <FileText className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">File type not supported for preview</p>
          </div>
        )
    }
  }

  if (evidence.length === 0) {
    return (
      <div className="text-center p-6 text-muted-foreground">
        <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
        <p>No evidence files submitted with this report</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-3">
        {evidence.map((item) => (
          <Card key={item.id} className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 flex-1">
                <div className="flex items-center gap-2">
                  {getEvidenceIcon(item.type)}
                  <Badge className={getEvidenceTypeColor(item.type)} variant="secondary">
                    {item.type.toUpperCase()}
                  </Badge>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{item.filename}</p>
                  {item.description && <p className="text-xs text-muted-foreground truncate">{item.description}</p>}
                  <p className="text-xs text-muted-foreground">
                    Uploaded {item.uploadedAt.toLocaleDateString()} at {item.uploadedAt.toLocaleTimeString()}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* Preview for images */}
                {item.type === "image" && (
                  <img
                    src={item.url || "/placeholder.svg"}
                    alt={item.filename}
                    className="w-12 h-12 object-cover rounded border"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.src = "/image-error.png"
                    }}
                  />
                )}

                {/* View button */}
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" onClick={() => setSelectedEvidence(item)}>
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2">
                        {getEvidenceIcon(item.type)}
                        {item.filename}
                      </DialogTitle>
                    </DialogHeader>
                    <div className="mt-4">
                      {renderEvidencePreview(item)}
                      {item.description && (
                        <div className="mt-4 p-3 bg-muted rounded-lg">
                          <p className="text-sm font-medium mb-1">Description:</p>
                          <p className="text-sm text-muted-foreground">{item.description}</p>
                        </div>
                      )}
                      <div className="mt-4 flex justify-between items-center text-xs text-muted-foreground">
                        <span>
                          Uploaded: {item.uploadedAt.toLocaleDateString()} at {item.uploadedAt.toLocaleTimeString()}
                        </span>
                        <Button variant="outline" size="sm" onClick={() => handleDownload(item)}>
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>

                {/* Download button */}
                <Button variant="ghost" size="sm" onClick={() => handleDownload(item)}>
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
