require('truffle-test-utils').init();

const HoneyShop = artifacts.require("./HoneyShop");

contract('HoneyShop', function (accounts) {
  let instance;
  let owner;

  const testProductId = 0;
  const ownerAddress = accounts[0];
  const customerAddress = '0xffffffffffffffffffffffffffffffffffffffaa';
  const dummyAddress = '0xffffffffffffffffffffffffffffffffdeadbeef';

  beforeEach(async function () {
    instance = await HoneyShop.deployed();
    owner = await instance.owner();
  });

  xit("should log abi JSON to be able to watch the contract in Parity", function () {
    console.log(JSON.stringify(instance.abi));
  });

  it("should instantiate correctly", async function () {
    assert.equal(owner, ownerAddress);

    const name = await instance.store_name();
    assert.equal(name, "Hoffmann's Honey Shop");

    const balance = await instance.getBalance();
    assert.equal(balance, 0);
  });

  it("should correctly rename store", async function () {
    await instance.renameStoreTo("ABC");
    const name = await instance.store_name();
    assert.equal(name, "ABC");
  });

  it("should correctly update store balance after checkout", async function () {
    const testProductId = 111;

    assert.isOk(await instance.registerProduct(testProductId, "Honey1", "Best honey ever", 40, 1), "registerProduct should work");
    assert.isOk(await instance.registerCustomer(customerAddress, "Customer1", 100), "registerCustomer should workd");

    const result = await instance.insertProductIntoCart(testProductId);
    assert.web3Event(result, {
      event: 'CartProductInserted',
      args: {
        customer: ownerAddress,
        prodId: testProductId,
        prodPrice: 40,
        completeSum: 40
      }
    }, 'The CartProductInserted event is emitted');

    assert.isOk(await instance.checkoutCart(), "checkoutCart should work");
    const balance = await instance.getStoreBalance();
    assert.isOk(balance.s > 0, "Store balance should increase after checkout");
  });

  it("should correctly register product", async function () {
    const productId = 222;
    const result = await instance.registerProduct(productId, "Honey1", "Best honey ever", 40, 1);
    assert.web3Event(result, {
      event: 'ProductRegistered',
      args: {
        productId: productId
      }
    }, 'The ProductRegistered event is emitted');
  });

  it("should correctly deregister product", async function () {
    const testProductId = 222;
    await instance.registerProduct(testProductId, "Honey1", "Best honey ever", 40, 1);
    const result = await instance.deregisterProduct(testProductId);
    assert.web3Event(result, {
      event: 'ProductDeregistered',
      args: {
        productId: testProductId
      }
    }, 'The ProductDeregistered event is emitted');
  });

  it("should correctly register customer", async function () {
    const result = await instance.registerCustomer(customerAddress, "Flo", 100);
    assert.web3Event(result, {
      event: 'CustomerRegistered',
      args: {
        customer: customerAddress
      }
    }, 'The CustomerRegistered event is emitted');
  });

  it("should correctly deregister customer", async function () {
    const result = await instance.deregisterCustomer(customerAddress);
    assert.web3Event(result, {
      event: 'CustomerDeregistered',
      args: {
        customer: customerAddress
      }
    }, 'The CustomerDeregistered event is emitted');
  });

  it("should correctly return product information", async function () {
    // FIXME
    const product = await instance.getProduct(testProductId);
    assert.isOk(product.length === 4);
    console.log('product', product);
  });


  // IMPORTANT: Needs to be the last test as it changes the ownership
  it("should correctly transfer ownership", async function () {
    await instance.transferOwnership(dummyAddress);
    const newOwner = await instance.owner();
    assert.equal(newOwner, dummyAddress);
  });

});
