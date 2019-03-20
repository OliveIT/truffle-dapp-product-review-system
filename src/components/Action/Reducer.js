const initialState = {
    searchKey: {},
    blockchainData: {}
}

const commonReducer = (state = initialState, action) => {
    if (action.type === "BLOCKCHAIN_DATA") {
        console.log("-------action: ", action);
        return {...state, blockchainData: action.data};
    }
    else if (action.type === "SEARCH_REDUCER") {
        return {...state, searchKey: action.data};
    }
    else if (action.type === "ADD_PRODUCT_REDUCER") {
        let newstate = {...state};
        newstate.blockchainData.productData.push(action.data);
        return newstate;
    }
    else if (action.type === "ADD_REVIEW_REDUCER") {
        let newstate = {...state};
        //action.data.id = newstate.blockchainData.reviewData.length + 1;
        newstate.blockchainData.reviewData.push(action.data);
        return newstate;
    }
    else if (action.type === "REPLY_REDUCER") {
        let newstate = {...state};
        if(newstate.blockchainData.reviewData[action.data.id]){
            newstate.blockchainData.reviewData[action.data.id].review_status = 2;   //negative
            newstate.blockchainData.reviewData[action.data.id].reply = action.data.reply;
        }
        return newstate;
    }
    else if (action.type === "APPROVE_REDUCER") {
        let newstate = {...state};
        if(newstate.blockchainData.reviewData[action.data.id]){
            newstate.blockchainData.reviewData[action.data.id].review_status = 1;   //positive
        }
        return newstate;
    }else {
        return state;
    }
}

export default commonReducer
