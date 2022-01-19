import * as ActionTypes from './ActionTypes'; 

export const Auth = (state = {
        isLoading : false,
        isAuthenticated : localStorage.getItem('token') ? true : false,
        token : localStorage.getItem('token'),
        user : {
            username : localStorage.getItem('username')
        },
        errMess : null
    }, action) => {
        switch (action.type) {
            case ActionTypes.LOGIN_REQUEST:
                return {...state, isLoading : true, user : action.payload, isAuthenticated : false,errMess : null};
            case ActionTypes.LOGIN_SUCCESS:
                return {...state, isLoading : false, token : action.payload.token, isAuthenticated : true,errMess : null};
            case ActionTypes.LOGIN_FAILURE:
                return {...state, isLoading : false, isAuthenticated : false, errMess : action.payload};
            case ActionTypes.LOGOUT_REQUEST:
                return {...state, isLoading : true,errMess : null};
            case ActionTypes.LOGOUT_SUCCESS:
                return {...state, isLoading : false, isAuthenticated : false,user : null,token : null, errMess : null};
            default :
                return state;
        }
}