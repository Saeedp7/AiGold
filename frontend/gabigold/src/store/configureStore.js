import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import categoryReducer from './reducers/categoryReducer';
import goldReducer from './reducers/goldpriceReducer';
import cartActions from './reducers/cartReducer';
import authReducer from './reducers/authReducer';

const rootReducer = combineReducers({
  categories: categoryReducer,
  goldPrice: goldReducer,
  cart: cartActions,
  auth: authReducer,
});

const persistConfig = {
  key: 'root',
  storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: false
  }),
});

const persistor = persistStore(store);

export { store, persistor };
