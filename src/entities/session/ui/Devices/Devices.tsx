'use client'

import s from './Devices.module.scss'
import {
  useDeleteAllSessionMutation,
  useDeleteSessionByIdMutation,
  useGetSessionsQuery,
} from '@/src/entities/session/api/sessionApi'
import {
  Button,
  IconChromeBrowser,
  IconDesktopDevice,
  IconLogOut,
  IconPhoneDevice,
} from '@rocketweb-studio/ulens-ui-kit'
import { formatDateDDMMYYYY } from '@/src/shared/utils/formatDateDDMMYYYY'

export const Devices = () => {
  const { data: devices } = useGetSessionsQuery()
  const [deleteAllSession] = useDeleteAllSessionMutation()
  const [deleteSingleSession] = useDeleteSessionByIdMutation()

  return (
    <div className={s.general}>
      <div className={s.currentSession}>
        <h2 className={s.title}>Current device</h2>
        <div className={s.deviceItem}>
          <div className={s.icon}>
            <IconChromeBrowser width={50} height={50} />
          </div>
          <div className={s.deviceInfo}>
            <strong>{devices?.currentSession?.browser}</strong>
            <span>IP {devices?.currentSession?.ip}</span>
          </div>
        </div>
      </div>
      <div className={s.terminate}>
        <Button onClick={() => deleteAllSession()} variant={'outline'}>
          Terminate all other session
        </Button>
      </div>

      <div className={s.otherSessions}>
        <h2 className={s.title}>Active sessions</h2>
        {devices?.otherSessions?.length ?
          <div className={s.deviceList}>
            {devices?.otherSessions?.map((device) => (
              <div className={s.deviceItemOther}>
                <div className={s.leftSecion}>
                  <div className={s.icon}>
                    {device.type === 'desktop' && <IconDesktopDevice width={50} height={50} />}
                    {device.type === 'tablet' && <IconPhoneDevice width={50} height={50} />}
                    {device.type === 'mobile' && <IconPhoneDevice width={50} height={50} />}
                  </div>
                  <div className={s.deviceInfo}>
                    <strong>{device.browser}</strong>
                    <span>IP {device.ip}</span>
                    <span>Last visit: {formatDateDDMMYYYY(device?.createdAt)}</span>
                  </div>
                </div>
                <div className={s.rightSecion} onClick={() => deleteSingleSession({ deviceId: device.deviceId })}>
                  <IconLogOut width={25} height={25} /> Log out
                </div>
              </div>
            ))}
          </div>
        : <div className={s.emptyActiveSession}>You have not yet logged in from other devices</div>}
      </div>
    </div>
  )
}
