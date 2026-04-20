import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';

import authReducer from './slices/authSlice';
import trekReducer from './slices/trekSlice';
import meshReducer from './slices/meshSlice';
import locationReducer from './slices/locationSlice';
import messageReducer from './slices/messageSlice';
import mapReducer from './slices/mapSlice';

const rootReducer = combineReducers({
  auth: authReducer,
  trek: trekReducer,
  mesh: meshReducer,
  location: locationReducer,
  message: messageReducer,
  map: mapReducer,
});

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['auth', 'trek', 'map'], // Only persist these slices
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
