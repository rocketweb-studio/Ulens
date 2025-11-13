export type Notification = {
  id: number | string
  message: string
  sentAt: string
  readAt: string
}

export type NotificationResponse = {
  notifications: Notification[]
  unreadedCount: number | string
}
