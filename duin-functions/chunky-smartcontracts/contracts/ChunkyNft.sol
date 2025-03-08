// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract ChunkyNft is ERC721URIStorage, Ownable {
    // Track the next token ID
    uint256 private _nextTokenId;
    
    // Events for minting and transferring
    event NFTMinted(uint256 tokenId, address recipient, string tokenURI);
    
    constructor() ERC721("ChunkySoup", "CHUNKY_SOUP") Ownable(msg.sender) {}
    
    /**
     * @dev Mint a new NFT and assign it to the contract owner
     * @param tokenURI The metadata URI (pointing to S3 image)
     * @return tokenId of the newly minted NFT
     */
    function mintNFT(string memory tokenURI) public onlyOwner returns (uint256) {
        uint256 newTokenId = _nextTokenId;
        _nextTokenId++;
        
        _mint(owner(), newTokenId);
        _setTokenURI(newTokenId, tokenURI);
        
        emit NFTMinted(newTokenId, owner(), tokenURI);
        
        return newTokenId;
    }

    /**
     * @dev Burn NFT
     * @param tokenId ID of the token to burn
     */
    function burnNFT(uint256 tokenId) public {
        require(ownerOf(tokenId) == msg.sender, "Only tokens owned by the user can be burned");
        _burn(tokenId);
    }
    
    /**
     * @dev Transfer NFT from owner to recipient
     * @param to Address of the recipient
     * @param tokenId ID of the token to transfer
     */
    function transferNFTToUser(address to, uint256 tokenId) public onlyOwner {
        require(ownerOf(tokenId) == owner(), "Only tokens owned by contract owner can be transferred");
        safeTransferFrom(owner(), to, tokenId);
    }
    
    /**
     * @dev Mint and transfer in a single transaction
     * @param to Recipient address
     * @param tokenURI The metadata URI (pointing to S3 image)
     * @return tokenId of the newly minted NFT
     */
    function mintAndTransfer(address to, string memory tokenURI) public onlyOwner returns (uint256) {
        uint256 tokenId = mintNFT(tokenURI);
        transferNFTToUser(to, tokenId);
        return tokenId;
    }
}