import { GetPostByIdResponse } from '@/src/entities/post/api/postsApi.types'
import { UserAvatar } from '@/src/entities/userProfile'
import { PostMenuActions } from '@/src/widgets/postMenuActions'
import s from './FeedPostItem.module.scss'
import { timeAgo } from '@/src/shared/utils/timeAgo'

import Link from 'next/link'
import { Path } from '@/src/shared/router/Path'
import Image from 'next/image'
import {
  CustomSwiper,
  FlexContainer,
  IconBookmarkOutline,
  IconHeartOutline,
  IconMessageCircleOutline,
  IconPaperPlaneOutline,
} from '@rocketweb-studio/ulens-ui-kit'
import { CreatePostComment } from '@/src/features/post/postCreateComment'

type Props = {
  postItem: GetPostByIdResponse
}
export const FeedPostItem = ({ postItem }: Props) => {
  console.log(postItem)
  return (
    <FlexContainer direction={'column'} gap={'20px'} className={s.container}>
      <FlexContainer justify={'between'} align={'center'}>
        <FlexContainer gap={'12px'} align={'center'}>
          <UserAvatar userName={postItem.userName} mode={'size'} height={36} width={36} />
          <span className={s.author}>{postItem.userName}</span>
          <p className={s.dateText}>{timeAgo(postItem.createdAt)}</p>
        </FlexContainer>
        <PostMenuActions postId={postItem.id} userId={postItem.ownerId} description={postItem.description} />
      </FlexContainer>

      <CustomSwiper
        className={s.customSwiper}
        slides={postItem.images.medium.map((image, index) => ({
          id: index,
          content: (
            <div className={s.customSwiper}>
              <Link href={Path.ViewPost(postItem.ownerId, postItem.id)} key={postItem.id}>
                <Image
                  className={s.customSwiper}
                  src={`${process.env.NEXT_PUBLIC_MEDIA_URL}${image.url}`}
                  alt={'photo'}
                  width={image.width}
                  height={image.height}
                />
              </Link>
            </div>
          ),
        }))}
      />

      <FlexContainer>
        <IconHeartOutline />
        <IconMessageCircleOutline />
        <IconPaperPlaneOutline />
        <IconBookmarkOutline />
      </FlexContainer>

      <FlexContainer gap={'12px'}>
        <div>
          <UserAvatar userName={postItem.userName} mode={'size'} height={36} width={36} />
        </div>
        <div>
          <span className={s.blockDescription_userName}>{postItem.userName} </span>
          <span className={s.blockDescription_text}>{postItem.description}</span>
        </div>
      </FlexContainer>
      <FlexContainer>
        <CreatePostComment postId={postItem.id} />
      </FlexContainer>
    </FlexContainer>
  )
}
