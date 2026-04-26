// import React, { useState } from "react";
// import {
//   Client,
//   ContractExecuteTransaction,
//   ContractFunctionParameters,
//   ContractId,
// } from "@hashgraph/sdk";
// import { AbiCoder } from "ethers";

// interface AddNewProps {
//   accountId: string | null;
//   privateKey: string | null;
//   contractId: string; // Hedera contract ID
// }


// const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_APP_CLOUDINARY_UPLOAD_PRESET || 'defaultPreset';
// const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_APP_CLOUDINARY_CLOUD_NAME || 'defaultCloudName';
// const CLOUDINARY_API = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;

// const AddNew: React.FC<AddNewProps> = ({ accountId, privateKey, contractId }) => {
//   const [appName, setAppName] = useState<string>("");
//   const [appDescription, setAppDescription] = useState<string>("");
//   const [appType, setAppType] = useState<"Free" | "Paid" | "OpenSource" | "Beta">("Free");
//   const [appImage, setAppImage] = useState<File | null>(null);
//   const [appMetaData, setAppMetaData] = useState<string>("{}");
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
//       let appImageUrl = ""; // Default to empty string if no image is selected
//       if (appImage) {
//         const url = await handleImageUpload(appImage);
//         if (!url) {
//           alert("Image upload failed. Check console for details.");
//           setLoading(false);
//           return;
//         }
//         appImageUrl = url; // Set the image URL to appImageUrl
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

//       // 1️⃣ Add App
//       const tx = await new ContractExecuteTransaction()
//         .setContractId(ContractId.fromString(contractId))
//         .setGas(500_000)
//         .setFunction(
//           "addApp",
//           new ContractFunctionParameters()
//             .addString(appName)
//             .addString(appDescription)
//             .addString(appImageUrl) // Correctly using appImageUrl here
//             .addUint8(0) // PendingReview
//             .addUint8(appTypeEnumMap[appType])
//             .addString(appMetaData) // Adding metadata
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

//       // 2️⃣ Publish App
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

//       <input
//         type="file"
//         accept="image/*"
//         onChange={(e) => setAppImage(e.target.files ? e.target.files[0] : null)}
//         className="input"
//       />

//       {/* Image preview */}
//       {appImage && (
//         <img
//           src={URL.createObjectURL(appImage)}
//           alt="Preview"
//           style={{ width: "150px", borderRadius: "8px", margin: "10px 0" }}
//         />
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

// import React, { useState } from "react";
// import {
//   Client,
//   ContractExecuteTransaction,
//   ContractFunctionParameters,
//   ContractId,
// } from "@hashgraph/sdk";
// import { AbiCoder } from "ethers";
// import { generateFileMetadata } from "../utils/metadata.ts";

// interface AddNewProps {
//   accountId: string | null;
//   privateKey: string | null;
//   contractId: string;
// }

// // Configuration
// const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_APP_CLOUDINARY_UPLOAD_PRESET || 'defaultPreset';
// const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_APP_CLOUDINARY_CLOUD_NAME || 'defaultCloudName';
// const CLOUDINARY_API = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;
// const DROPBOX_ACCESS_TOKEN = "VOTRE_TOKEN_ICI"; // À sécuriser via .env

// const AddNew: React.FC<AddNewProps> = ({ accountId, privateKey, contractId }) => {
//   const [appName, setAppName] = useState<string>("");
//   const [appDescription, setAppDescription] = useState<string>("");
//   const [appType, setAppType] = useState<"Free" | "Paid" | "OpenSource" | "Beta">("Free");
//   const [appImage, setAppImage] = useState<File | null>(null);
//   const [appMetaData, setAppMetaData] = useState<string>("{}");
//   const [loading, setLoading] = useState<boolean>(false);

//   // 📂 Gérer la sélection du fichier et générer les métadonnées automatiquement
//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files ? e.target.files[0] : null;
//     setAppImage(file);

//     if (file) {
//       // Génère les métadonnées pour le fichier sélectionné
//       const metaArray = generateFileMetadata([file]);
//       // On prend le premier élément et on le transforme en string JSON {}
//       setAppMetaData(JSON.stringify(metaArray[0], null, 2));
//     } else {
//       setAppMetaData("{}");
//     }
//   };

//   // ☁️ Upload vers Cloudinary (pour l'image/logo)
//   const handleCloudinaryUpload = async (file: File) => {
//     const formData = new FormData();
//     formData.append("file", file);
//     formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
//     formData.append("folder", "developer_console_apps");

//     try {
//       const res = await fetch(CLOUDINARY_API, { method: "POST", body: formData });
//       const data = await res.json();
//       return data.secure_url || null;
//     } catch (err) {
//       console.error("Cloudinary error:", err);
//       return null;
//     }
//   };

//   // 📦 Upload vers Dropbox (déclenché seulement au clic sur Add App)
//   const uploadToDropbox = async (file: File) => {
//     try {
//       const response = await fetch("https://content.dropboxapi.com/2/files/upload", {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${DROPBOX_ACCESS_TOKEN}`,
//           "Content-Type": "application/octet-stream",
//           "Dropbox-API-Arg": JSON.stringify({
//             path: `/apps/${Date.now()}_${file.name}`,
//             mode: "add",
//             autorename: true,
//           }),
//         },
//         body: file,
//       });

//       if (!response.ok) {
//         const data = await response.json();
//         throw new Error(data.error_summary || "Dropbox upload failed");
//       }
//       console.log("File saved to Dropbox successfully");
//       return true;
//     } catch (err) {
//       console.error("Dropbox error:", err);
//       return false;
//     }
//   };

//   const handleAddApp = async () => {
//     if (!appName || !appDescription || !appImage) {
//       alert("Please fill all fields and select a file");
//       return;
//     }

//     if (!accountId || !privateKey) {
//       alert("Connect your wallet first");
//       return;
//     }

//     setLoading(true);

//     try {
//       // 1. Upload Cloudinary
//       const appImageUrl = await handleCloudinaryUpload(appImage);
//       if (!appImageUrl) throw new Error("Cloudinary upload failed");

//       // 2. Upload Dropbox (C'est ici que l'envoi Dropbox se produit)
//       const dropboxSuccess = await uploadToDropbox(appImage);
//       if (!dropboxSuccess) throw new Error("Dropbox upload failed");

//       // 3. Préparation Client Hedera
//       const client = import.meta.env.VITE_NETWORK === "mainnet" ? Client.forMainnet() : Client.forTestnet();
//       client.setOperator(accountId, privateKey);

//       const appTypeEnumMap: Record<typeof appType, number> = {
//         Free: 0, Paid: 1, OpenSource: 2, Beta: 3,
//       };

//       // 4. Transaction Hedera : Add App
//       const tx = await new ContractExecuteTransaction()
//         .setContractId(ContractId.fromString(contractId))
//         .setGas(500_000)
//         .setFunction(
//           "addApp",
//           new ContractFunctionParameters()
//             .addString(appName)
//             .addString(appDescription)
//             .addString(appImageUrl)
//             .addUint8(0) // Status
//             .addUint8(appTypeEnumMap[appType])
//             .addString(appMetaData) // Métadonnées au format {}
//         )
//         .execute(client);

//       const record = await tx.getRecord(client);
//       const logData = record.contractFunctionResult?.logs?.[0]?.data;
//       if (!logData) throw new Error("No log data");

//       const abiCoder = new AbiCoder();
//       const decoded = abiCoder.decode(["uint256", "string", "address"], logData);
//       const newAppId = Number(decoded[0]);

//       // 5. Transaction Hedera : Publish App
//       const publishTx = await new ContractExecuteTransaction()
//         .setContractId(ContractId.fromString(contractId))
//         .setGas(200_000)
//         .setFunction("publishApp", new ContractFunctionParameters().addUint256(newAppId))
//         .execute(client);

//       const publishReceipt = await publishTx.getReceipt(client);

//       if (publishReceipt.status.toString() === "SUCCESS") {
//         alert(`App "${appName}" successfully integrated and uploaded!`);
//         // Reset form
//         setAppName("");
//         setAppDescription("");
//         setAppImage(null);
//         setAppMetaData("{}");
//       }
//     } catch (err: any) {
//       console.error(err);
//       alert(err.message || "An error occurred");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="AddNewApp_section">
//       <h2>Add New App & Upload File</h2>

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

//       <label>App File / Image:</label>
//       <input
//         type="file"
//         onChange={handleFileChange}
//         className="input"
//       />

//       {appImage && (
//         <div className="preview">
//           <p>File selected: {appImage.name}</p>
//           <img
//             src={URL.createObjectURL(appImage)}
//             alt="Preview"
//             style={{ width: "100px", borderRadius: "8px" }}
//           />
//         </div>
//       )}

//       <label>Technical Metadata (Auto-generated):</label>
//       <textarea
//         placeholder="Metadata (JSON)"
//         value={appMetaData}
//         onChange={(e) => setAppMetaData(e.target.value)}
//         className="input"
//         rows={6}
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
//         {loading ? "Processing (Dropbox + Hedera)..." : "Add App & Upload"}
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
// import { generateFileMetadata } from "../utils/metadata.ts";

// interface AddNewProps {
//   accountId: string | null;
//   privateKey: string | null;
//   contractId: string;
// }

// const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_APP_CLOUDINARY_UPLOAD_PRESET || 'defaultPreset';
// const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_APP_CLOUDINARY_CLOUD_NAME || 'defaultCloudName';
// const CLOUDINARY_API = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;
// const DROPBOX_ACCESS_TOKEN = 'sl.u.AGY7Sy-9-tM4Z8DFO8gjvRwTTSoWr4oh1Cpx2ulN6vp7skMVno9LpIvEXOcCDo6puqnX1YDfX0-Oai7uDWigjocYqkIqHSqPCIEPkJc7jVEQOo2ZzuwkVB8WuCmGq5t3lpRLSJ3ZaGFblhljx7iy1Mj_zDtqrLZ9mK6yoxIJRy6mxIMjHTIUR2dT7kLo5KV1450bsGHK3wfqAOk0JYPEwCQnZdGPOTGkOlCbSBc5n6b_Jw5mHV22lm-CpCYnp7rfsJq6CMl-eCPLMi_gud6pbYif237rwci2OSc7PXjrFV5lOiSYTyRv96ZAqdsx_iAQtRupeCE0cB_JBc0iAGLI4oVVVe741smWKogoAPd6Adhz2CpjqC3U3TNG70VKV8U7RKap6WQQE_re64_zQHpGyLpOt4J4wYNwsoevFBp7Z7uPJDMSudDWk_wznKht-gblVvILZ5g9K38n0RWV90bCWWEZUAoFkqDsNxwGSLvLG-X8uQ2Kr-QA3sxxq4zEsRSG2p1rDmHmTwVFtOejHCPOjCounblLDnKJBfBhd3gp9p8C-P_DgAr3Gt1GpSwvRu3vbDKdwQxEOurcQEknIFO4yzNt1yyWyTy0x3vn1bOqZzFet71BO34IvWeisnZl4b75O5V0vMEapn377IrdDE8fF1Vhe57hAwloCPuPRxht2o1jIcnxTvOqt5-dWXTH36euVqMO9XkpTPmKsJ4iriRS6MzoHDJmJFU5MCQf7uFHHjveF6zWp_RowBt23Wlagm9oC_APtvbhYTgE7di37clbZIbe986wicO1suRnH8FaroTrPIUKDTeDlXRnqzG-6s8yiw0D85kMSeVg-BrnvYDMZmB7aWdccVDZo-iZ0CjaII4gj3x9hUPTw7LazzxF0i0IRCs8U7tUO4fN-bjZvocEFKtRmeaR-uxwz__CD1JVuybWWLMf2si_LBos1LveBsErOvng__9ycHIoyIhU75F_QuIM7me-Kc2VLxoCPf_m0KKDLfGlOSprrlQSy5h55ZGas2ON29BgOBBuhdHnx9iAAyuen4t2niFa0rnM7VW4-s5dig0h-VTS0QaCdoCYojwdrX-5PEPpYiCD_ZBMEo9E46EvMNfr0cgekex2czf8ZXOB5IvsvXXnQZMo6L86_kNFDnJDyAvAa5H68qtvqrtJKeTwFDdjQNz65xZ2TsUxFPP5CCieE3ym5PZpCiDAcDFnkk4J0M9oaSlL2gbg3T-kGtoS07pcmw_FOutfRirSJYUrBYxGZ-EdiRDMd_aQwKZNT0a884ehul4gNoqNmalSvuQAAZ6FN6qmn5WQ8TEMF18ujswBuTjZi87DOrzztIEeyBvo-wchCwrsIIMxratPU5OzwrcD6NnlM1OgiCy-NdM04ZIDvd2r8KvmoOcHAjw9WJuAB2fF_ukDl_nZ4lKhrCRzkCOSeJB4F3-1teOQ3Y20gKoiuQA4utPEwlZkmpwjstg'; 

// const AddNew: React.FC<AddNewProps> = ({ accountId, privateKey, contractId }) => {
//   const [appName, setAppName] = useState<string>("");
//   const [appDescription, setAppDescription] = useState<string>("");
//   const [appType, setAppType] = useState<"Free" | "Paid" | "OpenSource" | "Beta">("Free");
  
//   // États distincts pour l'image et le fichier
//   const [appImage, setAppImage] = useState<File | null>(null);
//   const [appFile, setAppFile] = useState<File | null>(null);
//   const [appMetaData, setAppMetaData] = useState<string>("{}");
//   const [loading, setLoading] = useState<boolean>(false);

//   // 📂 Gérer le fichier de l'application et ses métadonnées
//   const handleAppFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files ? e.target.files[0] : null;
//     setAppFile(file);

//     if (file) {
//       const metaArray = generateFileMetadata([file]);
//       setAppMetaData(JSON.stringify(metaArray[0], null, 2));
//     } else {
//       setAppMetaData("{}");
//     }
//   };

//   const handleCloudinaryUpload = async (file: File) => {
//     const formData = new FormData();
//     formData.append("file", file);
//     formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
//     formData.append("folder", "developer_console_logos");

//     try {
//       const res = await fetch(CLOUDINARY_API, { method: "POST", body: formData });
//       const data = await res.json();
//       return data.secure_url || null;
//     } catch (err) {
//       console.error("Cloudinary error:", err);
//       return null;
//     }
//   };

//   const uploadToDropbox = async (file: File) => {
//     try {
//       const response = await fetch("https://content.dropboxapi.com/2/files/upload", {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${DROPBOX_ACCESS_TOKEN}`,
//           "Content-Type": "application/octet-stream",
//           "Dropbox-API-Arg": JSON.stringify({
//             path: `/apps_files/${Date.now()}_${file.name}`,
//             mode: "add",
//             autorename: true,
//           }),
//         },
//         body: file,
//       });

//       if (!response.ok) throw new Error("Dropbox upload failed");
//       return true;
//     } catch (err) {
//       console.error("Dropbox error:", err);
//       return false;
//     }
//   };

//   const handleAddApp = async () => {
//     if (!appName || !appDescription || !appImage || !appFile) {
//       alert("Please provide an app name, description, logo, and the app file.");
//       return;
//     }

//     if (!accountId || !privateKey) {
//       alert("Connect your account first");
//       return;
//     }

//     setLoading(true);

//     try {
//       // 1. Upload Logo vers Cloudinary
//       const appImageUrl = await handleCloudinaryUpload(appImage);
//       if (!appImageUrl) throw new Error("Logo upload failed");

//       // 2. Upload App File vers Dropbox
//       const dropboxSuccess = await uploadToDropbox(appFile);
//       if (!dropboxSuccess) throw new Error("App file upload to Dropbox failed");

//       // 3. Hedera Setup
//       const client = import.meta.env.VITE_NETWORK === "mainnet" ? Client.forMainnet() : Client.forTestnet();
//       client.setOperator(accountId, privateKey);

//       const appTypeEnumMap: Record<typeof appType, number> = {
//         Free: 0, Paid: 1, OpenSource: 2, Beta: 3,
//       };

//       // 4. Smart Contract: addApp
//       const tx = await new ContractExecuteTransaction()
//         .setContractId(ContractId.fromString(contractId))
//         .setGas(600_000)
//         .setFunction(
//           "addApp",
//           new ContractFunctionParameters()
//             .addString(appName)
//             .addString(appDescription)
//             .addString(appImageUrl) // URL Cloudinary
//             .addUint8(0) // Status
//             .addUint8(appTypeEnumMap[appType])
//             .addString(appMetaData) // Métadonnées du fichier Dropbox
//         )
//         .execute(client);

//       const record = await tx.getRecord(client);
//       const logData = record.contractFunctionResult?.logs?.[0]?.data;
//       if (!logData) throw new Error("No log data from contract");

//       const abiCoder = new AbiCoder();
//       const decoded = abiCoder.decode(["uint256", "string", "address"], logData);
//       const newAppId = Number(decoded[0]);

//       // 5. Smart Contract: publishApp
//       const publishTx = await new ContractExecuteTransaction()
//         .setContractId(ContractId.fromString(contractId))
//         .setGas(250_000)
//         .setFunction("publishApp", new ContractFunctionParameters().addUint256(newAppId))
//         .execute(client);

//       const publishReceipt = await publishTx.getReceipt(client);

//       if (publishReceipt.status.toString() === "SUCCESS") {
//         alert(`Success! "${appName}" is published.`);
//         // Reset
//         setAppName("");
//         setAppDescription("");
//         setAppImage(null);
//         setAppFile(null);
//         setAppMetaData("{}");
//       }
//     } catch (err: any) {
//       console.error(err);
//       alert(err.message || "An error occurred");
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

//       {/* INPUT 1 : LOGO (Cloudinary) */}
//       <label>App Logo (Image):</label>
//       <input
//         type="file"
//         accept="image/*"
//         onChange={(e) => setAppImage(e.target.files ? e.target.files[0] : null)}
//         className="input"
//       />
//       {appImage && <p style={{fontSize: '12px'}}>Logo selected: {appImage.name}</p>}

//       {/* INPUT 2 : APP FILE (Dropbox + Metadata) */}
//       <label>App File (Executable/Archive):</label>
//       <input
//         type="file"
//         onChange={handleAppFileChange}
//         className="input"
//       />

//       <label>Auto-generated Metadata (from App File):</label>
//       <textarea
//         value={appMetaData}
//         readOnly
//         className="input"
//         rows={5}
//         style={{backgroundColor: '#f4f4f4'}}
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
//         {loading ? "Uploading & Minting..." : "Add App"}
//       </button>
//     </div>
//   );
// };

// export default AddNew;




import React, { useState } from "react";
import {
  Client,
  ContractExecuteTransaction,
  ContractFunctionParameters,
  ContractId,
} from "@hashgraph/sdk";
import { AbiCoder } from "ethers";
import { generateFileMetadata } from "../utils/metadata.ts";
import { getDropboxToken } from "../utils/DropBox.ts";

interface AddNewProps {
  accountId: string | null;
  privateKey: string | null;
  contractId: string;
}

const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_APP_CLOUDINARY_UPLOAD_PRESET || 'defaultPreset';
const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_APP_CLOUDINARY_CLOUD_NAME || 'defaultCloudName';
const CLOUDINARY_API = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;
// const DROPBOX_ACCESS_TOKEN = import.meta.env.VITE_ACCESS_TOKEN;

const AddNew: React.FC<AddNewProps> = ({ accountId, privateKey, contractId }) => {
  const [appName, setAppName] = useState<string>("");
  const [appDescription, setAppDescription] = useState<string>("");
  const [appType, setAppType] = useState<"Free" | "Paid" | "OpenSource" | "Beta">("Free");
  
  // États pour les fichiers
  const [appImage, setAppImage] = useState<File | null>(null); // Pour Cloudinary
  const [appFile, setAppFile] = useState<File | null>(null);   // Pour Dropbox
  const [appMetaData, setAppMetaData] = useState<string>("{}");
  const [loading, setLoading] = useState<boolean>(false);

  // 📂 Gérer le fichier et générer les métadonnées automatiquement
  const handleAppFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    setAppFile(file);

    if (file) {
      const metaArray = generateFileMetadata([file]);
      // On remplit directement avec l'objet {} et non [{}]
      setAppMetaData(JSON.stringify(metaArray[0], null, 2));
    } else {
      setAppMetaData("{}");
    }
  };

  // ☁️ Upload Cloudinary (Image)
  const handleImageUpload = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
    formData.append("folder", "developer_console_logos");

    try {
      const res = await fetch(CLOUDINARY_API, { method: "POST", body: formData });
      const data = await res.json();
      if (!data.secure_url) throw new Error(data.error?.message || "Cloudinary failed");
      return data.secure_url;
    } catch (err) {
      console.error("Cloudinary upload error:", err);
      return null;
    }
  };

  // 📦 Upload Dropbox (Fichier App) - Déclenché au clic sur Add App
  // const uploadToDropbox = async (file: File) => {
  //   try {
  //     const response = await fetch("https://content.dropboxapi.com/2/files/upload", {
  //       method: "POST",
  //       headers: {
  //         Authorization: `Bearer ${DROPBOX_ACCESS_TOKEN}`,
  //         "Content-Type": "application/octet-stream",
  //         "Dropbox-API-Arg": JSON.stringify({
  //           path: `/apps_files/${Date.now()}_${file.name}`,
  //           mode: "add",
  //           autorename: true,
  //         }),
  //       },
  //       body: file,
  //     });

  //     if (!response.ok) {
  //       const errorData = await response.json();
  //       throw new Error(errorData.error_summary || "Dropbox upload failed");
  //     }
  //     return true;
  //   } catch (err) {
  //     console.error("Dropbox error:", err);
  //     return false;
  //   }
  // };



//   const uploadToDropbox = async (file: File) => {
//   try {
//     const token = await getDropboxToken();

//     const response = await fetch("https://content.dropboxapi.com/2/files/upload", {
//       method: "POST",
//       headers: {
//         Authorization: `Bearer ${token}`,
//         "Content-Type": "application/octet-stream",
//         "Dropbox-API-Arg": JSON.stringify({
//           path: `/apps_files/${Date.now()}_${file.name}`,
//           mode: "add",
//           autorename: true,
//         }),
//       },
//       body: file,
//     });

//     return response.ok;
//   } catch (err) {
//     console.error(err);
//     return false;
//   }
// };


const uploadToDropbox = async (file: File) => {
  try {
    if (!file) throw new Error("File is missing");

    const token = await getDropboxToken();

    const dropboxArg = {
      path: `/apps_files/${Date.now()}_${file.name}`,
      mode: "add",
      autorename: true,
    };

    const response = await fetch(
      "https://content.dropboxapi.com/2/files/upload",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/octet-stream",
          "Dropbox-API-Arg": JSON.stringify(dropboxArg),
        },
        body: file,
      }
    );

    const text = await response.text(); // IMPORTANT for debugging

    if (!response.ok) {
      console.error("Dropbox RAW ERROR:", text);
      throw new Error(text);
    }

    console.log("Dropbox upload success:", text);
    return true;

  } catch (err) {
    console.error("Dropbox upload error:", err);
    return false;
  }
};

  const handleAddApp = async () => {
    if (!appName || !appDescription || !appImage || !appFile) {
      alert("Please fill all fields and select both a logo and an app file.");
      return;
    }

    if (!accountId || !privateKey) {
      alert("Please connect your account first");
      return;
    }

    setLoading(true);

    try {
      // 1. Upload Logo (Cloudinary)
      const appImageUrl = await handleImageUpload(appImage);
      if (!appImageUrl) {
        throw new Error("Logo upload failed. Check your Cloudinary credentials (401).");
      }

      // 2. Upload App File (Dropbox)
      const dropboxSuccess = await uploadToDropbox(appFile);
      if (!dropboxSuccess) {
        throw new Error("App file upload to Dropbox failed.");
      }

      // 3. Hedera Client
      const client = import.meta.env.VITE_NETWORK === "mainnet" ? Client.forMainnet() : Client.forTestnet();
      client.setOperator(accountId, privateKey);

      const appTypeEnumMap: Record<typeof appType, number> = {
        Free: 0, Paid: 1, OpenSource: 2, Beta: 3,
      };

      // 4. Hedera: addApp
      const tx = await new ContractExecuteTransaction()
        .setContractId(ContractId.fromString(contractId))
        .setGas(2000000)
        .setFunction(
          "addApp",
          new ContractFunctionParameters()
            .addString(appName)
            .addString(appDescription)
            .addString(appImageUrl)
            .addUint8(0) // Status
            .addUint8(appTypeEnumMap[appType])
            .addString(appMetaData)
        )
        .execute(client);

      const record = await tx.getRecord(client);
      const logData = record.contractFunctionResult?.logs?.[0]?.data;
      if (!logData) throw new Error("Contract call failed (no logs).");

      const abiCoder = new AbiCoder();
      const decoded = abiCoder.decode(["uint256", "string", "address"], logData);
      const newAppId = Number(decoded[0]);

      // 5. Hedera: publishApp
      const publishTx = await new ContractExecuteTransaction()
        .setContractId(ContractId.fromString(contractId))
        .setGas(500000)
        .setFunction("publishApp", new ContractFunctionParameters().addUint256(newAppId))
        .execute(client);

      await publishTx.getReceipt(client);

      alert(`Success! App "${appName}" has been uploaded and published.`);
      
      // Reset form
      setAppName("");
      setAppDescription("");
      setAppImage(null);
      setAppFile(null);
      setAppMetaData("{}");

    } catch (err: any) {
      console.error(err);
      alert(err.message || "An error occurred during the process.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="AddNewApp_section">
      <h2>Add New Application</h2>

      <input type="text" placeholder="App Name" value={appName} onChange={(e) => setAppName(e.target.value)} className="input" />
      
      <textarea placeholder="App Description" value={appDescription} onChange={(e) => setAppDescription(e.target.value)} className="textarea" />

      {/* Input Logo */}
      <div className="input-group">
        <label>App Logo (Cloudinary):</label>
        <input type="file" accept="image/*" onChange={(e) => setAppImage(e.target.files ? e.target.files[0] : null)} className="input" />
      </div>

      {/* Input File */}
      <div className="input-group">
        <label>Application File (Dropbox):</label>
        <input type="file" onChange={handleAppFileChange} className="input" />
      </div>

      {/* Metadata (Auto-filled) */}
      <div className="input-group">
        <label>File Metadata (Auto-generated):</label>
        <textarea value={appMetaData} readOnly className="input" rows={5} style={{ backgroundColor: '#f9f9f9' }} />
      </div>

      <select value={appType} onChange={(e) => setAppType(e.target.value as any)} className="select">
        <option value="Free">Free</option>
        <option value="Paid">Paid</option>
        <option value="OpenSource">Open Source</option>
        <option value="Beta">Beta</option>
      </select>

      <button onClick={handleAddApp} disabled={loading} className="btn connect-btn">
        {loading ? "Uploading (Cloudinary + Dropbox + Hedera)..." : "Add & Publish App"}
      </button>
    </div>
  );
};

export default AddNew;

