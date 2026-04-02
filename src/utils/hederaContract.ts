// utils/hederaContract.ts
import { Client, ContractExecuteTransaction, ContractCallQuery } from "@hashgraph/sdk";

export const createHederaClient = (accountId: string, privateKey: string) => {
  const client = import.meta.env.VITE_NETWORK === "mainnet" 
    ? Client.forMainnet() 
    : Client.forTestnet();
  client.setOperator(accountId, privateKey);
  return client;
};

// Call a view function (e.g., getPublishedApps)
export const callContractView = async (
  client: Client,
  contractId: string,
  abiEncodedFunctionCall: Uint8Array
) => {
  const contractQuery = new ContractCallQuery()
    .setContractId(contractId)
    .setGas(100000)
    .setFunctionParameters(abiEncodedFunctionCall);

  const response = await contractQuery.execute(client);
  return response; // raw bytes, decode according to your ABI
};

// Execute a state-changing function
export const executeContractFunction = async (
  client: Client,
  contractId: string,
  abiEncodedFunctionCall: Uint8Array
) => {
  const contractTx = new ContractExecuteTransaction()
    .setContractId(contractId)
    .setGas(200000)
    .setFunctionParameters(abiEncodedFunctionCall);

  const response = await contractTx.execute(client);
  const receipt = await response.getReceipt(client);
  return receipt;
};