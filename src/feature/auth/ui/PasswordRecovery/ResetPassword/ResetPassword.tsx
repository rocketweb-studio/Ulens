'use client'

import {Input} from '@/src/common/components/Input/Input';
import s from './ResetPassword.module.scss'
import {Button} from "@/src/common/components/Button/Button";
import {useState} from "react";
import {SubmitHandler, useForm} from "react-hook-form"
import {useSetNewPasswordMutation} from "@/src/feature/auth/api/authApi";
import Image from "next/image";
import imgResend from 'public/rafiki.svg'
import {zodResolver} from "@hookform/resolvers/zod";
import {passwordSchema} from "@/src/feature/auth/lib/schemas";
import {Modal} from "@/src/common/components/Modal/Modal";
import {useRouter} from "next/navigation";

type Inputs = {
  password: string
  passwordConfirmation: string
}

type Props = {
  isValidCode: boolean
  code?: string | undefined
}

export const ResetPassword = ({isValidCode}: Props) => {
  // const [openModal, setOpenModal] = useState(false)
  // const [sendEmail, result] = usePasswordRecoveryMutation()
  const [setNewPassword, result2] = useSetNewPasswordMutation()
  const router = useRouter();


  const {
    register,
    handleSubmit,
    reset,
    formState: {errors},
  } = useForm<Inputs>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {password: '', passwordConfirmation: ''}
  })


  const onSubmit: SubmitHandler<Inputs> = (data) => {
    console.log(data)
    reset()
  }

  console.log(errors)

  const resendEmail = () => {
  //   const email = localStorage.getItem("recoveryEmail")
  //   console.log(email)
  //   sendEmail({email: email || ''})
  // }
  //
  // if (result?.isSuccess) {
  //   setOpenModal(true)
    router.push('/password-recovery')
  }


  return (
    <>
      {isValidCode &&

          <div className={s.formWrapper}>
              <form onSubmit={handleSubmit(onSubmit)}>
                  <h1 className={s.pageTitle}>Create New Password</h1>
                  <Input className={s.input} register={register} name="password" placeholder="*********" label="New password"
                         type={"password"}
                         error={errors.password?.message}
                         showPasswordToggle/>
                  <Input name="passwordConfirmation" register={register} placeholder="*********" label="Password confirmation"
                         error={errors.passwordConfirmation?.message}
                         type={"password"}
                         showPasswordToggle/>
                  <p className={s.infoMessage}>Your password must be between 6 and 20 characters</p>
                  <div className={s.buttonWrapper}>
                      <Button>Create new password и перенаправление на вход в систему</Button>
                  </div>
              </form>
          </div>}

      {!isValidCode &&
          <div className={s.pageWrapper}>
              <h1 className={s.pageTitle2}>Email verification link expired</h1>
              <p className={s.infoMessage2}>Looks like the verification link has expired. Not to worry, we can send the link again</p>
              <Button onClick={resendEmail} className={s.button}>Resend link</Button>
              <Image priority={true} width={470} height={350} src={imgResend} alt={'imgResend'}/>

          </div>}

      {/*<Modal modalTitle={'Email sent'} open={openModal} onClose={() => setOpenModal(false)}>*/}
      {/*  <p className={s.infoMessage3}>We have sent a link to confirm your email to epam@epam.com</p>*/}
      {/*</Modal>*/}
    </>

  );
};