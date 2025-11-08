'use client'

import {useGetFollowingsPostsQuery} from "@/src/entities/post/api/postsApi";
import {useFollowUserMutation} from "@/src/entities/user/api/userApi";
import {FeedPostItem} from "@/src/views/feedPage/ui/FeedPostItem";
import {FlexContainer} from "@/src/shared/ui";

export const FeedPage = () => {
  const {data} = useGetFollowingsPostsQuery({pageSize: '5', endCursorPostId: '685d6728-315f-4fe6-bc37-5dafc6e20340'})
  const [follow] = useFollowUserMutation()

  if (!data) {
    return (
      <div> Loading </div>
    )
  }



  return (
    <FlexContainer  align={'center'} direction={'column'} gap={'35px'}>
      {data.items.map((postItem) => (
        <FeedPostItem postItem={postItem} key={postItem.id} />
      ))}
      {/*<button onClick={() => {*/}
      {/*  follow({userId: '3f639501-fc13-4608-964f-b99dc2390420'})*/}
      {/*}}>Follow*/}
      {/*</button>*/}
    </FlexContainer>
  );
};