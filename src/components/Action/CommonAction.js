import AuthenticationContract from '../../../build/contracts/Authentication.json'
import store from '../../store'
import {USER_TYPES, REVIEW_STATUS} from '../../util/globals'
import MerkleTree, { checkProofOrdered, merkleRoot, checkProofOrderedSolidityFactory } from 'merkle-tree-solidity'
import { sha3 } from 'ethereumjs-util'

const contract = require('truffle-contract')

export const blockchainDataReducer = (blockchainData) => ({
    type: 'BLOCKCHAIN_DATA',
    data:{
        blockchainData
    }
});

export const addProductReducer = (product_obj) => ({
    type: 'ADD_PRODUCT_REDUCER',
    data:  product_obj
});

export const addReviewReducer = (review_obj) => ({
    type: 'ADD_REVIEW_REDUCER',
    data:  review_obj
});

export const replyReviewReducer = (review_obj) => ({
    type: 'REPLY_REDUCER',
    data:  review_obj
});

export const approveReducer = (review_obj) => ({
    type: 'APPROVE_REDUCER',
    data:  review_obj
});

// export function initData() {
//     return (dispatch) => {
//         //Get data from Web3
//         let blockchainData = {};
//         dispatch(blockchainDataReducer(blockchainData));
//     };
// };

export function addProduct(product_obj) {
    let web3 = store.getState().web3.web3Instance
    if (typeof web3 !== 'undefined') {

        return function(dispatch) {
            const authentication = contract(AuthenticationContract)
            authentication.setProvider(web3.currentProvider)
            var authenticationInstance
            web3.eth.getCoinbase((error, coinbase) => {
                // Log errors, if any.
                if (error) {
                    console.error(error);
                }
                authentication.deployed().then(function(instance) {
                    authenticationInstance = instance
                    authenticationInstance.createProduct(product_obj.product_name, {from: coinbase})
                    .then(function(result) {
                        dispatch(addProductReducer(product_obj))
                    })
                    .catch(function(result) {
                        console.log("error in add new product: ", result);
                    // If error...
                    })
                })
            })
        }
    } else {
        console.error('Web3 is not initialized.');
    }
};

function bufToHex(element) {
    return Buffer.isBuffer(element) ? '0x' + element.toString('hex') : element;
}

function getMerkleTreeRootHash(somestring){
    // create merkle tree
    // expects 32 byte buffers as inputs (no hex strings)
    // if using web3.sha3, convert first -> Buffer(web3.sha3('a'), 'hex')
    const exploded = somestring.split("");
    const elements = exploded.map(e => sha3(e))

    // include the 'true' flag when generating the merkle tree
    const merkleTree = new MerkleTree(elements, true)

    // [same as above]
    // get the merkle root
    // returns 32 byte buffer
    const root = merkleTree.getRoot()

    // for convenience if only the root is desired
    // this creates a new MerkleTree under the hood
    // 2nd arg is "preserveOrder" flag

    const easyRoot = merkleRoot(elements, true)

    return bufToHex(easyRoot);
}

export function addReview(review_obj) {
    let web3 = store.getState().web3.web3Instance
    if (typeof web3 !== 'undefined') {
        return function(dispatch) {
            const authentication = contract(AuthenticationContract)
            authentication.setProvider(web3.currentProvider)
            var authenticationInstance
            web3.eth.getCoinbase((error, coinbase) => {
                // Log errors, if any.
                if (error) {
                    console.error(error);
                }

                authentication.deployed().then(function(instance) {
                    authenticationInstance = instance
                    let hash = getMerkleTreeRootHash(review_obj.review);
                    review_obj.merkle_tree_root_hash = hash;
                    authenticationInstance.createReview(
                        review_obj.product_id,
                        review_obj.rating,
                        review_obj.review,
                        review_obj.is_spam,
                        review_obj.merkle_tree_root_hash,
                        {from: coinbase})
                    .then(function(result) {
                        dispatch(addReviewReducer(review_obj))
                    })
                    .catch(function(result) {
                        console.log("error in add new review: ", result);
                    // If error...
                    })
                })
            })
        }
    } else {
        console.error('Web3 is not initialized.');
    }
};


export function replyReview(review_obj) {
    let web3 = store.getState().web3.web3Instance
    if (typeof web3 !== 'undefined') {

        return function(dispatch) {
            const authentication = contract(AuthenticationContract)
            authentication.setProvider(web3.currentProvider)
            var authenticationInstance
            web3.eth.getCoinbase((error, coinbase) => {
                // Log errors, if any.
                if (error) {
                    console.error(error);
                }
                authentication.deployed().then(function(instance) {
                    authenticationInstance = instance
                    authenticationInstance.replyReview(review_obj.review_id, review_obj.reply, {from: coinbase})
                    .then(function(result) {
                        dispatch(replyReviewReducer(review_obj))
                    })
                    .catch(function(result) {
                        console.log("error in 'replyReview': ", result);
                    // If error...
                    })
                })
            })
        }
    } else {
        console.error('Web3 is not initialized.');
    }
};


export function approveReview(review_obj) {
    let web3 = store.getState().web3.web3Instance
    if (typeof web3 !== 'undefined') {

        return function(dispatch) {
            const authentication = contract(AuthenticationContract)
            authentication.setProvider(web3.currentProvider)
            var authenticationInstance
            web3.eth.getCoinbase((error, coinbase) => {
                // Log errors, if any.
                if (error) {
                    console.error(error);
                }
                authentication.deployed().then(function(instance) {
                    authenticationInstance = instance
                    authenticationInstance.approveReview(review_obj.review_id, {from: coinbase})
                    .then(function(result) {
                        dispatch(approveReducer(review_obj))
                    })
                    .catch(function(result) {
                        console.log("error in 'approve Review': ", result);
                    // If error...
                    })
                })
            })
        }
    } else {
        console.error('Web3 is not initialized.');
    }
};


export const searchReducer = (searchKey) => ({
    type: 'SEARCH_REDUCER',
    data:{
        searchKey
    }
});

export function searchAction(searchKey) {
    return (dispatch) => {
        dispatch(searchReducer(searchKey));
    };
};