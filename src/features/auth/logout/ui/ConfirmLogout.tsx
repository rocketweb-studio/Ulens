// 'use client'
//
// import {useRouter} from 'next/navigation'
// import {Modal} from '@/src/shared/components/Modal/Modal'
// import {useLogoutMutation} from '@/src/features/auth/api/authApi'
// import {toast} from 'react-toastify'
// import {baseApi} from '@/src/store/baseApi'
// import s from './confirmLogout.module.scss'
// import {Path} from '@/src/shared/constants/Path'
// import {AppLoader} from "@/src/shared/components/AppLoader/AppLoader";
// import {useAppDispatch} from "@/src/shared/hooks/useAppDispatch";
//
// type Props = {
//   isOpen: boolean
//   onClose: () => void
//   email: string
// }
//
// export const ConfirmLogout = ({ isOpen, onClose, email }: Props) => {
//   const router = useRouter()
//   const [logout, {isLoading, isSuccess}] = useLogoutMutation()
//   const dispatch = useAppDispatch()
//
//   const handleYes = async () => {
//     try {
//       await logout().unwrap()
//       dispatch(baseApi.util.resetApiState())
//       //onClose()
//       router.push(Path.SignIn)
//     } catch (e) {
//       toast.error('Something went wrong during Logout')
//     } finally {
//       onClose()
//     }
//   }
//
//   const handleNo = () => {
//     onClose()
//   }
//
//   return (
//       <>
//         {(isLoading || isSuccess) && <AppLoader />}
//         <Modal isOpen={isOpen} onClose={onClose} modalTitle='Log Out' hideDefaultButton>
//           <p>
//             Are you really want to log out of your account <b>{email}</b>?
//           </p>
//           <div className={s.button}>
//             <button className={s.yesBtn} onClick={handleYes}>
//               Yes
//             </button>
//             <button className={s.noBtn} onClick={handleNo}>
//               No
//             </button>
//           </div>
//         </Modal>
//       </>
//   )
// }
