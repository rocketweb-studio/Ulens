export type NotificationItem = {
  id: number
  message: string
  sentAt: string
  readAt: string
}

export type NotificationResponse = {
  notifications: NotificationItem[]
  unreadedCount: number
}
