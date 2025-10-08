import { baseApi } from "@/src/store/baseApi";
import {
  GetProfileByUserIdResponse,
  UserProfileResponse,
} from "@/src/entities/userProfile/api/userProfile.types";
import { UserProfile } from "@/src/entities/userProfile/model/profileSchema";

export const userProfileApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getProfileByUsedId: build.query<
      GetProfileByUserIdResponse,
      { userId: string }
    >({
      query: ({ userId }) => `profile/${userId}`,
      providesTags: ["GetProfileByUsedId"],
    }),
    updateProfile: build.mutation<UserProfileResponse, UserProfile>({
      query: (body) => ({ method: "put", url: "profile", body }),
      invalidatesTags: ["GetProfileByUsedId"],
    }),
    uploadAvatar: build.mutation<GetProfileByUserIdResponse, { file: File }>({
      query: ({ file }) => {
        const formData = new FormData();
        formData.append("avatar", file);

        return {
          url: `/profile/avatar`,
          method: "POST",
          body: formData,
        };
      },
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(
            userProfileApi.util.updateQueryData(
              "getProfileByUsedId",
              { userId: data.id },
              (draft) => {
                Object.assign(draft, data);
              },
            ),
          );
        } catch {}
      },
    }),
    deleteAvatar: build.mutation<void, void>({
      query: () => ({
        url: `/profile/avatar`,
        method: "DELETE",
      }),
      async onQueryStarted(_, { dispatch, getState, queryFulfilled }) {
        try {
          await queryFulfilled;
          // получаем userId из уже закешированного профиля
          const state: any = getState();
          const cached = Object.keys(state.userProfileApi.queries).find((key) =>
            key.startsWith("getProfileByUsedId"),
          );
          if (!cached) return;

          const args = JSON.parse(cached.split("(")[1].split(")")[0]) as {
            userId: string;
          };
          dispatch(
            userProfileApi.util.updateQueryData(
              "getProfileByUsedId",
              args,
              (draft) => {
                draft.avatars = [];
              },
            ),
          );
        } catch {}
      },
    }),
  }),
});

export const {
  useGetProfileByUsedIdQuery,
  useUpdateProfileMutation,
  useUploadAvatarMutation,
  useDeleteAvatarMutation,
} = userProfileApi;
