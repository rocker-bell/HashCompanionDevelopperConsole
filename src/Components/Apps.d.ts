import "../Styles/Apps.css";
interface AppsProps {
    accountId: string | null;
    privateKey: string | null;
    evmAddress: string | null;
    contractId: string;
    network?: "testnet" | "mainnet";
}
declare const Apps: ({ accountId, privateKey, evmAddress, contractId, network }: AppsProps) => import("react/jsx-runtime").JSX.Element;
export default Apps;
