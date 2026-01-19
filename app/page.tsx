"use client"

import { useState, useEffect } from "react"
import type { User } from "@/lib/types"
import { AuthService } from "@/lib/auth"
import { LoginForm } from "@/components/auth/login-form"
import { RegisterForm } from "@/components/auth/register-form"
import { UserDashboard } from "@/components/dashboard/user-dashboard"
import { AdminDashboard } from "@/components/admin/admin-dashboard"
import { DatabaseService } from "@/lib/database"

export default function HomePage() {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [authMode, setAuthMode] = useState<"login" | "register">("login")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    DatabaseService.initializeDatabase()

    // Check if user is already logged in
    const user = AuthService.getCurrentUser()
    setCurrentUser(user)
    setIsLoading(false)
  }, [])

  const handleLogin = (user: User) => {
    setCurrentUser(user)
  }

  const handleRegister = (user: User) => {
    setCurrentUser(user)
  }

  const handleLogout = () => {
    AuthService.logout()
    setCurrentUser(null)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading CrimeSafe...</p>
        </div>
      </div>
    )
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        {authMode === "login" ? (
          <LoginForm onLogin={handleLogin} onSwitchToRegister={() => setAuthMode("register")} />
        ) : (
          <RegisterForm onRegister={handleRegister} onSwitchToLogin={() => setAuthMode("login")} />
        )}
      </div>
    )
  }

  // Render appropriate dashboard based on user role
  if (currentUser.role === "admin" || currentUser.role === "officer") {
    return <AdminDashboard user={currentUser} onLogout={handleLogout} />
  }

  return <UserDashboard user={currentUser} onLogout={handleLogout} />
}
