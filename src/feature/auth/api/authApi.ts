import {baseApi} from "@/src/app/baseApi";
import {UserType} from "@/src/feature/auth/api/authApi.types";

export const authApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getUsers: build.query<UserType[], void>({
      query: () => "users",
    }),
  }),
})

export const {useGetUsersQuery} = authApi