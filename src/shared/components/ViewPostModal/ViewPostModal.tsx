'use client'

import {useModal} from '@/src/shared/hooks/useModal'
import {FlexContainer} from '@/src/shared/components/FlexContainer'
import {useRouter} from 'next/navigation'
import {Path} from '@/src/shared/constants/Path'
import s from './ViewPostModal.module.scss'
import Image from 'next/image'
import {Modal} from '@/src/shared/components/Modal/Modal'
import {MouseEvent} from 'react'
import {useGetPostByIdQuery} from '@/src/feature/Posts/api/postsApi'
import {CustomSwiper} from '@/src/shared/components/CustomSwiper'
import {useGetProfileByUsedIdQuery} from '@/src/feature/userProfile/api/userProfileApi'
import Link from 'next/link'
import {PostMenuActions} from '@/src/feature/Posts/ui/postMenuActions'
import { IconHeart, IconHeartOutline} from '@rocketweb-studio/ulens-ui-kit'
import {useGetMeQuery} from "@/src/feature/auth/api/authApi";

const comments = [
    {
        id: 1,
        authorImage: '/avatar/avatar_mini.png',
        userName: 'UserName',
        text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        isChecked: false,
        date: '2 hours ago',
        likesCount: 0
    },
    {
        id: 2,
        authorImage: '/avatar/avatar_mini.png',
        userName: 'UserName',
        text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        isChecked: true,
        date: '5 hours ago',
        likesCount: 3
    },
    {
        id: 3,
        authorImage: '/avatar/avatar_mini.png',
        userName: 'UserName',
        text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        isChecked: false,
        date: '3 days ago',
        likesCount: 0
    },
    {
        id: 4,
        authorImage: '/avatar/avatar_mini.png',
        userName: 'UserName',
        text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        isChecked: false,
        date: '1 week ago',
        likesCount: 0
    },
    {
        id: 5,
        authorImage: '/avatar/avatar_mini.png',
        userName: 'UserName',
        text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        isChecked: false,
        date: '1 week ago',
        likesCount: 0
    },
]

export default function ViewPostModal({userId, postId}: { userId: string; postId: string }) {
    const {isOpen, closeModal} = useModal(true)
    const {replace,} = useRouter()
    const {data} = useGetMeQuery()

    const onModalCloseHandler = () => {
        closeModal()
        replace(Path.Profile + `/${userId}`)
    }

    const onOverlayClick = (e: MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            closeModal()
            replace(Path.Profile + `/${userId}`)
        }
    }
    const {data: postInfo} = useGetPostByIdQuery({postId})
    const {data: user} = useGetProfileByUsedIdQuery({userId})

    const formattedDate = postInfo?.createdAt
        ? new Intl.DateTimeFormat('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        }).format(new Date(postInfo.createdAt))
        : ''
    return (
        <FlexContainer align={'center'} justify={'center'}>
            <div className={s.wrapper}>
                <Modal
                    className={`${s.modal} ${s.viewPostModal}`}
                    isOpen={isOpen}
                    onClose={onModalCloseHandler}
                    onOverlayClick={onOverlayClick}
                    modalTitle={''}
                    withoutPadding
                    hideCloseButton
                    hideDefaultButton
                >
                    <div className={s.publication}>
                        <div className={s.publicationImg}>
                            {postInfo?.images && (
                                <CustomSwiper
                                    slides={postInfo?.images.medium.map((image, index) => ({
                                        id: index,
                                        content: (
                                            <div className={s.slideImageWrapper}>
                                                <Image
                                                    className={s.zaebalaimg}
                                                    src={`${process.env.NEXT_PUBLIC_MEDIA_URL}${image.url}`}
                                                    alt={''}
                                                    width={image.width}
                                                    height={image.height}
                                                />
                                            </div>
                                        ),
                                    }))}
                                    navigation={true}
                                    pagination={true}
                                    className={s.customSwiper}
                                    allowTouchMove={false}
                                    swiperProps={{
                                        spaceBetween: 0,
                                        slidesPerView: 1,
                                        initialSlide: 0,
                                        noSwiping: true,
                                        noSwipingClass: 'swiper-slide',
                                        preventInteractionOnTransition: true,
                                    }}
                                />
                            )}
                        </div>
                        <div className={s.publicationContent}>
                            <div className={s.publicationHeadLine}>
                                <div className={s.publicationProfileImage}>
                                    <Image src={'/avatar/avatar_mini.png'} alt={'Avatar'} width={36} height={36}/>
                                    <Link href={Path.UserProfile(userId)} className={s.publicationProfileURL}>
                                        {user?.userName}
                                    </Link>
                                </div>
                                <div className={s.publicationMenu}>
                                    <PostMenuActions postId={postId} description={''}/>
                                </div>
                            </div>
                            <div className={s.postDescription}><p>{postInfo?.description}</p></div>

                            {/*блок комментариев*/}
                            <div className={s.publicationComments}>
                                    {comments.map((comment, index) => (
                                        <div key={index} className={s.commentWrapper}>
                                            <div className={s.avatar}>
                                                <Image src={comment.authorImage} alt={comment.userName} width={36}
                                                       height={36}/>
                                            </div>
                                            <div className={s.commentText}>
                                                <strong>{comment.userName}</strong>
                                                <p>{comment.text}</p>
                                                <div className={s.commentPanel}>
                                                    <span className={s.date}>{comment.date}</span>
                                                    {comment.likesCount > 0 &&
                                                        <span className={s.like}>Like: {comment.likesCount}</span>}
                                                    {data && <span className={s.like}>Answer</span>}
                                                </div>
                                            </div>
                                            {data && (comment.isChecked
                                                    ? <div className={s.iconHeart}><IconHeart/></div>
                                                    : <div className={s.iconHeartOutline}><IconHeartOutline/></div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                                {/*todo добавить обработчики событий и пути иконок*/}
                                {data && <div className={s.postActions}>
                                    <div className={s.postActionsLeft}>
                                        {postInfo?.isLiked
                                            ? <div className={s.iconHeart}><IconHeart/></div>
                                            : <div className={s.iconHeartOutline}><IconHeartOutline/></div>}

                                        <Image width={24} height={24} src={"/savedPost.svg"} alt={'Saved'}/>
                                    </div>
                                    <Image width={24} height={24} src={"/sendPost.svg"} alt={'Saved'}/>
                                </div>}
                                <div className={s.postData}>
                                    <div className={s.likesPostContainer}>
                                        <div className={s.likeImagesContainer}>
                                            <Image className={s.likeImage} width={24} height={24}
                                                   src={"/github-svg.svg"} alt={'Saved'}/>
                                            <Image className={s.likeImage} width={24} height={24}
                                                   src={"/github-svg.svg"} alt={'Saved'}/>
                                            <Image className={s.likeImage} width={24} height={24}
                                                   src={"/github-svg.svg"} alt={'Saved'}/>
                                        </div>
                                        <span>{`${postInfo?.likeCount||""} "Like"`}</span>
                                    </div>
                                    <span className={s.date}>{formattedDate}</span>
                                </div>
                                {data && <div className={s.addCommentContainer}>
                                    <input placeholder={'Add a Comment...'} className={s.inputComment}/>
                                    <button className={s.buttonComment}>Publish</button>
                                </div>}
                            </div>
                        </div>
                </Modal>
            </div>
        </FlexContainer>
    )
}
