import { UserProfile } from "@/src/entities/userProfile/model/profileSchema";

export type GetProfileByUserIdResponse = {
  userName: string;
  id: string;
  firstName: string;
  lastName: string;
  city: string;
  country: string;
  region: string;
  dateOfBirth: string;
  aboutMe: string;
  createdAt: string;
  avatars: {
    url: string;
    width: number;
    height: number;
    fileSize: number;
    size: string;
    createdAt: string;
    uploadId: string;
  }[];
  publicationsCount: number;
  followers: number;
  following: number;
};

export type UserProfileResponse = UserProfile & {
  id: string;
};
