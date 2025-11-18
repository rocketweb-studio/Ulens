'use client'

import { IconOutlineBell } from '@rocketweb-studio/ulens-ui-kit'
import s from './Notification.module.scss'
import { notificationsApi, useGetNotificationsQuery, useReadNotificationsMutation } from '@/src/entities/notification'
import { io } from 'socket.io-client'
import { useEffect } from 'react'
import { usePopup } from '@/src/shared/hooks/usePopup'
import { timeAgo } from '@/src/shared/utils/timeAgo'
import Scrollbars from 'react-custom-scrollbars'
import { useAppDispatch } from '@/src/shared/hooks/useAppDispatch'
import { NotificationItem } from '@/src/entities/notification/api/notificationApi.types'

export const Notification = () => {
  const { data } = useGetNotificationsQuery()
  const [markAsRead] = useReadNotificationsMutation()
  const { refPopup, showPopup, togglePopup } = usePopup()
  const dispatch = useAppDispatch()

  const iconClickHandler = () => {
    if (data?.unreadedCount !== 0 && data?.notifications) {
      const notificationIds = data.notifications.map((n) => n.id)
      setTimeout(() => {
        markAsRead(notificationIds)
      }, 1000)
    }

    togglePopup(!showPopup)
  }

  useEffect(() => {
    const token = localStorage.getItem('accessToken')

    const socket = io('https://ulens.org/ws', {
      auth: {
        token: token,
      },
      transports: ['websocket', 'polling'],
    })

    //base events
    socket.on('connect', () => {
      socket.emit('SUBSCRIBE_NOTIFICATIONS')
    })

    socket.on('disconnect', (reason) => {
      console.log('disconnect', reason)
    })

    socket.on('connect_error', (err) => {
      console.log('Connection error:', err.message)
    })

    //custom server events
    socket.on('NEW_NOTIFICATION', (data: NotificationItem) => {
      dispatch(
        notificationsApi.util.updateQueryData('getNotifications', undefined, (draft) => {
          draft.notifications.unshift(data)
          draft.unreadedCount = draft.unreadedCount + 1
        }),
      )
    })

    socket.on('ERROR', (error) => {
      console.error('WebSocket error:', error)
    })

    return () => {
      socket.close()
    }
  }, [])

  return (
    <div className={s.wrapper}>
      <div onClick={() => iconClickHandler()}>
        <IconOutlineBell />
        {data?.unreadedCount !== 0 && <div className={s.count}>{data?.unreadedCount}</div>}
      </div>
      {showPopup && (
        <div ref={refPopup} className={s.notifications}>
          <div className={s.header}>Notification</div>
          <Scrollbars style={{ height: 200 }}>
            <ul className={s.noteWrap}>
              {data?.notifications.map((n) => (
                <li key={n.id} className={s.note}>
                  <div className={s.message}>{n.message}</div>
                  <span className={s.date}>
                    {timeAgo(n.sentAt)}
                    {!n.readAt && <span className={s.new}>new</span>}
                  </span>
                </li>
              ))}
            </ul>
          </Scrollbars>
        </div>
      )}
    </div>
  )
}
