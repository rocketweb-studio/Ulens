'use client'

import {Input} from '@/src/common/components/Input/Input';
import s from './ResetPassword.module.scss'
import {Button} from "@/src/common/components/Button/Button";
import {SubmitHandler, useForm} from "react-hook-form"
import {usePasswordRecoveryMutation, useSetNewPasswordMutation} from "@/src/feature/auth/api/authApi";
import Image from "next/image";
import imgResend from 'public/rafiki.svg'
import {zodResolver} from "@hookform/resolvers/zod";
import {passwordSchema} from "@/src/feature/auth/lib/schemas";
import {useRouter} from "next/navigation";
import {Modal} from "@/src/common/components/Modal/Modal";
import {useModal} from "@/src/common/hooks/useModal";
import ReCaptcha from "@/src/feature/auth/ui/PasswordRecovery/ReCaptcha/ReCaptcha";
import {useState} from "react";
import {Path} from "@/src/common/components/Navigation/Navigation";

type Inputs = {
  password: string
  passwordConfirmation: string
}

type Props = {
  isValidCode: boolean
  email: string
  recoveryCode: string
}

export const ResetPassword = ({isValidCode, recoveryCode, email}: Props) => {
  const {isOpen, openModal, closeModal} = useModal()
  const [sendEmail] = usePasswordRecoveryMutation()
  const [setNewPassword] = useSetNewPasswordMutation()
  const [captcha, setCaptcha] = useState('')
  const [isCaptchaOpen, setIsCaptchaOpen] = useState<boolean>(false);
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


  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      await setNewPassword({newPassword: data.password, recoveryCode}).unwrap()
      openModal()
    } catch (e) {}
    reset()
  }

  const openCaptchaHandler = () => {
    setIsCaptchaOpen(true)
  }

  const resendEmail = () => {
    sendEmail({email, recaptchaToken: captcha})
  }

   const onCloseModalHandler = () => {
     closeModal()
     router.replace(Path.SignIn)
   }

  return (
    <>
      {isValidCode &&

          <div className={s.formWrapper}>
              <form onSubmit={handleSubmit(onSubmit)}>
                  <h1 className={s.pageTitle}>Create New Password</h1>
                  <Input className={s.input} register={register} name="password" placeholder="*********"
                         label="New password"
                         type={"password"}
                         error={errors.password?.message}
                         showPasswordToggle/>
                  <Input name="passwordConfirmation" register={register} placeholder="*********"
                         label="Password confirmation"
                         error={errors.passwordConfirmation?.message}
                         type={"password"}
                         showPasswordToggle/>
                  <p className={s.infoMessage}>Your password must be between 6 and 20 characters</p>
                  <div className={s.buttonWrapper}>
                      <Button>Create new password</Button>
                  </div>
              </form>
          </div>}

      {!isValidCode &&
          <div className={s.pageWrapper}>
              <h1 className={s.pageTitle2}>Email verification link expired</h1>
              <p className={s.infoMessage2}>Looks like the verification link has expired. Not to worry, we can send the
                  link again</p>
            {!isCaptchaOpen
              ?<Button onClick={openCaptchaHandler} className={s.button}>Resend link</Button>
              : <>
                <Button onClick={resendEmail} className={s.button} disabled={!captcha} >Resend link</Button>
                <ReCaptcha setCaptcha={setCaptcha} />
              </>}
              <Image priority={true} width={470} height={350} src={imgResend} alt={'imgResend'}/>
          </div>}

      <Modal modalTitle={'Email sent'} isOpen={isOpen} onClose={onCloseModalHandler}>
        <p className={s.infoMessage3}>We have sent a link to confirm your email to {email}</p>
      </Modal>

    </>

  );
};
