import type { User } from "./types"
import { DatabaseService } from "./database"

export class AuthService {
  private static currentUser: User | null = null

  static login(email: string, password: string): Promise<User | null> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const users = DatabaseService.loadUsers()
        const user = users.find((u) => u.email === email)
        if (user && password === "password123") {
          this.currentUser = user
          localStorage.setItem("currentUser", JSON.stringify(user))
          resolve(user)
        } else {
          resolve(null)
        }
      }, 1000)
    })
  }

  static register(userData: Omit<User, "id" | "createdAt" | "isVerified">): Promise<User> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newUser: User = {
          ...userData,
          id: Date.now().toString(),
          createdAt: new Date(),
          isVerified: false,
        }

        const users = DatabaseService.loadUsers()
        users.push(newUser)
        DatabaseService.saveUsers(users)

        // Only set as current user if it's a citizen registration (not admin creating officers)
        if (userData.role === "citizen") {
          this.currentUser = newUser
          localStorage.setItem("currentUser", JSON.stringify(newUser))
        }

        resolve(newUser)
      }, 1000)
    })
  }

  static createOfficer(userData: Omit<User, "id" | "createdAt" | "isVerified" | "role">): Promise<User> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newOfficer: User = {
          ...userData,
          id: Date.now().toString(),
          role: "officer",
          createdAt: new Date(),
          isVerified: true, // Officers are pre-verified by admin
        }

        const users = DatabaseService.loadUsers()
        users.push(newOfficer)
        DatabaseService.saveUsers(users)

        resolve(newOfficer)
      }, 1000)
    })
  }

  static logout(): void {
    this.currentUser = null
    localStorage.removeItem("currentUser")
  }

  static getCurrentUser(): User | null {
    if (this.currentUser) return this.currentUser

    const stored = localStorage.getItem("currentUser")
    if (stored) {
      this.currentUser = JSON.parse(stored)
      return this.currentUser
    }

    return null
  }

  static isAdmin(user: User | null): boolean {
    return user?.role === "admin"
  }

  static isOfficer(user: User | null): boolean {
    return user?.role === "officer"
  }

  static canManagePolice(user: User | null): boolean {
    return user?.role === "admin"
  }

  static sendEmailOTP(email: string): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Generate random 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString()

        // Store OTP in localStorage for demo (in real app, this would be server-side)
        localStorage.setItem(
          `otp_${email}`,
          JSON.stringify({
            code: otp,
            timestamp: Date.now(),
            expires: Date.now() + 10 * 60 * 1000, // 10 minutes
          }),
        )

        console.log(`[v0] Email OTP sent to ${email}: ${otp}`)
        // In real implementation, send email via email service
        alert(`Demo: Your OTP is ${otp} (Check console for details)`)
        resolve(true)
      }, 1000)
    })
  }

  static verifyEmailOTP(email: string, otp: string): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const storedOtpData = localStorage.getItem(`otp_${email}`)

        if (!storedOtpData) {
          resolve(false)
          return
        }

        const { code, expires } = JSON.parse(storedOtpData)

        // Check if OTP is expired
        if (Date.now() > expires) {
          localStorage.removeItem(`otp_${email}`)
          resolve(false)
          return
        }

        // Verify OTP
        const isValid = otp === code

        if (isValid) {
          // Remove OTP after successful verification
          localStorage.removeItem(`otp_${email}`)
        }

        resolve(isValid)
      }, 500)
    })
  }

  static sendOTP(phone: string): Promise<boolean> {
    console.warn("Phone OTP is deprecated. Use sendEmailOTP instead.")
    return this.sendEmailOTP(phone) // Fallback for compatibility
  }

  static verifyOTP(phone: string, otp: string): Promise<boolean> {
    console.warn("Phone OTP is deprecated. Use verifyEmailOTP instead.")
    return this.verifyEmailOTP(phone, otp) // Fallback for compatibility
  }
}
