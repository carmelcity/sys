/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Interface, type ContractRunner } from "ethers";
import type {
  NonceManager,
  NonceManagerInterface,
} from "../../../../@account-abstraction/contracts/core/NonceManager";

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "sender",
        type: "address",
      },
      {
        internalType: "uint192",
        name: "key",
        type: "uint192",
      },
    ],
    name: "getNonce",
    outputs: [
      {
        internalType: "uint256",
        name: "nonce",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint192",
        name: "key",
        type: "uint192",
      },
    ],
    name: "incrementNonce",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "uint192",
        name: "",
        type: "uint192",
      },
    ],
    name: "nonceSequenceNumber",
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
] as const;

export class NonceManager__factory {
  static readonly abi = _abi;
  static createInterface(): NonceManagerInterface {
    return new Interface(_abi) as NonceManagerInterface;
  }
  static connect(
    address: string,
    runner?: ContractRunner | null
  ): NonceManager {
    return new Contract(address, _abi, runner) as unknown as NonceManager;
  }
}