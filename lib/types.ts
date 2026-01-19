export interface User {
  id: string
  email: string
  name: string
  phone: string
  role: "citizen" | "admin" | "officer"
  isVerified: boolean
  createdAt: Date
}

export interface CrimeReport {
  id: string
  userId: string
  title: string
  description: string
  category: "theft" | "assault" | "vandalism" | "fraud" | "domestic" | "traffic" | "other"
  priority: "low" | "medium" | "high" | "emergency"
  status: "pending" | "investigating" | "resolved" | "closed"
  location: {
    address: string
    latitude?: number
    longitude?: number
  }
  dateTime: Date
  evidence: Evidence[]
  assignedOfficer?: string
  createdAt: Date
  updatedAt: Date
}

export interface Evidence {
  id: string
  type: "image" | "video" | "document" | "audio"
  filename: string
  url: string
  description?: string
  uploadedAt: Date
}

export interface ChatMessage {
  id: string
  reportId: string
  senderId: string
  senderName: string
  senderRole: "citizen" | "admin" | "officer"
  message: string
  timestamp: Date
  isRead: boolean
}

export interface EmergencyContact {
  id: string
  name: string
  phone: string
  relationship: string
  userId: string
}

export interface SOSAlert {
  id: string
  userId: string
  location: {
    latitude: number
    longitude: number
    address?: string
  }
  timestamp: Date
  status: "active" | "responded" | "false_alarm"
  responderId?: string
}
