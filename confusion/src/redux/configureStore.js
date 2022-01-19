import { Dishes } from './dishes';
import { Comments } from './comments';
import { Promotions } from './promotions';
import { Leaders } from './leaders';
import { createStore, combineReducers, applyMiddleware } from 'redux';
//applyMiddleware() sets up a middleware pipeline and returns a store enhancer that is passed to createStore()
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import {createForms} from 'react-redux-form';
import { InitialFeedback } from './forms';
import { Auth } from './auth';
import { Favorites } from './favorites';
import { Cart } from './cart';
import { Orders } from './orders';

// Configuring react store
export const configureStore = () => {
    const store = createStore(
        // We have splitted the reducer into multiple reducers that manage partial state, and then 
        // combined them together using combineReducers().
        combineReducers({
            dishes : Dishes,
            comments : Comments,
            leaders : Leaders,
            promotions : Promotions,
            auth : Auth,
            favorites : Favorites,
            cart : Cart,
            orders : Orders,
            //adding the forms to redux store
            ...createForms({
                feedback : InitialFeedback,
            })
        }),
        applyMiddleware(thunk,logger),
    );
    return store;
}