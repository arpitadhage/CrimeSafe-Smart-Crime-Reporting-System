"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Upload, X } from "lucide-react"
import type { CrimeReport, Evidence } from "@/lib/types"

interface ReportFormProps {
  userId: string
  onSubmit: (report: CrimeReport) => void
  onCancel: () => void
}

export function ReportForm({ userId, onSubmit, onCancel }: ReportFormProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    priority: "",
    address: "",
    dateTime: "",
  })
  const [evidence, setEvidence] = useState<Evidence[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    Array.from(files).forEach((file) => {
      const newEvidence: Evidence = {
        id: Date.now().toString() + Math.random(),
        type: file.type.startsWith("image/")
          ? "image"
          : file.type.startsWith("video/")
            ? "video"
            : file.type.startsWith("audio/")
              ? "audio"
              : "document",
        filename: file.name,
        url: URL.createObjectURL(file),
        uploadedAt: new Date(),
      }
      setEvidence((prev) => [...prev, newEvidence])
    })
  }

  const removeEvidence = (id: string) => {
    setEvidence((prev) => prev.filter((e) => e.id !== id))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")

    if (!formData.title || !formData.description || !formData.category || !formData.priority) {
      setError("Please fill in all required fields")
      setIsSubmitting(false)
      return
    }

    if (formData.dateTime) {
      const selectedDate = new Date(formData.dateTime)
      const now = new Date()
      if (selectedDate > now) {
        setError("Date and time cannot be in the future")
        setIsSubmitting(false)
        return
      }
    }

    try {
      const newReport: CrimeReport = {
        id: Date.now().toString(),
        userId,
        title: formData.title,
        description: formData.description,
        category: formData.category as any,
        priority: formData.priority as any,
        status: "pending",
        location: {
          address: formData.address,
        },
        dateTime: formData.dateTime ? new Date(formData.dateTime) : new Date(),
        evidence,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      onSubmit(newReport)
    } catch (err) {
      setError("Failed to submit report. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const getCurrentDateTime = () => {
    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, "0")
    const day = String(now.getDate()).padStart(2, "0")
    const hours = String(now.getHours()).padStart(2, "0")
    const minutes = String(now.getMinutes()).padStart(2, "0")
    return `${year}-${month}-${day}T${hours}:${minutes}`
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>File a Crime Report</CardTitle>
        <CardDescription>
          Please provide as much detail as possible to help law enforcement investigate your case.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Report Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              placeholder="Brief description of the incident"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Crime Category *</Label>
              <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="theft">Theft</SelectItem>
                  <SelectItem value="assault">Assault</SelectItem>
                  <SelectItem value="vandalism">Vandalism</SelectItem>
                  <SelectItem value="fraud">Fraud</SelectItem>
                  <SelectItem value="domestic">Domestic Violence</SelectItem>
                  <SelectItem value="traffic">Traffic Violation</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">Priority Level *</Label>
              <Select value={formData.priority} onValueChange={(value) => handleInputChange("priority", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="emergency">Emergency</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Detailed Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Provide a detailed description of what happened, including time, location, people involved, etc."
              rows={4}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Location/Address</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => handleInputChange("address", e.target.value)}
              placeholder="Where did this incident occur?"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dateTime">Date and Time of Incident</Label>
            <Input
              id="dateTime"
              type="datetime-local"
              value={formData.dateTime}
              onChange={(e) => handleInputChange("dateTime", e.target.value)}
              max={getCurrentDateTime()}
            />
          </div>

          <div className="space-y-2">
            <Label>Evidence (Photos, Videos, Documents)</Label>
            <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
              <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground mb-2">
                Upload any evidence that might help with the investigation
              </p>
              <Input
                type="file"
                multiple
                accept="image/*,video/*,audio/*,.pdf,.doc,.docx"
                onChange={handleFileUpload}
                className="hidden"
                id="evidence-upload"
              />
              <Label htmlFor="evidence-upload" className="cursor-pointer">
                <Button type="button" variant="outline" asChild>
                  <span>Choose Files</span>
                </Button>
              </Label>
            </div>

            {evidence.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Uploaded Evidence:</h4>
                {evidence.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-2 bg-muted rounded">
                    <span className="text-sm">{item.filename}</span>
                    <Button type="button" variant="ghost" size="sm" onClick={() => removeEvidence(item.id)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex gap-4">
            <Button type="submit" disabled={isSubmitting} className="flex-1">
              {isSubmitting ? "Submitting Report..." : "Submit Report"}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
