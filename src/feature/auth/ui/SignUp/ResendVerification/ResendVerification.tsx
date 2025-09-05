'use client'

import style from './ResendVerification.module.scss'
import {FlexContainer} from "@/src/shared/components/FlexContainer";
import {Button} from "@/src/shared/components/Button/Button";
import Image from "next/image";
import resendVerificationImage from "@/public/sign-up/resend-verification-link.svg"
import {Input} from '@/src/shared/components/Input/Input';
import {SubmitHandler, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {emailConfirmationSchema, EmailInput} from "@/src/feature/auth/lib/schemas/emailConfirmationSchema";
import {useResendRegistrationEmailMutation} from "@/src/feature/auth/api/authApi";
import {useEffect, useState} from "react";
import {Modal} from "@/src/shared/components/Modal/Modal";
import {useModal} from "@/src/shared/hooks/useModal";

export const ResendVerification = () => {
    const [resend, {isSuccess}] = useResendRegistrationEmailMutation()
    const [email, setEmail] = useState('')
    const {isOpen, openModal, closeModal} = useModal()

    const {
        register,
        handleSubmit,
        reset,
        formState: {errors, isValid},
    } = useForm<EmailInput>({
        resolver: zodResolver(emailConfirmationSchema),
    })

    const onSubmit: SubmitHandler<EmailInput> = async (data) => {
        const {email} = data

        try {
            const res = await resend({email, recaptchaToken: '123456'})
                .unwrap()
            setEmail(email)
            reset()
        } catch (error) {
        }
    }

    useEffect(() => {
        if (isSuccess) openModal()
    }, [isSuccess, openModal])

    return (
        <section className={style.section}>
            <FlexContainer direction={"column"} justify={"center"} align={"center"}>
                <h1 className={style.title}>
                    Email verification link expired
                </h1>
                <p className={style.text}>
                    Looks like the verification link has expired. Not to worry, we can send the link again
                </p>
                <form className={style.form} onSubmit={handleSubmit(onSubmit)}>
                    <Input className={style.input} name={"email"} register={register} error={errors.email?.message} placeholder={"Epam@epam.com"}
                           label={"Email"} id={"email"}/>
                    <Button className={style.button} disabled={!isValid}>Resend verification link</Button>
                </form>
                <Image className={style.image} src={resendVerificationImage} alt={"Image confirmed email"} width={432}
                       height={300}></Image>
                <Modal
                    isOpen={isOpen}
                    onClose={closeModal}
                    modalTitle="Email sent"
                >
                    <div>
                        <p>We have sent a link to confirm your email to {email}</p>
                    </div>
                </Modal>
            </FlexContainer>
        </section>

    );
};

