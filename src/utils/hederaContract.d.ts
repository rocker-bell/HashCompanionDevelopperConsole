import { Client } from "@hashgraph/sdk";
export declare const createHederaClient: (accountId: string, privateKey: string) => Client;
export declare const callContractView: (client: Client, contractId: string, abiEncodedFunctionCall: Uint8Array) => Promise<import("@hashgraph/sdk").ContractFunctionResult>;
export declare const executeContractFunction: (client: Client, contractId: string, abiEncodedFunctionCall: Uint8Array) => Promise<import("@hashgraph/sdk").TransactionReceipt>;
