//SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import "@semaphore-protocol/contracts/base/SemaphoreVerifier.sol";

contract TestSemaphoreVerifier is SemaphoreVerifier { 
    string public name;

    constructor(string memory _name) SemaphoreVerifier(){
        name = _name;
    }
}