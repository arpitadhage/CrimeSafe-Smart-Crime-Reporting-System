# 🛡️ CrimeSafe - Online Crime Reporting System

**CrimeSafe** is a professional, full-stack crime reporting system built with Next.js, featuring real-time communication, emergency SOS functionality, and comprehensive case management for both citizens and law enforcement.

## 🌟 Features

### 👤 **Citizen Features**
- **Secure Registration & Login** with OTP verification
- **Crime Report Filing** with evidence upload (photos, videos, documents)
- **Real-time Chat** with assigned police officers via WebSocket
- **Emergency SOS Button** with UDP-style instant alerts to nearby police stations
- **Case Status Tracking** (Submitted → Under Review → Investigation → Closed)
- **Personal Dashboard** with analytics and report history

### 👮 **Police/Admin Features**
- **Comprehensive Report Management** - View, filter, and manage all reports
- **Officer Assignment System** - Assign cases to specific officers
- **Real-time Status Updates** - Update case progress with persistent storage
- **SOS Alert Monitoring** - Receive instant emergency notifications
- **User Management** - Manage citizens and officers
- **Analytics Dashboard** - Crime statistics and resolution rates

### 🔧 **Technical Features**
- **Client-Server Architecture** with REST APIs
- **WebSocket Integration** for real-time chat (TCP simulation)
- **UDP-style SOS Alerts** for instant emergency broadcasting
- **Persistent Data Storage** using localStorage (easily replaceable with real database)
- **Professional UI/UX** with CrimeSafe branding
- **Responsive Design** for all devices
- **Role-based Access Control**

## 🚀 Quick Start Guide

### **Option 1: Deploy with v0 (Recommended)**
1. Click the **"Publish"** button in the top-right corner
2. Deploy to Vercel automatically
3. Access your live application at the provided URL

### **Option 2: Run Locally with VSCode**

#### **Prerequisites**
- Node.js 18+ installed
- VSCode (recommended)
- Git

#### **Installation Steps**

1. **Download the project:**
   \`\`\`bash
   # If you downloaded the ZIP file from v0
   unzip crimesafe-reporting-system.zip
   cd crimesafe-reporting-system
   \`\`\`

2. **Open in VSCode:**
   \`\`\`bash
   code .
   \`\`\`

3. **Install dependencies:**
   \`\`\`bash
   npm install
   \`\`\`

4. **Start development server:**
   \`\`\`bash
   npm run dev
   \`\`\`

5. **Open your browser:**
   Navigate to `http://localhost:3000`

#### **VSCode Commands**
\`\`\`bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

# Useful VSCode shortcuts
Ctrl+Shift+P         # Command palette
Ctrl+`               # Open terminal
Ctrl+Shift+E         # Explorer panel
F5                   # Start debugging
\`\`\`

## 🔐 Demo Credentials

### **Citizens**
- **Email:** `john.doe@email.com`
- **Password:** `password123`

### **Police/Admin**
- **Email:** `admin@police.gov`
- **Password:** `password123`

### **OTP Verification**
- **Demo OTP:** `123456` (for any phone number)

## 📊 Data Storage

### **Current Implementation**
The system uses **localStorage** for data persistence:

\`\`\`javascript
// Data is stored in browser localStorage with these keys:
- crimesafe_users           // User accounts and profiles
- crimesafe_reports         // Crime reports and evidence
- crimesafe_messages        // Chat messages between users and officers
- crimesafe_emergency_contacts // Emergency contact information
\`\`\`

### **Database Schema**
\`\`\`typescript
// Users
interface User {
  id: string
  email: string
  name: string
  phone: string
  role: "citizen" | "officer" | "admin"
  isVerified: boolean
  createdAt: Date
}

// Crime Reports
interface CrimeReport {
  id: string
  userId: string
  title: string
  description: string
  category: "theft" | "assault" | "vandalism" | "fraud" | "other"
  priority: "low" | "medium" | "high" | "emergency"
  status: "pending" | "investigating" | "resolved" | "closed"
  location: { address: string; latitude?: number; longitude?: number }
  dateTime: Date
  evidence: Evidence[]
  assignedOfficer?: string
  createdAt: Date
  updatedAt: Date
}

// Chat Messages
interface ChatMessage {
  id: string
  reportId: string
  senderId: string
  senderName: string
  senderRole: "citizen" | "officer" | "admin"
  message: string
  timestamp: Date
  isRead: boolean
}
\`\`\`

### **Upgrading to Real Database**
To connect to a real database (PostgreSQL, MySQL, MongoDB):

1. **Replace localStorage calls** in `lib/database.ts`
2. **Add database connection** in `lib/db-connection.ts`
3. **Update environment variables** for database URL
4. **Run database migrations** for table creation

## 🌐 Networking Architecture

### **Client-Server Model**
- **Frontend:** Next.js React application (Client)
- **Backend:** Next.js API routes (Server)
- **Communication:** HTTP/HTTPS REST APIs

### **Real-time Features**
- **WebSocket Service** (`lib/websocket.ts`) - Simulates TCP socket communication
- **SOS Service** (`lib/sos-service.ts`) - Simulates UDP broadcast for emergency alerts

### **API Endpoints**
\`\`\`
GET  /api/reports      # Get all reports (admin) or user reports
POST /api/reports      # Create new report
PUT  /api/reports/:id  # Update report status
GET  /api/messages     # Get chat messages for report
POST /api/messages     # Send new message
POST /api/sos          # Send emergency SOS alert
\`\`\`

## 🛠️ Development

### **Project Structure**
\`\`\`
crimesafe-reporting-system/
├── app/                    # Next.js app directory
│   ├── page.tsx           # Main application entry
│   ├── layout.tsx         # Root layout with CrimeSafe branding
│   └── globals.css        # Global styles and design tokens
├── components/            # React components
│   ├── auth/             # Authentication forms
│   ├── dashboard/        # User dashboard
│   ├── admin/           # Admin/police dashboard
│   ├── reports/         # Report management
│   ├── chat/            # Real-time messaging
│   ├── emergency/       # SOS functionality
│   └── ui/              # Reusable UI components
├── lib/                  # Utility libraries
│   ├── types.ts         # TypeScript interfaces
│   ├── auth.ts          # Authentication service
│   ├── database.ts      # Data persistence layer
│   ├── websocket.ts     # WebSocket service
│   ├── sos-service.ts   # Emergency SOS service
│   └── mock-data.ts     # Demo data
└── README.md            # This file
\`\`\`

### **Key Technologies**
- **Frontend:** Next.js 14, React 19, TypeScript
- **Styling:** Tailwind CSS v4, Shadcn/ui components
- **State Management:** React hooks, localStorage
- **Real-time:** WebSocket simulation
- **Forms:** React Hook Form with Zod validation
- **Icons:** Lucide React
- **Charts:** Recharts for analytics

## 🔧 Customization

### **Branding**
- Update `components/ui/logo.tsx` for custom logo
- Modify `app/globals.css` for color scheme
- Change `app/layout.tsx` for meta information

### **Features**
- Add new crime categories in `lib/types.ts`
- Extend user roles and permissions
- Add new dashboard widgets
- Integrate with external APIs

## 🚀 Production Deployment

### **Vercel (Recommended)**
1. Push code to GitHub repository
2. Connect repository to Vercel
3. Deploy automatically with zero configuration

### **Other Platforms**
\`\`\`bash
# Build for production
npm run build

# Start production server
npm run start
\`\`\`

## 📞 Support

For technical support or questions:
- **GitHub Issues:** Create an issue in the repository
- **Documentation:** Refer to Next.js and React documentation
- **Community:** Join the Vercel community for help

## 📄 License

This project is built for educational and demonstration purposes. Feel free to use and modify for your needs.

---

**Built with ❤️ using v0.app and Next.js**
