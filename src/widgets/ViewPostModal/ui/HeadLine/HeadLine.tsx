import React from 'react'
import s from '@/src/widgets/ViewPostModal/ui/HeadLine/HeadLine.module.scss'
import Link from 'next/link'
import { Path } from '@/src/shared/router/Path'
import { UserAvatar } from '@/src/entities/userProfile'
import { PostMenuActions } from '@/src/widgets/postMenuActions'
import { GetPostByIdResponse } from '@/src/entities/post/api/postsApi.types'

type Props = {
  dataPostModal: GetPostByIdResponse
  handleCloseModal: () => void
  handleSetEditMode: () => void
}

export const HeadLine = ({ dataPostModal, handleCloseModal, handleSetEditMode }: Props) => {
  return (
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
      <PostMenuActions
        postOwnerId={dataPostModal.ownerId || ''}
        postId={dataPostModal.id}
        userId={dataPostModal.ownerId}
        onPostDeleted={handleCloseModal}
        handleSetEditMode={handleSetEditMode}
      />
    </div>
  )
}
