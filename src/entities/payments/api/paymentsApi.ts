import { baseApi } from '@/src/store/baseApi'
import {
  GetPlansResponce,
  MakePaymentResponse,
  MySubscriptionResponse,
  PaymentPlans,
} from '@/src/entities/payments/api/paymentsApi.types'

export const paymentsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getMySubscription: build.query<MySubscriptionResponse, void>({
      query: () => 'payments/current-subscription',
      providesTags: ['MySubscription'],
    }),

    toggleAutoRenewal: build.mutation<void, { isAutoRenewal: boolean }>({
      query: (body) => ({ method: 'post', url: 'payments/auto-renewal', body }),
      invalidatesTags: ['MySubscription'],
    }),

    getPlans: build.query<GetPlansResponce, void>({
      query: () => 'payments/plans',
      providesTags: ['MySubscription'],
    }),

    makePayment: build.mutation<MakePaymentResponse, { planId: number; provider: PaymentPlans }>({
      query: (body) => ({
        method: 'post',
        url: 'payments/make-payment',
        body,
      }),
      invalidatesTags: ['MySubscription'],
    }),
  }),
})

export const { useGetMySubscriptionQuery, useToggleAutoRenewalMutation, useMakePaymentMutation, useGetPlansQuery } =
  paymentsApi
