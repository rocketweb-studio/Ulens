import {baseApi} from '@/src/store/baseApi'
import {MySubscriptionResponse} from "@/src/entities/payments/api/paymentsApi.types";

export const paymentsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getMySubscription: build.query<MySubscriptionResponse, void>({
      query: () => 'payments/current-subscription',
      providesTags: ['MySubscription'],
    }),

    toggleAutoRenewal: build.mutation<void, {isAutoRenewal: boolean}>({
      query: (body) => ({ method: 'post', url: 'payments/auto-renewal', body }),
      invalidatesTags: ['MySubscription'],
    }),

  }),
})

export const {
useGetMySubscriptionQuery,
useToggleAutoRenewalMutation,
} = paymentsApi
