var Authentication = artifacts.require("./Authentication.sol");
var RMSToken = artifacts.require("./RMSToken.sol");
var MerkleProof = artifacts.require("./MerkleProof.sol");

const USER_TYPES = ["User", "Company"];
const REVIEW_STATUS = ["Pending", "Positive", "Negative"];

function display_user_data(id, userType, email, user_first_name, user_second_name, user_zipcode, company_name, company_address){
/*  console.log("**** id: ", id.toNumber());
    console.log("**** userType: ", userType.toNumber());
    console.log("**** email: ", email);
    console.log("**** user_first_name: ", user_first_name);
    console.log("**** user_second_name: ", user_second_name);
    console.log("**** user_zipcode: ", user_zipcode);
    console.log("**** company_name: ", company_name);
    console.log("**** company_address: ", company_address);
*/
    console.log("**** id: ", id.toNumber(),
                "userType: ", USER_TYPES[userType.toNumber()],
                "email: ", email,
                "user_first_name: ", user_first_name,
                "user_second_name: ", user_second_name,
                "user_zipcode: ", user_zipcode,
                "company_name: ", company_name,
                "company_address: ", company_address);
}

function display_product_data(product_id, company_id, product_name){
  console.log("@@@@ product_id: ", product_id.toNumber(), "company_id: ", company_id.toNumber(), " product_name: ", product_name);
}

function display_review_data(review_id, user_id, product_id, company_id, rating, review, is_spam, review_status, reply, hash){
  console.log("#### review_id: ", review_id.toNumber(),
              "user_id: ", user_id.toNumber(),
              "product_id: ", product_id.toNumber(),
              "review: ", review,
              "is_spam: ", is_spam ? "YES" : "NO",
              "review_status: ", REVIEW_STATUS[review_status.toNumber()],
              "reply: ", reply,
              "hash: ", hash);
}


contract('Authentication', async function(accounts) {
  let authentication;
  let rmstoken;
  
  beforeEach('setup contract for each test', async () => {
		rmstoken = await RMSToken.new();
    authentication = await Authentication.new(rmstoken.address);
    
		console.log(' === before each ===');
		console.log('rmstoken.address     : ', rmstoken.address);
		console.log('authentication.address: ', authentication.address);
  });
  
  it("...should sign up and log in a user.", async function() {
    let expectedEmail = 'first@user.com';
    let expectedFirstName = 'first name';
    let expectedSecondName = 'second name';
    let expectedZipCode = '65432432';

  await authentication.signupUser(expectedEmail, expectedFirstName, expectedSecondName, expectedZipCode, {from: accounts[0]});
    let [id, userType, email, user_first_name, user_second_name, user_zipcode, company_name, company_address] = await authentication.login.call({from: accounts[0]});
    display_user_data(id, userType, email, user_first_name, user_second_name, user_zipcode, company_name, company_address);
    assert.equal(userType.toNumber(), 0, "The user is company.");
    assert.equal(email, expectedEmail, "email is wrong.");
    assert.equal(user_zipcode, expectedZipCode, "zipcode is wrong.");
    return;
  });

  
  it("...should sign up and log in a company.", async function() {
    let expectedEmail = 'company@company.com';
    let expectedName = 'my great company';
    let expectedAddress = 'vladivostok russia';

    await authentication.signupCompany(expectedEmail, expectedName, expectedAddress, {from: accounts[0]});
    let [id, userType, email, user_first_name, user_second_name, user_zipcode, company_name, company_address] = await authentication.login.call({from: accounts[0]});

    assert.equal(userType.toNumber(), 1, "The user is company.");
    assert.equal(email, expectedEmail, "email is wrong.");
    assert.equal(company_address, expectedAddress, "company address is wrong.");
  });


  it("...should sign up 3 users, 2 companies, create 6 products and display them all", async function() {
    //1 user
    await authentication.signupUser('first@user.com', 'first name 1', 'second name 1', '65432432', {from: accounts[0]});
    await authentication.signupUser('second@user.com', 'first name 2', 'second name 2 ', '34546532', {from: accounts[1]});
    await authentication.signupUser('third@user.com', 'first name 3', 'second name 3 ', '6875687354', {from: accounts[2]});
    //2 company
    await authentication.signupCompany('company@company.com', 'my great company', 'vladivostok russia', {from: accounts[3]});
    await authentication.signupCompany('coporation@coporation.com', 'great coporation', 'russia vladivostok', {from: accounts[4]});

    let [id, userType, email, user_first_name, user_second_name, user_zipcode, company_name, company_address] = await authentication.login.call({from: accounts[3]});
    display_user_data(id, userType, email, user_first_name, user_second_name, user_zipcode, company_name, company_address);

    assert.equal(userType.toNumber(), 1, "The user is User.");
    assert.equal(email, 'company@company.com', "email is wrong.");
    assert.equal(company_address, 'vladivostok russia', "company address is wrong.");

    //3 display
    let totalCount = (await authentication.totalCount.call()).toNumber();
    console.log("Total Count : ", totalCount);
    for(let i = 1; i <= totalCount; i++){
      let [id, userType, email, user_first_name, user_second_name, user_zipcode, company_name, company_address] = await authentication.getUser.call(i);
      console.log("^^^^ id: ", id.toNumber(), " userType: ", USER_TYPES[userType.toNumber()], " email: ", email);
    }

    assert.equal(totalCount, 5, "total count is wrong.");

    //4 create Products

    await authentication.createProduct("First Product",{from: accounts[3]});
    await authentication.createProduct("Second Product",{from: accounts[4]});
    await authentication.createProduct("Third Product",{from: accounts[3]});
    await authentication.createProduct("Fourth Product",{from: accounts[3]});
    await authentication.createProduct("Second Product",{from: accounts[4]});
    await authentication.createProduct("Sixth Product",{from: accounts[4]});

    //5 display product list

    let productCount = (await authentication.productCount.call()).toNumber();
    console.error("Product Count :", productCount);
    for(let i = 1; i <= productCount; i++){
      let [product_id, company_id, product_name] = await authentication.getProduct.call(i);
      display_product_data(product_id, company_id, product_name);
    }

    assert.equal(productCount, 6, "total count is wrong.");

    let somehash = "0xe0ebd530ec3a760d1f2d2e44fbb3a39106452fe4";
    //6 create 5 reviews
    await authentication.createReview(
      1,
      3,
      "This is FIRST product!\nIt's awesome!!!!\nI'll buy again.",
      false,
      somehash,
      {from: accounts[1]}
    );
    await authentication.createReview(
      1,
      5,
      "This is FIRST product!\nIt's awesome!!!!\nI'll buy again.",
      false,
      somehash,
      {from: accounts[2]}
    );
    await authentication.createReview(
      5,
      2,
      "This is FIFTH product!\tIt's the worst!\n",
      true,
      somehash,
      {from: accounts[1]}
    );
    await authentication.createReview(
      5,
      5,
      "This is FIFTH product!\tIt's the best!\n",
      false,
      somehash,
      {from: accounts[0]}
    );
    await authentication.createReview(
      6,
      1,
      "This is SIXTH product!\tIt's the worst product I've ever seen!!!\n",
      true,
      somehash,
      {from: accounts[1]}
    );
    await authentication.createReview(
      3,
      4,
      "This is THIRD product!\tIt's the worst product I've ever seen!!!\n",
      true,
      somehash,
      {from: accounts[1]}
    );


    let reviewCount = (await authentication.reviewCount.call()).toNumber();
    console.error("Review Count :", reviewCount);

    for(let i = 1; i <= reviewCount; i++){
      let [review_id, user_id, product_id, company_id, rating, review, is_spam, review_status, reply, hash ] = await authentication.getReview.call(i);
      display_review_data(review_id, user_id, product_id, company_id, rating, review, is_spam, review_status, reply, hash);
    }
    assert.equal(reviewCount, 6, "review count is wrong.");

    //7 reply reviews
    console.log("\n\nReply to Reviews 1, 3, 5: ")
    let reviewIndexes = [1, 3, 5];
    let accountIndexes = [3, 4, 4];
    for(i = 0; i < 3; i++){
      await authentication.replyReview(reviewIndexes[i], "This is reply", {from:accounts[accountIndexes[i]]});
      let [review_id, user_id, product_id, company_id, rating, review, is_spam, review_status, reply ] = await authentication.getReview.call(reviewIndexes[i]);
      display_review_data(review_id, user_id, product_id, company_id, rating, review, is_spam, review_status, reply);
    }

    //8. accept reviews
    console.log("\n\nApprove Reviews 2, 4, 6: ");
    reviewIndexes = [2, 4, 6];
    accountIndexes = [3, 4, 3];
    for(i = 0; i < 3; i++){
      await authentication.approveReview(reviewIndexes[i], {from:accounts[accountIndexes[i]]});
      let [review_id, user_id, product_id, company_id, rating, review, is_spam, review_status, reply ] = await authentication.getReview.call(reviewIndexes[i]);
      display_review_data(review_id, user_id, product_id, company_id, rating, review, is_spam, review_status, reply);
      let userbalance = (await authentication.getUserBalance(user_id)).toNumber();
      console.error("balance : " + userbalance + " RMST");
    }
  });
});
