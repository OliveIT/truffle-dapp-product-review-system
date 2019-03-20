import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import userReducer from './user/userReducer'
import web3Reducer from './util/web3/web3Reducer'
import commonReducer from 'components/Action/Reducer'

const reducer = combineReducers({
  routing: routerReducer,
  user: userReducer,
  common: commonReducer,
  web3: web3Reducer
})

export default reducer
