import { UserProfile } from "@/src/feature/userProfile/UserProfile"
import CreatePostModal from "@/src/shared/components/CreatePostModal/CreatePostModal"
import PostModal from "@/src/shared/components/PostModal/PostModal"

export default async function UserPage({
  params,
  searchParams,
}: {
  params: Promise<{ userId: string }>
  searchParams: Promise<{ [key: string]: string | undefined }>
}) {
  const { userId } = await params
  const filters = await searchParams

  if (filters.postId) {
    filters.action = ""
  }

  return (
    <div>
      <UserProfile userId={userId} />
      {filters.postId && <PostModal postId={filters.postId} />}
      {filters.action === "create" && <CreatePostModal />}
    </div>
  )
}
