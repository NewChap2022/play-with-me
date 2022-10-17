import {
    UPDATE_TAGS,
    UPDATE_CURRENT_TAG,
    UPDATE_USER_ACTIVITIES,
    REMOVE_USER_ACTIVITY,
    UPDATE_USER_ACTIVITY,
    UPDATE_EDIT_ACTIVITY
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
        
        case UPDATE_USER_ACTIVITIES:
            return {
                ...state,
                userActivities: [...action.userActivities]
            };

        case REMOVE_USER_ACTIVITY:
           let newState = state.userActivities.filter(activity => {
            return activity._id !== action._id;
           });

           return {
            ...state,
            useActivities: newState
           };
        case UPDATE_EDIT_ACTIVITY: 
            return {
                ...state,
                editActivity: action.activity
            };
        case UPDATE_USER_ACTIVITY:
            return state;   
        default: 
            return state;
    }
}