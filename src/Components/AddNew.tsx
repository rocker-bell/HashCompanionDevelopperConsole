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


const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_APP_CLOUDINARY_UPLOAD_PRESET || 'defaultPreset';
const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_APP_CLOUDINARY_CLOUD_NAME || 'defaultCloudName';
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
      let appImageUrl = ""; // Default to empty string if no image is selected
      if (appImage) {
        const url = await handleImageUpload(appImage);
        if (!url) {
          alert("Image upload failed. Check console for details.");
          setLoading(false);
          return;
        }
        appImageUrl = url; // Set the image URL to appImageUrl
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
            .addString(appImageUrl) // Correctly using appImageUrl here
            .addUint8(0) // PendingReview
            .addUint8(appTypeEnumMap[appType])
            .addString(appMetaData) // Adding metadata
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

