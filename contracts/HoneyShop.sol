pragma solidity ^0.4.21;

import "./base/Owned.sol";

/**
 * The HoneyShop contract is used to buy honey
 */
contract HoneyShop is Owned {
  string public name; 
  bool public open = true;
  uint productCount = 0;
  address treasuryAddress;
  address owner;
  uint premiumDuration = 30 minutes;

  event NewProduct(string name, uint price);
  event NewBuy(string name, uint price);
  event Cashout(address cashoutAddress);
  event IsPremium(address premiumAddress, bool isPremium);  

  enum ProductType { ForestHoney, BlossomHoney }
  enum Weekdays { Sunday, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday }

  struct Product {
    string name;
    ProductType productType;
    uint price;
    uint8 fillingQuantityInGrams;
  }

  mapping(uint => Product) products;
  mapping (address => uint) premiumMembers;  

  function HoneyShop (string _name) public {
    owner = msg.sender;
    name = _name;
  }	

  function isOpen() public view returns (bool o_isOpen) {
    return open;
  }  

  function changeAddress(address _address) public onlyOwner {
    if (_address != 0x0) {
      treasuryAddress = _address;
    }		
  }  

  function changeShopName(string _name) public onlyOwner {
    require(keccak256(_name) != keccak256(""));
    name = _name;
  }  

  function addProduct(string _name, uint8 _fillingQuantityInGrams, ProductType _productType, uint8 _price) public onlyOwner {
    Product memory p = Product({
      name: _name,
      productType: _productType,
      price: _price,
      fillingQuantityInGrams: _fillingQuantityInGrams
    });
    products[productCount] = p;
    emit NewProduct(_name, _price);
    productCount++;
  }  

  function purchase(uint _id) public payable {
    Product memory p = products[_id];  
    if (isPremium(msg.sender)) {
      emit IsPremium(msg.sender, true);
      p.price = (p.price * 5) / 100;
    } else {
      emit IsPremium(msg.sender, false);
    }  
    require(msg.value >= p.price);  
    emit NewBuy(p.name, p.price);
    msg.sender.transfer(msg.value - p.price);
  }  

  function subscribePremium() public payable {
    if (msg.value >= 100 finney) {
      premiumMembers[msg.sender] = block.timestamp;
      msg.sender.transfer(msg.value - 100 finney);
    }
  }  

  function isPremium(address _address) constant public returns (bool) {
    return (block.timestamp - premiumMembers[_address]) < premiumDuration;
  }  

  function cashout() public onlyOwner {
    treasuryAddress.transfer(this.balance);
    emit Cashout(treasuryAddress);
  } 
  
  function() public payable {
    treasuryAddress.transfer(msg.value);
  }  

  function kill() public onlyOwner {
    selfdestruct(owner); 
  }
}

