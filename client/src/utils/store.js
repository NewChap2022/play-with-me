import { configureStore } from '@reduxjs/toolkit';
import { reducer } from './reducers';

const preloadedState = {   
    tags: [],
    currentTag: '',
    activities: [],
    userActivities: []
}
export const store = configureStore({
    reducer,
    preloadedState
})