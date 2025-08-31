import {baseApi} from "@/src/app/baseApi";
import {LoginRequestParams,LoginResponse,getMeResponse, UserType} from "@/src/feature/auth/api/authApi.types";
import {RegistrationRequest, RegistrationResponce} from "@/src/feature/auth/types";
import {setLoaderStatus} from "@/src/app/app-slice";

// @ts-ignore
export const authApi = baseApi.injectEndpoints({
    endpoints: (build) => ({
        getUsers: build.query<UserType[], void>({
            query: () => "auth/users",
            onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
                dispatch(setLoaderStatus({ status: 'loading' }))
                try {
                    await queryFulfilled
                } finally {
                    dispatch(setLoaderStatus({ status: 'idle' }))
                }
            },
        }),
        registration: build.mutation<RegistrationResponce, RegistrationRequest>({
            query: (body) => ({method: "post", url: "auth/registration", body}),
            onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
                dispatch(setLoaderStatus({ status: 'loading' }))
                try {
                    await queryFulfilled
                } finally {
                    dispatch(setLoaderStatus({ status: 'idle' }))
                }
            },
        }),
        confirmRegistration: build.mutation<any, { code: string }>({
            query: (body) => ({method: 'post', url: 'auth/registration-confirmation', body}),
            onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
                dispatch(setLoaderStatus({ status: 'loading' }))
                try {
                    await queryFulfilled
                } finally {
                    dispatch(setLoaderStatus({ status: 'idle' }))
                }
            },
        }),
        resendRegistrationEmail: build.mutation<any, { email: string, recaptchaToken: string }>({
            query: (body) => ({method: 'post', url: 'auth/registration-email-resending', body}),
            onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
                dispatch(setLoaderStatus({ status: 'loading' }))
                try {
                    await queryFulfilled
                } finally {
                    dispatch(setLoaderStatus({ status: 'idle' }))
                }
            },
        }),
        login: build.mutation<LoginResponse, LoginRequestParams>({
            query: (body) => ({method: "post", url: "auth/login", body}),
            async onQueryStarted(_arg, {dispatch, queryFulfilled}) {
                try {
                    dispatch(setLoaderStatus({ status: 'loading' }))
                    const res = await queryFulfilled;
                    localStorage.setItem("accessToken", res.data.accessToken)
                    await dispatch(authApi.endpoints.getMe.initiate());
                } catch (error) {
                    console.log("login endpoint err: ", error)
                } finally {
                    dispatch(setLoaderStatus({ status: 'idle' }))
                }
            },
        }),
        getMe: build.query<getMeResponse, void>({
            query: () => "auth/me",
            onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
                dispatch(setLoaderStatus({ status: 'loading' }))
                try {
                    await queryFulfilled
                } finally {
                    dispatch(setLoaderStatus({ status: 'idle' }))
                }
            },
        }),
        passwordRecovery: build.mutation<any, { email: string, recaptchaToken: string }>({
            query: (body) => ({method: "post", url: "auth/password-recovery", body}),
            onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
                dispatch(setLoaderStatus({ status: 'loading' }))
                try {
                    await queryFulfilled
                } finally {
                    dispatch(setLoaderStatus({ status: 'idle' }))
                }
            },
        }),
        checkRecoveryCode: build.mutation<any, { code: string }>({
            query: (body) => ({method: "post", url: "auth/check-recovery-code", body}),
            onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
                dispatch(setLoaderStatus({ status: 'loading' }))
                try {
                    await queryFulfilled
                } finally {
                    dispatch(setLoaderStatus({ status: 'idle' }))
                }
            },
        }),
        setNewPassword: build.mutation<any, { newPassword: string, recoveryCode: string }>({
            query: (body) => ({method: "post", url: "auth/new-password", body}),
            onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
                dispatch(setLoaderStatus({ status: 'loading' }))
                try {
                    await queryFulfilled
                } finally {
                    dispatch(setLoaderStatus({ status: 'idle' }))
                }
            },
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
    useResendRegistrationEmailMutation
} = authApi
