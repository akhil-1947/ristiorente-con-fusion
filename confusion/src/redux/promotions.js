import * as ActionTypes from './ActionTypes';

export const Promotions = (state = {
        isLoading : true,
        promotions : [],
        errMess : null
    }, action) => {
    switch(action.type) {

        case ActionTypes.ADD_PROMOS:
            return {...state, isLoading : false, promotions : action.payload, errMess : null};
        
        case ActionTypes.PROMOS_LOADING:
            return {...state, isLoading : true, promotions : [], errMess : null};
        
        case ActionTypes.PROMOS_FAILED:
            return {...state, isLoading : false, errMess : action.payload};

        default:
            return state;
    }
}