import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

module.exports = buildModule("DuinNftModule", (m) => {
  const nft = m.contract("DuinNft", []);
  
  return { nft };
});