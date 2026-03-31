// import React from "react";

// interface AppFormProps {
//   newAppData: { title: string; description: string };
//   setNewAppData: React.Dispatch<React.SetStateAction<{ title: string; description: string }>>;
//   handleAddApp: () => void;
// }

// const AppForm = ({ newAppData, setNewAppData, handleAddApp }: AppFormProps) => {
//   return (
//     <form className="app-form" onSubmit={(e) => { e.preventDefault(); handleAddApp(); }}>
//       <h2>Add New App</h2>
//       <input
//         type="text"
//         placeholder="App Title"
//         value={newAppData.title}
//         onChange={(e) => setNewAppData({ ...newAppData, title: e.target.value })}
//       />
//       <textarea
//         placeholder="App Description"
//         value={newAppData.description}
//         onChange={(e) => setNewAppData({ ...newAppData, description: e.target.value })}
//       ></textarea>
//       <button type="submit">Add App</button>
//     </form>
//   );
// };

// export default AppForm;

import "../Styles/AppForm.css";
interface AppFormProps {
  newAppData: { title: string; description: string };
  setNewAppData: React.Dispatch<React.SetStateAction<{ title: string; description: string }>>;
  handleAddApp: () => void;
}

const AppForm: React.FC<AppFormProps> = ({ 
  newAppData, 
  setNewAppData, 
  handleAddApp 

}) => {
  return (
    <div>
      <input
        type="text"
        value={newAppData.title}
        onChange={(e) => setNewAppData({ ...newAppData, title: e.target.value })}
        placeholder="App Title"
      />
      <textarea
        value={newAppData.description}
        onChange={(e) => setNewAppData({ ...newAppData, description: e.target.value })}
        placeholder="App Description"
      />
      <button onClick={handleAddApp}>Add App</button>
    </div>
  );
};

export default AppForm;