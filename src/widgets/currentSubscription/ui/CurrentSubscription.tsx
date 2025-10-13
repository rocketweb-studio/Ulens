import s from './CurrentSubscription.module.scss'
import {Card, FlexContainer, Input} from "@/src/shared/ui";
import {useGetMySubscriptionQuery, useToggleAutoRenewalMutation} from "@/src/entities/payments";
import {AutoRenewal} from "@/src/features/payments/autoRenewal";

export const CurrentSubscription = () => {
  const {data: subscriptionData, isSuccess} = useGetMySubscriptionQuery()

  return (
    subscriptionData && isSuccess &&
    <section className={s.sectionContainer}>
        <h3 className={s.sectionTitle}>Current Subscription:</h3>
        <Card contentClass={s.card}>
            <FlexContainer gap={45}>
                <FlexContainer gap={12} direction={'column'}>
                    <span className={s.dateTitle}>Expire at</span>
                    <span className={s.date}>12.02.2022</span>
                </FlexContainer>
                <FlexContainer gap={12} direction={'column'}>
                    <span className={s.dateTitle}>Next payment</span>
                    <span className={s.date}>12.02.2022</span>
                </FlexContainer>
            </FlexContainer>
        </Card>
        <AutoRenewal/>
    </section>
  );
};