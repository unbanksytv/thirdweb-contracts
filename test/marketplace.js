const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Marketplace", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployMarketplace() {
    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await ethers.getSigners();

    const NFT = await ethers.getContractFactory("TestNFT");
    const nft = await NFT.deploy();
    await nft.mint(owner.address, 1);

    const XP = await ethers.getContractFactory("MockOdysseyXp");
    const xp = await XP.deploy();

    const Token = await ethers.getContractFactory("TestERC20");
    const token = await Token.deploy();
    await token.mint(otherAccount.address, ethers.constants.WeiPerEther.mul(100));
    

    const Marketplace = await ethers.getContractFactory("OdysseyMarketplace");
    const marketplace = await Marketplace.deploy(
      "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
      owner.address,
      xp.address,
      owner.address,
      200
    );

    await nft.setApprovalForAll(marketplace.address, true);
    await token.connect(otherAccount).approve(marketplace.address, ethers.constants.MaxUint256);


    return { marketplace, nft, token, owner, otherAccount, Marketplace };
    
  }

  describe("721 direct buy", function () {
    it("everythings fine", async function () {
      const { marketplace, nft, token, owner, otherAccount } = await loadFixture(deployMarketplace);
      const timeStamp = (await ethers.provider.getBlock("latest")).timestamp
      await marketplace.createListing({
        assetContract: nft.address,
        tokenId: 1,
        startTime: timeStamp,
        secondsUntilEndTime: ethers.constants.MaxUint256.div(2),
        quantityToList: 1,
        currencyToAccept: [token.address],
        reservePricePerToken: 0,
        buyoutPricePerToken: [ethers.constants.WeiPerEther],
        listingType: 0
      });

      await marketplace.connect(otherAccount).buy(
        0,
        otherAccount.address,
        1,
        token.address,
        ethers.constants.WeiPerEther,
        0
      )
    });
  });

  describe("721 collection", function () {
    it("everythings fine", async function () {
      const { marketplace, nft, token, owner, otherAccount } = await loadFixture(deployMarketplace);
      for (let i=2; i<=100; i++) {
        await nft.mint(owner.address, i);
      }
      const timeStamp = (await ethers.provider.getBlock("latest")).timestamp
      await marketplace.createCollectionListing({
        assetContract: nft.address,
        owner: owner.address,
        startTime: timeStamp,
        secondsUntilEndTime: ethers.constants.MaxUint256.div(2),
        quantityToList: 100,
        currencyToAccept: [token.address],
        buyoutPricePerToken: [ethers.constants.WeiPerEther]
      });

      await marketplace.connect(otherAccount).buy(
        0,
        otherAccount.address,
        1,
        token.address,
        ethers.constants.WeiPerEther,
        1
      )
    });
  });

  describe("multicall ", function () {
    it("everythings fine", async function () {
      const { marketplace, nft, token, owner, otherAccount, Marketplace } = await loadFixture(deployMarketplace);
      for (let i=2; i<=100; i++) {
        await nft.mint(owner.address, i);
      }
      const timeStamp = (await ethers.provider.getBlock("latest")).timestamp

      let iface = Marketplace.interface
      const call1 = iface.encodeFunctionData("createCollectionListing", [{
        assetContract: nft.address,
        owner: owner.address,
        startTime: timeStamp,
        secondsUntilEndTime: ethers.constants.MaxUint256.div(2),
        quantityToList: 100,
        currencyToAccept: [token.address],
        buyoutPricePerToken: [ethers.constants.WeiPerEther]
      }]);

      const call2 = iface.encodeFunctionData("createListing", [{
        assetContract: nft.address,
        tokenId: 2,
        startTime: timeStamp,
        secondsUntilEndTime: ethers.constants.MaxUint256.div(2),
        quantityToList: 1,
        currencyToAccept: [token.address],
        reservePricePerToken: 0,
        buyoutPricePerToken: [ethers.constants.WeiPerEther],
        listingType: 0
      }]);

      await marketplace.multicall([
        call1, call2
      ]);

      await marketplace.connect(otherAccount).buy(
        0,
        otherAccount.address,
        1,
        token.address,
        ethers.constants.WeiPerEther,
        1
      )

      await marketplace.connect(otherAccount).buy(
        1,
        otherAccount.address,
        1,
        token.address,
        ethers.constants.WeiPerEther,
        2
      )
    });
  });
});
