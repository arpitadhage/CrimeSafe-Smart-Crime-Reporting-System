"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Send, MessageCircle } from "lucide-react"
import type { User, ChatMessage } from "@/lib/types"
import { DatabaseService } from "@/lib/database"

interface ChatInterfaceProps {
  reportId: string
  currentUser: User
}

export function ChatInterface({ reportId, currentUser }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const loadMessages = () => {
      const reportMessages = DatabaseService.getMessagesByReportId(reportId)
      setMessages(reportMessages)
    }

    loadMessages()

    const interval = setInterval(loadMessages, 2000)
    return () => clearInterval(interval)
  }, [reportId])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim()) return

    setIsLoading(true)

    const message: ChatMessage = {
      id: Date.now().toString(),
      reportId,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderRole: currentUser.role,
      message: newMessage.trim(),
      timestamp: new Date(),
      isRead: false,
    }

    DatabaseService.addMessage(message)
    setMessages((prev) => [...prev, message])
    setNewMessage("")

    // Simulate sending message and getting response
    setTimeout(() => {
      if (currentUser.role === "citizen") {
        const autoResponse: ChatMessage = {
          id: (Date.now() + 1).toString(),
          reportId,
          senderId: "system",
          senderName: "Officer Johnson",
          senderRole: "officer",
          message: "Thank you for your message. I'm reviewing your case and will update you shortly.",
          timestamp: new Date(),
          isRead: false,
        }
        DatabaseService.addMessage(autoResponse)
        setMessages((prev) => [...prev, autoResponse])
      }
      setIsLoading(false)
    }, 1000)
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case "citizen":
        return "bg-blue-500/20 text-blue-300 border-blue-500/30"
      case "officer":
        return "bg-green-500/20 text-green-300 border-green-500/30"
      case "admin":
        return "bg-purple-500/20 text-purple-300 border-purple-500/30"
      default:
        return "bg-gray-500/20 text-gray-300 border-gray-500/30"
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  return (
    <Card className="flex flex-col h-[600px] bg-card/50 backdrop-blur-sm border-border/50">
      <CardHeader className="border-b border-border/50">
        <CardTitle className="flex items-center gap-2 text-foreground">
          <MessageCircle className="h-5 w-5 text-primary" />
          Case Communication
        </CardTitle>
        <CardDescription>Chat with assigned officers about this case</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col p-4">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2">
          {messages.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No messages yet. Start a conversation with the investigating team.</p>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.senderId === currentUser.id ? "flex-row-reverse" : "flex-row"}`}
              >
                <Avatar className="w-8 h-8 border">
                  <AvatarFallback className={`text-xs font-medium border ${getRoleColor(message.senderRole)}`}>
                    {getInitials(message.senderName)}
                  </AvatarFallback>
                </Avatar>
                <div
                  className={`max-w-[70%] rounded-lg p-3 ${
                    message.senderId === currentUser.id
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted/50 border border-border/50"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-medium opacity-90">{message.senderName}</span>
                    <span className="text-xs opacity-60">{message.timestamp.toLocaleTimeString()}</span>
                  </div>
                  <p className="text-sm">{message.message}</p>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            disabled={isLoading}
            className="bg-input/50 border-border/50 focus:border-primary/50"
          />
          <Button type="submit" disabled={isLoading || !newMessage.trim()} className="shrink-0">
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
