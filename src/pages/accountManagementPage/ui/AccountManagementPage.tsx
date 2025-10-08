import s from './AccountManagementPage.module.scss'
import {CurrentSubscription} from "@/src/widgets/currentSubscription";

export const AccountManagementPage = () => {
  return (
    <main className={s.pageContainer}>
      <CurrentSubscription/>
    </main>
  );
};