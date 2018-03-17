var HoneyShop = artifacts.require("./HoneyShop");

contract('HoneyShop', function (accounts) {

  var instance;
  var owner;

  beforeEach(async function () {
    instance = await HoneyShop.deployed();
    owner = await instance.owner();
  });

  it("should have an owner and a name", async function () {
    const name = await instance.name();
    assert.equal(owner, 0x0);
    assert.equal(name, 'HoneyShop');
  });

  it("should not make owner premium per default", async function () {
    var isPremium = await instance.isPremium(owner);

    assert.equal(isPremium, false);
  });

  it("should be open per default", async function () {
    var isOpen = await instance.isOpen();

    assert.equal(isOpen, true);
  });

});
