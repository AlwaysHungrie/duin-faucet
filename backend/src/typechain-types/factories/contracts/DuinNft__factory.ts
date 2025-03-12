/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import {
  Contract,
  ContractFactory,
  ContractTransactionResponse,
  Interface,
} from "ethers";
import type { Signer, ContractDeployTransaction, ContractRunner } from "ethers";
import type { NonPayableOverrides } from "../../common";
import type { DuinNft, DuinNftInterface } from "../../contracts/DuinNft";

const _abi = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "sender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    name: "ERC721IncorrectOwner",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "operator",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "ERC721InsufficientApproval",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "approver",
        type: "address",
      },
    ],
    name: "ERC721InvalidApprover",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "operator",
        type: "address",
      },
    ],
    name: "ERC721InvalidOperator",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    name: "ERC721InvalidOwner",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "receiver",
        type: "address",
      },
    ],
    name: "ERC721InvalidReceiver",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "sender",
        type: "address",
      },
    ],
    name: "ERC721InvalidSender",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "ERC721NonexistentToken",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    name: "OwnableInvalidOwner",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "OwnableUnauthorizedAccount",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "approved",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "Approval",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "operator",
        type: "address",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "approved",
        type: "bool",
      },
    ],
    name: "ApprovalForAll",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "_fromTokenId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "_toTokenId",
        type: "uint256",
      },
    ],
    name: "BatchMetadataUpdate",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "_tokenId",
        type: "uint256",
      },
    ],
    name: "MetadataUpdate",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "recipient",
        type: "address",
      },
      {
        indexed: false,
        internalType: "string",
        name: "tokenURI",
        type: "string",
      },
    ],
    name: "NFTMinted",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "approve",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    name: "balanceOf",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "burnNFT",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "getApproved",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "address",
        name: "operator",
        type: "address",
      },
    ],
    name: "isApprovedForAll",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "string",
        name: "tokenURI",
        type: "string",
      },
    ],
    name: "mintAndTransfer",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "tokenURI",
        type: "string",
      },
    ],
    name: "mintNFT",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "name",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "ownerOf",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "safeTransferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
    ],
    name: "safeTransferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "operator",
        type: "address",
      },
      {
        internalType: "bool",
        name: "approved",
        type: "bool",
      },
    ],
    name: "setApprovalForAll",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes4",
        name: "interfaceId",
        type: "bytes4",
      },
    ],
    name: "supportsInterface",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "tokenURI",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "transferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "transferNFTToUser",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

const _bytecode =
  "0x60806040523480156200001157600080fd5b50336040518060400160405280600c81526020017f4372797374616c6c42616c6c00000000000000000000000000000000000000008152506040518060400160405280600d81526020017f4352595354414c4c5f42414c4c00000000000000000000000000000000000000815250816000908162000090919062000472565b508060019081620000a2919062000472565b505050600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff16036200011a5760006040517f1e4fbdf70000000000000000000000000000000000000000000000000000000081526004016200011191906200059e565b60405180910390fd5b6200012b816200013260201b60201c565b50620005bb565b6000600760009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905081600760006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508173ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e060405160405180910390a35050565b600081519050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b600060028204905060018216806200027a57607f821691505b60208210810362000290576200028f62000232565b5b50919050565b60008190508160005260206000209050919050565b60006020601f8301049050919050565b600082821b905092915050565b600060088302620002fa7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff82620002bb565b620003068683620002bb565b95508019841693508086168417925050509392505050565b6000819050919050565b6000819050919050565b6000620003536200034d62000347846200031e565b62000328565b6200031e565b9050919050565b6000819050919050565b6200036f8362000332565b620003876200037e826200035a565b848454620002c8565b825550505050565b600090565b6200039e6200038f565b620003ab81848462000364565b505050565b5b81811015620003d357620003c760008262000394565b600181019050620003b1565b5050565b601f8211156200042257620003ec8162000296565b620003f784620002ab565b8101602085101562000407578190505b6200041f6200041685620002ab565b830182620003b0565b50505b505050565b600082821c905092915050565b6000620004476000198460080262000427565b1980831691505092915050565b600062000462838362000434565b9150826002028217905092915050565b6200047d82620001f8565b67ffffffffffffffff81111562000499576200049862000203565b5b620004a5825462000261565b620004b2828285620003d7565b600060209050601f831160018114620004ea5760008415620004d5578287015190505b620004e1858262000454565b86555062000551565b601f198416620004fa8662000296565b60005b828110156200052457848901518255600182019150602085019450602081019050620004fd565b8683101562000544578489015162000540601f89168262000434565b8355505b6001600288020188555050505b505050505050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000620005868262000559565b9050919050565b620005988162000579565b82525050565b6000602082019050620005b560008301846200058d565b92915050565b612a8b80620005cb6000396000f3fe608060405234801561001057600080fd5b506004361061012c5760003560e01c8063715018a6116100ad578063b88d4fde11610071578063b88d4fde1461032d578063c87b56dd14610349578063e985e9c514610379578063f2fde38b146103a9578063fb37e883146103c55761012c565b8063715018a6146102af5780638da5cb5b146102b957806395d89b41146102d7578063a22cb465146102f5578063a2362349146103115761012c565b80632890e0d7116100f45780632890e0d7146101e75780633df0805e1461020357806342842e0e146102335780636352211e1461024f57806370a082311461027f5761012c565b806301ffc9a71461013157806306fdde0314610161578063081812fc1461017f578063095ea7b3146101af57806323b872dd146101cb575b600080fd5b61014b60048036038101906101469190611d38565b6103f5565b6040516101589190611d80565b60405180910390f35b610169610456565b6040516101769190611e2b565b60405180910390f35b61019960048036038101906101949190611e83565b6104e8565b6040516101a69190611ef1565b60405180910390f35b6101c960048036038101906101c49190611f38565b610504565b005b6101e560048036038101906101e09190611f78565b61051a565b005b61020160048036038101906101fc9190611e83565b61061c565b005b61021d60048036038101906102189190612100565b61069e565b60405161022a919061216b565b60405180910390f35b61024d60048036038101906102489190611f78565b6106c9565b005b61026960048036038101906102649190611e83565b6106e9565b6040516102769190611ef1565b60405180910390f35b61029960048036038101906102949190612186565b6106fb565b6040516102a6919061216b565b60405180910390f35b6102b76107b5565b005b6102c16107c9565b6040516102ce9190611ef1565b60405180910390f35b6102df6107f3565b6040516102ec9190611e2b565b60405180910390f35b61030f600480360381019061030a91906121df565b610885565b005b61032b60048036038101906103269190611f38565b61089b565b005b610347600480360381019061034291906122c0565b610936565b005b610363600480360381019061035e9190611e83565b61095b565b6040516103709190611e2b565b60405180910390f35b610393600480360381019061038e9190612343565b610a6e565b6040516103a09190611d80565b60405180910390f35b6103c360048036038101906103be9190612186565b610b02565b005b6103df60048036038101906103da9190612383565b610b88565b6040516103ec919061216b565b60405180910390f35b6000634906490660e01b7bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916827bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916148061044f575061044e82610c17565b5b9050919050565b606060008054610465906123fb565b80601f0160208091040260200160405190810160405280929190818152602001828054610491906123fb565b80156104de5780601f106104b3576101008083540402835291602001916104de565b820191906000526020600020905b8154815290600101906020018083116104c157829003601f168201915b5050505050905090565b60006104f382610cf9565b506104fd82610d81565b9050919050565b6105168282610511610dbe565b610dc6565b5050565b600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff160361058c5760006040517f64a0ae920000000000000000000000000000000000000000000000000000000081526004016105839190611ef1565b60405180910390fd5b60006105a0838361059b610dbe565b610dd8565b90508373ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff1614610616578382826040517f64283d7b00000000000000000000000000000000000000000000000000000000815260040161060d9392919061242c565b60405180910390fd5b50505050565b3373ffffffffffffffffffffffffffffffffffffffff1661063c826106e9565b73ffffffffffffffffffffffffffffffffffffffff1614610692576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610689906124d5565b60405180910390fd5b61069b81610ff2565b50565b60006106a8611078565b60006106b383610b88565b90506106bf848261089b565b8091505092915050565b6106e483838360405180602001604052806000815250610936565b505050565b60006106f482610cf9565b9050919050565b60008073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff160361076e5760006040517f89c62b640000000000000000000000000000000000000000000000000000000081526004016107659190611ef1565b60405180910390fd5b600360008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020549050919050565b6107bd611078565b6107c760006110ff565b565b6000600760009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905090565b606060018054610802906123fb565b80601f016020809104026020016040519081016040528092919081815260200182805461082e906123fb565b801561087b5780601f106108505761010080835404028352916020019161087b565b820191906000526020600020905b81548152906001019060200180831161085e57829003601f168201915b5050505050905090565b610897610890610dbe565b83836111c5565b5050565b6108a3611078565b6108ab6107c9565b73ffffffffffffffffffffffffffffffffffffffff166108ca826106e9565b73ffffffffffffffffffffffffffffffffffffffff1614610920576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161091790612567565b60405180910390fd5b61093261092b6107c9565b83836106c9565b5050565b61094184848461051a565b61095561094c610dbe565b85858585611334565b50505050565b606061096682610cf9565b506000600660008481526020019081526020016000208054610987906123fb565b80601f01602080910402602001604051908101604052809291908181526020018280546109b3906123fb565b8015610a005780601f106109d557610100808354040283529160200191610a00565b820191906000526020600020905b8154815290600101906020018083116109e357829003601f168201915b505050505090506000610a116114e5565b90506000815103610a26578192505050610a69565b600082511115610a5b578082604051602001610a439291906125c3565b60405160208183030381529060405292505050610a69565b610a64846114fc565b925050505b919050565b6000600560008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff16905092915050565b610b0a611078565b600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff1603610b7c5760006040517f1e4fbdf7000000000000000000000000000000000000000000000000000000008152600401610b739190611ef1565b60405180910390fd5b610b85816110ff565b50565b6000610b92611078565b6000600854905060086000815480929190610bac90612616565b9190505550610bc2610bbc6107c9565b82611565565b610bcc818461165e565b7f06becd955c918828f6e985541acbf49cc842c9e9bd569fffc7698e721ef1357581610bf66107c9565b85604051610c069392919061265e565b60405180910390a180915050919050565b60007f80ac58cd000000000000000000000000000000000000000000000000000000007bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916827bffffffffffffffffffffffffffffffffffffffffffffffffffffffff19161480610ce257507f5b5e139f000000000000000000000000000000000000000000000000000000007bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916827bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916145b80610cf25750610cf1826116ba565b5b9050919050565b600080610d0583611724565b9050600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff1603610d7857826040517f7e273289000000000000000000000000000000000000000000000000000000008152600401610d6f919061216b565b60405180910390fd5b80915050919050565b60006004600083815260200190815260200160002060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff169050919050565b600033905090565b610dd38383836001611761565b505050565b600080610de484611724565b9050600073ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff1614610e2657610e25818486611926565b5b600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff1614610eb757610e68600085600080611761565b6001600360008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600082825403925050819055505b600073ffffffffffffffffffffffffffffffffffffffff168573ffffffffffffffffffffffffffffffffffffffff1614610f3a576001600360008773ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600082825401925050819055505b846002600086815260200190815260200160002060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550838573ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef60405160405180910390a4809150509392505050565b60006110016000836000610dd8565b9050600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff160361107457816040517f7e27328900000000000000000000000000000000000000000000000000000000815260040161106b919061216b565b60405180910390fd5b5050565b611080610dbe565b73ffffffffffffffffffffffffffffffffffffffff1661109e6107c9565b73ffffffffffffffffffffffffffffffffffffffff16146110fd576110c1610dbe565b6040517f118cdaa70000000000000000000000000000000000000000000000000000000081526004016110f49190611ef1565b60405180910390fd5b565b6000600760009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905081600760006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508173ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e060405160405180910390a35050565b600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff160361123657816040517f5b08ba1800000000000000000000000000000000000000000000000000000000815260040161122d9190611ef1565b60405180910390fd5b80600560008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060006101000a81548160ff0219169083151502179055508173ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff167f17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c31836040516113279190611d80565b60405180910390a3505050565b60008373ffffffffffffffffffffffffffffffffffffffff163b11156114de578273ffffffffffffffffffffffffffffffffffffffff1663150b7a02868685856040518563ffffffff1660e01b815260040161139394939291906126f1565b6020604051808303816000875af19250505080156113cf57506040513d601f19601f820116820180604052508101906113cc9190612752565b60015b611453573d80600081146113ff576040519150601f19603f3d011682016040523d82523d6000602084013e611404565b606091505b50600081510361144b57836040517f64a0ae920000000000000000000000000000000000000000000000000000000081526004016114429190611ef1565b60405180910390fd5b805181602001fd5b63150b7a0260e01b7bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916817bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916146114dc57836040517f64a0ae920000000000000000000000000000000000000000000000000000000081526004016114d39190611ef1565b60405180910390fd5b505b5050505050565b606060405180602001604052806000815250905090565b606061150782610cf9565b5060006115126114e5565b90506000815111611532576040518060200160405280600081525061155d565b8061153c846119ea565b60405160200161154d9291906125c3565b6040516020818303038152906040525b915050919050565b600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff16036115d75760006040517f64a0ae920000000000000000000000000000000000000000000000000000000081526004016115ce9190611ef1565b60405180910390fd5b60006115e583836000610dd8565b9050600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff16146116595760006040517f73c6ac6e0000000000000000000000000000000000000000000000000000000081526004016116509190611ef1565b60405180910390fd5b505050565b8060066000848152602001908152602001600020908161167e919061292b565b507ff8e1a15aba9398e019f0b49df1a4fde98ee17ae345cb5f6b5e2c27f5033e8ce7826040516116ae919061216b565b60405180910390a15050565b60007f01ffc9a7000000000000000000000000000000000000000000000000000000007bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916827bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916149050919050565b60006002600083815260200190815260200160002060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff169050919050565b808061179a5750600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff1614155b156118ce5760006117aa84610cf9565b9050600073ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff161415801561181557508273ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff1614155b801561182857506118268184610a6e565b155b1561186a57826040517fa9fbf51f0000000000000000000000000000000000000000000000000000000081526004016118619190611ef1565b60405180910390fd5b81156118cc57838573ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b92560405160405180910390a45b505b836004600085815260200190815260200160002060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555050505050565b611931838383611ab8565b6119e557600073ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff16036119a657806040517f7e27328900000000000000000000000000000000000000000000000000000000815260040161199d919061216b565b60405180910390fd5b81816040517f177e802f0000000000000000000000000000000000000000000000000000000081526004016119dc9291906129fd565b60405180910390fd5b505050565b6060600060016119f984611b79565b01905060008167ffffffffffffffff811115611a1857611a17611fd5565b5b6040519080825280601f01601f191660200182016040528015611a4a5781602001600182028036833780820191505090505b509050600082602001820190505b600115611aad578080600190039150507f3031323334353637383961626364656600000000000000000000000000000000600a86061a8153600a8581611aa157611aa0612a26565b5b04945060008503611a58575b819350505050919050565b60008073ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff1614158015611b7057508273ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff161480611b315750611b308484610a6e565b5b80611b6f57508273ffffffffffffffffffffffffffffffffffffffff16611b5783610d81565b73ffffffffffffffffffffffffffffffffffffffff16145b5b90509392505050565b600080600090507a184f03e93ff9f4daa797ed6e38ed64bf6a1f0100000000000000008310611bd7577a184f03e93ff9f4daa797ed6e38ed64bf6a1f0100000000000000008381611bcd57611bcc612a26565b5b0492506040810190505b6d04ee2d6d415b85acef81000000008310611c14576d04ee2d6d415b85acef81000000008381611c0a57611c09612a26565b5b0492506020810190505b662386f26fc100008310611c4357662386f26fc100008381611c3957611c38612a26565b5b0492506010810190505b6305f5e1008310611c6c576305f5e1008381611c6257611c61612a26565b5b0492506008810190505b6127108310611c91576127108381611c8757611c86612a26565b5b0492506004810190505b60648310611cb45760648381611caa57611ca9612a26565b5b0492506002810190505b600a8310611cc3576001810190505b80915050919050565b6000604051905090565b600080fd5b600080fd5b60007fffffffff0000000000000000000000000000000000000000000000000000000082169050919050565b611d1581611ce0565b8114611d2057600080fd5b50565b600081359050611d3281611d0c565b92915050565b600060208284031215611d4e57611d4d611cd6565b5b6000611d5c84828501611d23565b91505092915050565b60008115159050919050565b611d7a81611d65565b82525050565b6000602082019050611d956000830184611d71565b92915050565b600081519050919050565b600082825260208201905092915050565b60005b83811015611dd5578082015181840152602081019050611dba565b60008484015250505050565b6000601f19601f8301169050919050565b6000611dfd82611d9b565b611e078185611da6565b9350611e17818560208601611db7565b611e2081611de1565b840191505092915050565b60006020820190508181036000830152611e458184611df2565b905092915050565b6000819050919050565b611e6081611e4d565b8114611e6b57600080fd5b50565b600081359050611e7d81611e57565b92915050565b600060208284031215611e9957611e98611cd6565b5b6000611ea784828501611e6e565b91505092915050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000611edb82611eb0565b9050919050565b611eeb81611ed0565b82525050565b6000602082019050611f066000830184611ee2565b92915050565b611f1581611ed0565b8114611f2057600080fd5b50565b600081359050611f3281611f0c565b92915050565b60008060408385031215611f4f57611f4e611cd6565b5b6000611f5d85828601611f23565b9250506020611f6e85828601611e6e565b9150509250929050565b600080600060608486031215611f9157611f90611cd6565b5b6000611f9f86828701611f23565b9350506020611fb086828701611f23565b9250506040611fc186828701611e6e565b9150509250925092565b600080fd5b600080fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b61200d82611de1565b810181811067ffffffffffffffff8211171561202c5761202b611fd5565b5b80604052505050565b600061203f611ccc565b905061204b8282612004565b919050565b600067ffffffffffffffff82111561206b5761206a611fd5565b5b61207482611de1565b9050602081019050919050565b82818337600083830152505050565b60006120a361209e84612050565b612035565b9050828152602081018484840111156120bf576120be611fd0565b5b6120ca848285612081565b509392505050565b600082601f8301126120e7576120e6611fcb565b5b81356120f7848260208601612090565b91505092915050565b6000806040838503121561211757612116611cd6565b5b600061212585828601611f23565b925050602083013567ffffffffffffffff81111561214657612145611cdb565b5b612152858286016120d2565b9150509250929050565b61216581611e4d565b82525050565b6000602082019050612180600083018461215c565b92915050565b60006020828403121561219c5761219b611cd6565b5b60006121aa84828501611f23565b91505092915050565b6121bc81611d65565b81146121c757600080fd5b50565b6000813590506121d9816121b3565b92915050565b600080604083850312156121f6576121f5611cd6565b5b600061220485828601611f23565b9250506020612215858286016121ca565b9150509250929050565b600067ffffffffffffffff82111561223a57612239611fd5565b5b61224382611de1565b9050602081019050919050565b600061226361225e8461221f565b612035565b90508281526020810184848401111561227f5761227e611fd0565b5b61228a848285612081565b509392505050565b600082601f8301126122a7576122a6611fcb565b5b81356122b7848260208601612250565b91505092915050565b600080600080608085870312156122da576122d9611cd6565b5b60006122e887828801611f23565b94505060206122f987828801611f23565b935050604061230a87828801611e6e565b925050606085013567ffffffffffffffff81111561232b5761232a611cdb565b5b61233787828801612292565b91505092959194509250565b6000806040838503121561235a57612359611cd6565b5b600061236885828601611f23565b925050602061237985828601611f23565b9150509250929050565b60006020828403121561239957612398611cd6565b5b600082013567ffffffffffffffff8111156123b7576123b6611cdb565b5b6123c3848285016120d2565b91505092915050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b6000600282049050600182168061241357607f821691505b602082108103612426576124256123cc565b5b50919050565b60006060820190506124416000830186611ee2565b61244e602083018561215c565b61245b6040830184611ee2565b949350505050565b7f4f6e6c7920746f6b656e73206f776e656420627920746865207573657220636160008201527f6e206265206275726e6564000000000000000000000000000000000000000000602082015250565b60006124bf602b83611da6565b91506124ca82612463565b604082019050919050565b600060208201905081810360008301526124ee816124b2565b9050919050565b7f4f6e6c7920746f6b656e73206f776e656420627920636f6e7472616374206f7760008201527f6e65722063616e206265207472616e7366657272656400000000000000000000602082015250565b6000612551603683611da6565b915061255c826124f5565b604082019050919050565b6000602082019050818103600083015261258081612544565b9050919050565b600081905092915050565b600061259d82611d9b565b6125a78185612587565b93506125b7818560208601611db7565b80840191505092915050565b60006125cf8285612592565b91506125db8284612592565b91508190509392505050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b600061262182611e4d565b91507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff8203612653576126526125e7565b5b600182019050919050565b6000606082019050612673600083018661215c565b6126806020830185611ee2565b81810360408301526126928184611df2565b9050949350505050565b600081519050919050565b600082825260208201905092915050565b60006126c38261269c565b6126cd81856126a7565b93506126dd818560208601611db7565b6126e681611de1565b840191505092915050565b60006080820190506127066000830187611ee2565b6127136020830186611ee2565b612720604083018561215c565b818103606083015261273281846126b8565b905095945050505050565b60008151905061274c81611d0c565b92915050565b60006020828403121561276857612767611cd6565b5b60006127768482850161273d565b91505092915050565b60008190508160005260206000209050919050565b60006020601f8301049050919050565b600082821b905092915050565b6000600883026127e17fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff826127a4565b6127eb86836127a4565b95508019841693508086168417925050509392505050565b6000819050919050565b600061282861282361281e84611e4d565b612803565b611e4d565b9050919050565b6000819050919050565b6128428361280d565b61285661284e8261282f565b8484546127b1565b825550505050565b600090565b61286b61285e565b612876818484612839565b505050565b5b8181101561289a5761288f600082612863565b60018101905061287c565b5050565b601f8211156128df576128b08161277f565b6128b984612794565b810160208510156128c8578190505b6128dc6128d485612794565b83018261287b565b50505b505050565b600082821c905092915050565b6000612902600019846008026128e4565b1980831691505092915050565b600061291b83836128f1565b9150826002028217905092915050565b61293482611d9b565b67ffffffffffffffff81111561294d5761294c611fd5565b5b61295782546123fb565b61296282828561289e565b600060209050601f8311600181146129955760008415612983578287015190505b61298d858261290f565b8655506129f5565b601f1984166129a38661277f565b60005b828110156129cb578489015182556001820191506020850194506020810190506129a6565b868310156129e857848901516129e4601f8916826128f1565b8355505b6001600288020188555050505b505050505050565b6000604082019050612a126000830185611ee2565b612a1f602083018461215c565b9392505050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601260045260246000fdfea2646970667358221220604f0d5edab0d174aa93fdae277d7440932071e5362ce7107aae2fb26ceacd7f64736f6c63430008180033";

type DuinNftConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: DuinNftConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class DuinNft__factory extends ContractFactory {
  constructor(...args: DuinNftConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override getDeployTransaction(
    overrides?: NonPayableOverrides & { from?: string }
  ): Promise<ContractDeployTransaction> {
    return super.getDeployTransaction(overrides || {});
  }
  override deploy(overrides?: NonPayableOverrides & { from?: string }) {
    return super.deploy(overrides || {}) as Promise<
      DuinNft & {
        deploymentTransaction(): ContractTransactionResponse;
      }
    >;
  }
  override connect(runner: ContractRunner | null): DuinNft__factory {
    return super.connect(runner) as DuinNft__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): DuinNftInterface {
    return new Interface(_abi) as DuinNftInterface;
  }
  static connect(address: string, runner?: ContractRunner | null): DuinNft {
    return new Contract(address, _abi, runner) as unknown as DuinNft;
  }
}
