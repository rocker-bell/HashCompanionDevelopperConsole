import "../Styles/AppManager.css";
import React from "react";
interface AppManagerProps {
    accountId: string;
    privateKey: string;
    connectAccount: (acc?: {
        accountId: string;
        privateKey: string;
    }) => Promise<void>;
    activeAccount: number | null;
    accounts: {
        accountId: string;
        privateKey: string;
        evmAddress?: string;
    }[];
}
declare const AppManager: React.FC<AppManagerProps>;
export default AppManager;
