import "../Styles/HashCompanionDeveloperConsole.css";
interface HashCompanionDeveloperConsoleProps {
    accountId: string | null;
    privateKey: string | null;
    evmAddress: string | null;
    setAccountId: React.Dispatch<React.SetStateAction<string | null>>;
    setPrivateKey: React.Dispatch<React.SetStateAction<string | null>>;
    setEvmAddress: React.Dispatch<React.SetStateAction<string | null>>;
    accounts: {
        accountId: string;
        privateKey: string;
        evmAddress: string;
    }[];
    activeAccount: number | null;
    autoConnect: boolean;
    setAutoConnect: React.Dispatch<React.SetStateAction<boolean>>;
}
declare const HashCompanionDeveloperConsole: React.FC<HashCompanionDeveloperConsoleProps>;
export default HashCompanionDeveloperConsole;
