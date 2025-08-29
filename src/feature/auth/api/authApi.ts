import {baseApi} from "@/src/app/baseApi";
import {UserType} from "@/src/feature/auth/api/authApi.types";
import {getMeResponse, LoginRequestParams, LoginResponse} from "@/src/feature/auth/ui/SignIn";

export const authApi = baseApi.injectEndpoints({
    endpoints: (build) => ({
        getUsers: build.query<UserType[], void>({
            query: () => "auth/users",
        }),
        registration: build.mutation<any, { userName: string, email: string, password: string }>({
            query: (body) => ({method: 'post', url: 'auth/registration', body})
        }),
        confirmRegistration: build.mutation<any, { code: string }>({
            query: (body) => ({method: 'post', url: 'auth/registration-confirmation', body})
        }),
        login: build.mutation<LoginResponse, LoginRequestParams>({
            query: (body) => ({method: "post", url: "auth/login", body}),
            async onQueryStarted(_arg, {dispatch, queryFulfilled}) {
                try {
                    const res = await queryFulfilled;

                    localStorage.setItem("accessToken", res.data.accessToken)
                    await dispatch(authApi.endpoints.getMe.initiate());
                } catch (error) {
                    console.log("login endpoint err: ", error)
                }
            },
        }),
        getMe: build.query<getMeResponse, void>({
            query: () => "/auth/me",
        }),
        passwordRecovery: build.mutation<any, { email: string }>({
            query: (body) => ({method: "post", url: "auth/password-recovery", body}),
        }),
        checkRecoveryCode: build.mutation<any, { code: string }>({
            query: (body) => ({method: "post", url: "auth/check-recovery-code", body}),
        }),
        setNewPassword: build.mutation<any, { password: string, code: string }>({
            query: (body) => ({method: "post", url: "auth/new-password", body}),
        }),

    }),
})

export const {
    useGetUsersQuery,
    useLoginMutation,
    usePasswordRecoveryMutation,
    useRegistrationMutation,
    useConfirmRegistrationMutation,
    useCheckRecoveryCodeMutation,
    useSetNewPasswordMutation,
    useGetMeQuery,
} = authApi