"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"
import { AuthService } from "@/lib/auth"
import type { User } from "@/lib/types"

interface RegisterFormProps {
  onRegister: (user: User) => void
  onSwitchToLogin: () => void
}

export function RegisterForm({ onRegister, onSwitchToLogin }: RegisterFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [otpSent, setOtpSent] = useState(false)
  const [otp, setOtp] = useState("")

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    if (name === "phone") {
      const phoneValue = value.replace(/\D/g, "").slice(0, 10)
      setFormData((prev) => ({ ...prev, [name]: phoneValue }))
      return
    }

    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSendOTP = async () => {
    if (!formData.email) {
      setError("Please enter your email address")
      return
    }

    if (!formData.email.includes("@")) {
      setError("Please enter a valid email address")
      return
    }

    setIsLoading(true)
    try {
      await AuthService.sendEmailOTP(formData.email)
      setOtpSent(true)
      setError("")
    } catch (err) {
      setError("Failed to send OTP to email")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    if (formData.phone && formData.phone.length !== 10) {
      setError("Phone number must be exactly 10 digits")
      setIsLoading(false)
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      setIsLoading(false)
      return
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long")
      setIsLoading(false)
      return
    }

    if (!otpSent) {
      setError("Please verify your email address first")
      setIsLoading(false)
      return
    }

    if (otp.length !== 6) {
      setError("Please enter the complete 6-digit OTP")
      setIsLoading(false)
      return
    }

    try {
      const isOtpValid = await AuthService.verifyEmailOTP(formData.email, otp)
      if (!isOtpValid) {
        setError("Invalid OTP. Please check your email and try again.")
        setIsLoading(false)
        return
      }

      const user = await AuthService.register({
        name: formData.name,
        email: formData.email,
        phone: formData.phone || "", // Made phone optional
        role: "citizen",
      })
      onRegister(user)
    } catch (err) {
      setError("Registration failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold text-primary">Create Account</CardTitle>
        <CardDescription>Register for the Crime Reporting System</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter your full name"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <div className="flex gap-2">
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email"
                required
              />
              <Button type="button" variant="outline" onClick={handleSendOTP} disabled={isLoading || otpSent}>
                {otpSent ? "Sent" : "Send OTP"}
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number (Optional)</Label>
            <Input
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="Enter 10-digit phone number"
              maxLength={10}
            />
            {formData.phone && formData.phone.length > 0 && formData.phone.length !== 10 && (
              <p className="text-sm text-destructive">Phone number must be exactly 10 digits</p>
            )}
          </div>
          {otpSent && (
            <div className="space-y-2">
              <Label htmlFor="otp">Email Verification Code</Label>
              <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
              <p className="text-sm text-muted-foreground">Check your email for the 6-digit verification code</p>
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Enter your password (min 6 characters)"
              required
              minLength={6}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              placeholder="Confirm your password"
              required
            />
          </div>
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Creating Account..." : "Create Account"}
          </Button>
          <div className="text-center">
            <Button type="button" variant="link" onClick={onSwitchToLogin} className="text-sm">
              Already have an account? Sign In
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
