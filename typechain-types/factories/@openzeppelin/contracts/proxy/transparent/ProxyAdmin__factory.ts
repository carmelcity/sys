/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import {
  Contract,
  ContractFactory,
  ContractTransactionResponse,
  Interface,
} from "ethers";
import type {
  Signer,
  AddressLike,
  ContractDeployTransaction,
  ContractRunner,
} from "ethers";
import type { NonPayableOverrides } from "../../../../../common";
import type {
  ProxyAdmin,
  ProxyAdminInterface,
} from "../../../../../@openzeppelin/contracts/proxy/transparent/ProxyAdmin";

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "initialOwner",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
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
    inputs: [],
    name: "UPGRADE_INTERFACE_VERSION",
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
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "contract ITransparentUpgradeableProxy",
        name: "proxy",
        type: "address",
      },
      {
        internalType: "address",
        name: "implementation",
        type: "address",
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
    ],
    name: "upgradeAndCall",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
] as const;

const _bytecode =
  "0x608060405234801561001057600080fd5b50604051610a2b380380610a2b833981810160405281019061003291906101e2565b80600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff16036100a55760006040517f1e4fbdf700000000000000000000000000000000000000000000000000000000815260040161009c919061021e565b60405180910390fd5b6100b4816100bb60201b60201c565b5050610239565b60008060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff169050816000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508173ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e060405160405180910390a35050565b600080fd5b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b60006101af82610184565b9050919050565b6101bf816101a4565b81146101ca57600080fd5b50565b6000815190506101dc816101b6565b92915050565b6000602082840312156101f8576101f761017f565b5b6000610206848285016101cd565b91505092915050565b610218816101a4565b82525050565b6000602082019050610233600083018461020f565b92915050565b6107e3806102486000396000f3fe60806040526004361061004a5760003560e01c8063715018a61461004f5780638da5cb5b146100665780639623609d14610091578063ad3cb1cc146100ad578063f2fde38b146100d8575b600080fd5b34801561005b57600080fd5b50610064610101565b005b34801561007257600080fd5b5061007b610115565b604051610088919061040c565b60405180910390f35b6100ab60048036038101906100a691906105eb565b61013e565b005b3480156100b957600080fd5b506100c26101b9565b6040516100cf91906106d9565b60405180910390f35b3480156100e457600080fd5b506100ff60048036038101906100fa91906106fb565b6101f2565b005b610109610278565b61011360006102ff565b565b60008060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905090565b610146610278565b8273ffffffffffffffffffffffffffffffffffffffff16634f1ef2863484846040518463ffffffff1660e01b815260040161018292919061077d565b6000604051808303818588803b15801561019b57600080fd5b505af11580156101af573d6000803e3d6000fd5b5050505050505050565b6040518060400160405280600581526020017f352e302e3000000000000000000000000000000000000000000000000000000081525081565b6101fa610278565b600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff160361026c5760006040517f1e4fbdf7000000000000000000000000000000000000000000000000000000008152600401610263919061040c565b60405180910390fd5b610275816102ff565b50565b6102806103c3565b73ffffffffffffffffffffffffffffffffffffffff1661029e610115565b73ffffffffffffffffffffffffffffffffffffffff16146102fd576102c16103c3565b6040517f118cdaa70000000000000000000000000000000000000000000000000000000081526004016102f4919061040c565b60405180910390fd5b565b60008060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff169050816000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508173ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e060405160405180910390a35050565b600033905090565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b60006103f6826103cb565b9050919050565b610406816103eb565b82525050565b600060208201905061042160008301846103fd565b92915050565b6000604051905090565b600080fd5b600080fd5b6000610446826103eb565b9050919050565b6104568161043b565b811461046157600080fd5b50565b6000813590506104738161044d565b92915050565b610482816103eb565b811461048d57600080fd5b50565b60008135905061049f81610479565b92915050565b600080fd5b600080fd5b6000601f19601f8301169050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b6104f8826104af565b810181811067ffffffffffffffff82111715610517576105166104c0565b5b80604052505050565b600061052a610427565b905061053682826104ef565b919050565b600067ffffffffffffffff821115610556576105556104c0565b5b61055f826104af565b9050602081019050919050565b82818337600083830152505050565b600061058e6105898461053b565b610520565b9050828152602081018484840111156105aa576105a96104aa565b5b6105b584828561056c565b509392505050565b600082601f8301126105d2576105d16104a5565b5b81356105e284826020860161057b565b91505092915050565b60008060006060848603121561060457610603610431565b5b600061061286828701610464565b935050602061062386828701610490565b925050604084013567ffffffffffffffff81111561064457610643610436565b5b610650868287016105bd565b9150509250925092565b600081519050919050565b600082825260208201905092915050565b60005b83811015610694578082015181840152602081019050610679565b60008484015250505050565b60006106ab8261065a565b6106b58185610665565b93506106c5818560208601610676565b6106ce816104af565b840191505092915050565b600060208201905081810360008301526106f381846106a0565b905092915050565b60006020828403121561071157610710610431565b5b600061071f84828501610490565b91505092915050565b600081519050919050565b600082825260208201905092915050565b600061074f82610728565b6107598185610733565b9350610769818560208601610676565b610772816104af565b840191505092915050565b600060408201905061079260008301856103fd565b81810360208301526107a48184610744565b9050939250505056fea2646970667358221220df1a0e09480551967df5e8a501cce5875618be726878582cdba445bca09d052664736f6c634300081c0033";

type ProxyAdminConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: ProxyAdminConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class ProxyAdmin__factory extends ContractFactory {
  constructor(...args: ProxyAdminConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override getDeployTransaction(
    initialOwner: AddressLike,
    overrides?: NonPayableOverrides & { from?: string }
  ): Promise<ContractDeployTransaction> {
    return super.getDeployTransaction(initialOwner, overrides || {});
  }
  override deploy(
    initialOwner: AddressLike,
    overrides?: NonPayableOverrides & { from?: string }
  ) {
    return super.deploy(initialOwner, overrides || {}) as Promise<
      ProxyAdmin & {
        deploymentTransaction(): ContractTransactionResponse;
      }
    >;
  }
  override connect(runner: ContractRunner | null): ProxyAdmin__factory {
    return super.connect(runner) as ProxyAdmin__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): ProxyAdminInterface {
    return new Interface(_abi) as ProxyAdminInterface;
  }
  static connect(address: string, runner?: ContractRunner | null): ProxyAdmin {
    return new Contract(address, _abi, runner) as unknown as ProxyAdmin;
  }
}