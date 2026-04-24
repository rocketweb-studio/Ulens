export type MySubscriptionResponse = {
  id: number
  createdAt: string
  expiresAt: string
  isAutoRenewal: boolean
}

export type GetPlansResponce = {
  id: number
  title: string
  description: string
  price: number
  interval: string
  currency: string
}[]

export type PaymentPlans = 'STRIPE' | 'PAYPAL'

export type MakePaymentResponse = {
  url: string
}
