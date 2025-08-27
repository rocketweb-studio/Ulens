import {baseApi} from "@/src/app/baseApi";
import {UserType} from "@/src/feature/auth/api/authApi.types";
import {LoginRequestParams, LoginResponseAccessToken} from "@/src/feature/auth/ui/SignIn";

export const authApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getUsers: build.query<UserType[], void>({
      query: () => "users",
    }),
    login: build.mutation<LoginResponseAccessToken,LoginRequestParams>({
      query: (body) => ({ method: "post", url: "auth/login", body }),
    }),
  }),
})

export const {useGetUsersQuery,useLoginMutation} = authApi