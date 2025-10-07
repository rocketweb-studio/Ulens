import s from './CurrentSubscription.module.scss'
import {Card, FlexContainer, Input} from "@/src/shared/ui";

export const CurrentSubscription = () => {

  const onChangeHandler = () => {
    console.log('check ✔')
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