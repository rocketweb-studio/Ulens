export type Payment = {
  dateOfPayment: string
  endDateOfSubscription: string
  price: string
  subscriptionType: string
  paymentType: 'Stripe' | 'PayPal'
}
