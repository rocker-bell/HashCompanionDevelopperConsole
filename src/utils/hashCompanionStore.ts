import { Client, AccountId, PrivateKey, ContractCallQuery, ContractExecuteTransaction, ContractFunctionParameters } from "@hashgraph/sdk";

const CONTRACT_ID = "0.0.8078086"; // Replace with your contract ID

// Function to create a Hedera client
export const createClient = (accountId: string, privateKey: string) => {
  const client = Client.forTestnet(); // or forMainnet() depending on the network
  client.setOperator(AccountId.fromString(accountId), PrivateKey.fromString(privateKey));
  return client;
};

// Fetch Apps (or whatever data you need)
export const fetchApps = async (accountId: string, privateKey: string) => {
  const client = createClient(accountId, privateKey);
  try {
    const response = await new ContractCallQuery()
      .setContractId(CONTRACT_ID)
      .setFunction("getAllApps") // Replace with your actual function name
      .execute(client);

    return response.getStringArray(0); // Assume it returns an array of apps
  } catch (error) {
    console.error("Error fetching apps:", error);
    return [];
  }
};

// Add a new app to the store
export const addApp = async (accountId: string, privateKey: string, appData: any) => {
  const client = createClient(accountId, privateKey);
  try {
    const tx = await new ContractExecuteTransaction()
      .setContractId(CONTRACT_ID)
      .setFunction("addApp", new ContractFunctionParameters().addString(appData.title).addString(appData.description))
      .execute(client);
    await tx.getReceipt(client);
    return true;
  } catch (error) {
    console.error("Error adding app:", error);
    return false;
  }
};

// Remove an app
export const removeApp = async (accountId: string, privateKey: string, appId: number) => {
  const client = createClient(accountId, privateKey);
  try {
    const tx = await new ContractExecuteTransaction()
      .setContractId(CONTRACT_ID)
      .setFunction("removeApp", new ContractFunctionParameters().addUint256(appId))
      .execute(client);
    await tx.getReceipt(client);
    return true;
  } catch (error) {
    console.error("Error removing app:", error);
    return false;
  }
};