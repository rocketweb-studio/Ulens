'use client'

import { useMemo, useState } from 'react'
import { useFollowUserMutation, useUnfollowUserMutation } from '@/src/entities/user/api/userApi'
import { Modal } from '@/src/shared/ui/Modal/Modal'
import s from './FollowModal.module.scss'

type Props = {
  isOpen: boolean
  onClose: () => void
  title: string
  data: {
    id: string
    userName: string
    firstName: string
    lastName: string
    aboutMe: string
  }[]
  followingsIds?: string[]
}

export const FollowModal = ({ isOpen, onClose, title, data, followingsIds }: Props) => {
  const [search, setSearch] = useState('')

  const [follow] = useFollowUserMutation()
  const [unfollow] = useUnfollowUserMutation()

  const filtered = useMemo(() => {
    if (!search.trim()) return data
    return data.filter(
      (u) =>
        u.userName.toLowerCase().includes(search.toLowerCase()) ||
        u.firstName.toLowerCase().includes(search.toLowerCase()) ||
        u.lastName.toLowerCase().includes(search.toLowerCase()),
    )
  }, [search, data])

  return (
    <Modal isOpen={isOpen} onClose={onClose} modalTitle={title} withoutPadding hideDefaultButton>
      <div className={s.container}>
        <input className={s.search} placeholder='Search' value={search} onChange={(e) => setSearch(e.target.value)} />

        <div className={s.list}>
          {filtered.map((u) => {
            const isFollowing = followingsIds?.includes(u.id)

            return (
              <div key={u.id} className={s.item}>
                <div className={s.info}>
                  <span className={s.userName}>{u.userName}</span>
                  <span className={s.fullName}>
                    {u.firstName} {u.lastName}
                  </span>
                </div>

                {isFollowing ?
                  <button className={s.unfollow} onClick={() => unfollow({ userId: u.id })}>
                    Unfollow
                  </button>
                : <button className={s.follow} onClick={() => follow({ userId: u.id })}>
                    Follow
                  </button>
                }
              </div>
            )
          })}
        </div>
      </div>
    </Modal>
  )
}
