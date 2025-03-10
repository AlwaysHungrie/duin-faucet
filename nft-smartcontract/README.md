# NFT Smart Contract

compile:
npx hardhat compile

test:
npx hardhat test

deploy:
npx hardhat ignition deploy ignition/modules/DuinNft.ts --network baseSepolia
npx hardhat ignition deploy ignition/modules/DuinNft.ts --network baseSepolia --tags DuinNft0

verify:
npx hardhat verify --network baseSepolia 0xeBFD1ee09C25A799e5a511d42EB193864860b673