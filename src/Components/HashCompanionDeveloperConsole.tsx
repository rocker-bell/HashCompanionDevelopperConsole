import { useState, useEffect } from "react";
import "../Styles/HashCompanionDeveloperConsole.css";
import {
  Client,
  AccountBalanceQuery,
  PrivateKey,
  AccountId,
 
  
} from "@hashgraph/sdk";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
// import "../Styles/ConnectWallet.css";
// import TODOLISTABI from "./TODOLISTABI.ts";
// import todoapp_icon from "../assets/todoapp_icon.png";

// type Status = "Active" | "Completed" | "Expired";

// interface ConnectWalletProps {
//   accountId: string | null;
//   privateKey: string | null;
//    evmAddress: string | null;
//   setAccountId: React.Dispatch<React.SetStateAction<string | null>>;
//   setPrivateKey: React.Dispatch<React.SetStateAction<string | null>>;
//   setEvmAddress: React.Dispatch<React.SetStateAction<string | null>>; // ✅ add this

  
// }

interface HashCompanionDeveloperConsoleProps {
  accountId: string | null;
  privateKey: string | null;
  evmAddress: string | null;
  setAccountId: React.Dispatch<React.SetStateAction<string | null>>;
  setPrivateKey: React.Dispatch<React.SetStateAction<string | null>>;
  setEvmAddress: React.Dispatch<React.SetStateAction<string | null>>;
  accounts: { accountId: string; privateKey: string; evmAddress: string }[]; // type accounts
  activeAccount: number | null; // index of active wallet
  autoConnect: boolean; // ✅ new
  setAutoConnect: React.Dispatch<React.SetStateAction<boolean>>;
}

const HashCompanionDeveloperConsole: React.FC<HashCompanionDeveloperConsoleProps> = ({
  accountId,
  privateKey,
  evmAddress,
  setAccountId,
  setPrivateKey,
  setEvmAddress,
    accounts,
  activeAccount,
  autoConnect,
  setAutoConnect
}) => {
  const [balance, setBalance] = useState("");
  const [loading, setLoading] = useState(false);
  // const [evmAddress, setEvmAddress] = useState("");
 
const [hasConnected, setHasConnected] = useState(false);
  const navigate = useNavigate();

  // const CONTRACT_ID = "0.0.8028090";

  const saveAccountId = (id: string) =>
    localStorage.setItem("hedera_account_id", id);

  const clearAccountId = () => {
    localStorage.removeItem("hedera_account_id");
    setAccountId(null);
    setPrivateKey(null);
    setBalance("");
    setEvmAddress("");
    navigate("/");
  };

  const getEvmAddressFromAccountId = (id: string): string => {
    try {
      const parsed = AccountId.fromString(id);
      return "0x" + parsed.toSolidityAddress();
    } catch (err) {
      console.error("Error converting to EVM address:", err);
      return "";
    }
  };

  // -------------------- Connect Hedera account --------------------
  const connectAccount = async () => {
    try {
      setLoading(true);

      if (!accountId || !privateKey) {
        toast.error("Please enter both Account ID and Private Key");
        return;
      }

      const parsedAccountId = AccountId.fromString(accountId.trim());
      const parsedPrivateKey = PrivateKey.fromStringECDSA(privateKey);

      const client =
        import.meta.env.VITE_NETWORK === "mainnet"
          ? Client.forMainnet()
          : Client.forTestnet();

      client.setOperator(parsedAccountId, parsedPrivateKey);

      const balanceQuery = new AccountBalanceQuery().setAccountId(
        parsedAccountId
      );
      const accountBalance = await balanceQuery.execute(client);

      setBalance(accountBalance.hbars.toString());
      saveAccountId(accountId);
      setHasConnected(true);

      const evm = getEvmAddressFromAccountId(accountId);
      setEvmAddress(evm);

      // ✅ Fetch all todos on login
      // fetchTodos(client);
    } catch (err) {
      console.error(err);
      toast.error("Invalid Account ID or Private Key");
      setBalance("");
    } finally {
      setLoading(false);
    }
  };

  const disconnect = () => {
    clearAccountId();
    toast.error("Disconnected from account.");
  };

  
  useEffect(() => {
  const intervalId = setInterval(() => {
    const savedId = localStorage.getItem("hedera_account_id");
    if (savedId && savedId !== accountId) setAccountId(savedId);
    else if (!savedId && accountId && hasConnected) disconnect();
  }, 3000);

  return () => clearInterval(intervalId);
}, [accountId, hasConnected]);

  useEffect(() => {
    const onStorageChange = (e: StorageEvent) => {
      if (e.key === "hedera_account_id") setAccountId(e.newValue || null);
    };
    window.addEventListener("storage", onStorageChange);
    return () => window.removeEventListener("storage", onStorageChange);
  }, []);

  // -------------------- Balance polling --------------------
  useEffect(() => {
    if (!accountId) return;

    const fetchBalance = async () => {
      try {
        setLoading(true);
        const parsedAccountId = AccountId.fromString(accountId);

        const client =
          import.meta.env.VITE_NETWORK === "mainnet"
            ? Client.forMainnet()
            : Client.forTestnet();

        const balanceQuery = new AccountBalanceQuery().setAccountId(
          parsedAccountId
        );

        const accountBalance = await balanceQuery.execute(client);
        setBalance(accountBalance.hbars.toString());
      } catch (err) {
        console.error(err);
        setBalance("Error fetching balance");
      } finally {
        setLoading(false);
      }
    };

    fetchBalance();
    const intervalId = setInterval(fetchBalance, 5000);
    return () => clearInterval(intervalId);
  }, [accountId]);

  useEffect(() => {
  if (activeAccount !== null && accounts[activeAccount]) {
    const acc = accounts[activeAccount];
    setAccountId(acc.accountId);
    setPrivateKey(acc.privateKey);
    setEvmAddress(acc.evmAddress);
  }
}, [activeAccount, accounts]);

  // -------------------- Masking helpers --------------------
  const maskAccountId = (id: string) =>
    !id ? "" : `${id.slice(0, 8)}...${id.slice(-4)}`;

  const maskPrivateKey = (key: string) =>
    !key ? "" : `${key.slice(0, 8)}...${key.slice(-4)}`;

  const maskEvmAddress = (address: string) =>
    !address ? "" : `${address.slice(0, 6)}...${address.slice(-4)}`;



  

  // const handleHCAIhelperLink = () => {
  //   navigate("/HCAIhelper")
  // }



  type CopyField = "accountId" | "privateKey" | "evmAddress";

const [copied, setCopied] = useState<CopyField | "">("");

const copyToClipboard = async (text: string, field: CopyField) => {
  await navigator.clipboard.writeText(text);
  setCopied(field);

  setTimeout(() => {
    setCopied("");
  }, 2000);
};



useEffect(() => {
  if (autoConnect && accountId && privateKey && !hasConnected) {
    connectAccount();
    setAutoConnect(false); // reset flag
  }
}, [autoConnect, accountId, privateKey]);

  // -------------------- Render --------------------
  return (
    <div className="container">
      <div className="header-container">
       <Link to="/">
            <img width="35" height="35" src="https://img.icons8.com/nolan/64/left.png" alt="left"/>
      </Link>
      <h2 className="header1">Connect Hedera Account</h2>
      </div>

      <input
        type="text"
        placeholder="Account ID (0.0.x)"
        value={accountId ?? ""}
        onChange={(e) => setAccountId(e.target.value.trim())}
        className="input"
      />

      <input
        type="password"
        placeholder="Private Key"
        value={privateKey ?? ""}
        onChange={(e) => setPrivateKey(e.target.value.trim())}
        className="input"
      />

      <div className="button-group">
        <button
          onClick={connectAccount}
          disabled={loading}
          className="btn"
        >
          {loading ? "Connecting..." : accountId ? "Connected" : "Connect"}
        </button>

        <button
          onClick={disconnect}
          disabled={!accountId}
          className="btn disconnect"
        >
          Disconnect
        </button>
      </div>

      {/* {accountId && (
        <div className="info">
          <p>
            <strong>Account ID:</strong> {maskAccountId(accountId)}
          </p>
          <p>
            <strong>Private Key:</strong> {maskPrivateKey(privateKey ?? "")}
          </p>
        </div>
      )}

      {balance && (
        <p className="info">
          <strong>Balance:</strong> {balance} HBAR
        </p>
      )}

      {evmAddress && (
        <p className="info">
          <strong>EVM Address:</strong> {maskEvmAddress(evmAddress)}
        </p>
      )} */}

      {accountId && (
  <div className="info">
    <div className="wallet-info-container">
    <p className="container-paragraph">
      <strong>Account ID:</strong> {maskAccountId(accountId)}
      <button onClick={() => copyToClipboard(accountId ?? "", "accountId")}>
        {copied === "accountId" ? "📋 Copied" : "📋"}
      </button>
    </p>
    </div>
        <div className="wallet-info-container">
    <p className="container-paragraph">
      <strong>Private Key:</strong> {maskPrivateKey(privateKey ?? "")}
      <button onClick={() => copyToClipboard(privateKey ?? "", "privateKey")}>
        {copied === "privateKey" ? "📋 Copied" : "📋"}
      </button>
    </p>
    </div>
  </div>
)}

      {balance && (
        <p className="info">
          <strong>Balance:</strong> {balance} HBAR
        </p>
      )}

      {evmAddress && (
        <p className="wallet-info-container info">
          <strong>EVM Address:</strong> {maskEvmAddress(evmAddress)}
          <button  onClick={() => copyToClipboard(evmAddress, "evmAddress")}>
            
            {copied === "evmAddress" ? "📋 Copied" : "📋"}
          </button>
        </p>
      )}

      <div className="apps-container">
        {/* <span className="more-apps">
          <Link to="/Myapps" className="Myapps-link">
          more <img width="25" height="25" src="https://img.icons8.com/office/40/forward--v1.png" alt="forward--v1"/>
          </Link>
        </span> */}
        <div className="general-appbox">
          
        



      
        </div>
        
      </div>
    </div>
  );
};

export default HashCompanionDeveloperConsole;



