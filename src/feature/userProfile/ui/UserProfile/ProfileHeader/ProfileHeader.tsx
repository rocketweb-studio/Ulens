'use client'

import s from "@/src/feature/userProfile/ui/UserProfile/userProfile.module.scss";
import Image from "next/image";
import avatar from "@/src/assets/avatarTmp/avatar.jpg";
import {UserProfileActions} from "@/src/feature/userProfile/ui/UserProfile/UserProfileActions/UserProfileActions";
import {useGetProfileByUsedIdQuery} from "@/src/feature/userProfile/api/userProfileApi";
import {Skeleton} from "@/src/shared/components/Skeleton/Skeleton";

type Props = {
    userId: string
}

export const ProfileUserInfo = ({ userId }: Props) => {

    const {data: user, isLoading} = useGetProfileByUsedIdQuery({userId})

    if( isLoading ) {
        return (
            <div className={s.profileHeader}>
                <div className={s.profileAvatar}>
                    <Skeleton height={'auto'} width={'100%'} radius={'50%'}/>
                </div>
                <div className={s.profileInfo}>
                    <div className={s.nameAndFollowRow}>
                        <Skeleton height={'36px'} width={'210px'} radius={'20px'} border={'3px solid #0d0d0d'}/>
                        <Skeleton height={'39px'} width={'200px'} radius={'4px'}/>
                    </div>
                    <div className={s.statisticRow}>
                        <div className={s.statisticItem}>
                            <Skeleton height={'20px'} width={'50px'} radius={'10px'} border={'2px solid #0d0d0d'}/>
                            <Skeleton height={'20px'} width={'80px'} radius={'10px'} border={'2px solid #0d0d0d'}/>
                        </div>
                        <div className={s.statisticItem}>
                            <Skeleton height={'20px'} width={'50px'} radius={'10px'} border={'2px solid #0d0d0d'}/>
                            <Skeleton height={'20px'} width={'80px'} radius={'10px'} border={'2px solid #0d0d0d'}/>
                        </div>
                        <div className={s.statisticItem}>
                            <Skeleton height={'20px'} width={'50px'} radius={'10px'} border={'2px solid #0d0d0d'}/>
                            <Skeleton height={'20px'} width={'80px'} radius={'10px'} border={'2px solid #0d0d0d'}/>
                        </div>
                    </div>
                    <div className={`${s.aboutUser} ${s.aboutUserSkeleton}`}>
                        <Skeleton height={'21px'} width={'100%'} radius={'10px'} border={'2px solid #0d0d0d'}/>
                        <Skeleton height={'21px'} width={'85%'} radius={'10px'} border={'2px solid #0d0d0d'}/>
                        <Skeleton height={'21px'} width={'50%'} radius={'10px'} border={'2px solid #0d0d0d'}/>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className={s.profileHeader}>
            <div className={s.profileAvatar}>
                {user && user?.avatars?.length > 0
                    ? <Image src={`${process.env.NEXT_PUBLIC_MEDIA_URL}${user?.avatars[0].url}`} alt={'avatar'}/>
                    : <Image src={avatar} alt={'avatar'}/>
                }
            </div>
            <div className={s.profileInfo}>
                <div className={s.nameAndFollowRow}>
                    <h1>{user?.userName}</h1>
                    <UserProfileActions/>
                </div>
                <div className={s.statisticRow}>
                    <div className={s.statisticItem}>
                        <strong>{user?.following}</strong>
                        <span>Following</span>
                    </div>
                    <div className={s.statisticItem}>
                        <strong>{user?.followers}</strong>
                        <span>Followers</span>
                    </div>
                    <div className={s.statisticItem}>
                        <strong>{user?.publicationsCount}</strong>
                        <span>Publications</span>
                    </div>
                </div>
                <div className={s.aboutUser}>
                    {user?.aboutMe ? user.aboutMe :
                        <span>
                      Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consequuntur dolor ex hic iusto nulla optio
                      sed totam voluptatem? Adipisci aliquid amet corporis deleniti earum eligendi error ipsum iste labore
                      nobis, perferendis quas quasi rem soluta suscipit veniam vero voluptatem voluptatum? Accusamus aliquam
                      architecto facilis ipsa, maxime non quasi quis sit.
                  </span>
                    }
                </div>
            </div>
        </div>
    )
}
