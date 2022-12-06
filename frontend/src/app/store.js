import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import postReducer from '../features/post/postSlice';
import tagReducer from '../features/tag/tagSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    posts: postReducer, 
    tag: tagReducer,
  },
});
