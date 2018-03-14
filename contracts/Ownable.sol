pragma solidity ^0.4.2;

/**
 * The ownable contract checks if sender is owner
 */
contract Ownable {
	address public owner;

    modifier ownerOnly() { 
    	require (msg.sender == owner); 
    	_; 
    }
}
