import {ProfileUserInfo} from "@/src/feature/userProfile/ui/UserProfile/ProfileHeader/ProfileHeader";
import {ProfilePosts} from "@/src/feature/userProfile/ui/UserProfile/ProfilePosts/ProfilePosts";

type Props = {
  userId: string
}

export const UserProfile = ({ userId }: Props) => {
    return (
      <>
        <ProfileUserInfo userId={userId}/>
        <ProfilePosts userId={userId}/>
      </>
  )
}