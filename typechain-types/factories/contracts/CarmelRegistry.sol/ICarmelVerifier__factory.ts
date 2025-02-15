/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Interface, type ContractRunner } from "ethers";
import type {
  ICarmelVerifier,
  ICarmelVerifierInterface,
} from "../../../contracts/CarmelRegistry.sol/ICarmelVerifier";

const _abi = [
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "digest",
        type: "bytes32",
      },
      {
        internalType: "bytes",
        name: "signature",
        type: "bytes",
      },
      {
        internalType: "bytes32",
        name: "x",
        type: "bytes32",
      },
      {
        internalType: "bytes32",
        name: "y",
        type: "bytes32",
      },
    ],
    name: "verify",
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
] as const;

export class ICarmelVerifier__factory {
  static readonly abi = _abi;
  static createInterface(): ICarmelVerifierInterface {
    return new Interface(_abi) as ICarmelVerifierInterface;
  }
  static connect(
    address: string,
    runner?: ContractRunner | null
  ): ICarmelVerifier {
    return new Contract(address, _abi, runner) as unknown as ICarmelVerifier;
  }
}
