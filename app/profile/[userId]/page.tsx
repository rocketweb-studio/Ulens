import { UserProfile } from '@/src/feature/userProfile/ui/UserProfile/UserProfile'
import CreatePostModal from '@/src/shared/components/CreatePostModal/CreatePostModal'
import PostModal from '@/src/shared/components/PostModal/PostModal'
import ViewPostModal from "@/src/shared/components/ViewPostModal/ViewPostModal";

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
      {filters.postId && <ViewPostModal userId={userId} postId={filters.postId}  />}
      {filters.action === 'create' && <CreatePostModal />}
    </div>
  )
}
