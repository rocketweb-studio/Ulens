'use client'

import { useModal } from '@/src/shared/hooks/useModal'
import { FlexContainer } from '@/src/shared/components/FlexContainer'
import { useRouter } from 'next/navigation'
import { Path } from '@/src/shared/constants/Path'
import s from './VewPostModal.module.scss'
import Image from 'next/image'
import { Modal } from '@/src/shared/components/Modal/Modal'
import { MouseEvent } from 'react'
import { useGetPostByIdQuery } from '@/src/feature/Posts/api/postsApi'
import { CustomSwiper } from '@/src/shared/components/CustomSwiper'
import { useGetProfileByUsedIdQuery } from '@/src/feature/userProfile/api/userProfileApi'
import Link from 'next/link'
import { PostMenuActions } from '@/src/feature/Posts/ui/postMenuActions'

export default function ViewPostModal({ userId, postId }: { userId: string; postId: string }) {
  const { isOpen, closeModal } = useModal(true)
  const { replace } = useRouter()

  const onModalCloseHandler = () => {
    closeModal()
    replace(Path.Profile)
  }

  const onOverlayClick = (e: MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      closeModal()
      replace(Path.Profile)
    }
  }
  const { data: postInfo } = useGetPostByIdQuery({ postId })
  const { data: user } = useGetProfileByUsedIdQuery({ userId })

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
                  slides={postInfo?.images.map((image, index) => ({
                    id: index,
                    content: (
                      <Image
                        className={s.zaebalaimg}
                        src={`${process.env.NEXT_PUBLIC_MEDIA_URL}${image.url}`}
                        alt={''}
                        fill
                        style={{ objectFit: 'cover' }}
                      />
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
              <div className={s.publicationProfile}>
                <div className={s.publicationProfileImage}>
                  <Image src={'/avatar/avatar_mini.png'} alt={'Avatar'} width={36} height={36} />
                  <Link href={Path.UserProfile(userId)} className={s.publicationProfileURL}>
                    {user?.userName}
                  </Link>
                  <PostMenuActions postId={userId} description={''} />
                </div>
              </div>
            </div>
          </div>
        </Modal>
      </div>
    </FlexContainer>
  )
}
