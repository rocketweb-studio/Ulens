import s from './CurrentSubscription.module.scss'
import {Card} from "@/src/shared/ui";

export const CurrentSubscription = () => {

  return (
    <section className={s.sectionContainer}>
      <h3 className={s.sectionTitle}>Current Subscription:</h3>
      <Card>
        Test
      </Card>
    </section>
  );
};