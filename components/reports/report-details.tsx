"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Calendar, MapPin, User, ImageIcon, Video, FileText, File } from "lucide-react"
import type { CrimeReport } from "@/lib/types"
import { EvidenceViewer } from "./evidence-viewer"

interface ReportDetailsProps {
  report: CrimeReport
}

export function ReportDetails({ report }: ReportDetailsProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "investigating":
        return "bg-blue-100 text-blue-800"
      case "resolved":
        return "bg-green-100 text-green-800"
      case "closed":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "emergency":
        return "bg-red-100 text-red-800"
      case "high":
        return "bg-orange-100 text-orange-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getEvidenceIcon = (type: string) => {
    switch (type) {
      case "image":
        return <ImageIcon className="h-4 w-4" />
      case "video":
        return <Video className="h-4 w-4" />
      case "audio":
        return <File className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-xl">{report.title}</CardTitle>
            <CardDescription>Report ID: {report.id}</CardDescription>
          </div>
          <div className="flex gap-2">
            <Badge className={getPriorityColor(report.priority)}>{report.priority}</Badge>
            <Badge className={getStatusColor(report.status)}>{report.status}</Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>
              Reported on {report.createdAt.toLocaleDateString()} at {report.createdAt.toLocaleTimeString()}
            </span>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>
              Incident occurred on {report.dateTime.toLocaleDateString()} at {report.dateTime.toLocaleTimeString()}
            </span>
          </div>

          {report.location.address && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>{report.location.address}</span>
            </div>
          )}

          {report.assignedOfficer && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <User className="h-4 w-4" />
              <span>Assigned to Officer (ID: {report.assignedOfficer})</span>
            </div>
          )}
        </div>

        <Separator />

        {/* Description */}
        <div>
          <h3 className="font-medium mb-2">Description</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">{report.description}</p>
        </div>

        {/* Evidence */}
        {report.evidence.length > 0 && (
          <>
            <Separator />
            <div>
              <h3 className="font-medium mb-3">Evidence ({report.evidence.length})</h3>
              <EvidenceViewer evidence={report.evidence} />
            </div>
          </>
        )}

        {/* Case Timeline */}
        <Separator />
        <div>
          <h3 className="font-medium mb-3">Case Timeline</h3>
          <div className="space-y-3">
            <div className="flex gap-3">
              <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
              <div>
                <p className="text-sm font-medium">Report Filed</p>
                <p className="text-xs text-muted-foreground">
                  {report.createdAt.toLocaleDateString()} at {report.createdAt.toLocaleTimeString()}
                </p>
              </div>
            </div>
            {report.status !== "pending" && (
              <div className="flex gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm font-medium">Investigation Started</p>
                  <p className="text-xs text-muted-foreground">
                    {report.updatedAt.toLocaleDateString()} at {report.updatedAt.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
