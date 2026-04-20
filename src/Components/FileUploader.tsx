// import React, { useState } from "react";
// import {
//   generateFileMetadata
// } from "./utils/metadata.ts"; // adjust path as needed

// const ACCESS_TOKEN = "YOUR_ACCESS_TOKEN_HERE"; // ⚠️ not for production

// const FileUploader = () => {
//   const [files, setFiles] = useState([]);
//   const [metadata, setMetadata] = useState([]);

//   const handleFileChange = (e) => {
//     const selectedFiles = Array.from(e.target.files);
//     setFiles(selectedFiles);

//     const meta = generateFileMetadata(selectedFiles);
//     setMetadata(meta);

//     console.log("Generated metadata:", meta);
//   };

//   const uploadFiles = async () => {
//     for (let file of files) {
//       try {
//         const response = await fetch(
//           "https://content.dropboxapi.com/2/files/upload",
//           {
//             method: "POST",
//             headers: {
//               Authorization: "Bearer " + ACCESS_TOKEN,
//               "Content-Type": "application/octet-stream",
//               "Dropbox-API-Arg": JSON.stringify({
//                 path: "/" + file.name,
//                 mode: "add",
//                 autorename: true,
//                 mute: false
//               })
//             },
//             body: file
//           }
//         );

//         const data = await response.json();

//         if (!response.ok) {
//           throw new Error(data.error_summary || "Upload failed");
//         }

//         console.log("Uploaded:", file.name, data);
//       } catch (err) {
//         console.error("Upload error:", err);
//       }
//     }

//     alert("Upload process finished");
//   };

//   return (
//     <div style={{ padding: "20px" }}>
//       <h2>File Upload with Metadata</h2>

//       <input type="file" multiple onChange={handleFileChange} />

//       <button onClick={uploadFiles} disabled={!files.length}>
//         Upload Files
//       </button>

//       <h3>Generated Metadata</h3>
//       <pre style={{ background: "#f4f4f4", padding: "10px" }}>
//         {JSON.stringify(metadata, null, 2)}
//       </pre>
//     </div>
//   );
// };

// export default FileUploader;


import React, { useEffect, useState } from "react";
import { generateFileMetadata } from "../utils/metadata.ts";

const ACCESS_TOKEN = "sl.u.AGY7Sy-9-tM4Z8DFO8gjvRwTTSoWr4oh1Cpx2ulN6vp7skMVno9LpIvEXOcCDo6puqnX1YDfX0-Oai7uDWigjocYqkIqHSqPCIEPkJc7jVEQOo2ZzuwkVB8WuCmGq5t3lpRLSJ3ZaGFblhljx7iy1Mj_zDtqrLZ9mK6yoxIJRy6mxIMjHTIUR2dT7kLo5KV1450bsGHK3wfqAOk0JYPEwCQnZdGPOTGkOlCbSBc5n6b_Jw5mHV22lm-CpCYnp7rfsJq6CMl-eCPLMi_gud6pbYif237rwci2OSc7PXjrFV5lOiSYTyRv96ZAqdsx_iAQtRupeCE0cB_JBc0iAGLI4oVVVe741smWKogoAPd6Adhz2CpjqC3U3TNG70VKV8U7RKap6WQQE_re64_zQHpGyLpOt4J4wYNwsoevFBp7Z7uPJDMSudDWk_wznKht-gblVvILZ5g9K38n0RWV90bCWWEZUAoFkqDsNxwGSLvLG-X8uQ2Kr-QA3sxxq4zEsRSG2p1rDmHmTwVFtOejHCPOjCounblLDnKJBfBhd3gp9p8C-P_DgAr3Gt1GpSwvRu3vbDKdwQxEOurcQEknIFO4yzNt1yyWyTy0x3vn1bOqZzFet71BO34IvWeisnZl4b75O5V0vMEapn377IrdDE8fF1Vhe57hAwloCPuPRxht2o1jIcnxTvOqt5-dWXTH36euVqMO9XkpTPmKsJ4iriRS6MzoHDJmJFU5MCQf7uFHHjveF6zWp_RowBt23Wlagm9oC_APtvbhYTgE7di37clbZIbe986wicO1suRnH8FaroTrPIUKDTeDlXRnqzG-6s8yiw0D85kMSeVg-BrnvYDMZmB7aWdccVDZo-iZ0CjaII4gj3x9hUPTw7LazzxF0i0IRCs8U7tUO4fN-bjZvocEFKtRmeaR-uxwz__CD1JVuybWWLMf2si_LBos1LveBsErOvng__9ycHIoyIhU75F_QuIM7me-Kc2VLxoCPf_m0KKDLfGlOSprrlQSy5h55ZGas2ON29BgOBBuhdHnx9iAAyuen4t2niFa0rnM7VW4-s5dig0h-VTS0QaCdoCYojwdrX-5PEPpYiCD_ZBMEo9E46EvMNfr0cgekex2czf8ZXOB5IvsvXXnQZMo6L86_kNFDnJDyAvAa5H68qtvqrtJKeTwFDdjQNz65xZ2TsUxFPP5CCieE3ym5PZpCiDAcDFnkk4J0M9oaSlL2gbg3T-kGtoS07pcmw_FOutfRirSJYUrBYxGZ-EdiRDMd_aQwKZNT0a884ehul4gNoqNmalSvuQAAZ6FN6qmn5WQ8TEMF18ujswBuTjZi87DOrzztIEeyBvo-wchCwrsIIMxratPU5OzwrcD6NnlM1OgiCy-NdM04ZIDvd2r8KvmoOcHAjw9WJuAB2fF_ukDl_nZ4lKhrCRzkCOSeJB4F3-1teOQ3Y20gKoiuQA4utPEwlZkmpwjstg"; // ⚠️ not for production

// ✅ Type for your metadata
type FileMeta = {
  id: string;
  file_name: string;
  file_size: number;
  creation_date: string;
  modification_date: string;
  file_hash: string;
};

// ✅ Type for Dropbox file
type DropboxFile = {
  ".tag": "file" | "folder";
  name: string;
  id: string;
  path_lower: string;
};

const FileUploader: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [metadata, setMetadata] = useState<FileMeta[]>([]);
  const [dropboxFiles, setDropboxFiles] = useState<DropboxFile[]>([]);

  // 📂 Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);

    const meta = generateFileMetadata(selectedFiles);
    setMetadata(meta);
  };

  // ☁️ Upload to Dropbox
  const uploadFiles = async () => {
    for (const file of files) {
      try {
        const response = await fetch(
          "https://content.dropboxapi.com/2/files/upload",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${ACCESS_TOKEN}`,
              "Content-Type": "application/octet-stream",
              "Dropbox-API-Arg": JSON.stringify({
                path: `/${file.name}`,
                mode: "add",
                autorename: true,
              }),
            },
            body: file,
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error_summary || "Upload failed");
        }

        console.log("Uploaded:", data);
      } catch (err) {
        console.error("Upload error:", err);
      }
    }

    fetchDropboxFiles();
  };

  // 📥 Fetch files from Dropbox
  const fetchDropboxFiles = async () => {
    try {
      const response = await fetch(
        "https://api.dropboxapi.com/2/files/list_folder",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${ACCESS_TOKEN}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            path: "",
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error_summary || "Fetch failed");
      }

      setDropboxFiles(data.entries as DropboxFile[]);
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  useEffect(() => {
    fetchDropboxFiles();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Upload + Fetch Dropbox Files</h2>

      <input type="file" multiple onChange={handleFileChange} />

      <button onClick={uploadFiles} disabled={!files.length}>
        Upload Files
      </button>

      <h3>Generated Metadata</h3>
      <pre>{JSON.stringify(metadata, null, 2)}</pre>

      <h3>Files in Dropbox</h3>
      <button onClick={fetchDropboxFiles}>Refresh</button>

      <ul>
        {dropboxFiles.map((file) => (
          <li key={file.id}>
            {file.name} ({file[".tag"]})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FileUploader;