import { applyMiddleware, createStore } from 'redux'
import reducer from './reducer'
import thunk from 'redux-thunk'

export default createStore(reducer, applyMiddleware(thunk))
