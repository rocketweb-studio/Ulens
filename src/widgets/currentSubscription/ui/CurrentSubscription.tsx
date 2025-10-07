import s from './CurrentSubscription.module.scss'
import {Card, FlexContainer, Input} from "@/src/shared/ui";
import {useGetMySubscriptionQuery, useToggleAutoRenewalMutation} from "@/src/entities/payments";

export const CurrentSubscription = () => {
// const {data: subscriptionData} = useGetMySubscriptionQuery()
const data = useGetMySubscriptionQuery()
const [toggleAutoRenewal,{data: data2}] = useToggleAutoRenewalMutation()

  const onChangeHandler = () => {
    console.log('subscriptionData', data2)
    toggleAutoRenewal({isAutoRenewal: true})

  }

  return (
    <section className={s.sectionContainer}>
      <h3 className={s.sectionTitle}>Current Subscription:</h3>
      <Card className={s.card}>
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
      <Input type={'checkbox'} label={'Auto-Renewal'} checked={false} onChange={onChangeHandler} />
    </section>
  );
};