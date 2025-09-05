import {baseApi} from "@/src/app/baseApi";
import {LoginRequestParams,LoginResponse,getMeResponse, UserType} from "@/src/feature/auth/api/authApi.types";
import {RegistrationRequest, RegistrationResponce} from "@/src/feature/auth/types";

export const authApi = baseApi.injectEndpoints({
    endpoints: (build) => ({
        getMe: build.query<getMeResponse, void>({
            query: () => "auth/me",
            providesTags: ['Auth']
        }),

        registration: build.mutation<RegistrationResponce, RegistrationRequest>({
            query: (body) => ({method: "post", url: "auth/registration", body}),
            invalidatesTags: ['Auth']
        }),
        confirmRegistration: build.mutation<any, { code: string }>({
            query: (body) => ({method: 'post', url: 'auth/registration-confirmation', body}),
            invalidatesTags: ['Auth']
        }),
        resendRegistrationEmail: build.mutation<any, { email: string, recaptchaToken: string }>({
            query: (body) => ({method: 'post', url: 'auth/registration-email-resending', body}),
        }),
        login: build.mutation<LoginResponse, LoginRequestParams>({
            query: (body) => ({method: "post", url: "auth/login", body}),
            invalidatesTags: ['Auth'],
        }),

        passwordRecovery: build.mutation<any, { email: string, recaptchaToken: string }>({
            query: (body) => ({method: "post", url: "auth/password-recovery", body}),
        }),
        checkRecoveryCode: build.mutation<any, { code: string }>({
            query: (body) => ({method: "post", url: "auth/check-recovery-code", body}),
        }),
        setNewPassword: build.mutation<any, { newPassword: string, recoveryCode: string }>({
            query: (body) => ({method: "post", url: "auth/new-password", body}),
            invalidatesTags: ['Auth'],
        }),
        logout: build.mutation<void, void>({
            query: () => ({method: "post", url: "auth/logout"}),
            invalidatesTags: ['Auth'],
            async onQueryStarted(_arg, { queryFulfilled }) {
                try {
                    await queryFulfilled;
                    localStorage.removeItem('accessToken');
                } catch (error) {
                    console.error('Logout error:', error);
                }
            },
        })
        // getUsers: build.query<UserType[], void>({
        //     query: () => "auth/users",
        //     providesTags: ['User']
        // }),
    }),
})

export const {
    //useGetUsersQuery,
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
