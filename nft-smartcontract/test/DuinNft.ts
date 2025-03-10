import { expect } from "chai";
import { ethers } from "hardhat";
import { Contract } from "ethers";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";

describe("DuinNft", function () {
  let duinNft: any;
  let owner: SignerWithAddress;
  let addr1: SignerWithAddress;
  let addr2: SignerWithAddress;
  const TEST_URI = "ipfs://QmTest123456789";
  const BURN_ADDRESS = '0x0000000000000000000000000000000000000000';
  beforeEach(async function () {
    // Get signers
    [owner, addr1, addr2] = await ethers.getSigners();
    
    // Deploy the contract
    const DuinNft = await ethers.getContractFactory("DuinNft");
    duinNft = await DuinNft.deploy();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await duinNft.owner()).to.equal(owner.address);
    });

    it("Should have the correct name and symbol", async function () {
      expect(await duinNft.name()).to.equal("CrystallBall");
      expect(await duinNft.symbol()).to.equal("CRYSTALL_BALL");
    });
  });

  describe("Minting", function () {
    it("Should allow the owner to mint an NFT", async function () {
      const tx = await duinNft.mintNFT(TEST_URI);
      const receipt = await tx.wait();
      
      // Verify the token exists and has correct URI
      const tokenId = 0; // First token should have ID 0
      expect(await duinNft.ownerOf(tokenId)).to.equal(owner.address);
      expect(await duinNft.tokenURI(tokenId)).to.equal(TEST_URI);
    });

    it("Should increment token IDs correctly", async function () {
      await duinNft.mintNFT("URI1");
      await duinNft.mintNFT("URI2");
      await duinNft.mintNFT("URI3");
      
      expect(await duinNft.ownerOf(0)).to.equal(owner.address);
      expect(await duinNft.ownerOf(1)).to.equal(owner.address);
      expect(await duinNft.ownerOf(2)).to.equal(owner.address);
      
      expect(await duinNft.tokenURI(0)).to.equal("URI1");
      expect(await duinNft.tokenURI(1)).to.equal("URI2");
      expect(await duinNft.tokenURI(2)).to.equal("URI3");
    });

    it("Should prevent non-owners from minting", async function () {
      let errorOccurred = false;
      try {
        await duinNft.connect(addr1).mintNFT(TEST_URI);
      } catch (error) {
        errorOccurred = true;
      }
      expect(errorOccurred).to.be.true;
    });
  });

  describe("Transferring", function () {
    beforeEach(async function () {
      // Mint a token for testing transfers
      await duinNft.mintNFT(TEST_URI);
    });

    it("Should allow the owner to transfer NFTs", async function () {
      await duinNft.transferNFTToUser(addr1.address, 0);
      expect(await duinNft.ownerOf(0)).to.equal(addr1.address);
    });

    it("Should prevent non-owners from transferring NFTs", async function () {
      let errorOccurred = false;
      try {
        await duinNft.connect(addr1).transferNFTToUser(addr2.address, 0);
      } catch (error) {
        errorOccurred = true;
      }
      expect(errorOccurred).to.be.true;
    });

    it("Should revert if trying to transfer a token not owned by the contract owner", async function () {
      // First transfer to addr1
      await duinNft.transferNFTToUser(addr1.address, 0);
      
      // Then try to transfer again (should fail)
      let errorOccurred = false;
      let errorMessage = "";
      try {
        await duinNft.transferNFTToUser(addr2.address, 0);
      } catch (error: any) {
        errorOccurred = true;
        errorMessage = error.message;
      }
      expect(errorOccurred).to.be.true;
      expect(errorMessage).to.include("Only tokens owned by contract owner can be transferred");
    });
  });

  describe("Mint and Transfer", function () {
    it("Should mint and transfer in a single transaction", async function () {
      const tx = await duinNft.mintAndTransfer(addr1.address, TEST_URI);
      await tx.wait();
      
      // Verify the token was transferred to addr1
      const tokenId = 0; // First token should have ID 0
      expect(await duinNft.ownerOf(tokenId)).to.equal(addr1.address);
      expect(await duinNft.tokenURI(tokenId)).to.equal(TEST_URI);
    });

    it("Should revert if non-owner tries to mint and transfer", async function () {
      let errorOccurred = false;
      try {
        await duinNft.connect(addr1).mintAndTransfer(addr2.address, TEST_URI);
      } catch (error) {
        errorOccurred = true;
      }
      expect(errorOccurred).to.be.true;
    });
  });

  describe("Burning", function () {
    it("Should only allow the token owner to burn NFTs", async function () {
      const tx = await duinNft.mintAndTransfer(addr1.address, TEST_URI);
      await tx.wait();

      const tokenId = 0;
      const duinNftAsAddr1 = duinNft.connect(addr1);
      let errorOccurred = false;
      
      try {
        await duinNftAsAddr1.burnNFT(tokenId);
      } catch (error) {
        errorOccurred = true;
      }
      expect(errorOccurred).to.be.false;
    });

    it("Should not allow non-owners to burn NFTs", async function () {
      const tx = await duinNft.mintAndTransfer(addr1.address, TEST_URI);
      await tx.wait();

      const duinNftAsAddr2 = duinNft.connect(addr2);
      const tokenId = 0;
      
      let errorOccurred = false;
      try {
        await duinNftAsAddr2.burnNFT(tokenId);
      } catch (error) {
        errorOccurred = true;
      }
      expect(errorOccurred).to.be.true;
    });
  });

  describe("Events", function() {
    it("Should emit NFTMinted event when minting", async function() {
      const tx = await duinNft.mintNFT(TEST_URI);
      const receipt = await tx.wait();
      
      // Check if NFTMinted event exists in receipt logs
      let eventFound = false;
      for (const log of receipt.logs) {
        try {
          const event = duinNft.interface.parseLog(log);
          if (event && event.name === 'NFTMinted') {
            eventFound = true;
            expect(event.args[0]).to.equal(0); // tokenId
            expect(event.args[1]).to.equal(owner.address); // recipient
            expect(event.args[2]).to.equal(TEST_URI); // tokenURI
            break;
          }
        } catch (error) {
          // Skip logs that can't be parsed as events
          continue;
        }
      }
      expect(eventFound).to.be.true;
    });
  });

  describe("Gas Usage", function () {
    it("Should report gas usage for mint operations", async function () {
      const tx = await duinNft.mintNFT(TEST_URI);
      const receipt = await tx.wait();
      console.log(`Gas used for minting: ${receipt.gasUsed.toString()}`);
    });

    it("Should report gas usage for mint and transfer operations", async function () {
      const tx = await duinNft.mintAndTransfer(addr1.address, TEST_URI);
      const receipt = await tx.wait();
      console.log(`Gas used for mint and transfer: ${receipt.gasUsed.toString()}`);
    });
  });
});