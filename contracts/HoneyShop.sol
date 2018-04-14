pragma solidity ^0.4.21;

import "./base/Owned.sol";
import "./base/SafeMath.sol";

/**
  This contract implements a simple honey shop that can interact with
  registered customers. Every customer has its own shopping cart.
  @title Honey Shop Contract
  @author Michael Hoffmann (Mokkapps)
 */
contract HoneyShop is Owned, SafeMath {

  /* Store internals */
  string public storeName;
  uint256 private storeBalance;

  mapping (address => Customer) customers;
  mapping (uint256 => Product) products;

  /* Store Events */
  event CustomerRegistered(address customer);
  event CustomerRegistrationFailed(address customer);
  event CustomerDeregistered(address customer);
  event CustomerDeregistrationFailed(address customer);

  event ProductRegistered(uint256 productId);
  event ProductDeregistered(uint256 productId);
  event ProductRegistrationFailed(uint256 productId);
  event ProductDeregistrationFaled(uint256 productId);

  event CartProductInserted(address customer, uint256 prodId, uint256 prodPrice, uint256 completeSum);
  event CartProductInsertionFailed(address customer, uint256 prodId);
  event CartProductRemoved(address customer, uint256 prodId);
  event CartCheckoutCompleted(address customer, uint256 paymentSum);
  event CartCheckoutFailed(address customer, uint256 customerBalance, uint256 paymentSum);
  event CartEmptied(address customer);

  struct Customer {
    address adr;
    bytes32 name;
    uint256 balance;
    Cart cart;
  }

  struct Cart {
    uint256[] products; // array of product ids
    uint256 completeSum; // gets automatically updated when customer adds or removes products
  }

  struct Product {
    uint256 id;
    bytes32 name;
    bytes32 description;
    uint256 price;
    uint256 defaultAmount;
  }

  function HoneyShop() public {
    owner = msg.sender;
    storeName = "Hoffmann's Honey Shop";
    storeBalance = 0;
    if (address(this).balance > 0) revert();
  }
  
  /**
    Payable fallback which transfer value to owner ;-)
   */
  function() public payable {
    owner.transfer(msg.value);
  }  

  /**
    Registers a single product
    @param id Product ID
    @param name Product Name
    @param description Product Description
    @param price Product Price
    @param defaultAmount Default amount of items in a single product
    @return success
   */
  function registerProduct(uint256 id, bytes32 name, bytes32 description, uint256 price, uint256 defaultAmount) public onlyOwner returns (bool success) {
    Product memory product = Product(id, name, description, price, defaultAmount);
    if (checkProductValidity(product)) {
      products[id] = product;
      emit ProductRegistered(id);
      return true;
    }
    emit ProductRegistrationFailed(id);
    return false;
  }

  /**
    Removes a product from the list
    @param id Product ID
    @return success
  */
  function deregisterProduct(uint256 id) public onlyOwner returns (bool success) {
    Product storage product = products[id];
    if (product.id == id) {
      delete products[id];
      emit ProductDeregistered(id);
      return true;
    }
    emit ProductDeregistrationFaled(id);
    return false;
  }

  /**
    Registers a new customer (only store owners)
    @param _address Customer's address
    @param _name Customer's name
    @param _balance Customer's balance
    @return success
  */  
  function registerCustomer(address _address, bytes32 _name, uint256 _balance) public onlyOwner returns (bool success) {
    if (_address != address(0)) {
      Customer memory customer = Customer(
        { adr: _address, name: _name, balance: _balance, cart: Cart(new uint256[](0), 0) }
      );
      customers[_address] = customer;
      emit CustomerRegistered(_address);
      return true;
    }
    emit CustomerRegistrationFailed(_address);
    return false;
  } 

  /**
    Removes a customer (only store owners)
    @param _address Customer's address
    @return success
  */
  function deregisterCustomer(address _address) public onlyOwner returns (bool success) {
    Customer storage customer = customers[_address];
    if (customer.adr != address(0)) {
      delete customers[_address];
      emit CustomerDeregistered(_address);
      return true;
    }
    emit CustomerDeregistrationFailed(_address);
    return false;
  }

  /**
    Inserts a product into the shopping cart.
    This function returns a boolean and the position of the
    inserted product.
    The positional information can later be used to directly reference
    the product within the mapping. Solidity mappings aren't iterable.
    @param id Product ID
    @return (success, posInProductMapping)
  */
  function insertProductIntoCart(uint256 id) public returns (bool success, uint256 posInProductMapping) {
    Customer storage cust = customers[msg.sender];
    Product storage prod = products[id];
    uint256 prodsPrevLength = cust.cart.products.length;
    cust.cart.products.push(prod.id);
    uint256 currentSum = cust.cart.completeSum;
    cust.cart.completeSum = safeAdd(currentSum, prod.price);

    if (cust.cart.products.length > prodsPrevLength) {
      emit CartProductInserted(msg.sender, id, prod.price, cust.cart.completeSum);
      return (true, cust.cart.products.length - 1);
    }

    emit CartProductInsertionFailed(msg.sender, id);
    return (false, 0);
  }

  /**
    Removes a product entry from the shopping cart
    @param prodPosInMapping Product's position in the internal mapping
  */
  function removeProductFromCart(uint256 prodPosInMapping) public {
    uint256[] memory newProductList = new uint256[](customers[msg.sender].cart.products.length - 1);
    uint256[] memory customerProds = customers[msg.sender].cart.products;
    for (uint256 i = 0; i < customerProds.length; i++) {
      if (i != prodPosInMapping) {
        newProductList[i] = customerProds[i];
      } else {
        customers[msg.sender].cart.completeSum -= products[customerProds[i]].price;
        emit CartProductRemoved(msg.sender, customerProds[i]);
      }
    }
    customers[msg.sender].cart.products = newProductList;
  }

  /**
    Invokes a checkout process that'll use the current shopping cart to
    transfer balances between the current customer and the store
    @return success
  */
  function checkoutCart() public returns (bool success) {
    Customer storage customer = customers[msg.sender];
    uint256 paymentSum = customer.cart.completeSum;
    if ((customer.balance >= paymentSum) && customer.cart.products.length > 0) {
      customer.balance -= paymentSum;
      customer.cart = Cart(new uint256[](0), 0);
      storeBalance += paymentSum;
      emit CartCheckoutCompleted(msg.sender, paymentSum);
      return true;
    }
    emit CartCheckoutFailed(msg.sender, customer.balance, paymentSum);
    return false;
  }

  /**
    Empties the shopping cart
    @return success
  */
  function emptyCart() public returns (bool success) {
    Customer storage customer = customers[msg.sender];
    customer.cart = Cart(new uint256[](0), 0);
    emit CartEmptied(customer.adr);
    return true;
  }

  /**
    Changes the name of the store
    @param newStoreName New store name
    @return success
  */
  function renameStoreTo(string newStoreName) public onlyOwner returns (bool success) {
    storeName = newStoreName;
    return true;
  }

  /**
    Returns a elements describing a product
    @param id Product ID
    @return (name, description, price, defaultAmount)
  */
  function getProduct(uint256 id) public constant returns (bytes32 name, bytes32 description, uint256 price, uint256 defaultAmount) {
    return (products[id].name, products[id].description, products[id].price, products[id].defaultAmount);
  }
  
  /**
    Returns a list of product ids and a complete sum.
    The caller address must be a registered customer.
    @return (product_ids, complete_sum)
  */
  function getCart() public constant returns (uint256[] memory productIds, uint256 completeSum) {
    Customer storage customer = customers[msg.sender];
    uint256 len = customer.cart.products.length;
    uint256[] memory ids = new uint256[](len);
    for (uint256 i = 0; i < len; i++) {
      ids[i] = products[i].id;
    }
    return (ids, customer.cart.completeSum);
  }

  /**
    Returns customer's balance
    @return _balance Customer's balance
  */
  function getBalance() public constant returns (uint256 _balance) {
    return customers[msg.sender].balance;
  }

  /**
    Returns stores's own balance
    @return storeBalance Store's current balance
  */
  function getStoreBalance() public onlyOwner constant returns (uint256) {
    return storeBalance;
  }

  /**
    Checks product validity
    @param product Product struct
    @return valid
  */
  function checkProductValidity(Product product) internal pure returns (bool valid) {
    return (product.price > 0);
  }

  /**
    Destroys the contract
  */
  function kill() public onlyOwner {
    selfdestruct(owner); 
  }
}

