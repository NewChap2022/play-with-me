import { configureStore } from '@reduxjs/toolkit';
import { reducer } from './reducers';

const preloadedState = {
    articles: []
}

export const store = configureStore({
    reducer,
    preloadedState
})