'use client'
import Image from "next/image";
import {useLoginMutation} from "@/src/feature/auth/api/authApi";
import {SubmitHandler, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from "zod";
import gitHubSvg from "@/public/github-svg.svg"
import googleSvg from "@/public/google-svg.svg"
import {Input} from "@/src/common/components/Input/Input";
import {Button} from "@/src/common/components/Button/Button";
import {loginSchema} from "@/src/feature/auth/lib/schemas/loginSchema";
import styles from "./SignIn.module.scss"
import {Path} from "@/src/common/components/Navigation/Navigation";
import {useRedirectIfAuthorized} from "@/src/common/hooks/useRedirectIfAuthorized";


export type LoginRequestParams = z.infer<typeof loginSchema>;
export type LoginResponse = { accessToken: string }
export type getMeResponse = { userId: number, userName: string, email: string, isBlocked?: boolean }

export default function SignIn() {
    const isLoading = useRedirectIfAuthorized()
    const [login] = useLoginMutation()

    const {
        register,
        handleSubmit,
        formState: {errors},
    } = useForm<LoginRequestParams>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })

    const onSubmit: SubmitHandler<LoginRequestParams> = (data) => {
        console.log("Отправка формы sign-in", data)
        login(data).unwrap()
    };

    return (
        <article className={styles.authWrapper}>

            <form onSubmit={handleSubmit(onSubmit)} className={styles.authForm}>
                <h2>Sign In</h2>
                <div className={styles.oAuth}>
                    <a href="https://ulens.org/api/v1/auth/google-login"><Image src={googleSvg} alt={"Google"}/></a>
                    <a href="https://ulens.org/api/v1/auth/github-login"><Image src={gitHubSvg} alt={"GitHub"}/></a>
                </div>

                <div className={styles.inputContainer}>
                    <Input register={register} name={"email"} error={errors.email?.message}
                           placeholder={"Ulens@ulens.com"} label={"Email"}/>

                    <Input register={register} name={"password"} error={errors.password?.message} label={"Password"}
                           type={"password"} showPasswordToggle/>
                    <a href={Path.PasswordRecovery} className={styles.forgotPassword}>
                        Forgot Password
                    </a>
                </div>
                <Button disabled={isLoading} variant={"primary"} fullWidth className={styles.submitBtn}>Sign In</Button>

                <span>Don’t have an account?</span>
                <a className={styles.signUpLink} href={Path.SignUp}>Sign Up</a>
            </form>

        </article>
    )
}


