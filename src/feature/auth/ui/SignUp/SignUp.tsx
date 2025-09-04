"use client"

import { Input } from "@/src/shared/components/Input/Input"
import styles from "./SignUp.module.scss"
import { Button } from "@/src/shared/components/Button/Button"
import Image from "next/image"
import googleSvg from "@/public/google-svg.svg"
import gitHubSvg from "@/public/github-svg.svg"
import { SubmitHandler, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { RegistrationInputs, registrationSchema } from "@/src/feature/auth/lib/schemas"
import { useRegistrationMutation } from "@/src/feature/auth/api/authApi"
import { useModal } from "@/src/shared/hooks/useModal"
import { Modal } from "@/src/shared/components/Modal/Modal"
import { ChangeEvent, useState } from "react"
import { Path } from "@/src/shared/components/Navigation/Navigation"
import { FetchBaseQueryError } from "@reduxjs/toolkit/query/react"
import { ServerErrorType } from "@/src/feature/auth/types"
import { isFetchBaseQueryError } from "@/src/shared/utils"

const COUNT_SYMBOLS_FOR_START_VALIDATE = 6

export const SignUp = () => {
  const [registration] = useRegistrationMutation()
  const { isOpen, openModal, closeModal } = useModal()
  const [email, setEmail] = useState("")

  const {
    register,
    handleSubmit,
    reset,
    setError,
    trigger,
    clearErrors,
    formState: { errors, isValid },
  } = useForm<RegistrationInputs>({
    mode: "onBlur",
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      agreePolitics: false,
    },
  })

  const onSubmit: SubmitHandler<RegistrationInputs> = async (data) => {
    const { userName, email, password } = data
    try {
      const res = await registration({ userName, email, password }).unwrap()
      openModal()
      setEmail(email)
      reset()
    } catch (err) {
      if (isFetchBaseQueryError(err)) {
        handleServerError(err)
      }
    }
  }

  const handleOnChangeInputTypeValue = (
    event: ChangeEvent<HTMLInputElement>,
    triggeredField: keyof RegistrationInputs,
  ) => {
    if (event.target.value.length > COUNT_SYMBOLS_FOR_START_VALIDATE) trigger(triggeredField)
  }

  const handleServerError = (error: FetchBaseQueryError) => {
    if (!error) return
    clearErrors()

    if ("status" in error) {
      if (error.status === 400 && error.data) {
        const serverError = error.data as ServerErrorType
        const errorsMessages = serverError.errorsMessages
        if (errorsMessages && errorsMessages.length > 0) {
          serverError.errorsMessages.forEach((errorMessage) => {
            const fieldName = errorMessage.field as keyof RegistrationInputs
            setError(fieldName, {
              type: "serverError",
              message: errorMessage.message,
            })
          })
        }
      }
    }
  }

  return (
    <div className={styles.formWrapper}>
      <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
        <h2 className={styles.title}>Sign Up</h2>
        <div className={styles.oAuthWrapper}>
          <a href="https://ulens.org/api/v1/auth/google-login">
            <Image src={googleSvg} alt={"Google"} />
          </a>
          <a href="https://ulens.org/api/v1/auth/github-login">
            <Image src={gitHubSvg} alt={"GitHub"} />
          </a>
        </div>
        <div className={styles.inputsTextWrapper}>
          <Input
            register={register}
            name={"userName"}
            onChange={(evt) => handleOnChangeInputTypeValue(evt, "userName")}
            error={errors.userName?.message}
            placeholder={"Epam11"}
            label={"Username"}
            id={"userName"}
          />
          <Input
            register={register}
            name={"email"}
            error={errors.email?.message}
            placeholder={"Epam@epam.com"}
            label={"Email"}
            id={"email"}
          />
          <Input
            register={register}
            name={"password"}
            onChange={(evt) => handleOnChangeInputTypeValue(evt, "password")}
            error={errors.password?.message}
            label={"Password"}
            type={"password"}
            showPasswordToggle
            id={"password"}
          />
          <Input
            register={register}
            name={"passwordConfirmation"}
            error={errors.passwordConfirmation?.message}
            label={"Password Confirmation"}
            type={"password"}
            showPasswordToggle
            id={"passwordConfirmation"}
          />
        </div>
        <div className={styles.signUpWrapper}>
          <Input
            register={register}
            onChange={() => trigger("agreePolitics")}
            name={"agreePolitics"}
            error={errors.agreePolitics?.message}
            label={
              <span>
                I agree to the{" "}
                <Button
                  tagType={"link"}
                  path={Path.TermOfService}
                  variant={"in-text"}
                  size={"inherit"}
                  underlineText
                  withoutPadding
                >
                  Terms of Service
                </Button>{" "}
                and{" "}
                <Button
                  tagType={"link"}
                  path={Path.PrivacyPolicy}
                  variant={"in-text"}
                  size={"inherit"}
                  underlineText
                  withoutPadding
                >
                  Privacy Policy
                </Button>
              </span>
            }
            type={"checkbox"}
            id={"agreePolitics"}
          />
          <Button type="submit" disabled={!isValid}>
            Sign Up
          </Button>
        </div>
        <div className={styles.signInWrapper}>
          <p className={styles.signInText}>Do you have an account?</p>
          <Button tagType={"link"} path={Path.SignIn} type={"button"} variant={"text"}>
            Sign In
          </Button>
        </div>
      </form>
      <Modal isOpen={isOpen} onClose={closeModal} modalTitle="Email sent">
        <div>
          <p>We have sent a link to confirm your email to {email}</p>
        </div>
      </Modal>
    </div>
  )
}
