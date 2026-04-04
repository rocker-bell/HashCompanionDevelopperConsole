
// import { useState, useEffect } from "react";
// import {
//   Client,
//   AccountId,
//   PrivateKey,
//   ContractCallQuery,
//   ContractId,
//   ContractFunctionParameters,
// } from "@hashgraph/sdk";
// import { AbiCoder } from "ethers";

// interface AppItem {
//   appId: number;
//   appName: string;
//   appDescription: string;
//   appImage: string;
//   appMetaData: string; // fixed type
//   appType: string;
//   appStatus: string;
//   owner: string; // EVM address
// }

// interface AppsProps {
//   accountId: string | null;
//   privateKey: string | null;
//   evmAddress: string | null;
//   contractId: string;
//   network?: "testnet" | "mainnet";
// }

// const Apps = ({ accountId, privateKey, evmAddress, contractId, network = "testnet" }: AppsProps) => {
//   const [apps, setApps] = useState<AppItem[]>([]);
//   const [loading, setLoading] = useState(true);

//   const createClient = () => {
//     if (!accountId || !privateKey) throw new Error("Wallet not connected");
//     const client = network === "mainnet" ? Client.forMainnet() : Client.forTestnet();
//     client.setOperator(AccountId.fromString(accountId), PrivateKey.fromStringECDSA(privateKey));
    
//     return client;
//   };

//   const fetchApps = async () => {
//     if (!accountId || !privateKey || !evmAddress) return;
//     setLoading(true);

//     try {
//       const client = createClient();

//       const query = new ContractCallQuery()
//         .setContractId(ContractId.fromString(contractId))
//         .setGas(1_000_000) // increased gas
//         .setFunction("getPublishedApps", new ContractFunctionParameters());
        
        
//       const response = await query.execute(client);

//       const abiCoder = new AbiCoder();
//       const appStructABI = [
//         "tuple(uint256 appId,string appName,string appDescription,string appImage,uint8 appStatus,uint8 appType,address owner,string metadata)[]"
//       ];

//       const decoded = abiCoder.decode(appStructABI, response.bytes);
//       const appsArrayRaw = decoded[0] as any[];

//       const mappedApps: AppItem[] = appsArrayRaw.map((a) => ({
//         appId: Number(a.appId),
//         appName: a.appName,
//         appDescription: a.appDescription,
//         appImage: a.appImage,
//         appMetaData: a.metadata, // fixed typo
//         appStatus: ["PendingReview", "Published", "Unlisted", "Unpublished"][Number(a.appStatus)],
//         appType: ["Free", "Paid", "OpenSource", "Beta"][Number(a.appType)],
//         owner: a.owner.toLowerCase(),
//       }));

//       setApps(mappedApps.filter((app) => app.owner === evmAddress.toLowerCase()));
//     } catch (err) {
//       console.error("Error fetching apps:", err);
//       setApps([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (accountId && privateKey && evmAddress) fetchApps();
//   }, [accountId, privateKey, evmAddress]);

//   if (loading) return <p>Loading apps...</p>;
//   if (!apps.length) return <p>No apps found for this owner.</p>;

//   return (
//     <div className="Apps_section">
//       <h2>Your Published Apps</h2>
//       <div className="published-apps-grid">
//         {apps.map((app) => (
//           <div key={app.appId} className="app-card">
//             <h3>{app.appName}</h3>
//             <p>{app.appDescription}</p>
//             {app.appImage && <img src={app.appImage} alt={app.appName} />}
//             <p>Metadata: {app.appMetaData}</p>
//             <p>Type: {app.appType}</p>
//             <p>Status: {app.appStatus}</p>
//             <p>Owner: {app.owner}</p>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Apps;


import { useState, useEffect } from "react";
import {
  Client,
  AccountId,
  PrivateKey,
  ContractCallQuery,
  ContractId,
  ContractFunctionParameters,
  Hbar
} from "@hashgraph/sdk";
import { AbiCoder } from "ethers";

import "../Styles/Apps.css"

interface AppItem {
  appId: number;
  appName: string;
  appDescription: string;
  appImage: string;
  appMetaData: string;
  appType: string;
  appStatus: string;
  owner: string; // EVM address
}

interface AppsProps {
  accountId: string | null;
  privateKey: string | null;
  evmAddress: string | null;
  contractId: string;
  network?: "testnet" | "mainnet";
}

const Apps = ({ accountId, privateKey, evmAddress, contractId, network = "testnet" }: AppsProps) => {
  const [apps, setApps] = useState<AppItem[]>([]);
  const [loading, setLoading] = useState(true);

  const createClient = () => {
    if (!accountId || !privateKey) throw new Error("Wallet not connected");
    const client = network === "mainnet" ? Client.forMainnet() : Client.forTestnet();
    client.setOperator(AccountId.fromString(accountId), PrivateKey.fromStringECDSA(privateKey));
    return client;
  };

  const fetchApps = async () => {
    if (!accountId || !privateKey) return;
    setLoading(true);

    try {
      const client = createClient();

      const query = new ContractCallQuery()
        .setContractId(ContractId.fromString(contractId))
        .setGas(1_000_000) // increased gas
        .setFunction("getPublishedApps", new ContractFunctionParameters())
        .setMaxQueryPayment(new Hbar(2)); // allow up to 1 HBAR (100_000_000 tinybars)

      const response = await query.execute(client);

      const abiCoder = new AbiCoder();
      const appStructABI = [
        "tuple(uint256 appId,string appName,string appDescription,string appImage,uint8 appStatus,uint8 appType,address owner,string metadata)[]"
      ];

      const decoded = abiCoder.decode(appStructABI, response.bytes);
      const appsArrayRaw = decoded[0] as any[];

      const mappedApps: AppItem[] = appsArrayRaw.map((a) => ({
        appId: Number(a.appId),
        appName: a.appName,
        appDescription: a.appDescription,
        appImage: a.appImage,
        appMetaData: a.metadata,
        appStatus: ["PendingReview", "Published", "Unlisted", "Unpublished"][Number(a.appStatus)],
        appType: ["Free", "Paid", "OpenSource", "Beta"][Number(a.appType)],
        owner: a.owner.toLowerCase(),
      }));

      // Optional filter by evmAddress
      const filteredApps = evmAddress
        ? mappedApps.filter((app) => app.owner === evmAddress.toLowerCase())
        : mappedApps;

      setApps(filteredApps);
    } catch (err) {
      console.error("Error fetching apps:", err);
      setApps([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (accountId && privateKey) fetchApps();
  }, [accountId, privateKey, evmAddress]);

  if (loading) return <p>Loading apps...</p>;
  if (!apps.length) return <p>No apps found{evmAddress ? " for this owner" : ""}.</p>;

return (
  <div className="apps-section">
    <h2>Your Published Apps</h2>

    {apps.length === 0 ? (
      <p className="no-apps">No apps found for this owner.</p>
    ) : (
      <div className="apps-grid">
        {apps.map((app) => (
          <div key={app.appId} className="app-card">
            {app.appImage && (
              <img src={app.appImage} alt={app.appName} className="app-image" />
            )}
            <div className="app-content">
              <h3>{app.appName}</h3>
              <p className="app-description">{app.appDescription}</p>
              <div className="app-details">
                <p><strong>Type:</strong> {app.appType}</p>
                <p><strong>Status:</strong> {app.appStatus}</p>
                <p><strong>Owner:</strong> {app.owner}</p>
              </div>
              <p className="app-metadata"><strong>Metadata:</strong> {app.appMetaData}</p>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
);

};

export default Apps;