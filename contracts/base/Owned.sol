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
    @param new_owner Address of the new owner
  */
  function transferOwnership(address new_owner) public onlyOwner {
    if (new_owner != address(0) &&
        new_owner != owner) {
      owner = new_owner;
    }
  }

}
