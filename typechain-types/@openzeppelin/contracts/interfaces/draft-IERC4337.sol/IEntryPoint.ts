/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumberish,
  BytesLike,
  FunctionFragment,
  Result,
  Interface,
  AddressLike,
  ContractRunner,
  ContractMethod,
  Listener,
} from "ethers";
import type {
  TypedContractEvent,
  TypedDeferredTopicFilter,
  TypedEventLog,
  TypedListener,
  TypedContractMethod,
} from "../../../../common";

export type PackedUserOperationStruct = {
  sender: AddressLike;
  nonce: BigNumberish;
  initCode: BytesLike;
  callData: BytesLike;
  accountGasLimits: BytesLike;
  preVerificationGas: BigNumberish;
  gasFees: BytesLike;
  paymasterAndData: BytesLike;
  signature: BytesLike;
};

export type PackedUserOperationStructOutput = [
  sender: string,
  nonce: bigint,
  initCode: string,
  callData: string,
  accountGasLimits: string,
  preVerificationGas: bigint,
  gasFees: string,
  paymasterAndData: string,
  signature: string
] & {
  sender: string;
  nonce: bigint;
  initCode: string;
  callData: string;
  accountGasLimits: string;
  preVerificationGas: bigint;
  gasFees: string;
  paymasterAndData: string;
  signature: string;
};

export declare namespace IEntryPoint {
  export type UserOpsPerAggregatorStruct = {
    userOps: PackedUserOperationStruct[];
    aggregator: AddressLike;
    signature: BytesLike;
  };

  export type UserOpsPerAggregatorStructOutput = [
    userOps: PackedUserOperationStructOutput[],
    aggregator: string,
    signature: string
  ] & {
    userOps: PackedUserOperationStructOutput[];
    aggregator: string;
    signature: string;
  };
}

export interface IEntryPointInterface extends Interface {
  getFunction(
    nameOrSignature:
      | "addStake"
      | "balanceOf"
      | "depositTo"
      | "getNonce"
      | "handleAggregatedOps"
      | "handleOps"
      | "unlockStake"
      | "withdrawStake"
      | "withdrawTo"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "addStake",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "balanceOf",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "depositTo",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "getNonce",
    values: [AddressLike, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "handleAggregatedOps",
    values: [IEntryPoint.UserOpsPerAggregatorStruct[], AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "handleOps",
    values: [PackedUserOperationStruct[], AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "unlockStake",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "withdrawStake",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "withdrawTo",
    values: [AddressLike, BigNumberish]
  ): string;

  decodeFunctionResult(functionFragment: "addStake", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "balanceOf", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "depositTo", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "getNonce", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "handleAggregatedOps",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "handleOps", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "unlockStake",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "withdrawStake",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "withdrawTo", data: BytesLike): Result;
}

export interface IEntryPoint extends BaseContract {
  connect(runner?: ContractRunner | null): IEntryPoint;
  waitForDeployment(): Promise<this>;

  interface: IEntryPointInterface;

  queryFilter<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEventLog<TCEvent>>>;
  queryFilter<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEventLog<TCEvent>>>;

  on<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    listener: TypedListener<TCEvent>
  ): Promise<this>;
  on<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    listener: TypedListener<TCEvent>
  ): Promise<this>;

  once<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    listener: TypedListener<TCEvent>
  ): Promise<this>;
  once<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    listener: TypedListener<TCEvent>
  ): Promise<this>;

  listeners<TCEvent extends TypedContractEvent>(
    event: TCEvent
  ): Promise<Array<TypedListener<TCEvent>>>;
  listeners(eventName?: string): Promise<Array<Listener>>;
  removeAllListeners<TCEvent extends TypedContractEvent>(
    event?: TCEvent
  ): Promise<this>;

  addStake: TypedContractMethod<
    [unstakeDelaySec: BigNumberish],
    [void],
    "payable"
  >;

  balanceOf: TypedContractMethod<[account: AddressLike], [bigint], "view">;

  depositTo: TypedContractMethod<[account: AddressLike], [void], "payable">;

  getNonce: TypedContractMethod<
    [sender: AddressLike, key: BigNumberish],
    [bigint],
    "view"
  >;

  handleAggregatedOps: TypedContractMethod<
    [
      opsPerAggregator: IEntryPoint.UserOpsPerAggregatorStruct[],
      beneficiary: AddressLike
    ],
    [void],
    "nonpayable"
  >;

  handleOps: TypedContractMethod<
    [ops: PackedUserOperationStruct[], beneficiary: AddressLike],
    [void],
    "nonpayable"
  >;

  unlockStake: TypedContractMethod<[], [void], "nonpayable">;

  withdrawStake: TypedContractMethod<
    [withdrawAddress: AddressLike],
    [void],
    "nonpayable"
  >;

  withdrawTo: TypedContractMethod<
    [withdrawAddress: AddressLike, withdrawAmount: BigNumberish],
    [void],
    "nonpayable"
  >;

  getFunction<T extends ContractMethod = ContractMethod>(
    key: string | FunctionFragment
  ): T;

  getFunction(
    nameOrSignature: "addStake"
  ): TypedContractMethod<[unstakeDelaySec: BigNumberish], [void], "payable">;
  getFunction(
    nameOrSignature: "balanceOf"
  ): TypedContractMethod<[account: AddressLike], [bigint], "view">;
  getFunction(
    nameOrSignature: "depositTo"
  ): TypedContractMethod<[account: AddressLike], [void], "payable">;
  getFunction(
    nameOrSignature: "getNonce"
  ): TypedContractMethod<
    [sender: AddressLike, key: BigNumberish],
    [bigint],
    "view"
  >;
  getFunction(
    nameOrSignature: "handleAggregatedOps"
  ): TypedContractMethod<
    [
      opsPerAggregator: IEntryPoint.UserOpsPerAggregatorStruct[],
      beneficiary: AddressLike
    ],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "handleOps"
  ): TypedContractMethod<
    [ops: PackedUserOperationStruct[], beneficiary: AddressLike],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "unlockStake"
  ): TypedContractMethod<[], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "withdrawStake"
  ): TypedContractMethod<[withdrawAddress: AddressLike], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "withdrawTo"
  ): TypedContractMethod<
    [withdrawAddress: AddressLike, withdrawAmount: BigNumberish],
    [void],
    "nonpayable"
  >;

  filters: {};
}