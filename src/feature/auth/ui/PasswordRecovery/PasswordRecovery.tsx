'use client'

import {Input} from '@/src/common/components/Input/Input';
import s from './PasswordRecovery.module.scss'
import {Button} from "@/src/common/components/Button/Button";
import Image from "next/image";
import ReCAPTCHA from '@/public/reCaptcha.svg'
import {Modal} from "@/src/common/components/Modal/Modal";
import {usePasswordRecoveryMutation} from "@/src/feature/auth/api/authApi";
import {useState} from "react";
import {SubmitHandler, useForm} from "react-hook-form"
import {zodResolver} from "@hookform/resolvers/zod";
import {emailSchema} from "@/src/feature/auth/lib/schemas/emailSchema";
import {useRouter} from "next/navigation";

type Inputs = {
  email: string
  ReCAPTCHA: boolean
}

export const PasswordRecovery = () => {
  const [sendEmail, result] = usePasswordRecoveryMutation() // {data, isLoading, error}
  const router = useRouter();
  const [openModal, setOpenModal] = useState(false)

  console.log(result)


  const {
    register,
    handleSubmit,
    reset,
    formState: {errors},
  } = useForm<Inputs>({
    resolver: zodResolver(emailSchema),
    defaultValues: {email: '', ReCAPTCHA: false},
  })

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    sendEmail({email: data.email})
    console.log(data.email)
    reset()
  }

  if (result?.isSuccess && !openModal) {
    setOpenModal(true)
    result.reset()
  }

  // console.log('errors =', errors)


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
          <Button type='submit' >{result.isSuccess ? 'Send Link Again' : 'Send Link'}</Button>
          <Button onClick={()=>{router.push('/sign-in')}} variant={"text"}>Back to Sign In</Button>

        </div>
        {!result.isSuccess && <>
            <div className={s.boxModel}>
                <Input name="ReCAPTCHA" register={register} label="I’m not a robot" type={"checkbox"}
                       error={errors?.ReCAPTCHA?.message}/>
                <Image src={ReCAPTCHA} alt={'ReCAPTCHA'}/>
            </div>
        </>}

      </form>


      <Modal modalTitle={'Email sent'} open={openModal} onClose={() => setOpenModal(false)}>
        <p className={s.infoMessage3}>We have sent a link to confirm your email to epam@epam.com</p>
      </Modal>

    </div>
  );
};

