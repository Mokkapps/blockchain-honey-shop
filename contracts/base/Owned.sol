pragma solidity ^0.4.21;

// Contract for maintaining ownership
contract Owned {
  address public owner;

  // Default constructor
  function Owned() public {
    owner = msg.sender;
  }

  modifier onlyOwner() {
    require(msg.sender == owner);
    _;
  }

  /**
    Changes the address of the store owner
    @param newOwner Address of the new owner
  */
  function transferOwnership(address newOwner) public onlyOwner {
    if (newOwner != address(0) &&
        newOwner != owner) {
      owner = newOwner;
    }
  }

}
