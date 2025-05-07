// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0 <0.9.0;

contract helloWorld {
	uint public greeting;
	mapping (address => uint) public balances;
	event Sent(address from, address to, uint amount);
	constructor (){
		greeting = 42;
	}

	function setgreeting(uint nbr) public {
		greeting = nbr;
	}

	function setBalance(address receiver, uint amount) public{
		balances[msg.sender] += amount;
		balances[receiver] += amount;
		emit Sent(msg.sender, receiver, amount);
	}

}
