// import {ProfileUserInfo} from "@/src/feature/userProfile/ui/UserProfile/ProfileHeader/ProfileHeader";
// import {ProfilePosts} from "@/src/feature/userProfile/ui/UserProfile/ProfilePosts/ProfilePosts";
// import {GetProfileByUserIdResponse} from "@/src/feature/userProfile/api/userProfile.types";
// import {GetPostsByUserIdResponse} from "@/src/feature/Posts/api/postsApi.types";
//
// type Props = {
//   userId: string
// }
//
// // const responseUserInfo = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}profile/${userId}`)
// // const dataUserInfo = await responseUserInfo.json() as GetProfileByUserIdResponse;
// //
// // const responsePosts = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}posts/user/${userId}`)
// // const dataPosts = await responsePosts.json() as GetPostsByUserIdResponse;
//
// export const UserProfile = ({ userId }: Props) => {
//     return (
//       <>
//         <ProfileUserInfo userId={userId}/>
//         <ProfilePosts userId={userId}/>
//       </>
//   )
// }