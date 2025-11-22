'use client'

import { FeedPostItem } from '@/src/views/feedPage/ui/FeedPostItem'
import { FlexContainer } from '@/src/shared/ui'
import { useGetFollowingsPostsInfiniteQuery } from '@/src/entities/post/api/postsApi'
import { useInfinityScroll } from '@/src/shared/hooks'

export const FeedPage = () => {
  const { data, fetchNextPage, hasNextPage, isSuccess } = useGetFollowingsPostsInfiniteQuery()
  const { observerRef } = useInfinityScroll({ hasNextPage, fetchNextPage })

  if (!data) {
    return <div> Loading </div>
  }
  const postItems = data.pages.flatMap((page) => page.items) || []
  // console.log(postItems)
  return (
    <FlexContainer align={'center'} direction={'column'} gap={'35px'}>
      {postItems.map((postItem) => (
        <FeedPostItem postItem={postItem} key={postItem.id} />
      ))}

      {hasNextPage && <div ref={observerRef} style={{ height: '10px' }}></div>}
    </FlexContainer>
  )
}
