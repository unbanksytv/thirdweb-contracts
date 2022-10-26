// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.11;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract TestERC20 is ERC20 {
    constructor() ERC20("test 20", "t20") {}

    function mint(address to, uint256 amount) external {
        _mint(to, amount);
    }
}
