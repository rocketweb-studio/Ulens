'use client'
import Image from "next/image";
import {authApi, useLoginMutation} from "@/src/feature/auth/api/authApi";
import {SubmitHandler, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import gitHubSvg from "@/public/github-svg.svg"
import googleSvg from "@/public/google-svg.svg"
import {Input} from "@/src/shared/components/Input/Input";
import {Button} from "@/src/shared/components/Button/Button";
import {loginSchema} from "@/src/feature/auth/lib/schemas/loginSchema";
import styles from "./SignIn.module.scss"
import {Path} from "@/src/shared/components/Navigation/Navigation";
import {useRedirectIfAuthorized} from "@/src/shared/hooks/useRedirectIfAuthorized";
import {LoginRequestParams} from "@/src/feature/auth/api/authApi.types";
import {useToast} from "@/src/shared/hooks/useToast";
import {useAppDispatch} from "@/src/shared/hooks/useAppDispatch";


export const SignIn = () => {
    const dispatch = useAppDispatch()
    const isLoading = useRedirectIfAuthorized()
    const {showSuccess} = useToast()
    const [login] = useLoginMutation()
    const {
        register,
        handleSubmit,
        reset,
        formState: {errors},
    } = useForm<LoginRequestParams>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })


    const onSubmit: SubmitHandler<LoginRequestParams> = async (data) => {
        try {
            const res = await login(data).unwrap()
            localStorage.setItem("accessToken", res.accessToken)
            dispatch(authApi.endpoints.getMe.initiate());
            showSuccess('Success login')
            reset()
        } catch (error) {
        }
    }

    return (
        <article className={styles.authWrapper}>

            <form onSubmit={handleSubmit(onSubmit)} className={styles.authForm}>
                <h2 className={styles.authForm__title}>Sign In</h2>
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


