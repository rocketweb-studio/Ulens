'use client'

import { useModal } from '@/src/shared/hooks/useModal'
import { useRouter } from 'next/navigation'
import { Path } from '@/src/shared/router/Path'
import s from './ViewPostModal.module.scss'
import Image from 'next/image'
import { Modal } from '@/src/shared/ui/Modal/Modal'
import { MouseEvent } from 'react'
import Link from 'next/link'
import { IconHeart, IconHeartOutline } from '@rocketweb-studio/ulens-ui-kit'
import { useGetMeQuery } from '@/src/entities/auth/api/authApi'
import { GetPostByIdResponse } from '@/src/entities/post/api/postsApi.types'
import { PostMenuActions } from '@/src/widgets/postMenuActions'
import { CustomSwiper } from '@/src/shared/ui/CustomSwiper'
import { formatDate } from '@/src/shared/utils/dateFormatter'
import { UserAvatar } from '@/src/entities/userProfile'

const comments = [
  {
    id: 1,
    authorImage: '/avatar/avatar_mini.png',
    userName: 'UserName',
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    isChecked: false,
    date: '2 hours ago',
    likesCount: 0,
  },
  {
    id: 2,
    authorImage: '/avatar/avatar_mini.png',
    userName: 'UserName',
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    isChecked: true,
    date: '5 hours ago',
    likesCount: 3,
  },
  {
    id: 3,
    authorImage: '/avatar/avatar_mini.png',
    userName: 'UserName',
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    isChecked: false,
    date: '3 days ago',
    likesCount: 0,
  },
  {
    id: 4,
    authorImage: '/avatar/avatar_mini.png',
    userName: 'UserName',
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    isChecked: false,
    date: '1 week ago',
    likesCount: 0,
  },
  {
    id: 5,
    authorImage: '/avatar/avatar_mini.png',
    userName: 'UserName',
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    isChecked: false,
    date: '1 week ago',
    likesCount: 0,
  },
]

type Props = {
  hardLoad?: boolean
  dataPostModal?: GetPostByIdResponse
}

export const ViewPostModal = ({ dataPostModal, hardLoad }: Props) => {
  const { isOpen, closeModal } = useModal(true)
  const { back, replace } = useRouter()
  const { data: meData } = useGetMeQuery()

  const handleCloseModal = () => {
    hardLoad ? replace(`/profile/${dataPostModal?.ownerId}`) : back()
    closeModal()
  }

  const onOverlayClick = (e: MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) handleCloseModal()
  }

  const slides = dataPostModal?.images.medium.map((image, index) => ({
    id: index,
    content: (
      <div className={s.slideImageWrapper}>
        <Image
          src={`${process.env.NEXT_PUBLIC_MEDIA_URL}${image.url}`}
          alt={''}
          width={image.width}
          height={image.height}
        />
      </div>
    ),
  }))

  if (!dataPostModal) {
    return null
  }

  return (
    <Modal
      className={`${s.modal} ${s.viewPostModal}`}
      isOpen={isOpen}
      onClose={handleCloseModal}
      onOverlayClick={onOverlayClick}
      modalTitle={''}
      withoutPadding
      hideCloseButton
      hideDefaultButton
      animationMode={!hardLoad}
      entity={'postModal'}
    >
      <div className={s.publication}>
        <div className={s.publicationImg}>
          {dataPostModal.images && <CustomSwiper slides={slides || []} className={s.customSwiper} />}
        </div>
        <div className={s.publicationContent}>
          <div className={s.publicationHeadLine}>
            <Link href={Path.UserProfile(dataPostModal.ownerId)} className={s.publicationProfileImage}>
              <UserAvatar
                mode={'size'}
                userName={dataPostModal.userName}
                width={36}
                height={36}
                avatarOwner={dataPostModal.avatarOwner}
              />
              {dataPostModal.userName}
            </Link>
            <div className={s.publicationMenu}>
              <PostMenuActions
                postOwnerId={dataPostModal.ownerId || ''}
                postId={dataPostModal.id}
                userId={dataPostModal.ownerId}
                description={''}
                onPostDeleted={handleCloseModal}
              />
            </div>
          </div>
          <div className={s.postDescription}>
            <p>{dataPostModal.description}</p>
          </div>

          {/*блок комментариев*/}
          <div className={s.publicationComments}>
            {comments.map((comment, index) => (
              <div key={index} className={s.commentWrapper}>
                <div className={s.avatar}>
                  <Image src={comment.authorImage} alt={comment.userName} width={36} height={36} />
                </div>
                <div className={s.commentText}>
                  <strong>{comment.userName}</strong>
                  <p>{comment.text}</p>
                  <div className={s.commentPanel}>
                    <span className={s.date}>{comment.date}</span>
                    {comment.likesCount > 0 && <span className={s.like}>Like: {comment.likesCount}</span>}
                    {meData && <span className={s.like}>Answer</span>}
                  </div>
                </div>
                {meData &&
                  (comment.isChecked ?
                    <div className={s.iconHeart}>
                      <IconHeart />
                    </div>
                  : <div className={s.iconHeartOutline}>
                      <IconHeartOutline />
                    </div>)}
              </div>
            ))}
          </div>
          {/*todo добавить обработчики событий и пути иконок*/}
          {meData && (
            <div className={s.postActions}>
              <div className={s.postActionsLeft}>
                {dataPostModal.isLiked ?
                  <div className={s.iconHeart}>
                    <IconHeart />
                  </div>
                : <div className={s.iconHeartOutline}>
                    <IconHeartOutline />
                  </div>
                }
                <Image width={24} height={24} src={'/savedPost.svg'} alt={'Saved'} />
              </div>
              <Image width={24} height={24} src={'/sendPost.svg'} alt={'Send'} />
            </div>
          )}
          <div className={s.postData}>
            <div className={s.likesPostContainer}>
              <div className={s.likeImagesContainer}>
                <Image className={s.likeImage} width={24} height={24} src={'/github-svg.svg'} alt={'liked'} />
                <Image className={s.likeImage} width={24} height={24} src={'/github-svg.svg'} alt={'liked'} />
                <Image className={s.likeImage} width={24} height={24} src={'/github-svg.svg'} alt={'liked'} />
              </div>
              <span>{`${dataPostModal.likeCount || ''} "Like"`}</span>
            </div>
            <span className={s.date}>{formatDate(dataPostModal.createdAt)}</span>
          </div>
          {meData && (
            <div className={s.addCommentContainer}>
              <input placeholder={'Add a Comment...'} className={s.inputComment} />
              <button className={s.buttonComment}>Publish</button>
            </div>
          )}
        </div>
      </div>
    </Modal>
  )
}
