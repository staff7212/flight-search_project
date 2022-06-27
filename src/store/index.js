import { configureStore } from '@reduxjs/toolkit';
import flights from '../flightsSlice'

export const store = configureStore({
  reducer: {flights},
  middleware: getDefaultMiddleware => getDefaultMiddleware(),
  devTools: process.env.NODE_ENV !== 'production',
})
