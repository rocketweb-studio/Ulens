'use client'
import Image from 'next/image'
import { useGetMeQuery, useLoginMutation } from '@/src/entities/auth/api/authApi'
import { SubmitHandler, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import gitHubSvg from '@/public/github-svg.svg'
import googleSvg from '@/public/google-svg.svg'
import { Input } from '@/src/shared/ui'
import { Button } from '@/src/shared/ui'
import { loginSchema } from '@/src/entities/auth/model/schemas/loginSchema'
import styles from './SignIn.module.scss'
import { LoginRequestParams } from '@/src/entities/auth/api/authApi.types'
import { Path } from '@/src/shared/router/Path'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { useAppDispatch } from '@/src/shared/hooks/useAppDispatch'
import { setLoaderStatus } from '@/src/store/app-slice'
import { useEffect } from 'react'

export const SignIn = () => {
  const { data: meData, isSuccess } = useGetMeQuery()
  const [login, { isLoading }] = useLoginMutation()
  const isAuth = !!meData?.id && isSuccess
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (document.readyState === 'complete') {
      dispatch(setLoaderStatus({ status: 'idle' }))
    }
  }, [])

  if (isAuth) {
    redirect(Path.UserProfile(meData.id))
  }

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LoginRequestParams>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit: SubmitHandler<LoginRequestParams> = async (data) => {
    try {
      dispatch(setLoaderStatus({ status: 'loading' }))
      const res = await login(data).unwrap()
      reset()
      localStorage.setItem('accessToken', res.accessToken)
    } catch (error) {}
  }

  return (
    <>
      <article className={styles.authWrapper}>
        <form onSubmit={handleSubmit(onSubmit)} className={styles.authForm}>
          <h2 className={styles.authForm__title}>Sign In</h2>
          <div className={styles.oAuth}>
            <a href='https://ulens.org/api/v1/auth/google-login'>
              <Image src={googleSvg} alt={'Google'} />
            </a>
            <a href='https://ulens.org/api/v1/auth/github-login'>
              <Image src={gitHubSvg} alt={'GitHub'} />
            </a>
          </div>

          <div className={styles.inputContainer}>
            <Input
              register={register}
              name={'email'}
              error={errors.email?.message}
              placeholder={'Ulens@ulens.com'}
              label={'Email'}
            />

            <Input
              register={register}
              name={'password'}
              error={errors.password?.message}
              label={'Password'}
              type={'password'}
              showPasswordToggle
            />
            <Link href={Path.PasswordRecovery} className={styles.forgotPassword}>
              Forgot Password
            </Link>
          </div>
          <Button disabled={isLoading} variant={'primary'} fullWidth className={styles.submitBtn}>
            Sign In
          </Button>

          <span>Don’t have an account?</span>
          <Link className={styles.signUpLink} href={Path.SignUp}>
            Sign Up
          </Link>
        </form>
      </article>
    </>
  )
}
