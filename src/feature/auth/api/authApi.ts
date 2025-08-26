import {baseApi} from "@/src/app/baseApi";
import {UserType} from "@/src/feature/auth/api/authApi.types";
import {LoginRequestParams, LoginResponseAccessToken} from "@/src/feature/auth/ui/SignIn";
import {RegistrationInputs} from "@/src/feature/auth/lib/schemas";
import {RegistrationRequest, RegistrationResponce} from "@/src/feature/auth/types";

export const authApi = baseApi.injectEndpoints({
    endpoints: (build) => ({
        getUsers: build.query<UserType[], void>({
            query: () => "users",
        }),
        login: build.mutation<LoginResponseAccessToken, LoginRequestParams>({
            query: (body) => ({method: "post", url: "auth/login", body}),
        }),
        registration: build.mutation<RegistrationResponce, RegistrationRequest>({
            query: (body) => ({method: "post", url: "auth/registration", body})
        })
    }),
})

export const {useGetUsersQuery, useLoginMutation, useRegistrationMutation} = authApi