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

export const SignUp = () => {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<RegistrationInputs>({
        resolver: zodResolver(registrationSchema),
        defaultValues: {
            agreePolitics: false
        }
    })

    const onSubmit: SubmitHandler<RegistrationInputs> = (data) => {
        console.log(data)
        reset()
    }

    return (
        <div className={styles.formWrapper}>
            <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
                <h2 className={styles.title}>Sign Up</h2>
                <div className={styles.oAuthWrapper}>
                    <a href=""><Image src={googleSvg} alt={"Google"}/></a>
                    <a href=""><Image src={gitHubSvg} alt={"GitHub"}/></a>
                </div>
                <div className={styles.inputsTextWrapper}>
                    <Input register={register} name={"username"} error={errors.username?.message} placeholder={"Epam11"} label={"Username"} />
                    <Input register={register} name={"email"} error={errors.email?.message} placeholder={"Epam@epam.com"} label={"Email"}/>
                    <Input register={register} name={"password"} error={errors.password?.message} label={"Password"} type={"password"} showPasswordToggle/>
                    <Input register={register} name={"passwordConfirmation"} error={errors.passwordConfirmation?.message} label={"Password Confirmation"} type={"password"} showPasswordToggle/>
                </div>
                <div className={styles.signUpWrapper}>
                    <Input register={register} name={"agreePolitics"} error={errors.agreePolitics?.message} label={"I agree to the Terms of Service and Privacy Policy"}
                           type={"checkbox"}/>
                    <Button type="submit">Sign Up</Button>
                </div>
                <div className={styles.signInWrapper}>
                    <p className={styles.signInText}>
                        Do you have an account?
                    </p>
                    <Button variant={"text"}>Sign In</Button>
                </div>
            </form>
        </div>
    );
};

