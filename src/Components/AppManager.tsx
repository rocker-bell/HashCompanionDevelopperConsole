// import { Client, AccountId, PrivateKey, ContractCallQuery, ContractExecuteTransaction, ContractFunctionParameters } from "@hashgraph/sdk";

// const CONTRACT_ID = "0.0.8078086"; // Replace with your contract ID

// // Function to create a Hedera client
// export const createClient = (accountId: string, privateKey: string) => {
//   const client = Client.forTestnet(); // or forMainnet() depending on the network
//   client.setOperator(AccountId.fromString(accountId), PrivateKey.fromString(privateKey));
//   return client;
// };

// // Fetch Apps (or whatever data you need)
// export const fetchApps = async (accountId: string, privateKey: string) => {
//   const client = createClient(accountId, privateKey);
//   try {
//     const response = await new ContractCallQuery()
//       .setContractId(CONTRACT_ID)
//       .setFunction("getAllApps") // Replace with your actual function name
//       .execute(client);

//     return response.getStringArray(0); // Assume it returns an array of apps
//   } catch (error) {
//     console.error("Error fetching apps:", error);
//     return [];
//   }
// };

// // Add a new app to the store
// export const addApp = async (accountId: string, privateKey: string, appData: any) => {
//   const client = createClient(accountId, privateKey);
//   try {
//     const tx = await new ContractExecuteTransaction()
//       .setContractId(CONTRACT_ID)
//       .setFunction("addApp", new ContractFunctionParameters().addString(appData.title).addString(appData.description))
//       .execute(client);
//     await tx.getReceipt(client);
//     return true;
//   } catch (error) {
//     console.error("Error adding app:", error);
//     return false;
//   }
// };

// // Remove an app
// export const removeApp = async (accountId: string, privateKey: string, appId: number) => {
//   const client = createClient(accountId, privateKey);
//   try {
//     const tx = await new ContractExecuteTransaction()
//       .setContractId(CONTRACT_ID)
//       .setFunction("removeApp", new ContractFunctionParameters().addUint256(appId))
//       .execute(client);
//     await tx.getReceipt(client);
//     return true;
//   } catch (error) {
//     console.error("Error removing app:", error);
//     return false;
//   }
// };


// import React, { useEffect, useState } from "react";
// import { toast } from "react-toastify";
// import AppCard from "./AppCard";
// import { Client, AccountId, PrivateKey, ContractExecuteTransaction, ContractFunctionParameters } from "@hashgraph/sdk";

// // Replace with your actual contract ID
// const CONTRACT_ID = "0.0.8078086"; // Example contract ID

// const AppManager = ({ accountId, privateKey }: { accountId: string; privateKey: string }) => {
//   const [apps, setApps] = useState<any[]>([]); // Store list of apps
//   const [loading, setLoading] = useState<boolean>(false);

//   // Fetch apps from the smart contract or storage
//   const fetchApps = async () => {
//     try {
//       setLoading(true);
//       // Replace with actual call to fetch apps from the smart contract
//       // Here, we simulate fetching apps
//       const fetchedApps = await getAppsFromContract();
//       setApps(fetchedApps);
//     } catch (err) {
//       toast.error("Error fetching apps.");
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Add new app function
//   const addApp = async (title: string, description: string) => {
//     try {
//       const parsedAccountId = AccountId.fromString(accountId);
//       const parsedPrivateKey = PrivateKey.fromString(privateKey);

//       const client = Client.forTestnet();
//       client.setOperator(parsedAccountId, parsedPrivateKey);

//       const tx = await new ContractExecuteTransaction()
//         .setContractId(CONTRACT_ID)
//         .setGas(100000) // Set appropriate gas limit
//         .setFunction("addApp", new ContractFunctionParameters().addString(title).addString(description))
//         .execute(client);

//       await tx.getReceipt(client);
//       toast.success("App added successfully.");
//       fetchApps(); // Refresh the app list
//     } catch (err) {
//       toast.error("Error adding app.");
//       console.error(err);
//     }
//   };

//   const getAppsFromContract = async () => {
//     // Simulate fetching apps from the smart contract
//     return [
//       { id: 1, title: "My App 1", description: "Description of App 1" },
//       { id: 2, title: "My App 2", description: "Description of App 2" },
//     ];
//   };

//   useEffect(() => {
//     if (accountId && privateKey) {
//       fetchApps();
//     }
//   }, [accountId, privateKey]);

//   return (
//     <div>
//       <h2>App Manager</h2>
//       <button onClick={() => addApp("New App", "App Description")}>Add New App</button>
//       {loading ? (
//         <p>Loading apps...</p>
//       ) : (
//         <div>
//           {apps.length === 0 ? (
//             <p>No apps found.</p>
//           ) : (
//             apps.map((app) => <AppCard key={app.id} app={app} />)
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default AppManager;
import "../Styles/AppManager.css";
import {Link} from "react-router-dom";
// AppManager.tsx
import React from "react";

interface AppManagerProps {
  accountId: string;
  privateKey: string;
  // setPrivateKey: React.Dispatch<React.SetStateAction<string | null>>;
  // setAccountId: React.Dispatch<React.SetStateAction<string | null>>;
  connectAccount: (acc?: { accountId: string; privateKey: string }) => Promise<void>; 
   activeAccount: number | null;
   accounts: { accountId: string; privateKey: string; evmAddress?: string }[];
}

const AppManager: React.FC<AppManagerProps> = ({
  accountId,
  privateKey,
 activeAccount,
 accounts,
  connectAccount
}) => {
  return (
    <div>
        <Link
  to="/ConnectWallet"
  onClick={() => activeAccount !== null && connectAccount(accounts[activeAccount])}
>
  <img width="35" height="35" src="https://img.icons8.com/nolan/64/left.png" alt="left" />
</Link>
      <h1>App Manager</h1>
      <p>Account ID: {accountId}</p>
      <p>Private Key: {privateKey}</p>
      {/* You can now use setPrivateKey and setAccountId to modify the state */}
    </div>
  );
};

export default AppManager;