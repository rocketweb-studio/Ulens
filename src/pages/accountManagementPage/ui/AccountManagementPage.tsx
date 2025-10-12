import s from './AccountManagementPage.module.scss'
import { CurrentSubscription } from '@/src/widgets/currentSubscription'
import { PurchaseSubscriptionBlock } from '@/src/widgets/purchaseSubscriptionBlock/ui/PurchaseSubscriptionBlock'

export const AccountManagementPage = () => {
  return (
    <main className={s.pageContainer}>
      <PurchaseSubscriptionBlock />
      <CurrentSubscription />
    </main>
  )
}
