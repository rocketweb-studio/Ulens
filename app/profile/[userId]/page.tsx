import {UserProfile} from '@/src/feature/userProfile/ui/UserProfile/UserProfile'
import ViewPostModal from '@/src/shared/components/ViewPostModal/ViewPostModal'
import {PostCreate} from '@/src/feature/postCreate/ui/PostCreate/PostCreate'

export default async function UserPage({
  params,
  searchParams,
}: {
  params: Promise<{ userId: string }>
  searchParams: Promise<{ [key: string]: string | undefined }>
}) {
  const { userId } = await params
  const filters = await searchParams
  console.log(filters)
  if (filters.postId) {
    filters.action = ''
  }

  return (
    <div>
      <UserProfile userId={userId} />
      {filters.postId && <ViewPostModal userId={userId} postId={filters.postId} />}
      {filters.action === 'create' && <PostCreate />}
    </div>
  )
}
