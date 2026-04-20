// ```
// inclue la partie du metadata et le file upload keep everything else only the uoload to drop box should only happens when we click on the handleAddApp
// - remove the get from dropbox also the metadata should be filled automatically in the metadata input {} directly not [{}]
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


// partie dropbox


// import React, { useEffect, useState } from "react";
// import { generateFileMetadata } from "../utils/metadata.ts";

// const ACCESS_TOKEN = ""; // ⚠️ not for production

// // ✅ Type for your metadata
// type FileMeta = {
//   id: string;
//   file_name: string;
//   file_size: number;
//   creation_date: string;
//   modification_date: string;
//   file_hash: string;
// };

// // ✅ Type for Dropbox file
// type DropboxFile = {
//   ".tag": "file" | "folder";
//   name: string;
//   id: string;
//   path_lower: string;
// };

// const FileUploader: React.FC = () => {
//   const [files, setFiles] = useState<File[]>([]);
//   const [metadata, setMetadata] = useState<FileMeta[]>([]);
//   const [dropboxFiles, setDropboxFiles] = useState<DropboxFile[]>([]);

//   // 📂 Handle file selection
//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (!e.target.files) return;

//     const selectedFiles = Array.from(e.target.files);
//     setFiles(selectedFiles);

//     const meta = generateFileMetadata(selectedFiles);
//     setMetadata(meta);
//   };

//   // ☁️ Upload to Dropbox
//   const uploadFiles = async () => {
//     for (const file of files) {
//       try {
//         const response = await fetch(
//           "https://content.dropboxapi.com/2/files/upload",
//           {
//             method: "POST",
//             headers: {
//               Authorization: `Bearer ${ACCESS_TOKEN}`,
//               "Content-Type": "application/octet-stream",
//               "Dropbox-API-Arg": JSON.stringify({
//                 path: `/${file.name}`,
//                 mode: "add",
//                 autorename: true,
//               }),
//             },
//             body: file,
//           }
//         );

//         const data = await response.json();

//         if (!response.ok) {
//           throw new Error(data.error_summary || "Upload failed");
//         }

//         console.log("Uploaded:", data);
//       } catch (err) {
//         console.error("Upload error:", err);
//       }
//     }

//     fetchDropboxFiles();
//   };

//   // 📥 Fetch files from Dropbox
//   const fetchDropboxFiles = async () => {
//     try {
//       const response = await fetch(
//         "https://api.dropboxapi.com/2/files/list_folder",
//         {
//           method: "POST",
//           headers: {
//             Authorization: `Bearer ${ACCESS_TOKEN}`,
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             path: "",
//           }),
//         }
//       );

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.error_summary || "Fetch failed");
//       }

//       setDropboxFiles(data.entries as DropboxFile[]);
//     } catch (error) {
//       console.error("Fetch error:", error);
//     }
//   };

//   useEffect(() => {
//     fetchDropboxFiles();
//   }, []);

//   return (
//     <div style={{ padding: "20px" }}>
//       <h2>Upload + Fetch Dropbox Files</h2>

//       <input type="file" multiple onChange={handleFileChange} />

//       <button onClick={uploadFiles} disabled={!files.length}>
//         Upload Files
//       </button>

//       <h3>Generated Metadata</h3>
//       <pre>{JSON.stringify(metadata, null, 2)}</pre>

//       <h3>Files in Dropbox</h3>
//       <button onClick={fetchDropboxFiles}>Refresh</button>

//       <ul>
//         {dropboxFiles.map((file) => (
//           <li key={file.id}>
//             {file.name} ({file[".tag"]})
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default FileUploader;
// ```