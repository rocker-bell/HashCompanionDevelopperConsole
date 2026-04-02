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

const AddNew: React.FC<AddNewProps> = ({ accountId, privateKey, contractId}) => {
  const [appName, setAppName] = useState<string>("");
  const [appDescription, setAppDescription] = useState<string>("");
  const [appType, setAppType] = useState<"Free" | "Paid" | "OpenSource" | "Beta">("Free");
  const [loading, setLoading] = useState<boolean>(false);

  // const handleAddApp = async () => {
  //   if (!appName || !appDescription) {
  //     alert("Please enter app name and description");
  //     return;
  //   }

  //   if (!accountId || !privateKey) {
  //     alert("You must connect your account first");
  //     return;
  //   }

  //   setLoading(true);

  //   try {
  //     const client =
  //       import.meta.env.VITE_NETWORK === "mainnet"
  //         ? Client.forMainnet()
  //         : Client.forTestnet();

  //     client.setOperator(accountId, privateKey);

  //     // Map appType to Hedera enum (0 = Free, 1 = Paid, 2 = OpenSource, 3 = Beta)
  //     const appTypeEnumMap: Record<typeof appType, number> = {
  //       Free: 0,
  //       Paid: 1,
  //       OpenSource: 2,
  //       Beta: 3,
  //     };

  //     const tx = new ContractExecuteTransaction()
  //       .setContractId(ContractId.fromString(contractId))
  //       .setGas(200_000)
  //       .setFunction(
  //         "addApp",
  //         new ContractFunctionParameters()
  //           .addString(appName)
  //           .addString(appDescription)
  //           .addString("") // appImage (placeholder)
  //           .addUint8(0) // appStatus (PendingReview)
  //           .addUint8(appTypeEnumMap[appType])
  //           .addString("{}") // metadata placeholder
  //       );

  //     const response = await tx.execute(client);
  //     const receipt = await response.getReceipt(client);


  //     const publishApp =  await new ContractExecuteTransaction()
  // .setContractId(ContractId.fromString(contractId))
  // .setGas(200_000)
  // .setFunction(
  //   "publishApp",
  //   new ContractFunctionParameters().addUint256(1) // your appId
  // )
  // .execute(client);

  // const tx1 = await publishApp.execute(client);

    

  //     if (receipt.status.toString() === "SUCCESS") {
  //       alert(`App "${appName}" submitted successfully!`);
  //       setAppName("");
  //       setAppDescription("");
  //       console.log("receipt", receipt);
  //     } else {
  //       alert("Failed to add app. Transaction not successful.");
  //     }
  //   } catch (err) {
  //     console.error("Error adding app:", err);
  //     alert("Failed to add app");
  //   } finally {
  //     setLoading(false);
  //   }
  // };
const handleAddApp = async () => {
  if (!appName || !appDescription) {
    alert("Please enter app name and description");
    return;
  }

  if (!accountId || !privateKey) {
    alert("You must connect your account first");
    return;
  }

  setLoading(true);

  try {
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
      .setGas(200_000)
      .setFunction(
        "addApp",
        new ContractFunctionParameters()
          .addString(appName)
          .addString(appDescription)
          .addString("") // appImage placeholder
          .addUint8(0) // PendingReview
          .addUint8(appTypeEnumMap[appType])
          .addString("{}") // metadata
      )
      .execute(client);



      const record = await tx.getRecord(client);
const logData = record.contractFunctionResult?.logs?.[0]?.data;

if (!logData) {
  throw new Error("No log data found. Unable to retrieve appId.");
}

const abiCoder = new AbiCoder();
const decoded = abiCoder.decode(
  ["uint256", "string", "address"],
  logData
);

// decoded[0] is now a bigint
const newAppId = Number(decoded[0]); // safely convert to number
// const appName = decoded[1];
// const owner = decoded[2];



    // 3️⃣ Publish App
    const publishTx = await new ContractExecuteTransaction()
      .setContractId(ContractId.fromString(contractId))
      .setGas(200_000)
      .setFunction(
        "publishApp",
        new ContractFunctionParameters().addUint256(newAppId)
      )
      .execute(client);

    const publishReceipt = await publishTx.getReceipt(client);

    if (publishReceipt.status.toString() === "SUCCESS") {
      alert(`App "${appName}" published successfully!`);
      setAppName("");
      setAppDescription("");
      
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