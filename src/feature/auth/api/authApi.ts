import {baseApi} from "@/src/app/baseApi";
import {LoginRequestParams,LoginResponse,getMeResponse, UserType} from "@/src/feature/auth/api/authApi.types";
import {RegistrationRequest, RegistrationResponce} from "@/src/feature/auth/types";

export const authApi = baseApi.injectEndpoints({
    endpoints: (build) => ({
        getUsers: build.query<UserType[], void>({
            query: () => "auth/users",
        }),
        registration: build.mutation<RegistrationResponce, RegistrationRequest>({
            query: (body) => ({method: "post", url: "auth/registration", body}),
        }),
        confirmRegistration: build.mutation<any, { code: string }>({
            query: (body) => ({method: 'post', url: 'auth/registration-confirmation', body}),
        }),
        resendRegistrationEmail: build.mutation<any, { email: string, recaptchaToken: string }>({
            query: (body) => ({method: 'post', url: 'auth/registration-email-resending', body}),
        }),
        login: build.mutation<LoginResponse, LoginRequestParams>({
            query: (body) => ({method: "post", url: "auth/login", body}),
        }),
        getMe: build.query<getMeResponse, void>({
            query: () => "auth/me",
        }),
        passwordRecovery: build.mutation<any, { email: string, recaptchaToken: string }>({
            query: (body) => ({method: "post", url: "auth/password-recovery", body}),
        }),
        checkRecoveryCode: build.mutation<any, { code: string }>({
            query: (body) => ({method: "post", url: "auth/check-recovery-code", body}),
        }),
        setNewPassword: build.mutation<any, { newPassword: string, recoveryCode: string }>({
            query: (body) => ({method: "post", url: "auth/new-password", body}),
        }),
        logout: build.mutation<void, void>({
            query: () => ({method: "post", url: "auth/logout"})
        })
    }),
})

export const {
    useGetUsersQuery,
    useLoginMutation,
    useLogoutMutation,
    usePasswordRecoveryMutation,
    useRegistrationMutation,
    useConfirmRegistrationMutation,
    useCheckRecoveryCodeMutation,
    useSetNewPasswordMutation,
    useGetMeQuery,
    useResendRegistrationEmailMutation
} = authApi