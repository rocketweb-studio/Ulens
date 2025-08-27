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


export type LoginRequestParams = z.infer<typeof loginSchema>;
export type LoginResponseAccessToken = { accessToken: string }


export default function SignIn() {
    const [login] = useLoginMutation()

    const {
        register,
        handleSubmit,
        formState: {errors},
        reset
    } = useForm<LoginRequestParams>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })

    const onSubmit: SubmitHandler<LoginRequestParams> = async (data) => {
        console.log("Отправка формы sign-in, сделается позже", data)

        try {
            const res = await login(data).unwrap()
            console.log('response sign-in', res)
            localStorage.setItem("accessToken", res.accessToken)
            reset()

        } catch (error) {
            console.log("ERROR sign-in", error)
        }
    };

    return (
        <article className={styles.authWrapper}>

            <form onSubmit={handleSubmit(onSubmit)} className={styles.authForm}>
                <h2>Sign In</h2>
                <div className={styles.oAuth}>
                    <a href=""><Image src={googleSvg} alt={"Google"}/></a>
                    <a href=""><Image src={gitHubSvg} alt={"GitHub"}/></a>
                </div>

                    <div className={styles.inputContainer}>
                    <Input register={register} name={"email"} error={errors.email?.message} placeholder={"Ulens@ulens.com"} label={"Email"}/>

                    <Input register={register} name={"password"} error={errors.password?.message} label={"Password"} type={"password"} showPasswordToggle/>
                    </div>
                    <Button variant={"primary"} fullWidth  className={styles.submitBtn}>Sign In</Button>

                <span>Don’t have an account?</span>
                <a className={styles.signUpLink} href="">Sign Up</a>

            </form>

        </article>
    )
}


