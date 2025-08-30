'use client'

import {Input} from "@/src/common/components/Input/Input";
import styles from "./SignUp.module.scss"
import {Button} from "@/src/common/components/Button/Button";
import Image from "next/image";
import googleSvg from "@/public/google-svg.svg";
import gitHubSvg from "@/public/github-svg.svg";
import {SubmitHandler, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {RegistrationInputs, registrationSchema} from "@/src/feature/auth/lib/schemas";
import {useRegistrationMutation} from "@/src/feature/auth/api/authApi";
import {useModal} from "@/src/common/hooks/useModal";
import {Modal} from "@/src/common/components/Modal/Modal";
import {useEffect, useState} from "react";
import {useRouter} from "next/navigation";

export const SignUp = () => {
    const [registration, {isSuccess, error}] = useRegistrationMutation()
    const {isOpen, openModal, closeModal} = useModal()
    const [email, setEmail] = useState('')
    const router = useRouter();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isValid },
    } = useForm<RegistrationInputs>({
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
            setEmail(email)
            reset()
        } catch (error) {

        }
    }

    useEffect(() => {
        if (isSuccess) openModal()
    }, [isSuccess, openModal])

    return (
        <div className={styles.formWrapper}>
            <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
                <h2 className={styles.title}>Sign Up</h2>
                <div className={styles.oAuthWrapper}>
                    <a href=""><Image src={googleSvg} alt={"Google"}/></a>
                    <a href=""><Image src={gitHubSvg} alt={"GitHub"}/></a>
                </div>
                <div className={styles.inputsTextWrapper}>
                    <Input register={register} name={"userName"} error={errors.userName?.message} placeholder={"Epam11"} label={"Username"} id={"userName"}/>
                    <Input register={register} name={"email"} error={errors.email?.message} placeholder={"Epam@epam.com"} label={"Email"} id={"email"}/>
                    <Input register={register} name={"password"} error={errors.password?.message} label={"Password"} type={"password"} showPasswordToggle id={"password"}/>
                    <Input register={register} name={"passwordConfirmation"} error={errors.passwordConfirmation?.message} label={"Password Confirmation"} type={"password"} showPasswordToggle id={"passwordConfirmation"}/>
                </div>
                <div className={styles.signUpWrapper}>
                    <Input register={register} name={"agreePolitics"} error={errors.agreePolitics?.message} label={"I agree to the Terms of Service and Privacy Policy"}
                           type={"checkbox"} id={"agreePolitics"}/>
                    <Button type="submit" disabled={!isValid}>Sign Up</Button>
                </div>
                <div className={styles.signInWrapper}>
                    <p className={styles.signInText}>
                        Do you have an account?
                    </p>
                    <Button type={"button"} variant={"text"} onClick={() => router.push('/sign-in')}>Sign In</Button>
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

