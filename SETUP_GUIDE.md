# CrimeSafe - Crime Reporting System Setup Guide

## 🚀 Quick Start with VSCode

### Method 1: Download from v0 (Recommended)
1. Click the **three dots (⋯)** in the top right of the v0 interface
2. Select **"Download ZIP"**
3. Extract the downloaded file
4. Open VSCode and run:
\`\`\`bash
cd crimesafe-reporting-system
code .
npm install
npm run dev
\`\`\`

### Method 2: GitHub Integration
1. Click the **GitHub logo** in the top right of v0
2. Push to your GitHub repository
3. Clone locally:
\`\`\`bash
git clone <your-repo-url>
cd <repo-name>
code .
npm install
npm run dev
\`\`\`

## 📊 Database Information

### Current Storage System
The application uses **localStorage** for data persistence with the following structure:

#### Storage Keys:
- `crimesafe_users` - User accounts and authentication data
- `crimesafe_reports` - Crime reports with evidence and status
- `crimesafe_messages` - Chat messages between citizens and officers
- `crimesafe_sos_alerts` - Emergency SOS alerts with location data

#### Data Structure:
\`\`\`typescript
// Users
interface User {
  id: string
  name: string
  email: string
  phone: string
  role: 'citizen' | 'officer' | 'admin'
  isVerified: boolean
  createdAt: Date
}

// Crime Reports
interface CrimeReport {
  id: string
  userId: string
  title: string
  description: string
  category: 'theft' | 'assault' | 'vandalism' | 'fraud' | 'other'
  priority: 'low' | 'medium' | 'high' | 'emergency'
  status: 'pending' | 'investigating' | 'resolved' | 'closed'
  location: { latitude: number; longitude: number; address: string }
  dateTime: Date
  evidence: string[]
  assignedOfficer?: string
  createdAt: Date
  updatedAt: Date
}

// SOS Alerts
interface SOSAlert {
  id: string
  userId: string
  location: { latitude: number; longitude: number; address: string }
  timestamp: Date
  status: 'active' | 'responded'
  responderId?: string
}
\`\`\`

### Database Migration (Production Ready)
To migrate to a real database (PostgreSQL, MySQL, etc.):

1. **Replace DatabaseService methods** in `lib/database.ts`
2. **Update environment variables** for database connection
3. **Run migration scripts** to create tables
4. **Update data serialization** to handle proper Date objects

## 🔧 VSCode Commands

### Development Commands:
\`\`\`bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Type checking
npm run type-check

# Linting
npm run lint
\`\`\`

### Useful VSCode Extensions:
- **ES7+ React/Redux/React-Native snippets**
- **Tailwind CSS IntelliSense**
- **TypeScript Importer**
- **Auto Rename Tag**
- **Prettier - Code formatter**

## 🌐 Deployment Options

### Vercel (Recommended)
1. Click **"Publish"** button in v0 interface
2. Connect your GitHub repository
3. Deploy automatically

### Manual Deployment
\`\`\`bash
npm run build
# Upload 'out' folder to your hosting provider
\`\`\`

## 🔐 Demo Credentials

### Test Accounts:
- **Citizen**: `john.doe@email.com` / `password123`
- **Police Officer**: `admin@police.gov` / `password123`
- **OTP Verification**: `123456` (for any phone number)

## 📱 Features Overview

### For Citizens:
- **Report Crimes** with evidence upload
- **Real-time Chat** with assigned officers
- **Emergency SOS** with GPS location
- **Track Report Status** and updates
- **Emergency Service Numbers** (Indian helplines)

### For Police/Admin:
- **Comprehensive Analytics** with charts and trends
- **Real-time SOS Monitoring** with immediate alerts
- **Report Management** with status updates
- **Officer Assignment** and case tracking
- **User Management** and verification
- **Chat System** for citizen communication

## 🚨 Emergency Services (India)
- **Universal Emergency**: 112
- **Police**: 100
- **Fire Brigade**: 101
- **Ambulance**: 102 / 108
- **Non-Emergency Police**: 100

## 🔧 Troubleshooting

### Common Issues:
1. **Port already in use**: Change port in `package.json` or kill existing process
2. **Module not found**: Run `npm install` to install dependencies
3. **Build errors**: Check TypeScript errors with `npm run type-check`
4. **Data not persisting**: Check browser localStorage permissions

### Development Tips:
- Use **Chrome DevTools** to inspect localStorage data
- **Network tab** to monitor API calls
- **Console** for debugging messages (look for `[CrimeSafe]` logs)
- **Responsive design** testing with device toolbar

## 📞 Support
For issues or questions, refer to the v0 documentation or open a support ticket at vercel.com/help.
