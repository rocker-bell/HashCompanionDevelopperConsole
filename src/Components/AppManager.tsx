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