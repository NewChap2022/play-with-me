import {
    ADD_ARTICLE,
    UPDATE_ARTICLE,
    DELETE_ARTICLE
} from "./actions";

export const reducer = (state, action) => {
    switch(action.type) {
        case ADD_ARTICLE:
            return {
                ...state,
                articles: [...state.articles, action.article]
            };
        case UPDATE_ARTICLE:
            return {
                ...state,
                articles: state.articles.map(article => {
                    return action._id === article._id ?
                    action.article : article
                })
            };
        case DELETE_ARTICLE:
            let newState = state.articles.filter(article => {
                return article._id !== action._id
            });

            return {
                ...state,
                articles: newState
            }
        default:
            return state;
    }
};