import AuthenticationContract from '../../../../build/contracts/Authentication.json'
import { loginUser } from '../loginbutton/LoginButtonActions'
import store from '../../../store'
import {USER_TYPES, REVIEW_STATUS} from '../../../util/globals'
const contract = require('truffle-contract')

export function signUpUser(user_type, email, user_first_name, user_second_name, user_zipcode, company_name, company_address) {
  let web3 = store.getState().web3.web3Instance

  // Double-check web3's status.
  if (typeof web3 !== 'undefined') {

    return function(dispatch) {
      // Using truffle-contract we create the authentication object.
      const authentication = contract(AuthenticationContract)
      authentication.setProvider(web3.currentProvider)

      // Declaring this for later so we can chain functions on Authentication.
      var authenticationInstance

      // Get current ethereum wallet.
      web3.eth.getCoinbase((error, coinbase) => {
        // Log errors, if any.
        if (error) {
          console.error(error);
        }

        authentication.deployed().then(function(instance) {
          authenticationInstance = instance

          // Attempt to sign up user.
          if( USER_TYPES[user_type] == "User" ){
            authenticationInstance.signupUser(email, user_first_name, user_second_name, user_zipcode, {from: coinbase})
            .then(function(result) {
              // If no error, login user.
              return dispatch(loginUser())
            })
            .catch(function(result) {
              console.log("error in signing up user: ", result);
              // If error...
            })
          }else{
            authenticationInstance.signupCompany(email, company_name, company_address, {from: coinbase})
            .then(function(result) {
              // If no error, login user.
              return dispatch(loginUser())
            })
            .catch(function(result) {
              console.log("error in signing up company: ", result);
              // If error...
            })
          }
        })
      })
    }
  } else {
    console.error('Web3 is not initialized.');
  }
}
