pragma solidity ^0.4.2;

import "./Ownable.sol";

/**
 * The HoneyShopPremium contract handles premium membership
 */
contract HoneyShopPremium is Ownable {
	uint duration = 3 minutes;

	event IsPremium(bool isPremium);

    mapping (address => uint) premiumMembers;
    
	function HoneyShopPremium () public {
		owner = msg.sender;
	}	

	function () public payable {
		if (msg.value >= 100 finney) {
			premiumMembers[msg.sender] = now;
			msg.sender.transfer(msg.value - 100 finney);
		}
	}

	function isPremium(address _address) constant public returns (bool) {
		return (now - premiumMembers[_address]) < duration;
	}

	function cashout() public ownerOnly {
		owner.transfer(this.balance);
	}
}

