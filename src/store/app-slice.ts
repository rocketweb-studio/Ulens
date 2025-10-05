import { createSlice } from '@reduxjs/toolkit'

export type RequestStatus = 'idle' | 'loading' | 'succeeded' | 'failed'

export const appSlice = createSlice({
  name: 'app',
  initialState: {
    loaderStatus: 'idle' as RequestStatus,
  },
  reducers: (create) => ({
    setLoaderStatus: create.reducer<{ status: RequestStatus }>((state, action) => {
      state.loaderStatus = action.payload.status
    }),
  }),
  selectors: {
    selectLoaderStatus: (state) => state.loaderStatus,
  },
})

export const appReducer = appSlice.reducer
export const { setLoaderStatus } = appSlice.actions
export const { selectLoaderStatus } = appSlice.selectors
