// import React, { useEffect, useState } from "react";
// import { toast } from "react-toastify";
// import AppCard from "./AppCard";

// const AppList = () => {
//   const [apps, setApps] = useState<any[]>([]); // Store list of apps
//   const [loading, setLoading] = useState<boolean>(false);

//   // Fetch apps from the smart contract or storage
//   const fetchApps = async () => {
//     try {
//       setLoading(true);
//       // Replace with actual call to fetch apps from the smart contract
//       const fetchedApps = await getAppsFromContract();
//       setApps(fetchedApps);
//     } catch (err) {
//       toast.error("Error fetching apps.");
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getAppsFromContract = async () => {
//     // Simulate fetching apps from the smart contract
//     return [
//       { id: 1, title: "My App 1", description: "Description of App 1" },
//       { id: 2, title: "My App 2", description: "Description of App 2" },
//     ];
//   };

//   useEffect(() => {
//     fetchApps();
//   }, []);

//   return (
//     <div>
//       <h2>App List</h2>
//       {loading ? (
//         <p>Loading apps...</p>
//       ) : (
//         <div>
//           {apps.length === 0 ? (
//             <p>No apps found.</p>
//           ) : (
//             apps.map((app) => <AppCard key={app.id} app={app} />)
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default AppList;
import "../Styles/AppList.css";
// import React from "react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import AppCard from "./AppCard";

const AppList = () => {
  const [apps, setApps] = useState<any[]>([]); // Store list of apps
  const [loading, setLoading] = useState<boolean>(false);

  // Fetch apps from the smart contract or storage
  const fetchApps = async () => {
    try {
      setLoading(true);
      // Replace with actual call to fetch apps from the smart contract
      const fetchedApps = await getAppsFromContract();
      setApps(fetchedApps);
    } catch (err) {
      toast.error("Error fetching apps.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getAppsFromContract = async () => {
    // Simulate fetching apps from the smart contract
    return [
      { id: 1, title: "My App 1", description: "Description of App 1" },
      { id: 2, title: "My App 2", description: "Description of App 2" },
    ];
  };

  // Handle removing an app from the list
  const handleRemoveApp = (appId: number) => {
    setApps((prevApps) => prevApps.filter((app) => app.id !== appId));
  };

  useEffect(() => {
    fetchApps();
  }, []);

  return (
    <div>
      <h2>App List</h2>
      {loading ? (
        <p>Loading apps...</p>
      ) : (
        <div>
          {apps.length === 0 ? (
            <p>No apps found.</p>
          ) : (
            apps.map((app) => (
              <AppCard key={app.id} app={app} handleRemoveApp={handleRemoveApp} />
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default AppList;