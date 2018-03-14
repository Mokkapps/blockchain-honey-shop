var SimpleStorage = artifacts.require("./SimpleStorage.sol");
var HoneyShopPremium = artifacts.require("./HoneyShopPremium.sol");
var HoneyShop = artifacts.require("./HoneyShop.sol");

module.exports = function(deployer) {
  // Use deployer to state migration tasks.
  deployer.deploy(SimpleStorage)
  .then(function() {
    return deployer.deploy(HoneyShop, "HoneyShop");
  })
  .then(function () {
  	return deployer.deploy(HoneyShopPremium);
  });
};
