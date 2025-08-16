'use client'
import Image from "next/image";
import {useLoginMutation} from "@/src/feature/auth/api/authApi";
import {useAppDispatch} from "@/src/app/store";
import {SubmitHandler, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from "zod";
import gitHubSvg from "@/public/github-svg.svg"
import googleSvg from "@/public/google-svg.svg"


const loginSchema = z.object({
    email: z.email("The email must match the format example@example.com"),
    password: z.string(),
})

 export type LoginRequestParams = z.infer<typeof loginSchema>;
 export type LoginResponseAccessToken = {accessToken:string}



export default function SignInPage() {
    const [login] = useLoginMutation()

    const dispatch = useAppDispatch()


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

    const onSubmit: SubmitHandler<LoginRequestParams> = async (data) => {
        console.log("Отправка формы, сделается позже",data)

        try {
            const res = await login(data).unwrap();
            console.log('res', res)
        } catch (error) {
            console.log("ERRR", error)
        }
    };

    return (
        <article>

            <form onSubmit={handleSubmit(onSubmit)}>
                <h2>Sign In</h2>
                <div>
                    <a href=""><Image src={googleSvg} alt={"Google"}  /></a>
                    <a href=""><Image src={gitHubSvg} alt={"GitHub"}/></a>
                </div>
                <input type="text" {...register("email")}  placeholder="Ulens@ulens.com"/>
                {errors.email && <p>{errors.email.message}</p>}

                <input type="text" {...register("password")} placeholder="**********"/>
                {errors.password && <p>{errors.password.message}</p>}

                <button>Sign In</button>
                <span>Don’t have an account?</span>
                <a href="">Sign Up</a>
            </form>

        </article>
    )
}


