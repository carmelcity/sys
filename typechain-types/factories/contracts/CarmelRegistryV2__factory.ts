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
import type {
  CarmelRegistryV2,
  CarmelRegistryV2Interface,
} from "../../contracts/CarmelRegistryV2";

const _abi = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "InvalidInitialization",
    type: "error",
  },
  {
    inputs: [],
    name: "NotInitializing",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint64",
        name: "version",
        type: "uint64",
      },
    ],
    name: "Initialized",
    type: "event",
  },
  {
    inputs: [],
    name: "version",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
] as const;

const _bytecode =
  "0x608060405234801561001057600080fd5b5061002b67f05d613098ffcea460c01b61007260201b60201c565b610045679c1a0fa76a772bf660c01b61007260201b60201c565b61005f6737a646c56387a12760c01b61007260201b60201c565b61006d61007560201b60201c565b6101df565b50565b600061008561017960201b60201c565b90508060000160089054906101000a900460ff16156100d0576040517ff92ee8a900000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b67ffffffffffffffff80168160000160009054906101000a900467ffffffffffffffff1667ffffffffffffffff16146101765767ffffffffffffffff8160000160006101000a81548167ffffffffffffffff021916908367ffffffffffffffff1602179055507fc7f505b2f371ae2175ee4913f4499e1f2633a7b5936321eed1cdaeb6115181d267ffffffffffffffff60405161016d91906101c4565b60405180910390a15b50565b60007ff0c57e16840df040f15088dc2f81fe391c3923bec73e23a9662efc9c229c6a00905090565b600067ffffffffffffffff82169050919050565b6101be816101a1565b82525050565b60006020820190506101d960008301846101b5565b92915050565b60ef806101ed6000396000f3fe6080604052348015600f57600080fd5b506004361060285760003560e01c806354fd4d5014602d575b600080fd5b60336047565b604051603e919060a0565b60405180910390f35b6000605b671de021b83e5795ad60c01b6086565b606d67266eb60fab3d3e9160c01b6086565b607f67fccee7f066ec390b60c01b6086565b6002905090565b50565b6000819050919050565b609a816089565b82525050565b600060208201905060b360008301846093565b9291505056fea264697066735822122014587fc7fd669938c7dfbf05157821d2eb75a483ef9f33ee8d5f92f01f4b98af64736f6c634300081c0033";

type CarmelRegistryV2ConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: CarmelRegistryV2ConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class CarmelRegistryV2__factory extends ContractFactory {
  constructor(...args: CarmelRegistryV2ConstructorParams) {
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
      CarmelRegistryV2 & {
        deploymentTransaction(): ContractTransactionResponse;
      }
    >;
  }
  override connect(runner: ContractRunner | null): CarmelRegistryV2__factory {
    return super.connect(runner) as CarmelRegistryV2__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): CarmelRegistryV2Interface {
    return new Interface(_abi) as CarmelRegistryV2Interface;
  }
  static connect(
    address: string,
    runner?: ContractRunner | null
  ): CarmelRegistryV2 {
    return new Contract(address, _abi, runner) as unknown as CarmelRegistryV2;
  }
}
