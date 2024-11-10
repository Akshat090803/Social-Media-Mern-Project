import userAuthSlice from "./userAuthSlice";
import userPostSlice from "./userPostSlice"
import socketSlice from "./socketSlice";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import { PersistGate } from "redux-persist/integration/react";
import chatSlice from "./chatSlice";
import NotificationSlice from "./NotificationSlice";
import searchPageSlice from "./searchPageSlice";


const persistConfig = {
  key: "root",
  version: 1,
  storage,
};

//!rootreducer

const rootReducer = combineReducers({
  auth: userAuthSlice,
  Posts:userPostSlice,
  socketio:socketSlice,
  chat:chatSlice,
  search:searchPageSlice,
  notifications:NotificationSlice
});

const persistedReducer = persistReducer(persistConfig, rootReducer);




const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export default store;
