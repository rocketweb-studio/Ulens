import s from './CurrentSubscription.module.scss'
import {Card, FlexContainer} from "@/src/shared/ui";
import {useGetMySubscriptionQuery} from "@/src/entities/payments";
import {AutoRenewal} from "@/src/features/payments/autoRenewal";
import {formatDateDDMMYYYY} from "@/src/shared/utils/formatDateDDMMYYYY";

export const CurrentSubscription = () => {
  const {data: subscriptionData, isSuccess} = useGetMySubscriptionQuery()

  return (
    subscriptionData && isSuccess &&
    <section className={s.sectionContainer}>
        <h3 className={s.sectionTitle}>Current Subscription:</h3>
        <Card contentClass={s.card}>
            <FlexContainer gap={45}>
                <FlexContainer gap={12} direction={'column'}>
                    <span className={s.dateTitle}>Created at</span>
                    <span className={s.date}>{formatDateDDMMYYYY(subscriptionData.createdAt)}</span>
                </FlexContainer>
                <FlexContainer gap={12} direction={'column'}>
                    <span className={s.dateTitle}>Expires at</span>
                    <span className={s.date}>{formatDateDDMMYYYY(subscriptionData.expiresAt)}</span>
                </FlexContainer>
            </FlexContainer>
        </Card>
        <AutoRenewal/>
    </section>
  );
};