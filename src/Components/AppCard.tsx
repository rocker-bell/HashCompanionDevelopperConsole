// import React from "react";

// interface AppCardProps {
//   app: { title: string; description: string; id: number };
//   handleRemoveApp: (appId: number) => void;
// }

// const AppCard = ({ app, handleRemoveApp }: AppCardProps) => {
//   return (
//     <div className="app-card">
//       <h3>{app.title}</h3>
//       <p>{app.description}</p>
//       <button onClick={() => handleRemoveApp(app.id)}>Remove App</button>
//     </div>
//   );
// };

// export default AppCard;

import "../Styles/AppCard.css"
import React from "react";

// Define the props for AppCard
interface AppCardProps {
  app: any;
  handleRemoveApp: (appId: number) => void; // Accept handleRemoveApp as a prop
}

const AppCard: React.FC<AppCardProps> = ({ app, handleRemoveApp }) => {
  return (
    <div className="app-card">
      <h4>{app.title}</h4>
      <p>{app.description}</p>

      {/* Add a button to delete the app */}
      <button onClick={() => handleRemoveApp(app.id)}>Delete</button>
    </div>
  );
};

export default AppCard;