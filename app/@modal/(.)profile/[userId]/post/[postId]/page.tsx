import { ViewPostModal } from '@/src/widgets/ViewPostModal/ui/ViewPostModal'

export default async function InterceptedPostPage({ params }: { params: Promise<{ userId: string; postId: string }> }) {
  const { postId } = await params
  const postData = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}posts/${postId}`).then((res) => res.json())

  return <ViewPostModal dataPostModal={postData} hardLoad={false} />
}
