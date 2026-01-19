import type { User, CrimeReport, ChatMessage, EmergencyContact } from "./types"

export const mockUsers: User[] = [
  {
    id: "1",
    email: "john.doe@email.com",
    name: "John Doe",
    phone: "+1234567890",
    role: "citizen",
    isVerified: true,
    createdAt: new Date("2024-01-15"),
  },
  {
    id: "2",
    email: "admin@police.gov",
    name: "Admin Officer",
    phone: "+1234567891",
    role: "admin",
    isVerified: true,
    createdAt: new Date("2024-01-01"),
  },
  {
    id: "3",
    email: "officer.smith@police.gov",
    name: "Officer Smith",
    phone: "+1234567892",
    role: "officer",
    isVerified: true,
    createdAt: new Date("2024-01-10"),
  },
]

export const mockReports: CrimeReport[] = [
  {
    id: "1",
    userId: "1",
    title: "Bicycle Theft",
    description:
      "My bicycle was stolen from the parking area near the mall. It was a red mountain bike with black handles.",
    category: "theft",
    priority: "medium",
    status: "investigating",
    location: {
      address: "123 Main St, Downtown",
      latitude: 40.7128,
      longitude: -74.006,
    },
    dateTime: new Date("2024-01-20T14:30:00"),
    evidence: [
      {
        id: "1",
        type: "image",
        filename: "bike_photo.jpg",
        url: "/red-mountain-bike.jpg",
        description: "Photo of the stolen bike taken before theft",
        uploadedAt: new Date("2024-01-20T15:00:00"),
      },
    ],
    assignedOfficer: "3",
    createdAt: new Date("2024-01-20T15:00:00"),
    updatedAt: new Date("2024-01-21T10:00:00"),
  },
  {
    id: "2",
    userId: "1",
    title: "Suspicious Activity",
    description: "Noticed suspicious individuals loitering around the neighborhood late at night.",
    category: "other",
    priority: "low",
    status: "pending",
    location: {
      address: "456 Oak Ave, Residential Area",
    },
    dateTime: new Date("2024-01-22T23:15:00"),
    evidence: [
      {
        id: "2",
        type: "video",
        filename: "security_footage.mp4",
        url: "/security-footage.mp4",
        description: "Security camera footage showing suspicious individuals",
        uploadedAt: new Date("2024-01-22T23:30:00"),
      },
    ],
    createdAt: new Date("2024-01-23T08:00:00"),
    updatedAt: new Date("2024-01-23T08:00:00"),
  },
  {
    id: "3",
    userId: "1",
    title: "Vandalism",
    description:
      "Graffiti vandalism on the side wall of my building. Multiple spray paint tags were found this morning.",
    category: "vandalism",
    priority: "medium",
    status: "pending",
    location: {
      address: "789 Pine St, Business District",
      latitude: 40.7589,
      longitude: -73.9851,
    },
    dateTime: new Date("2024-01-25T07:00:00"),
    evidence: [
      {
        id: "3",
        type: "image",
        filename: "vandalism_damage.jpg",
        url: "/vandalism-evidence.jpg",
        description: "Photo showing the graffiti damage on building wall",
        uploadedAt: new Date("2024-01-25T08:15:00"),
      },
    ],
    createdAt: new Date("2024-01-25T08:15:00"),
    updatedAt: new Date("2024-01-25T08:15:00"),
  },
]

export const mockMessages: ChatMessage[] = [
  {
    id: "1",
    reportId: "1",
    senderId: "3",
    senderName: "Officer Smith",
    senderRole: "officer",
    message:
      "Thank you for your report. We have started investigating this case. Can you provide more details about when you last saw your bicycle?",
    timestamp: new Date("2024-01-21T10:00:00"),
    isRead: true,
  },
  {
    id: "2",
    reportId: "1",
    senderId: "1",
    senderName: "John Doe",
    senderRole: "citizen",
    message:
      "I last saw it around 2 PM when I parked it near the mall entrance. When I came back at 4 PM, it was gone.",
    timestamp: new Date("2024-01-21T14:30:00"),
    isRead: true,
  },
]

export const mockEmergencyContacts: EmergencyContact[] = [
  {
    id: "1",
    name: "Jane Doe",
    phone: "+1234567893",
    relationship: "Spouse",
    userId: "1",
  },
  {
    id: "2",
    name: "Emergency Services",
    phone: "911",
    relationship: "Emergency",
    userId: "1",
  },
]
