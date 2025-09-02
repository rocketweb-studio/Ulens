'use client'

import {Input} from "@/src/common/components/Input/Input";
import styles from "./SignUp.module.scss"
import {Button} from "@/src/common/components/Button/Button";
import Image from "next/image";
import googleSvg from "@/public/google-svg.svg";
import gitHubSvg from "@/public/github-svg.svg";
import {FieldErrors, SubmitHandler, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {RegistrationInputs, registrationSchema} from "@/src/feature/auth/lib/schemas";
import {useRegistrationMutation} from "@/src/feature/auth/api/authApi";
import {useModal} from "@/src/common/hooks/useModal";
import {Modal} from "@/src/common/components/Modal/Modal";
import {useEffect, useState} from "react";
import {useToast} from "@/src/common/hooks/useToast";
import {Path} from "@/src/common/components/Navigation/Navigation";
import {FetchBaseQueryError} from "@reduxjs/toolkit/query/react";
import {SerializedError} from "@reduxjs/toolkit";
import {ServerErrorType} from "@/src/feature/auth/types";

export const SignUp = () => {
    const [registration, {isSuccess, error, isError}] = useRegistrationMutation()
    const {isOpen, openModal, closeModal} = useModal()
    const {showSuccess} = useToast()
    const [email, setEmail] = useState('')

    const {
        register,
        handleSubmit,
        reset,
        setError,
        clearErrors,
        formState: {errors, isValid},
    } = useForm<RegistrationInputs>({
        mode: "onBlur",
        resolver: zodResolver(registrationSchema),
        defaultValues: {
            agreePolitics: false
        }
    })


    const onSubmit: SubmitHandler<RegistrationInputs> = async (data) => {
        const {userName, email, password} = data
        console.log(data)
        try {
            const res = await registration({userName, email, password}).unwrap()
            showSuccess('You are successfully registered!')
            setEmail(email)
            reset()
        } catch (e) {
        }
    }

    const handleServerError = (error: FetchBaseQueryError | SerializedError | undefined) => {
        if (!error) return

        clearErrors()

        if ('status' in error) {
            if (error.status === 400 && error.data) {
                const serverError = error.data as ServerErrorType
                const errorsMessages = serverError.errorsMessages
                if (errorsMessages && errorsMessages.length > 0) {
                    serverError.errorsMessages.forEach((errorMessage) => {
                        const fieldName = errorMessage.field as keyof RegistrationInputs
                        setError(fieldName, {
                            type: 'serverError',
                            message: errorMessage.message,
                        })
                    })
                }
            }
        }
    }


    useEffect(() => {
        if (isSuccess) openModal()
    }, [isSuccess, openModal])

    useEffect(() => {
        if (isError) {
            handleServerError(error);
        }
    }, [isError]);

    return (
        <div className={styles.formWrapper}>
            <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
                <h2 className={styles.title}>Sign Up</h2>
                <div className={styles.oAuthWrapper}>
                    <a href="https://ulens.org/api/v1/auth/google-login"><Image src={googleSvg} alt={"Google"}/></a>
                    <a href="https://ulens.org/api/v1/auth/github-login"><Image src={gitHubSvg} alt={"GitHub"}/></a>
                </div>
                <div className={styles.inputsTextWrapper}>
                    <Input register={register} name={"userName"} error={errors.userName?.message} placeholder={"Epam11"}
                           label={"Username"} id={"userName"}/>
                    <Input register={register} name={"email"} error={errors.email?.message}
                           placeholder={"Epam@epam.com"} label={"Email"} id={"email"}/>
                    <Input register={register} name={"password"} error={errors.password?.message} label={"Password"}
                           type={"password"} showPasswordToggle id={"password"}/>
                    <Input register={register} name={"passwordConfirmation"}
                           error={errors.passwordConfirmation?.message} label={"Password Confirmation"}
                           type={"password"} showPasswordToggle id={"passwordConfirmation"}/>
                </div>
                <div className={styles.signUpWrapper}>
                    <Input register={register} name={"agreePolitics"} error={errors.agreePolitics?.message}
                           label={<span>I agree to the <Button tagType={"link"} path={Path.TermOfService}
                                                               variant={"in-text"} size={"inherit"} underlineText={true}
                                                               withoutPadding={true}>Terms of Service</Button> and <Button
                               tagType={"link"} path={Path.PrivacyPolicy} variant={"in-text"} size={"inherit"}
                               underlineText={true} withoutPadding={true}>Privacy Policy</Button></span>}
                           type={"checkbox"} id={"agreePolitics"}/>
                    <Button type="submit" disabled={!isValid}>Sign Up</Button>
                </div>
                <div className={styles.signInWrapper}>
                    <p className={styles.signInText}>
                        Do you have an account?
                    </p>
                    <Button tagType={"link"} path={Path.SignIn} type={"button"} variant={"text"}>Sign In</Button>
                </div>
            </form>
            <Modal
                isOpen={isOpen}
                onClose={closeModal}
                modalTitle="Email sent"
            >
                <div>
                    <p>We have sent a link to confirm your email to {email}</p>
                </div>
            </Modal>
        </div>
    );
};

