// SPDX-License-Identifier: MIT
pragma solidity >=0.5.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract MyNFT is ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIds;

    constructor() ERC721("Code Eater", "CER") {}

    function mintNFT(address recipient, string memory tokenURI)
        public
        onlyOwner
        returns (uint256)
    {
        _tokenIds.increment();

        uint256 newItemId = _tokenIds.current();
        _mint(recipient, newItemId);
        _setTokenURI(newItemId, tokenURI);
        return newItemId;
    }

    function getNFTById(uint256 tokenId)
        public
        view
        returns (string memory)
    {
        require(_exists(tokenId), "NFT does not exist");
        return tokenURI(tokenId);
    }

    function getAllNFTs() public view returns (uint256[] memory) {
        uint256[] memory allNFTs = new uint256[](_tokenIds.current());
        for (uint256 i = 1; i <= _tokenIds.current(); i++) {
            allNFTs[i - 1] = i;
        }
        return allNFTs;
    }

    function updateNFT(uint256 tokenId, string memory newTokenURI)
        public
        onlyOwner
    {
        require(_exists(tokenId), "NFT does not exist");
        _setTokenURI(tokenId, newTokenURI);
    }

    function deleteNFT(uint256 tokenId) public onlyOwner {
        require(_exists(tokenId), "NFT does not exist");
        _burn(tokenId);
    }
}
