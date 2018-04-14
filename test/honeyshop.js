require('truffle-test-utils').init();

const HoneyShop = artifacts.require("./HoneyShop");

contract('HoneyShop', function (accounts) {
  let instance;
  let owner;

  const testProductId = 0;
  const ownerAddress = accounts[0];

  beforeEach(async function () {
    instance = await HoneyShop.deployed();
    owner = await instance.owner();
  });

  xit("should log abi JSON to be able to watch the contract in Parity", function () {
    console.log(JSON.stringify(instance.abi));
  });

  it("should instantiate correctly", async function () {
    assert.equal(owner, ownerAddress);

    const name = await instance.storeName();
    assert.equal(name, "Hoffmann's Honey Shop");

    const balance = await instance.getBalance();
    const balanceString = new web3.BigNumber(balance);
    assert.equal(balanceString, '0');
  });

  it("should correctly rename store", async function () {
    await instance.renameStoreTo("ABC");
    const name = await instance.storeName();
    assert.equal(name, "ABC");
  });

  it("should correctly update store balance after checkout", async function () {
    const testProductId = 111;
    const customerAccount = accounts[1];

    const b = await instance.getStoreBalance();
    const bs = new web3.BigNumber(b);
    assert.equal(bs.toString(), 0);

    assert.isOk(await instance.registerProduct(testProductId, "Honey Delicious", "Mhmmm", 30, 1), "registerProduct should work");
    assert.isOk(await instance.registerCustomer(customerAccount, "Dummy", 100), "registerCustomer should workd");

    const result = await instance.insertProductIntoCart(testProductId, { from: customerAccount, gas: 500000 });
    assert.web3Event(result, {
      event: 'CartProductInserted',
      args: {
        customer: customerAccount,
        prodId: testProductId,
        prodPrice: 30,
        completeSum: 30
      }
    }, 'The CartProductInserted event is emitted');

    const checkoutRes = await instance.checkoutCart({ from: customerAccount, gas: 500000 });
    assert.isOk(checkoutRes, "checkoutCart should work");
    const balance = await instance.getStoreBalance();
    const balanceString = new web3.BigNumber(balance);
    assert.equal(balanceString.toString(), '30', "Store balance should increase after checkout");
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
    const result = await instance.registerCustomer(accounts[2], "Flo", 100);
    assert.web3Event(result, {
      event: 'CustomerRegistered',
      args: {
        customer: accounts[2]
      }
    }, 'The CustomerRegistered event is emitted');
  });

  it("should correctly deregister customer", async function () {
    const result = await instance.deregisterCustomer(accounts[2]);
    assert.web3Event(result, {
      event: 'CustomerDeregistered',
      args: {
        customer: accounts[2]
      }
    }, 'The CustomerDeregistered event is emitted');
  });

  it("should correctly return product information", async function () {
    const productId = 987;
    await instance.registerProduct(productId, "1 Honey 1", "Delicious", 25, 1);
    const product = await instance.getProduct(productId);
    assert.isOk(product.length === 4);

    const name = web3.toAscii(product[0]);
    const desc = web3.toAscii(product[1]);
    const price = new web3.BigNumber(product[2]);
    const defaultAmount = new web3.BigNumber(product[3]);

    assert.include(name, '1 Honey 1');
    assert.include(desc, 'Delicious');
    assert.equal(price, '25');
    assert.equal(defaultAmount, '1');
  });

  it("should correctly add product to cart", async function () {
    const result = await instance.insertProductIntoCart(testProductId, { from: accounts[3], gas: 500000 });
    assert.web3Event(result, {
      event: 'CartProductInserted',
      args: {
        customer: accounts[3],
        prodId: testProductId,
        prodPrice: 0,
        completeSum: 0,
      }
    }, 'The CartProductInserted event is emitted');
  });

  it("should correctly add multiple product to cart", async function () {
    await instance.registerCustomer(accounts[4], "Chris", 100);

    const productId1 = 111;
    const result1 = await instance.insertProductIntoCart.call(testProductId, { from: accounts[4], gas: 500000 });
    const result2 = await instance.insertProductIntoCart.call(testProductId, { from: accounts[4], gas: 500000 });
    const result3 = await instance.insertProductIntoCart.call(testProductId, { from: accounts[4], gas: 500000 });

    // All return succes  
    assert.isOk(result1[0]);
    assert.isOk(result2[0]);
    assert.isOk(result3[0]);

    // All on same position
    assert.equal(new web3.BigNumber(result1[1]).toString(), '0');
    assert.equal(new web3.BigNumber(result2[1]).toString(), '0');
    assert.equal(new web3.BigNumber(result3[1]).toString(), '0');
  });

  it("should correctly remove product from cart", async function () {
    const testAccount = accounts[5];
    const productId = 666;

    await instance.registerCustomer(testAccount, "Rolf", 100);
    const result = await instance.insertProductIntoCart.call(productId, { from: testAccount, gas: 500000 });
    assert.isOk(result[0]);

    await instance.removeProductFromCart(productId);

    const cartResult = await instance.getCart.call({ from: testAccount, gas: 500000 });
    assert(Array.isArray(cartResult[0]), 'empty arrays are arrays');
    assert.equal(new web3.BigNumber(cartResult[1]).toString(), 0);
  });

  it("should correctly checkout cart", async function () {
    const testAccount = accounts[6];
    const productId = 777;

    await instance.registerCustomer(testAccount, "Marius", 100);
    await instance.registerProduct(productId, "2 Honey 2", "Very Delicious", 11, 1);
    await instance.insertProductIntoCart(productId, { from: testAccount, gas: 500000 });

    const res = await instance.checkoutCart.call({ from: testAccount, gas: 500000 });
    assert.isOk(res);
  });

  it("should correctly empty cart", async function () {
    const testAccount = accounts[7];
    const productId = 888;

    await instance.registerCustomer(testAccount, "Markus", 100);
    await instance.registerProduct(productId, "3 Honey 3", "SOOO Delicious", 33, 1);
    await instance.insertProductIntoCart(productId, { from: testAccount, gas: 500000 });

    const res = await instance.emptyCart.call({ from: testAccount, gas: 500000 });
    assert.isOk(res);
  });

  // IMPORTANT: Needs to be the last test as it changes the ownership
  it("should correctly transfer ownership", async function () {
    await instance.transferOwnership(accounts[1]);
    const newOwner = await instance.owner();
    assert.equal(newOwner, accounts[1]);
  });

});
