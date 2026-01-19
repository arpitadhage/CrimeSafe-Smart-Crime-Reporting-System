export class WebSocketService {
  private static instance: WebSocketService
  private ws: WebSocket | null = null
  private messageHandlers: Map<string, (message: any) => void> = new Map()
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5

  static getInstance(): WebSocketService {
    if (!WebSocketService.instance) {
      WebSocketService.instance = new WebSocketService()
    }
    return WebSocketService.instance
  }

  connect(userId: string): void {
    // In a real implementation, this would connect to a WebSocket server
    // For demo purposes, we'll simulate WebSocket behavior
    console.log(`[CrimeSafe] WebSocket connecting for user ${userId}`)

    // Simulate connection after delay
    setTimeout(() => {
      console.log("[CrimeSafe] WebSocket connected")
      this.simulateConnection()
    }, 1000)
  }

  private simulateConnection(): void {
    // Simulate receiving messages every 30 seconds
    setInterval(() => {
      if (Math.random() > 0.7) {
        // 30% chance of receiving a message
        this.simulateIncomingMessage()
      }
    }, 30000)
  }

  private simulateIncomingMessage(): void {
    const mockMessage = {
      id: Date.now().toString(),
      reportId: "1",
      senderId: "3",
      senderName: "Officer Smith",
      senderRole: "officer",
      message: "We have an update on your case. Please check the report details.",
      timestamp: new Date(),
      isRead: false,
    }

    // Notify all message handlers
    this.messageHandlers.forEach((handler) => handler(mockMessage))
  }

  sendMessage(reportId: string, message: string, senderId: string): void {
    console.log(`[CrimeSafe] Sending message for report ${reportId}:`, message)

    // In real implementation, send to WebSocket server
    // For demo, we'll just log and simulate echo
    setTimeout(() => {
      const echoMessage = {
        id: Date.now().toString(),
        reportId,
        senderId: "3",
        senderName: "Officer Smith",
        senderRole: "officer",
        message: "Message received. We'll respond shortly.",
        timestamp: new Date(),
        isRead: false,
      }

      this.messageHandlers.forEach((handler) => handler(echoMessage))
    }, 2000)
  }

  onMessage(handler: (message: any) => void): () => void {
    const id = Date.now().toString()
    this.messageHandlers.set(id, handler)

    // Return cleanup function
    return () => {
      this.messageHandlers.delete(id)
    }
  }

  disconnect(): void {
    console.log("[CrimeSafe] WebSocket disconnected")
    this.messageHandlers.clear()
  }
}
