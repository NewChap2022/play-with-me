import {
    UPDATE_TAGS,
    UPDATE_CURRENT_TAG,
    UPDATE_ACTIVITIES,
    UPDATE_USER_ACTIVITIES,
    REMOVE_USER_ACTIVITY
} from "./actions";

export const reducer = (state, action) => {
    switch (action.type) {
        case UPDATE_TAGS:
            return {
                ...state,
                tags: [...action.tags]
            };

        case UPDATE_CURRENT_TAG:
            return {
                ...state,
                currentTag: action.currentTag
            };
        
        case UPDATE_ACTIVITIES:
            return {
                ...state,
                activities: [...action.activities]
            };
        
        case UPDATE_USER_ACTIVITIES:
            return {
                ...state,
                userActivities: [...action.user.activities]
            };

        case REMOVE_USER_ACTIVITY:
           let newState = state.cart.filter(activity => {
            return activity._id !== action._id;
           });

           return {
            ...state,
            useActivities: newState
           };

        default: 
            return state;
    }
}