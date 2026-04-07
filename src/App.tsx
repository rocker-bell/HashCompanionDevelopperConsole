import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
import {  Routes, Route } from "react-router-dom";
import HashCompanionDeveloperConsole from "./Components/HashCompanionDeveloperConsole";
import AppManager from "./Components/AppManager";
import AppList from "./Components/AppList";
import AppForm from "./Components/AppForm";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import HashCompanionDeveloperConsoleLanding from "./Components/DeveloperConsoleLandingPage";
import {
  loadAccounts,
  saveAccounts,
  loadActiveAccount,
  saveActiveAccount
} from "./utils/storage"
import DriveManager from "./Components/GoogleDriveexp";
function App() {

    // const navigate = useNavigate()
  // shared wallet state
  const [accountId, setAccountId] = useState<string | null>(null);
  const [privateKey, setPrivateKey] = useState<string | null>(null);
  const [evmAddress, setEvmAddress] = useState<string | null>(null);
  const [autoConnect, setAutoConnect] = useState(false);
  const [accounts, setAccounts] = useState<any[]>([])
const [activeAccount, setActiveAccount] = useState<number | null>(null)


useEffect(() => {
  const initWallet = async () => {
    const storedAccounts = await loadAccounts()
    const activeIndex = await loadActiveAccount()

    setAccounts(storedAccounts)
    setActiveAccount(activeIndex)
  }

  initWallet()
}, [])

useEffect(() => {
  saveAccounts(accounts)
}, [accounts])

useEffect(() => {
  if (activeAccount !== null) {
    saveActiveAccount(activeAccount)
  }
}, [activeAccount])



// const clearAccount = () => {
//   setAccountId(null);
//   setPrivateKey(null);
//   setEvmAddress(null);
//   localStorage.removeItem("hedera_account_id");
// };

const connectAccount = async (acc?: { accountId: string; privateKey: string }) => {
    try {
      const a = acc || (activeAccount !== null ? accounts[activeAccount] : null);
      if (!a) return;

      const { AccountId, PrivateKey, Client, AccountBalanceQuery } = await import("@hashgraph/sdk");
      const parsedAccountId = AccountId.fromString(a.accountId);
      const parsedPrivateKey = PrivateKey.fromStringECDSA(a.privateKey);

      const client =
        import.meta.env.VITE_NETWORK === "mainnet"
          ? Client.forMainnet()
          : Client.forTestnet();
      client.setOperator(parsedAccountId, parsedPrivateKey);

      const balanceQuery = new AccountBalanceQuery().setAccountId(parsedAccountId);
      const accountBalance = await balanceQuery.execute(client);

      setAccountId(a.accountId);
      setPrivateKey(a.privateKey);
      setEvmAddress("0x" + parsedAccountId.toSolidityAddress());
      console.log("Connected. Balance:", accountBalance.hbars.toString());
      localStorage.setItem("hedera_account_id", a.accountId);
    } catch (err) {
      console.error("Failed to connect account:", err);
    }
  };

//   const handleUseWallet = (index: number) => {
//   clearAccount();                   // disconnect old wallet
//   setActiveAccount(index);          // set new active wallet
//   connectAccount(accounts[index]);  // connect new wallet
//   navigate('/ConnectWallet')
// };


  const CONTRACT_ID = "0.0.8454022";
    const [newAppData, setNewAppData] = useState({ title: "", description: "" });

const handleAddApp = async () => {
  if (!newAppData.title || !newAppData.description) {
    toast.error("Please provide a title and description.");
    return;
  }

  try {
    const { AccountId, PrivateKey, Client, ContractExecuteTransaction, ContractFunctionParameters } = await import("@hashgraph/sdk");

    const parsedAccountId = AccountId.fromString(accountId!); // Assuming accountId is not null
    const parsedPrivateKey = PrivateKey.fromString(privateKey!);

    const client = Client.forTestnet();
    client.setOperator(parsedAccountId, parsedPrivateKey);

    const tx = await new ContractExecuteTransaction()
      .setContractId(CONTRACT_ID)
      .setGas(100000)
      .setFunction(
        "addApp", 
        new ContractFunctionParameters()
          .addString(newAppData.title)
          .addString(newAppData.description)
      )
      .execute(client);

    await tx.getReceipt(client);

    // Refresh app list after adding
    // fetchApps();
    toast.success("App added successfully.");
  } catch (err) {
    console.error("Error adding app:", err);
    toast.error("Failed to add app.");
  }
};
  return (
      <>
      <ToastContainer position="top-right" />
      <Routes>

        <Route path="Drive" element={<DriveManager/>}  />

        <Route path="/" element={<HashCompanionDeveloperConsoleLanding/>} />

        <Route path="/Console" 
        
        
        element={<HashCompanionDeveloperConsole 
               accountId={accountId}
      privateKey={privateKey}
      evmAddress={evmAddress}
      setAccountId={setAccountId}
      setPrivateKey={setPrivateKey}
      setEvmAddress={setEvmAddress}
      accounts={accounts}           
      activeAccount={activeAccount} 
      autoConnect={autoConnect}
      setAutoConnect={setAutoConnect}
      
        />} />

        {/* <Route path="/appManager" element={<AppManager 
          accountId={accountId}
          privateKey={privateKey}
          setPrivateKey={setPrivateKey}
          setAccountId={setAccountId}
        />} /> */}

      <Route
  path="/appManager"
  element={
    <AppManager
      accountId={accountId!} // Assert as non-null
      privateKey={privateKey!} // Assert as non-null
      // setPrivateKey={setPrivateKey}
      // setAccountId={setAccountId}
      accounts={accounts}
      connectAccount={connectAccount}
      activeAccount={activeAccount} 
    />
  }
/>
       <Route
  path="/addApp"
  element={
    <AppForm
      newAppData={newAppData}
      setNewAppData={setNewAppData}
      handleAddApp={handleAddApp}
    />
  }
/>
        <Route path="/appList" element={<AppList />} />
      </Routes>
    </>  
  );
  
}

export default App;