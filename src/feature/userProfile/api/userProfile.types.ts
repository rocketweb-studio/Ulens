import {UserProfile} from "@/src/feature/userProfile/model/schemas";

export type GetProfileByUserIdResponse = {
  userName: string,
  id: string,
  firstName: string,
  lastName: string,
  city: string,
  country: string,
  region: string,
  dateOfBirth: string,
  aboutMe: string,
  createdAt: string,
  avatars: {
    url: string,
    width: number,
    height: number,
    fileSize: number,
    size: string,
    createdAt: string
  }[],
  publicationsCount: number,
  followers: number,
  following: number
}

export type UserProfileResponse = UserProfile & {
  id: string;
};