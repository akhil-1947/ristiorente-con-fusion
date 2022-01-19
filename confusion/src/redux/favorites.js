import * as ActionTypes from './ActionTypes';

export const Favorites = (state = {
    isLoading : true,
    favorites : null,
    errMess : null
}, action) => {
    switch (action.type) {
        case ActionTypes.FAVORITES_LOADING:
            return {...state, isLoading : true, errMess : null, favorites: null};
        case ActionTypes.FETCH_FAVORITES:
            return {...state, isLoading : false, favorites: action.payload, errMess : null};
        case ActionTypes.FAVORITES_FAILED:
            return {...state, isLoading : false, errMess : action.payload,favorites : null}; 
        default:
            return state;
    }
}