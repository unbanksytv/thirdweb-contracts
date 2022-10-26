// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.11;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract TestNFT is ERC721 {
    constructor() ERC721("test nft", "tnft") {}

    function mint(address to, uint256 id) external {
        _mint(to, id);
    }
}
