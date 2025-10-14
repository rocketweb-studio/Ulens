import s from './UserCount.module.scss'

type Props = {
  totalUsers: number
}
export const UserCount = ({ totalUsers }: Props) => {
  const arrTotalUsers = totalUsers.toString().split('').reverse()

  return (
    <div className={s.boxModel}>
      <h2 className={s.registeredUser}>Registered users:</h2>
      <div className={s.countWrapper}>
        <h2 className={s.countText}>{arrTotalUsers[5] ?? '0'}</h2>
        <h2 className={s.countText}>{arrTotalUsers[4] ?? '0'}</h2>
        <h2 className={s.countText}>{arrTotalUsers[3] ?? '0'}</h2>
        <h2 className={s.countText}>{arrTotalUsers[2] ?? '0'}</h2>
        <h2 className={s.countText}>{arrTotalUsers[1] ?? '0'}</h2>
        <h2 className={s.countText}>{arrTotalUsers[0] ?? '0'}</h2>
      </div>
    </div>
  )
}
