import { useState, useEffect } from "react";
import { Client, AccountId, PrivateKey, ContractCallQuery, ContractId, ContractFunctionParameters } from "@hashgraph/sdk";
import { AbiCoder } from "ethers";

interface AppItem {
  appId: number;
  appName: string;
  appDescription: string;
  appImage: string;
  appType: string;
  appStatus: string;
  owner: string; // EVM address
}

interface AppsProps {
  accountId: string | null;
  privateKey: string | null;
  evmAddress: string | null; // filter by owner
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
    if (!accountId || !privateKey || !evmAddress) return;
    setLoading(true);

    try {
      const client = createClient();

      // Call getPublishedApps() which returns App[] memory
      const query = new ContractCallQuery()
        .setContractId(ContractId.fromString(contractId))
        .setGas(500_000)
        .setFunction("getPublishedApps", new ContractFunctionParameters());

      const response = await query.execute(client);

      // Decode the bytes using ethers AbiCoder
      const abiCoder = new AbiCoder();

      // Define the App struct ABI (tuple array)
      const appStructABI = [
        "tuple(uint256 appId,string appName,string appDescription,string appImage,uint8 appStatus,uint8 appType,address owner,string metadata)[]"
      ];

      const decoded = abiCoder.decode(appStructABI, response.bytes);
      const appsArrayRaw = decoded[0] as any[];

      // const mappedApps: AppItem[] = appsArrayRaw.map((a) => ({
      //   appId: a.appId.toNumber(),
      //   appName: a.appName,
      //   appDescription: a.appDescription,
      //   appImage: a.appImage,
      //   appStatus: ["PendingReview", "Published", "Unlisted", "Unpublished"][a.appStatus],
      //   appType: ["Free", "Paid", "OpenSource", "Beta"][a.appType],
      //   owner: a.owner,
      // }));
      const mappedApps: AppItem[] = appsArrayRaw.map((a) => ({
  appId: Number(a.appId),

  appName: a.appName,
  appDescription: a.appDescription,
  appImage: a.appImage,

  appStatus: ["PendingReview", "Published", "Unlisted", "Unpublished"][Number(a.appStatus)],

  appType: ["Free", "Paid", "OpenSource", "Beta"][Number(a.appType)],

  owner: a.owner.toLowerCase(),
}));

      // Filter by the current EVM address
      setApps(mappedApps.filter((app) => app.owner.toLowerCase() === evmAddress.toLowerCase()));
    } catch (err) {
      console.error("Error fetching apps:", err);
      setApps([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (accountId && privateKey && evmAddress) fetchApps();
  }, [accountId, privateKey, evmAddress]);

  if (loading) return <p>Loading apps...</p>;
  if (!apps.length) return <p>No apps found for this owner.</p>;

  return (
    <div className="Apps_section">
      <h2>Your Published Apps</h2>
      <div className="published-apps-grid">
        {apps.map((app) => (
          <div key={app.appId} className="app-card">
            <h3>{app.appName}</h3>
            <p>{app.appDescription}</p>
            {app.appImage && <img src={app.appImage} alt={app.appName} />}
            <p>Type: {app.appType}</p>
            <p>Status: {app.appStatus}</p>
            <p>Owner: {app.owner}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Apps;
