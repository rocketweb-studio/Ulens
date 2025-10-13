import {Input} from "@/src/shared/ui";
import {useGetMySubscriptionQuery, useToggleAutoRenewalMutation} from "@/src/entities/payments";


export const AutoRenewal = () => {
  const {data: subscriptionData} = useGetMySubscriptionQuery()
  const [toggleAutoRenewal,{data: dataAutoRenewal, isLoading}] = useToggleAutoRenewalMutation()

  const onChangeHandler = () => {
    console.log('dataAutoRenewal', dataAutoRenewal)
    toggleAutoRenewal({isAutoRenewal: !subscriptionData?.isAutoRenewal})
  }

  return (
    <>
      <Input type={'checkbox'} label={'Auto-Renewal'} checked={subscriptionData?.isAutoRenewal} onChange={onChangeHandler} disabled={isLoading} />
    </>
  );
};