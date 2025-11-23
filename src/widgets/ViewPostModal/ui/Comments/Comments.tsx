import React from 'react'
import s from '@/src/widgets/ViewPostModal/ui/Comments/Comments.module.scss'
import { UserAvatar } from '@/src/entities/userProfile'
import { formatDate } from '@/src/shared/utils/dateFormatter'
import { IconHeart, IconHeartOutline, IconMessageCircleOutline } from '@rocketweb-studio/ulens-ui-kit'
import { Scrollbars } from 'react-custom-scrollbars'
import { GetPostCommentsType } from '@/src/entities/post/api/postsApi.types'
import { getMeResponse } from '@/src/entities/auth/api/authApi.types'

type Props = {
  commentsData: GetPostCommentsType
  meData: getMeResponse | undefined
}

export const Comments = ({ commentsData, meData }: Props) => {
  return (
    <>
      {commentsData?.length ?
        <Scrollbars style={{ height: 310 }}>
          <div className={s.publicationComments}>
            {commentsData.map((comment, index) => (
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
            ))}
          </div>
        </Scrollbars>
      : <div className={s.noCommentsWrapper}>
          <IconMessageCircleOutline width={'100px'} height={'100px'} />
          <p style={{ margin: '0px' }}>There are no comments yet</p>
        </div>
      }
    </>
  )
}
