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
    uploadAvatar: build.mutation<
      GetProfileByUserIdResponse["avatars"],
      { file: File; userId: string }
    >({
      query: ({ file }) => {
        const formData = new FormData();
        formData.append("avatar", file);
        return {
          url: `profile/avatar`,
          method: "POST",
          body: formData,
        };
      },
      async onQueryStarted({ userId }, { dispatch, queryFulfilled }) {
        try {
          const { data: avatars } = await queryFulfilled;
          dispatch(
            userProfileApi.util.updateQueryData(
              "getProfileByUsedId",
              { userId },
              (draft) => {
                draft.avatars = avatars;
              },
            ),
          );
        } catch (e) {
          console.error("Error update cash", e);
        }
      },
    }),
    deleteAvatar: build.mutation<void, { userId: string }>({
      query: () => ({
        url: `profile/avatar`,
        method: "DELETE",
      }),
      async onQueryStarted({ userId }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          userProfileApi.util.updateQueryData(
            "getProfileByUsedId",
            { userId },
            (draft) => {
              draft.avatars = [];
            },
          ),
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
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
