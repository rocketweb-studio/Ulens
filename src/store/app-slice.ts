import { createSlice } from '@reduxjs/toolkit'
import { UserProfileType } from '@/src/entities/user/api/user.types'

export type RequestStatus = 'idle' | 'loading' | 'succeeded' | 'failed'

export const appSlice = createSlice({
  name: 'app',
  initialState: {
    loaderStatus: 'idle' as RequestStatus,
    recentSearch: [] as UserProfileType[],
  },
  reducers: (create) => ({
    setLoaderStatus: create.reducer<{ status: RequestStatus }>((state, action) => {
      state.loaderStatus = action.payload.status
    }),
    setRecentSearchRequests: create.reducer<{ recent: UserProfileType[] }>((state, action) => {
      state.recentSearch = action.payload.recent
    }),
  }),
  selectors: {
    selectLoaderStatus: (state) => state.loaderStatus,
    selectRecentSearchRequests: (state) => state.recentSearch,
  },
})

export const appReducer = appSlice.reducer
export const { setLoaderStatus, setRecentSearchRequests } = appSlice.actions
export const { selectLoaderStatus, selectRecentSearchRequests } = appSlice.selectors
