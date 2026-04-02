import "../Styles/AppForm.css";
interface AppFormProps {
    newAppData: {
        title: string;
        description: string;
    };
    setNewAppData: React.Dispatch<React.SetStateAction<{
        title: string;
        description: string;
    }>>;
    handleAddApp: () => void;
}
declare const AppForm: React.FC<AppFormProps>;
export default AppForm;
