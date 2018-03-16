var HoneyShop = artifacts.require("./HoneyShop.sol");

module.exports = function (deployer) {
  // Use deployer to state migration tasks.
  deployer.deploy(HoneyShop, "HoneyShop");
};
