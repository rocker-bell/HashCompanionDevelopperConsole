
// src/Components/AddNew.tsx
import React, { useState } from "react";
import {
  Client,
  ContractExecuteTransaction,
  ContractFunctionParameters,
  ContractId,
} from "@hashgraph/sdk";
import { AbiCoder } from "ethers";

interface AddNewProps {
  accountId: string | null;
  privateKey: string | null;
  contractId: string; // Hedera contract ID
}


import dotenv from 'dotenv';

// Load .env variables
dotenv.config();



const CLOUDINARY_UPLOAD_PRESET = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET || 'defaultPreset';
const CLOUDINARY_CLOUD_NAME = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME || 'defaultCloudName';
const CLOUDINARY_API = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;

const AddNew: React.FC<AddNewProps> = ({ accountId, privateKey, contractId }) => {
  const [appName, setAppName] = useState<string>("");
  const [appDescription, setAppDescription] = useState<string>("");
  const [appType, setAppType] = useState<"Free" | "Paid" | "OpenSource" | "Beta">("Free");
  const [appImage, setAppImage] = useState<File | null>(null);
  const [appMetaData, setAppMetaData] = useState<string>("{}");
  const [loading, setLoading] = useState<boolean>(false);

  // Upload image to Cloudinary
  const handleImageUpload = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
    formData.append("folder", "developer_console_apps"); // Folder in Cloudinary

    try {
      const res = await fetch(CLOUDINARY_API, { method: "POST", body: formData });
      const data = await res.json();

      if (!data.secure_url) {
        console.error("Cloudinary error:", data);
        throw new Error("Image upload failed");
      }

      return data.secure_url;
    } catch (err) {
      console.error("Upload error:", err);
      return null;
    }
  };

  const handleAddApp = async () => {
    if (!appName || !appDescription) {
      alert("Please enter app name and description");
      return;
    }

    if (!accountId || !privateKey) {
      alert("You must connect your account first");
      return;
    }

    // Validate metadata JSON
    try {
      JSON.parse(appMetaData);
    } catch {
      alert("Metadata must be valid JSON");
      return;
    }

    setLoading(true);

    try {
      let appImageUrl = "";
      if (appImage) {
        const url = await handleImageUpload(appImage);
        if (!url) {
          alert("Image upload failed. Check console for details.");
          setLoading(false);
          return;
        }
        appImageUrl = url;
      }

      const client =
        import.meta.env.VITE_NETWORK === "mainnet"
          ? Client.forMainnet()
          : Client.forTestnet();
      client.setOperator(accountId, privateKey);

      const appTypeEnumMap: Record<typeof appType, number> = {
        Free: 0,
        Paid: 1,
        OpenSource: 2,
        Beta: 3,
      };

      // 1️⃣ Add App
      const tx = await new ContractExecuteTransaction()
        .setContractId(ContractId.fromString(contractId))
        .setGas(500_000)
        .setFunction(
          "addApp",
          new ContractFunctionParameters()
            .addString(appName)
            .addString(appDescription)
            .addString(appImageUrl)
            .addUint8(0) // PendingReview
            .addUint8(appTypeEnumMap[appType])
            .addString(appMetaData)
        )
        .execute(client);

      const record = await tx.getRecord(client);
      const logData = record.contractFunctionResult?.logs?.[0]?.data;

      if (!logData) {
        throw new Error("No log data found. Unable to retrieve appId.");
      }

      const abiCoder = new AbiCoder();
      const decoded = abiCoder.decode(["uint256", "string", "address"], logData);
      const newAppId = Number(decoded[0]);

      // 2️⃣ Publish App
      const publishTx = await new ContractExecuteTransaction()
        .setContractId(ContractId.fromString(contractId))
        .setGas(200_000)
        .setFunction("publishApp", new ContractFunctionParameters().addUint256(newAppId))
        .execute(client);

      const publishReceipt = await publishTx.getReceipt(client);

      if (publishReceipt.status.toString() === "SUCCESS") {
        alert(`App "${appName}" published successfully!`);
        setAppName("");
        setAppDescription("");
        setAppImage(null);
        setAppMetaData("{}");
      } else {
        alert("Publish failed");
      }
    } catch (err) {
      console.error("Error adding or publishing app:", err);
      alert("Failed to add or publish app");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="AddNewApp_section">
      <h2>Add New App</h2>

      <input
        type="text"
        placeholder="App Name"
        value={appName}
        onChange={(e) => setAppName(e.target.value)}
        className="input"
      />

      <textarea
        placeholder="App Description"
        value={appDescription}
        onChange={(e) => setAppDescription(e.target.value)}
        className="textarea"
      />

      <input
        type="file"
        accept="image/*"
        onChange={(e) => setAppImage(e.target.files ? e.target.files[0] : null)}
        className="input"
      />

      {/* Image preview */}
      {appImage && (
        <img
          src={URL.createObjectURL(appImage)}
          alt="Preview"
          style={{ width: "150px", borderRadius: "8px", margin: "10px 0" }}
        />
      )}

      <textarea
        placeholder="Metadata (JSON)"
        value={appMetaData}
        onChange={(e) => setAppMetaData(e.target.value)}
        className="input"
      />

      <select
        value={appType}
        onChange={(e) => setAppType(e.target.value as any)}
        className="select"
      >
        <option value="Free">Free</option>
        <option value="Paid">Paid</option>
        <option value="OpenSource">Open Source</option>
        <option value="Beta">Beta</option>
      </select>

      <button onClick={handleAddApp} disabled={loading} className="btn connect-btn">
        {loading ? "Adding..." : "Add App"}
      </button>
    </div>
  );
};

export default AddNew;


// src/Components/AddNew.tsx
// import React, { useState } from "react";
// import {
//   Client,
//   ContractExecuteTransaction,
//   ContractFunctionParameters,
//   ContractId,
// } from "@hashgraph/sdk";
// import { AbiCoder } from "ethers";
// import GoogleDriveUpload from "../utils/GoogleDriveUpload.ts"; // Default import for Google Drive upload utility
// import { generateFileMetadata, generateUniqueId, generateFileHash } from "../utils/metadata.js"; // File metadata helpers

// import dotenv from 'dotenv';

// // Load environment variables
// dotenv.config();

// const CLOUDINARY_UPLOAD_PRESET = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET || 'defaultPreset';
// const CLOUDINARY_CLOUD_NAME = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME || 'defaultCloudName';
// const CLOUDINARY_API = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;

// const AddNew: React.FC<AddNewProps> = ({ accountId, privateKey, contractId }) => {
//   const [appName, setAppName] = useState<string>("");
//   const [appDescription, setAppDescription] = useState<string>("");
//   const [appType, setAppType] = useState<"Free" | "Paid" | "OpenSource" | "Beta">("Free");
//   const [appImage, setAppImage] = useState<File | null>(null);
//   const [appMetaData, setAppMetaData] = useState<string>("{}");
//   const [selectedFile, setSelectedFile] = useState<File | null>(null);
//   const [fileMetadata, setFileMetadata] = useState<any>(null); // File metadata
//   const [loading, setLoading] = useState<boolean>(false);

//   // Upload image to Cloudinary
//   const handleImageUpload = async (file: File) => {
//     const formData = new FormData();
//     formData.append("file", file);
//     formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
//     formData.append("folder", "developer_console_apps"); // Folder in Cloudinary

//     try {
//       const res = await fetch(CLOUDINARY_API, { method: "POST", body: formData });
//       const data = await res.json();

//       if (!data.secure_url) {
//         console.error("Cloudinary error:", data);
//         throw new Error("Image upload failed");
//       }

//       return data.secure_url;
//     } catch (err) {
//       console.error("Upload error:", err);
//       return null;
//     }
//   };

//   // Handle file selection
//   const handleFileSelection = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const file = event.target.files ? event.target.files[0] : null;
//     if (file) {
//       setSelectedFile(file);
//       const metadata = generateFileMetadata(file);
//       setFileMetadata(metadata); // Set metadata for the file
//       setAppMetaData(JSON.stringify(metadata)); // Populate the metadata field automatically
//     }
//   };

//   // Upload file to Google Drive
//   const handleFileUploadToGoogleDrive = async (file: File) => {
//     try {
//       const fileId = await GoogleDriveUpload(file); // Uploading the file to Google Drive
//       if (fileId) {
//         return `https://drive.google.com/uc?id=${fileId}`; // Google Drive URL
//       }
//       return null;
//     } catch (err) {
//       console.error("Error uploading to Google Drive:", err);
//       return null;
//     }
//   };

//   // Handle app addition
//   const handleAddApp = async () => {
//     if (!appName || !appDescription) {
//       alert("Please enter app name and description");
//       return;
//     }

//     if (!accountId || !privateKey) {
//       alert("You must connect your account first");
//       return;
//     }

//     // Validate metadata JSON
//     try {
//       JSON.parse(appMetaData);
//     } catch {
//       alert("Metadata must be valid JSON");
//       return;
//     }

//     setLoading(true);

//     try {
//       let appImageUrl = ""; // Initialize appImageUrl with an empty string
//       if (appImage) {
//         const url = await handleImageUpload(appImage);
//         if (!url) {
//           alert("Image upload failed. Check console for details.");
//           setLoading(false);
//           return;
//         }
//         appImageUrl = url; // Use Cloudinary URL for the app image
//       }

//       let fileUrl = "";
//       if (selectedFile) {
//         fileUrl = await handleFileUploadToGoogleDrive(selectedFile); // Upload file to Google Drive
//       }

//       const client =
//         import.meta.env.VITE_NETWORK === "mainnet"
//           ? Client.forMainnet()
//           : Client.forTestnet();
//       client.setOperator(accountId, privateKey);

//       const appTypeEnumMap: Record<typeof appType, number> = {
//         Free: 0,
//         Paid: 1,
//         OpenSource: 2,
//         Beta: 3,
//       };

//       // Add app to Hedera
//       const tx = await new ContractExecuteTransaction()
//         .setContractId(ContractId.fromString(contractId))
//         .setGas(500_000)
//         .setFunction(
//           "addApp",
//           new ContractFunctionParameters()
//             .addString(appName)
//             .addString(appDescription)
//             .addString(fileUrl || appImageUrl) // Use the Google Drive file URL or Cloudinary image URL
//             .addUint8(0) // PendingReview
//             .addUint8(appTypeEnumMap[appType])
//             .addString(appMetaData)
//         )
//         .execute(client);

//       const record = await tx.getRecord(client);
//       const logData = record.contractFunctionResult?.logs?.[0]?.data;

//       if (!logData) {
//         throw new Error("No log data found. Unable to retrieve appId.");
//       }

//       const abiCoder = new AbiCoder();
//       const decoded = abiCoder.decode(["uint256", "string", "address"], logData);
//       const newAppId = Number(decoded[0]);

//       // Publish the app
//       const publishTx = await new ContractExecuteTransaction()
//         .setContractId(ContractId.fromString(contractId))
//         .setGas(200_000)
//         .setFunction("publishApp", new ContractFunctionParameters().addUint256(newAppId))
//         .execute(client);

//       const publishReceipt = await publishTx.getReceipt(client);

//       if (publishReceipt.status.toString() === "SUCCESS") {
//         alert(`App "${appName}" published successfully!`);
//         setAppName("");
//         setAppDescription("");
//         setAppImage(null);
//         setAppMetaData("{}");
//         setFileMetadata(null); // Clear file metadata
//       } else {
//         alert("Publish failed");
//       }
//     } catch (err) {
//       console.error("Error adding or publishing app:", err);
//       alert("Failed to add or publish app");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="AddNewApp_section">
//       <h2>Add New App</h2>

//       <input
//         type="text"
//         placeholder="App Name"
//         value={appName}
//         onChange={(e) => setAppName(e.target.value)}
//         className="input"
//       />

//       <textarea
//         placeholder="App Description"
//         value={appDescription}
//         onChange={(e) => setAppDescription(e.target.value)}
//         className="textarea"
//       />

//       {/* Image upload */}
//       <input
//         type="file"
//         accept="image/*"
//         onChange={(e) => setAppImage(e.target.files ? e.target.files[0] : null)}
//         className="input"
//       />

//       {appImage && (
//         <img
//           src={URL.createObjectURL(appImage)}
//           alt="Preview"
//           style={{ width: "150px", borderRadius: "8px", margin: "10px 0" }}
//         />
//       )}

//       {/* File upload */}
//       <input
//         type="file"
//         onChange={handleFileSelection}
//         className="input"
//       />

//       <textarea
//         placeholder="Metadata (JSON)"
//         value={appMetaData}
//         onChange={(e) => setAppMetaData(e.target.value)}
//         className="input"
//       />

//       <select
//         value={appType}
//         onChange={(e) => setAppType(e.target.value as any)}
//         className="select"
//       >
//         <option value="Free">Free</option>
//         <option value="Paid">Paid</option>
//         <option value="OpenSource">Open Source</option>
//         <option value="Beta">Beta</option>
//       </select>

//       <button onClick={handleAddApp} disabled={loading} className="btn connect-btn">
//         {loading ? "Adding..." : "Add App"}
//       </button>
//     </div>
//   );
// };

// export default AddNew;


// import React, { useState } from "react";
// import {
//   Client,
//   ContractExecuteTransaction,
//   ContractFunctionParameters,
//   ContractId,
// } from "@hashgraph/sdk";
// import { AbiCoder } from "ethers";
// import { google } from "googleapis"; // Google APIs for Drive integration
// import dotenv from "dotenv";

// // Load environment variables
// dotenv.config();

// // Google OAuth Client ID for Drive
// const CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID; // Add your Google OAuth Client ID

// interface AddNewProps {
//   accountId: string | null;
//   privateKey: string | null;
//   contractId: string; // Hedera contract ID
// }

// // Generate metadata from file
// const generateFileMetadata = (file: File) => {
//   return {
//     id: `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`, // Unique ID
//     file_name: file.name,
//     file_size: file.size,
//     creation_date: new Date(file.lastModified).toISOString(),
//     modification_date: new Date().toISOString(),
//     file_hash: "samplehash" // Placeholder; You can implement a hash function for the file content
//   };
// };

// const AddNew: React.FC<AddNewProps> = ({ accountId, privateKey, contractId }) => {
//   const [appName, setAppName] = useState<string>("");
//   const [appDescription, setAppDescription] = useState<string>("");
//   const [appType, setAppType] = useState<"Free" | "Paid" | "OpenSource" | "Beta">("Free");
//   const [appImage, setAppImage] = useState<File | null>(null);
//   const [appMetaData, setAppMetaData] = useState<string>("{}");
//   const [selectedFile, setSelectedFile] = useState<File | null>(null);
//   const [fileMetadata, setFileMetadata] = useState<any>(null); // File metadata
//   const [loading, setLoading] = useState<boolean>(false);
//   const [authToken, setAuthToken] = useState<string | null>(null); // For Google OAuth

//   // Handle image upload to Cloudinary (or Google Drive, depending on the requirement)
//   const handleFileUploadToGoogleDrive = async (file: File) => {
//     if (!authToken) {
//       alert("Please log in first.");
//       return;
//     }

//     const drive = google.drive({ version: "v3", auth: authToken });
//     const formData = new FormData();
//     formData.append("file", file);

//     try {
//       const res = await drive.files.create({
//         requestBody: {
//           name: file.name,
//           mimeType: file.type,
//           parents: ["root"], // You can set a folder ID here if needed
//         },
//         media: {
//           mimeType: file.type,
//           body: formData.get("file"), // Pass the file data
//         },
//       });

//       return res.data.id; // Return the file ID on Google Drive
//     } catch (error) {
//       console.error("Error uploading to Google Drive:", error);
//       return null;
//     }
//   };

//   // Handle metadata and file selection
//   const handleFileSelection = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const file = event.target.files ? event.target.files[0] : null;
//     if (file) {
//       setSelectedFile(file);
//       const metadata = generateFileMetadata(file);
//       setFileMetadata(metadata); // Set metadata for the file
//       setAppMetaData(JSON.stringify(metadata)); // Populate the metadata field
//     }
//   };

//   // Handle Google OAuth login success
//   // const handleLoginSuccess = (response: any) => {
//   //   setAuthToken(response.credential); // Set the auth token after successful login
//   // };

//   // // Handle Google OAuth login failure
//   // const handleLoginFailure = (error: any) => {
//   //   console.error("Google Login Failed:", error);
//   // };

//   // Handle app addition
//   const handleAddApp = async () => {
//     if (!appName || !appDescription) {
//       alert("Please enter app name and description");
//       return;
//     }

//     if (!accountId || !privateKey) {
//       alert("You must connect your account first");
//       return;
//     }

//     // Validate metadata JSON
//     try {
//       JSON.parse(appMetaData);
//     } catch {
//       alert("Metadata must be valid JSON");
//       return;
//     }

//     setLoading(true);

//     try {
//       let appImageUrl = "";
//       if (selectedFile) {
//         const googleDriveFileId = await handleFileUploadToGoogleDrive(selectedFile);
//         if (!googleDriveFileId) {
//           alert("File upload failed. Check console for details.");
//           setLoading(false);
//           return;
//         }

//         // Use the file's metadata for the metadata field
//         const metadata = generateFileMetadata(selectedFile);
//         setAppMetaData(JSON.stringify(metadata)); // Update the metadata state

//         appImageUrl = `https://drive.google.com/uc?id=${googleDriveFileId}`; // Google Drive URL
//       }

//       const client =
//         import.meta.env.VITE_NETWORK === "mainnet"
//           ? Client.forMainnet()
//           : Client.forTestnet();
//       client.setOperator(accountId, privateKey);

//       const appTypeEnumMap: Record<typeof appType, number> = {
//         Free: 0,
//         Paid: 1,
//         OpenSource: 2,
//         Beta: 3,
//       };

//       // Add app to Hedera
//       const tx = await new ContractExecuteTransaction()
//         .setContractId(ContractId.fromString(contractId))
//         .setGas(500_000)
//         .setFunction(
//           "addApp",
//           new ContractFunctionParameters()
//             .addString(appName)
//             .addString(appDescription)
//             .addString(appImageUrl)
//             .addUint8(0) // PendingReview
//             .addUint8(appTypeEnumMap[appType])
//             .addString(appMetaData)
//         )
//         .execute(client);

//       const record = await tx.getRecord(client);
//       const logData = record.contractFunctionResult?.logs?.[0]?.data;

//       if (!logData) {
//         throw new Error("No log data found. Unable to retrieve appId.");
//       }

//       const abiCoder = new AbiCoder();
//       const decoded = abiCoder.decode(["uint256", "string", "address"], logData);
//       const newAppId = Number(decoded[0]);

//       // Publish the app
//       const publishTx = await new ContractExecuteTransaction()
//         .setContractId(ContractId.fromString(contractId))
//         .setGas(200_000)
//         .setFunction("publishApp", new ContractFunctionParameters().addUint256(newAppId))
//         .execute(client);

//       const publishReceipt = await publishTx.getReceipt(client);

//       if (publishReceipt.status.toString() === "SUCCESS") {
//         alert(`App "${appName}" published successfully!`);
//         setAppName("");
//         setAppDescription("");
//         setAppImage(null);
//         setAppMetaData("{}");
//         setFileMetadata(null); // Clear file metadata
//       } else {
//         alert("Publish failed");
//       }
//     } catch (err) {
//       console.error("Error adding or publishing app:", err);
//       alert("Failed to add or publish app");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="AddNewApp_section">
//       <h2>Add New App</h2>

//       <input
//         type="text"
//         placeholder="App Name"
//         value={appName}
//         onChange={(e) => setAppName(e.target.value)}
//         className="input"
//       />

//       <textarea
//         placeholder="App Description"
//         value={appDescription}
//         onChange={(e) => setAppDescription(e.target.value)}
//         className="textarea"
//       />

//       {/* File Input for selecting file */}
//       <input
//         type="file"
//         accept="*/*"
//         onChange={handleFileSelection}
//         className="input"
//       />

//       {/* Image preview (optional, can show file details here as well) */}
//       {fileMetadata && (
//         <div>
//           <h4>File Metadata:</h4>
//           <pre>{JSON.stringify(fileMetadata, null, 2)}</pre>
//         </div>
//       )}

//       <textarea
//         placeholder="Metadata (JSON)"
//         value={appMetaData}
//         onChange={(e) => setAppMetaData(e.target.value)}
//         className="input"
//       />

//       <select
//         value={appType}
//         onChange={(e) => setAppType(e.target.value as any)}
//         className="select"
//       >
//         <option value="Free">Free</option>
//         <option value="Paid">Paid</option>
//         <option value="OpenSource">Open Source</option>
//         <option value="Beta">Beta</option>
//       </select>

//       <button onClick={handleAddApp} disabled={loading} className="btn connect-btn">
//         {loading ? "Adding..." : "Add App"}
//       </button>
//     </div>
//   );
// };

// export default AddNew;