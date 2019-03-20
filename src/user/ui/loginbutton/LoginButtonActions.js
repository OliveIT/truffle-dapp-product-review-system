import AuthenticationContract from '../../../../build/contracts/Authentication.json'
import { browserHistory } from 'react-router'
import store from '../../../store'
import {USER_TYPES, REVIEW_STATUS} from '../../../util/globals'

const contract = require('truffle-contract')

export const USER_LOGGED_IN = 'USER_LOGGED_IN'
function userLoggedIn(user) {
  return {
    type: USER_LOGGED_IN,
    payload: user
  }
}


function display_user_data(id, userType, email, user_first_name, user_second_name, user_zipcode, company_name, company_address){
  console.log("**** id: ", id.toNumber());
    console.log("**** userType: ", userType.toNumber());
    console.log("**** email: ", email);
    console.log("**** user_first_name: ", user_first_name);
    console.log("**** user_second_name: ", user_second_name);
    console.log("**** user_zipcode: ", user_zipcode);
    console.log("**** company_name: ", company_name);
    console.log("**** company_address: ", company_address);

/*    console.log("**** id: ", id.toNumber(),
                "userType: ", USER_TYPES[userType.toNumber()],
                "email: ", email,
                "user_first_name: ", user_first_name,
                "user_second_name: ", user_second_name,
                "user_zipcode: ", user_zipcode,
                "company_name: ", company_name,
                "company_address: ", company_address);
*/
}

function display_product_data(product_id, company_id, product_name){
  console.log("@@@@ product_id: ", product_id.toNumber(), "company_id: ", company_id.toNumber(), " product_name: ", product_name);
}

function display_review_data(review_id, user_id, product_id, company_id, rating, review, is_spam, review_status, reply){
  console.log("#### review_id: ", review_id.toNumber(),
              "user_id: ", user_id.toNumber(),
              "product_id: ", product_id.toNumber(),
              "review: ", review,
              "is_spam: ", is_spam ? "YES" : "NO",
              "review_status: ", REVIEW_STATUS[review_status.toNumber()],
              "reply: ", reply);
}
  
let getBlockchainData = async function(authentication, coinbase){
  let BlockchainObj = {
    type: "BLOCKCHAIN_DATA",
    data:{
      balance: 0,

      userData:[],
      companyData:[],
      allUserData:[],
      productData:[],
      reviewData:[],
    }
  };

  let web3 = store.getState().web3.web3Instance;

  //my balance
  let curUserID = store.getState().user.data.id;
  if(curUserID)
    BlockchainObj.data.balance = (await authentication.getUserBalance(store.getState().user.data.id)).toNumber();
  //user list
  let allUserCount = (await authentication.totalCount.call()).toNumber();
  console.log("\n\nUser Count : ", allUserCount);

  for(let i = 1; i <= allUserCount; i++){
    let [id, user_type, email, user_first_name, user_second_name, user_zipcode, company_name, company_address] = await authentication.getUser.call(i);
    console.log("^^^^ id: ", id.toNumber(), " user_type: ", USER_TYPES[user_type.toNumber()], " email: ", email);

    let mixedObj = {
      id: id.toNumber(),
      user_type: user_type.toNumber(),
      email: email,
      user_first_name: user_first_name,
      user_second_name: user_second_name,
      user_zipcode: user_zipcode,
      company_name: company_name,
      company_address: company_address
    }
    BlockchainObj.data.allUserData.push(mixedObj);

    if( USER_TYPES[mixedObj.user_type] == 'User'){
      let userObj = {
        id: mixedObj.id,
        email: mixedObj.email,
        user_first_name: mixedObj.user_first_name,
        user_second_name: mixedObj.user_second_name,
        user_zipcode: mixedObj.user_zipcode,
      }
      BlockchainObj.data.userData.push(userObj);
    }
    else{
      let companyObj = {
        id: mixedObj.id,
        email: mixedObj.email,
        company_name: mixedObj.company_name,
        company_address: mixedObj.company_address
      }
      BlockchainObj.data.companyData.push(companyObj);
    }
  }

  //product list

  let productCount = (await authentication.productCount.call()).toNumber();
  console.log("\n\nProduct Count :", productCount);

  for(let i = 1; i <= productCount; i++){
    let [product_id, company_id, product_name] = await authentication.getProduct.call(i);
    display_product_data(product_id, company_id, product_name);

    let obj = {
      product_id: product_id.toNumber(),
      company_id: company_id.toNumber(),
      product_name: product_name
    }
    BlockchainObj.data.productData.push(obj);
  }

  //review list

  let reviewCount = (await authentication.reviewCount.call()).toNumber();
  console.log("\n\nReview Count :", reviewCount);

  for(let i = 1; i <= reviewCount; i++){
    let [review_id, user_id, product_id, company_id, rating, review, is_spam, review_status, reply, hash ] = await authentication.getReview.call(i);
    display_review_data(review_id, user_id, product_id, company_id, rating, review, is_spam, review_status, reply, hash);
    
    let obj = {
      review_id: review_id.toNumber(),
      user_id: user_id.toNumber(),
      product_id: product_id.toNumber(),
      company_id: company_id.toNumber(),
      rating: rating.toNumber(),
      review: review,
      is_spam: is_spam,// ? "YES" : "NO",
      review_status: review_status.toNumber(),
      reply: reply,
      merkle_tree_root_hash: hash
    }
    BlockchainObj.data.reviewData.push(obj);
  }
  console.log("get from blockchain : ", BlockchainObj);
  return BlockchainObj; 
}


export function loginUser() {
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
          console.log(error);
        }

        authentication.deployed().then(function(instance) {
          authenticationInstance = instance

          // Attempt to login user.
          let obj = {};

          authenticationInstance.login({from: coinbase})
          .then(function(result) {
            // If no error, login user.
            const [id, user_type,email,user_first_name, user_second_name, user_zipcode, company_name, company_address ] = result;

            obj = {
              id: id.toNumber(),
              user_type: user_type.toNumber(),
              email: (email),
              user_first_name: (user_first_name),
              user_second_name: (user_second_name),
              user_zipcode: (user_zipcode),
              company_name: (company_name),
              company_address: (company_address),
            };
            console.log(obj);
            dispatch(userLoggedIn(obj));
            return getBlockchainData(authenticationInstance, coinbase);
          })
          .then(function(result){ //finshed getting product
            if(result)  dispatch(result);
            
            // Used a manual redirect here as opposed to a wrapper.
            // This way, once logged in a user can still access the home page.
            var currentLocation = browserHistory.getCurrentLocation()

            if ('redirect' in currentLocation.query)
            {
              return browserHistory.push(decodeURIComponent(currentLocation.query.redirect))
            }

            if( obj.user_type == 0 ){ //user
              return browserHistory.push('/client_profile')
            }else{
              return browserHistory.push('/company_profile')
            }
          })
          .catch(function(result) {
            // If error, go to signup page.
            console.log('Wallet ' + coinbase + ' does not have an account!')

            return browserHistory.push('/signup')
          })
        })
      })
    }
  } else {
    console.log('Web3 is not initialized.');
  }
}
