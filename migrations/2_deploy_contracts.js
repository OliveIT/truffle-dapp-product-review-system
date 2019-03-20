// var SimpleStorage = artifacts.require("./SimpleStorage.sol");
var Killable        = artifacts.require("./zeppelin/lifecycle/Killable.sol");
var Authentication  = artifacts.require("./Authentication.sol");
var RMSToken        = artifacts.require("./RMSToken.sol");

module.exports = function(deployer) {
  deployer.deploy(Killable);
  deployer.deploy(RMSToken).then(function(token) {
    deployer.link(Killable, Authentication);
    return deployer.deploy(Authentication, token.address );
  }).then((ans) => {
    return ans;
  });
};
