import { redirect } from 'next/navigation'
import {Path} from "@/src/shared/constants/Path";

const allowedParts = ['info', 'devices', 'subscriptions', 'payments']

export default async function SettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>
}) {
  const filters = await searchParams
  if (!filters.part || !allowedParts.includes(filters.part)) {
    redirect(Path.Settings('info'))
  }

  return <div>Текущий раздел: {filters.part}</div>
}
