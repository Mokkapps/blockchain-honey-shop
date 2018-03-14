pragma solidity ^0.4.2;

import "./HoneyShopPremium.sol";
import "./Ownable.sol";

/**
 * The HoneyShop contract is used to buy honey
 */
contract HoneyShop is Ownable {
	string public name;
	bool public open = true;

	uint productCount = 0;
	address treasuryAddress;
	address owner;

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

	HoneyShopPremium premiumShop = HoneyShopPremium(0x277aD07109FE52a742B808a3E6765Ee1Ad0e7Ad2);

	function HoneyShop (string _name) public {
		owner = msg.sender;
		name = _name;
	}	

	function isOpen() public view returns (bool o_isOpen) {
		return open;
	}

	function changeAddress(address _address) public ownerOnly {
		if (_address != 0x0) {
			treasuryAddress = _address;
		}		
	}

	function changeShopName(string _name) public ownerOnly {
		require(keccak256(_name) != keccak256(""));
		name = _name;
	}

	function addProduct(string _name, uint8 _fillingQuantityInGrams, ProductType _productType, uint8 _price) public ownerOnly {
		Product memory p = Product({
				name: _name,
				productType: _productType,
				price: _price,
				fillingQuantityInGrams: _fillingQuantityInGrams
			});
		products[productCount] = p;
		NewProduct(_name, _price);
		productCount++;
	}

	function purchase(uint _id) public payable {
		Product memory p = products[_id];

		if (premiumShop.isPremium(msg.sender)) {
			IsPremium(msg.sender, true);
			p.price = (p.price * 5) / 100;
		} else {
			IsPremium(msg.sender, false);
		}

		require(msg.value >= p.price);

		NewBuy(p.name, p.price);
		msg.sender.transfer(msg.value - p.price);
	}

	function cashout() public ownerOnly {
		treasuryAddress.transfer(this.balance);
		Cashout(treasuryAddress);
	}

	function() public payable {
		treasuryAddress.transfer(msg.value);
	}

	function kill() public ownerOnly {
    	selfdestruct(owner); 
    }
}

