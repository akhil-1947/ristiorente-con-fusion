import * as ActionTypes from './ActionTypes';
import { baseUrl } from '../shared/baseUrl';

export const addComment = (comment) => ({
    type : ActionTypes.ADD_COMMENT,
    payload : comment
});

export const postComment = (dishId,rating,comment) => (dispatch) => {
    const newComment = {
        dish : dishId,
        rating : rating,
        comment : comment
    };

    var bearerToken = 'bearer '+localStorage.getItem('token');
    return fetch(baseUrl+'comments',{
        method : 'POST',
        body : JSON.stringify(newComment),
        headers : {
            'Content-Type' : 'application/json',
            'Authorization' : bearerToken
        },
        credentials : "same-origin"
    }).then(response => {
        if(response.ok) {
            return response;
        }
        else {
            var error = new Error('Error'+response.status+': '+response.statusText);
            error.response = response;
            throw error;
        }
    },
        error => {
            var errMess = new Error('Error: '+ error.message);
            throw errMess;
        }
    )
    .then(response => response.json())
    .then(comment => dispatch(addComment(comment)))
    .catch(error => {
        console.log('post comments'+ error.message);
        alert("Your comment can not be posted\nError: "+error.message);
    });
}

//dishes
// This is a redux thunk which return a function
export const fetchDishes = () => (dispatch) => {
    dispatch(dishesLoading(true));

    return fetch(baseUrl + 'dishes')
            .then(response => {
                if(response.ok) {
                    return response;
                }
                else {
                    var error = new Error('Error'+response.status+': '+response.statusText);
                    error.response = response;
                    throw error;
                }
            },
                error => {
                    var errMess = new Error('Error: '+ error.message);
                    throw errMess;
                }
            )
            .then(response => response.json())
            .then(dishes => dispatch(addDishes(dishes)))
            .catch(error => dispatch(dishesFailed(error.message)));
}


// These are normal action creaters which returns action objects
export const dishesLoading = () => ({
    type : ActionTypes.DISHES_LOADING,
});

export const dishesFailed = (errMess) => ({
    type : ActionTypes.DISHES_FAILED,
    payload : errMess
});

export const addDishes = (dishes) => ({
    type : ActionTypes.ADD_DISHES,
    payload : dishes
});

//comments

export const fetchComments = () => (dispatch) => {
    return fetch(baseUrl+'comments')
                .then(response => {
                    if(response.ok) {
                        return response;
                    }
                    else {
                        var error = new Error('Error'+response.status+': '+response.statusText);
                        error.response = response;
                        throw error;
                    }
                },
                    error => {
                        var errMess = new Error('Error: '+ error.message);
                        throw errMess;
                    }
                )
                .then(response => response.json())
                .then(comments => dispatch(addComments(comments)))
                .catch(error => dispatch(commentsFailed(error.message)));
}

export const addComments = (comments) => ({
    type : ActionTypes.ADD_COMMENTS,
    payload : comments
});

export const commentsFailed = (errMess) => ({
    type : ActionTypes.COMMENTS_FAILED,
    payload : errMess,
});

//promotions
export const fetchPromos = () => (dispatch) => {
    dispatch(promosLoading(true));

    return fetch(baseUrl+'promotions')
                .then(response => {
                    if(response.ok) {
                        return response;
                    }
                    else {
                        var error = new Error('Error'+response.status+': '+response.statusText);
                        error.response = response;
                        throw error;
                    }
                },
                    error => {
                        var errMess = new Error('Error: '+ error.message);
                        throw errMess;
                    }
                )
                .then(response => response.json())
                .then(promotions => dispatch(addPromos(promotions)))
                .catch(error => dispatch(promosFailed(error.message)));
}

export const promosLoading = () => ({
    type : ActionTypes.PROMOS_LOADING,
});

export const addPromos = (promos) => ({
    type : ActionTypes.ADD_PROMOS,
    payload : promos
});

export const promosFailed = (errMess) => ({
    type : ActionTypes.PROMOS_FAILED,
    payload : errMess
});

//leaders
export const fetchLeaders = () => (dispatch) => {
    dispatch(leadersLoading(true));

    return fetch(baseUrl+'leaders')
                .then(response => {
                    if(response.ok) {
                        return response;
                    }
                    else {
                        var error = new Error('Error'+ response.status+ ': ' + response.statusText);
                        error.response = response;
                        throw error;
                    }
                }, error => {
                    var errMess = new Error('Error:' + error.message);
                    throw errMess;
                })
                .then(response => response.json())
                .then(leaders => dispatch(addLeaders(leaders)))
                .catch(error => dispatch(leadersFailed(error.message)));
}

export const leadersLoading = () => ({
    type : ActionTypes.LEADERS_LOADING
});

export const addLeaders = (leaders) => ({
    type : ActionTypes.ADD_LEADERS,
    payload : leaders
});

export const leadersFailed = (errMess) => ({
    type : ActionTypes.LEADERS_FAILED,
    payload : errMess
});


// add feedback

export const postFeedback = (firstname,lastname,telnum,email,agree,contactType,message) => (dispatch) => {
    const newFeedback = {
        firstname : firstname,
        lastname : lastname,
        telnum : telnum,
        email : email,
        agree : agree,
        contactType : contactType,
        message : message
    }

    var bearer = 'bearer ' + localStorage.getItem('token');
    
    return fetch(baseUrl+'feedback', {
        method : 'POST',
        body : JSON.stringify(newFeedback),
        headers : {
            'Authorization' : bearer,
            'Content-Type' : 'application/json'
        },
    }).then(response => {
        console.log(response);
        if(response.ok) {
            return response;
        }
        else {
            var error = new Error('Error'+ response.status+ ': ' + response.statusText);
            error.response = response;
            throw error;
        }
    }, error => {
        var errMes = new Error('Error'+ error.message);
        throw errMes;
    })
    .then(response => response.json())
    .then(response => {
        console.log('Submitted Feedback: '+response);
        alert('Your feedback has been successfully submitted. Thank you for taking out your time to fill the feedback form!');
    }).catch((error) => alert("Your form cannot be submitted\n" + error.message));
}


export const requestLogin = (creds) => ({
    type : ActionTypes.LOGIN_REQUEST,
    payload : creds
});

export const loginSuccess = (response) => ({
    type : ActionTypes.LOGIN_SUCCESS,
    payload : response
});

export const loginFailure = (err) => ({
    type : ActionTypes.LOGIN_FAILURE,
    payload : err
});

// USER LOGIN IMPLEMENTATION
// export const loginUser = (userCreds) => (dispatch) => {
//     dispatch(requestLogin(userCreds));

//     return fetch(baseUrl+'users/login', {
//         method : "POST",
//         headers : {
//             'Content-Type' : 'application/json'
//         },
//         body : JSON.stringify(userCreds),
//     })
//     .then((response) => {
//         if(response.ok) {
//             return response;
//         }
//         else {
//             var err = new Error(`Error: ${response.status}`);
//             err.response = response;
//             throw err;
//         }
//     }, err => {throw err})
//     .then((response) => response.json())
//     .then((response) => {
//         if(response.success) {
//             localStorage.setItem('token',response.token);
//             localStorage.setItem('username',userCreds.username);
//             dispatch(fetchFavorites());
//             dispatch(fetchCart());
//             dispatch(fetchAllOrders());
//             dispatch(loginSuccess(response));
//         }
//         else {
//             var err = new Error(`Error: ${response.status}`);
//             err.response = response;
//             throw err;
//         }
//     })
//     .catch((err) => {
//         dispatch(loginFailure(err.message));
//     });
// }

export const loginUser = (userCreds) => (dispatch) => {
    dispatch(requestLogin(userCreds));

    return fetch(baseUrl+'users/login', {
        method : "POST",
        headers : {
            'Content-Type' : 'application/json'
        },
        body : JSON.stringify(userCreds),
    })
    .then((response) => {
        return response;
    }, err => {throw err})
    .then((response) => response.json())
    .then((response) => {
        if(response.success) {
            localStorage.setItem('token',response.token);
            localStorage.setItem('username',userCreds.username);
            dispatch(fetchFavorites());
            dispatch(fetchCart());
            dispatch(fetchAllOrders());
            dispatch(loginSuccess(response));
            alert('Logged in successfully!');
        }
        else {
            var err = new Error(`Error: ${response.status}`);
            err.message = `Error: ${response.err.message}`;
            throw err;
        }
    })
    .catch((err) => {
        alert(err.message);
        dispatch(loginFailure(err.message));
    });
}

export const registerUser = (userCreds) => (dispatch) => {

    return fetch(baseUrl+'users/signup', {
        method : "POST",
        headers : {
            'Content-Type' : 'application/json'
        },
        body : JSON.stringify(userCreds),
    })
    .then((response) => {
        return response;
    }, err => {throw err})
    .then((response) => response.json())
    .then((response) => {
        console.log(response);
        if(response.success) {
            alert('You have been registered successfully!');
            dispatch(loginUser({username : userCreds.username, password : userCreds.password}));
        }
        else {
            var err = new Error(`Error: ${response.status}`);
            err.message = `Error: ${response.err.message}`;
            throw err;
        }
    })
    .catch((err) => {
        alert(err.message);
    });
}


export const logoutRequest = () => ({
    type : ActionTypes.LOGOUT_REQUEST
});

export const logoutSuccess = () => ({
    type : ActionTypes.LOGOUT_SUCCESS,
});

export const logoutUser = () => (dispatch) => {
    dispatch(logoutRequest());
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    dispatch(favoritesFailed('Error : 401 Unauthorized. You cannot access this while being logged out. Login now to access!'));
    dispatch(cartFailed('Error : 401 Unauthorized. You cannot access this while being logged out. Login now to access!'));
    dispatch(ordersFailed('Error : 401 Unauthorized. You cannot access this while being logged out. Login now to access!'));
    dispatch(logoutSuccess());
}

// favorites

export const favoritesLoading = () => ({
    type : ActionTypes.FAVORITES_LOADING
});

export const addFavoritesToList = (favorites) => ({
    type : ActionTypes.FETCH_FAVORITES,
    payload : favorites
});

export const favoritesFailed = (err) => ({
    type : ActionTypes.FAVORITES_FAILED,
    payload : err
});

export const fetchFavorites = () => (dispatch) => {
    dispatch(favoritesLoading(true));

    if(localStorage.getItem('token') != null) {
        var authBearer = 'bearer ' + localStorage.getItem('token'); 
        return fetch(baseUrl+'favorites', {
            method : 'GET',
            headers : {
                'Authorization' : authBearer,
                'Content-Type' : "application/json"
            },
        }).then((response) => {
            if(response.ok) {
                return response;
            }
            else {
                var err = new Error('Error: '+ response.status);
                err.response = response;
                throw err;
            }
        }, err => {throw err})
        .then((response) => response.json())
        .then((favorites) => dispatch(addFavoritesToList(favorites)))
        .catch((err) => dispatch(favoritesFailed(err.message)));
    }
    else {
        dispatch(favoritesFailed("Error: 401"));
    }
}

export const removeFavorite = (dishId) => (dispatch) => {
    dispatch(favoritesLoading(true));
    var bearerToken = 'bearer ' + localStorage.getItem('token');
    return fetch(baseUrl+`favorites/${dishId}`, {
        method : "DELETE",
        headers : {
            'Authorization' : bearerToken,
            'Content-Type' : "application/json"
        },
    }).then((response) => {
        if(response.ok) {
            return response;
        }
        else {
            var err = new Error(`Error: ${response.status}`);
            err.response = response;
            throw err;
        }
    }).then((response) => response.json())
    .then((favorites) => dispatch(addFavoritesToList(favorites)))
    .catch((err) => dispatch(favoritesFailed(err.message)));
}

export const postFavorite = (dishId) => (dispatch) => {
    dispatch(favoritesLoading(true));
    var bearerToken = 'bearer ' + localStorage.getItem('token');
    return fetch(baseUrl+`favorites/${dishId}`, {
        method : "POST",
        headers : {
            'Authorization' : bearerToken,
            'Content-Type' : "application/json"
        },
    }).then((response) => {
        if(response.ok) {
            return response;
        }
        else {
            var err = new Error(`Error: ${response.status}`);
            err.response = response;
            throw err;
        }
    }).then((response) => response.json())
    .then((favorites) => {
        dispatch(addFavoritesToList(favorites));
        alert(`${favorites.dishes.find((id) => id._id === dishId).name} has been successfully added to your favorites!`);
    })
    .catch((err) => dispatch(favoritesFailed(err.message)));
}

// cart
export const cartLoading = () => ({
    type : ActionTypes.CART_LOADING
});

export const addFetchedCart = (cart) => ({
    type : ActionTypes.FETCH_CART,
    payload : cart
});

export const cartFailed = (errMess) => ({
    type: ActionTypes.CART_FAILED,
    payload : errMess
});

export const fetchCart = () => (dispatch) => {
    dispatch(cartLoading(true));
    var bearer = 'bearer ' + localStorage.getItem('token');
    return fetch(baseUrl+'cart', {
        method : 'GET',
        headers : {
            'Authorization' : bearer,
        }
    }).then((response) => {
        if(response.ok) {
            return response;
        }
        else {
            var err = new Error('Error: '+response.status);
            err.response = response;
            throw err;
        }
    }, err => {throw err})
    .then((response) => response.json())
    .then((response) => dispatch(addFetchedCart(response)))
    .catch((err) => dispatch(cartFailed(err.message)));
}

export const addDishToCart = (dishId, quantity,dishName) => (dispatch) => {
    // dispatch(cartLoading(true));
    var bearer = 'bearer ' + localStorage.getItem('token');
    return fetch(baseUrl+`cart/${dishId}`, {
        method : 'POST',
        headers : {
            'Authorization' : bearer,
            'Content-Type' : "application/json"
        },
        body : JSON.stringify({
            quantity : quantity
        })
    }).then((response) => {
        if(response.ok) {
            return response;
        }
        else {
            var err = new Error('Error: '+response.status);
            err.response = response;
            throw err;
        }
    }, err => {throw err})
    .then((response) => response.json())
    .then((response) => {
        dispatch(addFetchedCart(response));
        alert(`${dishName} has been successfully added to your cart!`);
    })
    .catch((err) => dispatch(cartFailed(err.message)));
}


export const removeDishFromCart = (dishId) => (dispatch) => {
    // dispatch(cartLoading(true));
    var bearer = 'bearer ' + localStorage.getItem('token');
    return fetch(baseUrl+`cart/${dishId}`, {
        method : 'DELETE',
        headers : {
            'Authorization' : bearer,
        },
    }).then((response) => {
        if(response.ok) {
            return response;
        }
        else {
            var err = new Error('Error: '+response.status);
            err.response = response;
            throw err;
        }
    }, err => {throw err})
    .then((response) => response.json())
    .then((response) => dispatch(addFetchedCart(response)))
    .catch((err) => dispatch(cartFailed(err.message)));
}

export const emptyCart = () => (dispatch) => {
    // dispatch(cartLoading(true));
    var bearer = 'bearer ' + localStorage.getItem('token');
    return fetch(baseUrl+`cart`, {
        method : 'DELETE',
        headers : {
            'Authorization' : bearer,
        },
    }).then((response) => {
        if(response.ok) {
            return response;
        }
        else {
            var err = new Error('Error: '+response.status);
            err.response = response;
            throw err;
        }
    }, err => {throw err})
    .then((response) => response.json())
    .then((response) => dispatch(addFetchedCart(null)))
    .catch((err) => dispatch(cartFailed(err.message)));
}

export const ordersLoading = () => ({
    type : ActionTypes.ORDERS_LOADING
});

export const ordersFetched = (orders) => ({
    type : ActionTypes.FETCH_ORDERS,
    payload : orders
});

export const ordersFailed = (errMess) => ({
    type : ActionTypes.ORDERS_FAILED,
    payload : errMess
});

export const fetchAllOrders = () => (dispatch) => {
    dispatch(ordersLoading(true));
    var token = 'bearer '+ localStorage.getItem('token');
    return fetch(baseUrl+'orders', {
        method : 'GET',
        headers : {
            'Authorization' : token,
        }
    })
    .then((response) => {
        if(response.ok) {
            return response;
        }
        else {
            var err = new Error('Error: '+response.status);
            err.response = response;
            throw err;
        }
    }, err => {throw err})
    .then((response) => response.json())
    .then((response) => {
        dispatch(ordersFetched(response));
    })
    .catch((err) => {dispatch(ordersFailed(err.message))});
}

export const completePaymentOrder = (orderDocId,paymentId, paymentSignature) => (dispatch) => {
    var token = 'bearer '+ localStorage.getItem('token');
    return fetch(baseUrl+`orders/${orderDocId}`, {
        method : 'POST',
        headers : {
            'Authorization' : token,
            'Content-Type' : 'application/json'
        },
        body : JSON.stringify({
            paymentId : paymentId,
            signature : paymentSignature
        })
    })
    .then((response) => {
        if(response.ok) {
            return response;
        }
        else {
            var err = new Error('Error: '+response.status);
            err.response = response;
            throw err;
        }
    }, err => {throw err})
    .then((response) => response.json())
    .then((response) => {
        dispatch(fetchAllOrders(response));
        dispatch(emptyCart());
    })
    .catch((err) => {alert(err.message)});
}
