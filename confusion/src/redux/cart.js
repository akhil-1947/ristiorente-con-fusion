import * as ActionTypes from './ActionTypes';

export const Cart = (state = {
        isLoading : true,
        cart : null,
        errMess : null
    }, action) => {
        switch (action.type) {
            case ActionTypes.CART_LOADING:
                return {...state, isLoading : true, errMess : null, cart : null};
            case ActionTypes.FETCH_CART:
                return {...state, isLoading : false, errMess : null, cart : action.payload};
            case ActionTypes.CART_FAILED:
                return {...state, isLoading : false, errMess : action.payload, cart : null};
            default:
                return state;
        }
}