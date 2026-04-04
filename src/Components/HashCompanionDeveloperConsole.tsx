import { useState, useEffect, useRef } from "react";
import "../Styles/HashCompanionDeveloperConsole.css";
import { Client, AccountBalanceQuery, PrivateKey, AccountId } from "@hashgraph/sdk";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import AddNew from "./AddNew.tsx";
import Apps from "./Apps.tsx";

interface HashCompanionDeveloperConsoleProps {
  accountId: string | null;
  privateKey: string | null;
  evmAddress: string | null;
  setAccountId: React.Dispatch<React.SetStateAction<string | null>>;
  setPrivateKey: React.Dispatch<React.SetStateAction<string | null>>;
  setEvmAddress: React.Dispatch<React.SetStateAction<string | null>>;
  accounts: { accountId: string; privateKey: string; evmAddress: string }[];
  activeAccount: number | null;
  autoConnect: boolean;
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
  setAutoConnect,
}) => {
  // -------------------- State --------------------
  const [balance, setBalance] = useState("");
  const [loading, setLoading] = useState(false);
  const [isActiveConnectModal, setisActiveConnectModal] = useState(false);
  const [hasConnected, setHasConnected] = useState(false);
  const [ProfileActive, setProfileActive] = useState(false);
  const [copied, setCopied] = useState<"accountId" | "privateKey" | "evmAddress" | "">("");
  const [activeSideBar, setActiveSideBar] = useState("add");
  const navigate = useNavigate();

  // -------------------- Helpers --------------------
  const saveAccountId = (id: string) => localStorage.setItem("hedera_account_id", id);
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
  const maskAccountId = (id: string) => (!id ? "" : `${id.slice(0, 8)}...${id.slice(-4)}`);
  const maskPrivateKey = (key: string) => (!key ? "" : `${key.slice(0, 8)}...${key.slice(-4)}`);
  const maskEvmAddress = (address: string) => (!address ? "" : `${address.slice(0, 6)}...${address.slice(-4)}`);
  const copyToClipboard = async (text: string, field: "accountId" | "privateKey" | "evmAddress") => {
    await navigator.clipboard.writeText(text);
    setCopied(field);
    setTimeout(() => setCopied(""), 2000);
  };

  // -------------------- Connect / Disconnect --------------------
  const connectAccount = async () => {
    try {
      setLoading(true);
      if (!accountId || !privateKey) {
        toast.error("Please enter both Account ID and Private Key");
        return;
      }

      const parsedAccountId = AccountId.fromString(accountId.trim());
      const parsedPrivateKey = PrivateKey.fromStringECDSA(privateKey);

      const client = import.meta.env.VITE_NETWORK === "mainnet" ? Client.forMainnet() : Client.forTestnet();
      client.setOperator(parsedAccountId, parsedPrivateKey);

      const accountBalance = await new AccountBalanceQuery().setAccountId(parsedAccountId).execute(client);
      setBalance(accountBalance.hbars.toString());
      saveAccountId(accountId);
      setHasConnected(true);

      const evm = getEvmAddressFromAccountId(accountId);
      setEvmAddress(evm);
    } catch (err) {
      console.error(err);
      toast.error("Invalid Account ID or Private Key");
      setBalance("");
    } finally {
      setLoading(false);
    }
  };

 
const disconnect = () => {
  console.log("Disconnect triggered");
  clearAccountId(); // clears state and localStorage
  setHasConnected(false); // reset connection flag
  setProfileActive(false); // optionally close dropdown
  toast.success("Disconnected from account."); // feedback
};


  // type CopyField = "accountId" | "privateKey" | "evmAddress";
  



  // -------------------- Effects --------------------
  // Auto-connect
  useEffect(() => {
    if (autoConnect && accountId && privateKey && !hasConnected) {
      connectAccount();
      setAutoConnect(false);
    }
  }, [autoConnect, accountId, privateKey]);

  // Modal visibility logic
  useEffect(() => {
    const isConnected = accountId && privateKey && evmAddress;
    setisActiveConnectModal(!isConnected);
  }, [accountId, privateKey, evmAddress]);


  useEffect(() => {
  const intervalId = setInterval(() => {
    const savedId = localStorage.getItem("hedera_account_id");
    if (!savedId && accountId && hasConnected) {
      console.log("Auto-disconnect triggered by storage interval");
      disconnect();
    }
  }, 3000);
  return () => clearInterval(intervalId);
}, [accountId, hasConnected]);

  // Storage listener
  useEffect(() => {
    const onStorageChange = (e: StorageEvent) => {
      if (e.key === "hedera_account_id") setAccountId(e.newValue || null);
    };
    window.addEventListener("storage", onStorageChange);
    return () => window.removeEventListener("storage", onStorageChange);
  }, []);

  // Balance polling
  useEffect(() => {
    if (!accountId) return;
    const fetchBalance = async () => {
      try {
        setLoading(true);
        const parsedAccountId = AccountId.fromString(accountId);
        const client = import.meta.env.VITE_NETWORK === "mainnet" ? Client.forMainnet() : Client.forTestnet();
        const accountBalance = await new AccountBalanceQuery().setAccountId(parsedAccountId).execute(client);
        setBalance(accountBalance.hbars.toString());
      } catch {
        setBalance("Error fetching balance");
      } finally {
        setLoading(false);
      }
    };
    fetchBalance();
    const intervalId = setInterval(fetchBalance, 5000);
    return () => clearInterval(intervalId);
  }, [accountId]);

  // Set active account from accounts array
  useEffect(() => {
    if (activeAccount !== null && accounts[activeAccount]) {
      const acc = accounts[activeAccount];
      setAccountId(acc.accountId);
      setPrivateKey(acc.privateKey);
      setEvmAddress(acc.evmAddress);
    }
  }, [activeAccount, accounts]);


  const closeTimeout = useRef<NodeJS.Timeout | null>(null);

// Mouse enters dropdown
const handleMouseEnter = () => {
  // Cancel any pending close
  if (closeTimeout.current) {
    clearTimeout(closeTimeout.current);
    closeTimeout.current = null;
  }
  setProfileActive(true);
};

// Mouse leaves dropdown
const handleMouseLeave = () => {
  // Start 3s timer to close dropdown
  closeTimeout.current = setTimeout(() => {
    setProfileActive(false);
  }, 3000);
};

  // -------------------- Render --------------------
  return (
    <div className="container">
      {/* Header */}
      <div className="header-container">
        {/* <Link to="/">
          <img width="35" height="35" src="https://img.icons8.com/nolan/64/left.png" alt="left" />
        </Link> */}
        <h1>Welcome to HashCompanion developperConsole</h1>

      

        {/* Profile Dropdown */}
<div
  className="profile-dropdown"
  onMouseEnter={handleMouseEnter}
  onMouseLeave={handleMouseLeave}
>
  <Link to="#">
    <img
      width="45"
      height="45"
      src="https://img.icons8.com/3d-fluency/94/user-male-circle.png"
      alt="user"
    />
  </Link>

  <div
    className={`ConnectedAccount-info ${ProfileActive ? "show" : ""}`}
    onClick={(e) => e.stopPropagation()} // ✅ Ensure clicks inside don't close dropdown
  >
    {accountId && (
      <div className="info">
        <div className="wallet-info-container">
          <p className="container-paragraph">
            <strong>Account ID:</strong> {maskAccountId(accountId)}
          </p>
          <button onClick={() => copyToClipboard(accountId ?? "", "accountId")}>
            {copied === "accountId" ? "📋 Copied" : "📋"}
          </button>
        </div>

        <div className="wallet-info-container">
          <p className="container-paragraph">
            <strong>Private Key:</strong> {maskPrivateKey(privateKey ?? "")}
          </p>
          <button onClick={() => copyToClipboard(privateKey ?? "", "privateKey")}>
            {copied === "privateKey" ? "📋 Copied" : "📋"}
          </button>
        </div>

        <div className="wallet-info-container">
          <strong>evmAddress:</strong> {maskEvmAddress(evmAddress ?? "")}
          <button onClick={() => copyToClipboard(evmAddress ?? "", "evmAddress")}>
            {copied === "evmAddress" ? "📋 Copied" : "📋"}
          </button>
        </div>
      </div>
    )}

    {balance && (
      <p className="info">
        <strong>Balance:</strong> {balance} HBAR
      </p>
    )}

    <div className="disconnect-container">
      <button
        onClick={(e) => {
          e.stopPropagation(); // ✅ Prevent dropdown auto-close
          disconnect();
        }}
        className="btn disconnect"
      >
        Disconnect
      </button>
    </div>
  </div>
</div>

         
        
      </div>

      {/* Connect Account Modal */}
      {isActiveConnectModal && (
        <div className="ConnectAccount_elements Active">
          <h1 className="ConnectAccount_elements_title">Connect your HashCompanion Account</h1>
          <div className="Connect_form">
          
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
            <button onClick={connectAccount} disabled={loading} className="btn connect-btn">
              {loading ? "Connecting..." : accountId ? "Connected" : "Connect"}
            </button>
          
          </div>
          </div>
        </div>
      )}

     

       <div className="developperbox-container">

      {/* Sidebar */}
      <div className="utilities_sidebar">
        <ul className="USidebar_slider">

          <li
            className={activeSideBar === "add" ? "active" : ""}
            onClick={() => setActiveSideBar("add")}
          >
            Add New App
          </li>

          <li
            className={activeSideBar === "apps" ? "active" : ""}
            onClick={() => setActiveSideBar("apps")}
          >
            Apps
          </li>

          <li
            className={activeSideBar === "analytics" ? "active" : ""}
            onClick={() => setActiveSideBar("analytics")}
          >
            Developer Analytics
          </li>

        </ul>
      </div>

      {/* Content */}
      <div className="sidebar_mainContent">

        {activeSideBar === "add" && (
          <div className="Content_section AddNewApp_section">
             <AddNew accountId={accountId} privateKey={privateKey} contractId="0.0.8454022" />



          </div>
        )}

        {activeSideBar === "apps" && (
          <div className="Content_section Apps_section">
            {
  !evmAddress || !accountId || !privateKey ? (
    <p>No EVM address or wallet connected</p>
  ) : (
    <Apps
      accountId={accountId}
      privateKey={privateKey}
      evmAddress={evmAddress}
      contractId="0.0.8454022"
      network="testnet"
    />
  )
}
          </div>
        )}

        {activeSideBar === "analytics" && (
          <div className="Content_section developperAnalytics_section">
            Analytics Content
          </div>
        )}

      </div>

    </div>
    </div>
  );
};

export default HashCompanionDeveloperConsole;


