import "../Styles/AppCard.css";
import React from "react";
interface AppCardProps {
    app: any;
    handleRemoveApp: (appId: number) => void;
}
declare const AppCard: React.FC<AppCardProps>;
export default AppCard;
