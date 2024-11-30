//SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import "@semaphore-protocol/contracts/base/SemaphoreGroups.sol";

contract TestSemaphoreGroups is SemaphoreGroups { 
    string public name;

    constructor(string memory _name) SemaphoreGroups(){
        name = _name;
    }
}