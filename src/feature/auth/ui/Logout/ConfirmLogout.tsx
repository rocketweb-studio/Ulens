'use client'

import { useRouter } from 'next/navigation'
import { Modal } from '@/src/shared/components/Modal/Modal'
import { useLogoutMutation } from '@/src/feature/auth/api/authApi'
import { toast } from 'react-toastify'
import { useDispatch } from 'react-redux'
import { baseApi } from '@/src/store/baseApi'
import s from './confirmLogout.module.scss'
import { Path } from '@/src/shared/constants/Path'

type Props = {
  isOpen: boolean
  onClose: () => void
  email: string
}

export const ConfirmLogout = ({ isOpen, onClose, email }: Props) => {
  const router = useRouter()
  const [logout] = useLogoutMutation()
  const dispatch = useDispatch()

  const handleYes = async () => {
    try {
      await logout().unwrap()
      localStorage.removeItem('accessToken')

      dispatch(baseApi.util.resetApiState())

      onClose()
      router.push(Path.SignIn)
    } catch (e) {
      console.error('Logout error:', e)
      toast.error('Something went wrong during Logout')
    }
  }

  const handleNo = () => {
    toast.error(`User with this email doesn't exist`)
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} modalTitle='Log Out' hideDefaultButton>
      <p>
        Are you really want to log out of your account <b>{email}</b>?
      </p>
      <div className={s.button}>
        <button className={s.yesBtn} onClick={handleYes}>
          Yes
        </button>
        <button className={s.noBtn} onClick={handleNo}>
          No
        </button>
      </div>
    </Modal>
  )
}
