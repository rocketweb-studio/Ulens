'use client'

import {useLogoutMutation} from '@/src/feature/auth/api/authApi'
import {useRouter} from 'next/navigation'
import {Path} from '@/src/shared/constants/Path'
import {useAppDispatch} from "@/src/shared/hooks/useAppDispatch";
import {baseApi} from "@/src/store/baseApi";
import {toast} from "react-toastify";
import {Modal} from "@/src/shared/components/Modal/Modal";
import s from "@/src/feature/auth/ui/Logout/confirmLogout.module.scss";
import {setLoaderStatus} from "@/src/store/app-slice";

type Props = {
  isOpen: boolean
  onClose: () => void
  email: string
}

export const Logout = ({ isOpen, onClose, email }: Props) => {
  const router = useRouter()
  const [logout] = useLogoutMutation()

  const dispatch = useAppDispatch()

  const handleYes = async () => {
    try {
      dispatch(setLoaderStatus({ status: 'loading' }))
      await logout().unwrap()
      dispatch(baseApi.util.resetApiState())
      router.push(Path.SignIn)
    } catch (e) {
      toast.error('Something went wrong during Logout')
    } finally {
      onClose()
    }
  }

  return (
    <>
      <Modal isOpen={isOpen} onClose={() => onClose()} modalTitle='Log Out' hideDefaultButton>
        <p>
          Are you really want to log out of your account <b>{email}</b>?
        </p>
        <div className={s.button}>
          <button className={s.yesBtn} onClick={handleYes}>
            Yes
          </button>
          <button className={s.noBtn} onClick={() => onClose()}>
            No
          </button>
        </div>
      </Modal>
    </>
  )
}
