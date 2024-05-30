// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

//import "hardhat/console.sol";

contract Assessment {
    address payable public owner;
    uint256 public balance;

    event Addfunds(uint256 amount);
    event Purchase(uint256 amount);

    constructor(uint initBalance) payable {
        owner = payable(msg.sender);
        balance = initBalance;
    }

    function getBalance() public view returns (uint256) {
        return balance;
    }

    function addfunds(uint256 _amount) public payable {
        uint256 _previousBalance = balance;

      
        require(msg.sender == owner, "You are not the owner of this account");

        // perform transaction
        balance += _amount;

       
        assert(balance == _previousBalance + _amount);

        // emit the event
        emit Addfunds(_amount);
    }

   
    error InsufficientBalance(uint256 balance, uint256 purchaseAmount);

    function purchase(uint256 _purchaseAmount) public {
        require(msg.sender == owner, "You are not the owner of this account");
        uint256 _previousBalance = balance;
        if (balance < _purchaseAmount) {
            revert InsufficientBalance({
                balance: balance,
                purchaseAmount: _purchaseAmount
            });
        }

       
        balance -= _purchaseAmount;

        // assert the balance is correct
        assert(balance == (_previousBalance - _purchaseAmount));

        
        emit Purchase(_purchaseAmount);
    }
}
