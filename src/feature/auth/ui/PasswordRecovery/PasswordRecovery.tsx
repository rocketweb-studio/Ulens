'use client'

import {Input} from '@/src/shared/components/Input/Input';
import s from './PasswordRecovery.module.scss'
import {Button} from "@/src/shared/components/Button/Button";
import {Modal} from "@/src/shared/components/Modal/Modal";
import {usePasswordRecoveryMutation} from "@/src/feature/auth/api/authApi";
import {SubmitHandler, useForm} from "react-hook-form"
import {zodResolver} from "@hookform/resolvers/zod";
import {emailSchema} from "@/src/feature/auth/lib/schemas/emailSchema";
import {useModal} from "@/src/shared/hooks/useModal";
import ReCaptcha from "@/src/feature/auth/ui/PasswordRecovery/ReCaptcha/ReCaptcha";
import {useState} from "react";
import {Path} from '@/src/shared/components/Navigation/Navigation';

type Inputs = {
  email: string
  recaptchaToken: string
}

export const PasswordRecovery = () => {
  const [sendEmail, result] = usePasswordRecoveryMutation() // {data, isLoading, error}
  const {isOpen, openModal, closeModal} = useModal()
  const [email, setEmail] = useState('')

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: {errors},
  } = useForm<Inputs>({
    resolver: zodResolver(emailSchema),
    defaultValues: {email: '', recaptchaToken: ''},
  })


  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    setEmail(data.email)
    try {
      await sendEmail({email: data.email, recaptchaToken: data.recaptchaToken}).unwrap()
      openModal()
    } catch (e) {}
    reset()
  }


  const setCaptcha = (token: string) => {
    setValue('recaptchaToken', token)
  }

  return (
    <div className={s.formWrapper}>
      <h1 className={s.pageTitle}>Forgot Password</h1>
      <form onSubmit={handleSubmit(onSubmit)}>

        <Input name={'email'} placeholder="Epam@epam.com" label="Email" register={register}
               error={result?.isError ? 'User with this email doesn\'t exist' : errors ? errors.email?.message : ''}
        />
        <p className={s.infoMessage}>Enter your email address and we will send you further instructions</p>
        {result?.isSuccess && <p className={s.infoMessage2}>The link has been sent by email.<br/>
            If you don’t receive an email send link again</p>}
        <div className={s.buttonWrapper}>

          {result.isSuccess
            ? <Button onClick={() => result.reset()} type={'button'}>Send Link Again</Button>
            : <Button type='submit'>Send Link</Button>}
          <Button tagType={"link"} path={Path.SignIn} variant={"text"}>Back to Sign In</Button>

        </div>
        {!result.isSuccess &&
            <ReCaptcha setCaptcha={setCaptcha} errorMessage={errors.recaptchaToken?.message || result?.isError}/>}
      </form>

      <Modal modalTitle={'Email sent'} isOpen={isOpen} onClose={closeModal}>
        <p className={s.infoMessage3}>We have sent a link to confirm your email to {email}</p>
      </Modal>

    </div>
  );
};

