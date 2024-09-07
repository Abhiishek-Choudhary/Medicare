import {createStore, combineReducers, applyMiddleware} from 'redux';

import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension'

import { getDoctorReducer } from './reducers/doctorReducer';

const reducer = combineReducers({
    getDoctors: getDoctorReducer
})

const middleware = [thunk];

const store = createStore(
    reducer,
    composeWithDevTools(applyMiddleware(...middleware))
)

export default store;

