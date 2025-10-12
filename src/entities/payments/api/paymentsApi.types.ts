export type MySubscriptionResponse = {
  id: number;
  createdAt: string;
  expiresAt: string;
  isAutoRenewal: boolean;
};

export type PaymentPlans = "STRIPE" | "PAYPAL";

export type MakePaymentResponse = {
  url: string;
};
