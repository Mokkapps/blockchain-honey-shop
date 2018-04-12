var HoneyShop = artifacts.require("./HoneyShop");

contract('HoneyShop', function (accounts) {
  var instance;
  var owner;

  beforeEach(async function () {
    instance = await HoneyShop.deployed();
    owner = await instance.owner();
  });

  it("should have an owner and a name", async function () {
    console.log(JSON.stringify(instance.abi));
    assert.equal(owner, 0x0);
  });

});
