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