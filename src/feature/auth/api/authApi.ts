import {baseApi} from "@/src/app/baseApi";
import {UserType} from "@/src/feature/auth/api/authApi.types";
import {LoginRequestParams, LoginResponseAccessToken} from "@/src/feature/auth/ui/SignIn";

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
    login: build.mutation<LoginResponseAccessToken, LoginRequestParams>({
      query: (body) => ({method: "post", url: "auth/login", body}),
    }),
    passwordRecovery: build.mutation<any, { email: string, reCaptcha: string }>({
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
  useSetNewPasswordMutation
} = authApi