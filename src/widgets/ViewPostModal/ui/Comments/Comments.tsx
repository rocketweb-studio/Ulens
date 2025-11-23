import React from 'react'
import s from '@/src/widgets/ViewPostModal/ui/Comments/Comments.module.scss'
import { UserAvatar } from '@/src/entities/userProfile'
import { formatDate } from '@/src/shared/utils/dateFormatter'
import { IconHeart, IconHeartOutline } from '@rocketweb-studio/ulens-ui-kit'
import { Scrollbars } from 'react-custom-scrollbars'
import { GetPostCommentsType } from '@/src/entities/post/api/postsApi.types'
import { getMeResponse } from '@/src/entities/auth/api/authApi.types'

type Props = {
  commentsData: GetPostCommentsType
  meData: getMeResponse | undefined
}

export const Comments = ({ commentsData, meData }: Props) => {
  return (
    <Scrollbars style={{ height: 300 }}>
      <div className={s.publicationComments}>
        {commentsData?.length ?
          commentsData.map((comment, index) => (
            <div key={index} className={s.commentWrapper}>
              <div className={s.avatar}>
                <UserAvatar
                  mode={'size'}
                  userName={comment.commentator.username}
                  width={36}
                  height={36}
                  avatarOwner={comment.commentator.avatar}
                />
              </div>
              <div className={s.commentText}>
                <strong>{comment?.commentator.username}</strong>
                <p>{comment.content}</p>
                <div className={s.commentPanel}>
                  <span className={s.date}>{formatDate(comment.createdAt)}</span>
                  {comment.likeCount > 0 && <span className={s.like}>Like: {comment.likeCount}</span>}
                  {meData && <span className={s.like}>Answer</span>}
                </div>
              </div>
              {meData &&
                (comment.isLiked ?
                  <div className={s.iconHeart}>
                    <IconHeart />
                  </div>
                : <div className={s.iconHeartOutline}>
                    <IconHeartOutline />
                  </div>)}
            </div>
          ))
        : <>Your comment be first</>}
      </div>
    </Scrollbars>
  )
}
