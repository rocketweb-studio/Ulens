import { createSlice } from '@reduxjs/toolkit'

export type RequestStatus = 'idle' | 'loading' | 'succeeded' | 'failed'

export const appSlice = createSlice({
  name: 'app',
  initialState: {
    loaderStatus: 'idle' as RequestStatus,
    isLoggedIn: false,
  },
  reducers: (create) => ({
    setIsLoggedIn: create.reducer<{ isLoggedIn: boolean }>((state, action) => {
      state.isLoggedIn = action.payload.isLoggedIn
    }),
    setLoaderStatus: create.reducer<{ status: RequestStatus }>((state, action) => {
      state.loaderStatus = action.payload.status
    }),
  }),
  selectors: {
    selectLoaderStatus: (state) => state.loaderStatus,
    selectIsLoggedIn: (state) => state.isLoggedIn,
  },
})

export const appReducer = appSlice.reducer
export const { setLoaderStatus, setIsLoggedIn } = appSlice.actions
export const { selectLoaderStatus, selectIsLoggedIn } = appSlice.selectors
