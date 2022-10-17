import { configureStore } from '@reduxjs/toolkit';
import { reducer } from './reducers';

const preloadedState = {   
    tags: [],
    currentTag: '',
    userActivities: [],
    editActivity: {}
}
export const store = configureStore({
    reducer,
    preloadedState
})