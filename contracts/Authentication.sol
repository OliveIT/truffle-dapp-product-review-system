pragma solidity ^0.5.0;

import './zeppelin/lifecycle/Killable.sol';
import "./RMSToken.sol";

contract Authentication is Killable {
  RMSToken rmstoken;

  constructor(address rmstokenAddress) public payable {
    rmstoken = RMSToken(rmstokenAddress);
  }

  enum UserType {User, Company}
  enum ReviewStatus {Pending, Positive, Negative}

  struct User {
    uint id;
    UserType userType;

    string email;
    string user_first_name;
    string user_second_name;
    string user_zipcode;

    string company_name;
    string company_address;

    address eth_address;
  }

  struct Product{
    uint id;
    uint company_id;
    string product_name;
  }

  struct Review{
    uint id;
    uint user_id;
    uint product_id;
    uint company_id;
    uint rating;
    string review;
    bool is_spam;
    ReviewStatus review_status;
    string reply;
    bytes32 merkle_tree_root_hash;
  }

  //users
  mapping (address => User) private users;
  mapping (uint => address) private usersById;
  uint public userCount;
  uint public totalCount;
  uint public companyCount;

  //product
  mapping (uint => Product) private products;
  uint public productCount;

  //reviews
  mapping (uint => Review) private reviews;
  uint public reviewCount;
  

  uint private id; // Stores user id temporarily

  modifier onlyExistingUser() { require(users[msg.sender].id > 0, "User is not registered"); _; }
  modifier onlyNONExistingUser() { require(users[msg.sender].id == 0, "User is already registered"); _; }

  modifier onlyExistingUserID(uint userid) { require(usersById[userid] != address(0), "User ID is not registered"); _; }
  modifier onlyExistingProductID(uint prodid) { require(products[prodid].id > 0, "Product ID is not registered"); _; }
  modifier onlyExistingReviewID(uint revid) { require(reviews[revid].id > 0, "Review ID is not registered"); _; }

  modifier validRating(uint rating) { require(rating >= 1 && rating <= 5, "rating should be between 1 and 5"); _; }

  modifier onlyCompany{
    require(users[msg.sender].id > 0, "User does not exist");
    require(users[msg.sender].userType == UserType.Company, "User is not company");
    _;
  }

  modifier onlyUser{
    require(users[msg.sender].id > 0, "User does not exist");
    require(users[msg.sender].userType == UserType.User, "User is not company");
    _;
  }

  modifier onlyMyReview(uint revid){ require(users[msg.sender].id == reviews[revid].company_id, "not my review"); _; }
  modifier onlyPendingReview(uint revid){ require(reviews[revid].review_status == ReviewStatus.Pending, "only pending review"); _; }

  event LogUserSignUp(address from);
  event LogCompanySignUp(address from);

  event LogBytes32(string data);
  event LogString(string str);
  event LogNumber(uint num);

  function login()
  public view onlyExistingUser
  returns (uint, UserType, string memory, string memory, string memory, string memory,  string memory, string memory) {
    // emit LogString("-------  Login");
    // emit LogNumber(users[msg.sender].id);
    // emit LogString(users[msg.sender].email);
    // emit LogString(users[msg.sender].user_first_name);
    // emit LogString(users[msg.sender].user_second_name);
    // emit LogString(users[msg.sender].user_zipcode);
    // emit LogString(users[msg.sender].company_name);
    // emit LogString(users[msg.sender].company_address);
    return (users[msg.sender].id, 
            users[msg.sender].userType,
            users[msg.sender].email,
            users[msg.sender].user_first_name, 
            users[msg.sender].user_second_name, 
            users[msg.sender].user_zipcode, 
            users[msg.sender].company_name, 
            users[msg.sender].company_address);
  }

  function getUser(uint index)
  public view onlyExistingUserID(index)
  returns (uint, UserType, string memory, string memory, string memory, string memory,  string memory, string memory) {
    User memory user = users[usersById[index]];
    return (user.id, 
            user.userType,
            user.email,
            user.user_first_name, 
            user.user_second_name, 
            user.user_zipcode, 
            user.company_name, 
            user.company_address);
  }

  /** @dev convert strint to string
     */
  function stringToString(string memory source) internal pure returns (bytes32 result) {
      bytes memory tempEmptyStringTest = bytes(source);
      if (tempEmptyStringTest.length == 0) {
          return 0x0;
      }

      assembly {
          result := mload(add(source, 32))
      }
  }

  function signupUser(
    string calldata _email,
    string calldata _user_first_name,
    string calldata _user_second_name,
    string calldata _user_zipcode
  )
  onlyNONExistingUser
  external  payable  returns (uint) {
    User memory newbie;
    newbie.email              = _email;
    newbie.user_first_name    = _user_first_name;
    newbie.user_second_name   = _user_second_name;
    newbie.user_zipcode       = _user_zipcode;
    userCount++;
    totalCount++;
    newbie.id = totalCount;
    newbie.userType = UserType.User;
    newbie.eth_address = msg.sender;

    usersById[totalCount] = msg.sender;
    users[msg.sender] = newbie;
    emit LogUserSignUp(msg.sender);
    emit LogString(newbie.email);
    emit LogString(_email);
    emit LogNumber(totalCount);
    return totalCount; //return userid
  }


  function signupCompany(
    string calldata _email,
    string calldata _company_name,
    string calldata _company_address
  )
  onlyNONExistingUser
  external  payable  returns (uint) {
    User memory newbie;
    newbie.email              = (_email);
    newbie.company_name    = (_company_name);
    newbie.company_address       = (_company_address);
    companyCount++;
    totalCount++;
    newbie.id = totalCount;
    newbie.userType = UserType.Company;
    newbie.eth_address = msg.sender;

    usersById[totalCount] = msg.sender;
    users[msg.sender] = newbie;
    emit LogUserSignUp(msg.sender);
    emit LogNumber(totalCount);
    return totalCount; //return userid
  }

  function createProduct(string memory _product_name)
  payable public onlyCompany
  returns(uint){
    productCount++;
    products[productCount].product_name = (_product_name);
    products[productCount].id = productCount;
    products[productCount].company_id = users[msg.sender].id;
    return productCount;
  }
  

  function getProduct(uint index)
  view public onlyExistingProductID(index)
  returns(uint, uint, string memory){
    return(
      products[index].id,
      products[index].company_id,
      products[index].product_name
    );
  }


  function createReview(uint _prod_id, uint _rating, string memory _review, bool _isSpam, bytes32 _hash)
  payable public
  onlyUser onlyExistingProductID(_prod_id) validRating(_rating)
  returns(uint){
    reviewCount++;
    reviews[reviewCount].id = reviewCount;
    reviews[reviewCount].user_id = users[msg.sender].id;
    reviews[reviewCount].product_id = _prod_id;
    reviews[reviewCount].company_id = products[_prod_id].company_id;
    reviews[reviewCount].rating = _rating;
    reviews[reviewCount].review = (_review);
    reviews[reviewCount].is_spam = _isSpam;
    reviews[reviewCount].review_status = ReviewStatus.Pending;
    reviews[reviewCount].merkle_tree_root_hash = _hash;
    return reviewCount;
  }

  function getReview(uint _review_id)
  view public
  onlyExistingReviewID(_review_id)
  returns(uint, uint, uint, uint, uint, string memory, bool, ReviewStatus, string memory, bytes32){
    Review memory review = reviews[_review_id];
    return (
      review.id,
      review.user_id,
      review.product_id,
      review.company_id,
      review.rating,
      review.review,
      review.is_spam,
      review.review_status,
      review.reply,
      review.merkle_tree_root_hash
    );
  }

  function replyReview(uint _review_id, string memory _reply)
  payable public
  onlyCompany onlyExistingReviewID(_review_id) onlyMyReview(_review_id) onlyPendingReview(_review_id)
  returns(uint){
    reviews[_review_id].review_status = ReviewStatus.Negative;
    reviews[_review_id].reply = (_reply);
    return _review_id;
  }

  function approveReview(uint _review_id)
  payable public
  onlyCompany onlyExistingReviewID(_review_id) onlyMyReview(_review_id) onlyPendingReview(_review_id)
  returns(uint){
    reviews[_review_id].review_status = ReviewStatus.Positive;
    //send tokens
    //reviews[reviewCount].user_id = users[msg.sender].id;
    //User memory user = users[usersById[reviews[_review_id].user_id]];
    address recipient = usersById[reviews[_review_id].user_id];
    rmstoken.mint(recipient);
    return rmstoken.balanceOf(recipient);
  }

  function getUserBalance(uint _user_id)
  view public
  returns (uint){
    return rmstoken.balanceOf(usersById[_user_id]);
  }

/*
  function update(string memory user_first_name)
  public
  payable
  onlyValidName(user_first_name)
  onlyExistingUser
  returns (string memory) {
    // Update user name.

    if (users[msg.sender].user_first_name != 0x0)
    {
        users[msg.sender].user_first_name = user_first_name;

        return (users[msg.sender].user_first_name);
    }
  }
*/
}
