import { redirect } from 'next/navigation'
import {Path} from "@/src/shared/constants/Path";
import {Tabs} from "@/src/shared/components/Tabs";

const allowedParts = ['info', 'devices', 'subscriptions', 'payments']

export default async function SettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>
}) {
  const params = await searchParams
  if (!params.part || !allowedParts.includes(params.part)) {
    redirect(Path.Settings('info'))
  }

  return (
    <div>
      <Tabs/>
      {params.part === 'info' && <p>Текущий раздел: {params.part}</p>}
      {params.part === 'devices' && <p>Текущий раздел: {params.part}</p>}
      {params.part === 'subscriptions' && <p>Текущий раздел: {params.part}</p>}
      {params.part === 'payments' && <p>Текущий раздел: {params.part}</p>}
    </div>
  )
}
