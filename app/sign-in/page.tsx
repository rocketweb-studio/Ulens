'use client'
import Image from "next/image";
import {useLoginMutation} from "@/src/feature/auth/api/authApi";
import {useAppDispatch} from "@/src/app/store";
import {SubmitHandler, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from "zod";
import gitHubSvg from "@/public/github-svg.svg"
import googleSvg from "@/public/google-svg.svg"
import styles from "@/src/feature/auth/styles/sign-in.module.css"

const loginSchema = z.object({
    email: z.email("The email must match the format example@example.com"),
    password: z.string().min(6),
})

export type LoginRequestParams = z.infer<typeof loginSchema>;
export type LoginResponseAccessToken = { accessToken: string }


export default function SignInPage() {
    const [login] = useLoginMutation()
    const dispatch = useAppDispatch()

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
        console.log("Отправка формы, сделается позже", data)

        try {
            const res = await login(data).unwrap()
            console.log('res', res)
            localStorage.setItem("accessToken", res.accessToken)
            reset()

        } catch (error) {
            console.log("ERROR", error)
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

                <div className={styles.inputWrapper}>

                <div className={styles.inputContainer}>
                    <input type="text" {...register("email")} placeholder="Ulens@ulens.com" className={styles.emailInput} />
                    {errors.email && <span className={styles.errorText}>{errors.email.message}</span>}
                </div>

                <div className={styles.inputContainer}>
                    <input type="text" {...register("password")} placeholder="**********" className={styles.passwordInput} />
                    {errors.password && <span className={styles.errorText}>{errors.password.message}</span>}
                </div>

                <button className={styles.btn}>Sign In</button>
                </div>

                    <span>Don’t have an account?</span>
                    <a className={styles.signUpLink} href="">Sign Up</a>

            </form>

        </article>
    )
}


