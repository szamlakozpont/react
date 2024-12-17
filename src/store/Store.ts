import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

import authReducer from './appSlices/AuthSlice';
import homeReducer from './appSlices/HomeSlice';
import tableReducer from './appSlices/TableSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    home: homeReducer,
    table: tableReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useReduxDispatch: () => AppDispatch = useDispatch;
export const useReduxSelector: TypedUseSelectorHook<RootState> = useSelector;
