import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

module.exports = buildModule("ChunkyNftModule", (m) => {
  const nft = m.contract("ChunkyNft", []);
  
  return { nft };
});