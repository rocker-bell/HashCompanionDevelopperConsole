// import React, { useEffect, useState } from 'react';
// import { initDrive, login, uploadFile, listFiles, downloadFile } from '../utils/app';
// import  "../Styles/GoogleDrive.css"
// import { generateFileMetadata } from '../utils/metadata';
// const DriveManager: React.FC = () => {
//   const [files, setFiles] = useState<{ id: string; name: string }[]>([]);
//   const [Metadata, setMetadata] = useState<{}>

//   const fetchFiles = async () => {
//     const res = await listFiles();
//     setFiles(res);
//   };

//   useEffect(() => {
//     initDrive();
//     fetchFiles();
//   }, []);

//   const handleLogin = () => login();

//   const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file) return;
//     await uploadFile(file);
//     fetchFiles();
//   };


//   const FileMetadata = (files) => {
//     const generatedMetadata = generateFileMetadata(files);
//     setMetadata(generatedMetadata);
//     return FileMetadata;
    
//   }


//   useEffect




//   return (
//     <div className='drive-manager'>
//       <button onClick={handleLogin}>Login with Google</button>
//       <input type="file" onChange={handleUpload} />
//       <h3>Files:</h3>
//       <ul>
//         {files.map((f) => (
//           <li key={f.id}>
//             {f.name}{' '}
//             <button onClick={() => downloadFile(f.id, f.name)}>Download</button>
//           </li>
//         ))}
//       </ul>
//       <div className='metadata-results'>
//           {Metadata && Metadata.length>0 ? (
//             MataData.map((metadata) => {
//                 metadata.array.forEach(element => {
//                     <p>element.keys :  <strong>element.values</strong></p>
//                 });
//             })
//           )} 

//       </div>
//     </div>
//   );
// };

// export default DriveManager;



// import React, { useEffect, useState } from 'react';
// import { initDrive, login, uploadFile, listFiles, downloadFile } from '../utils/app';
// import "../Styles/GoogleDrive.css";
// import { generateFileMetadata } from '../utils/metadata';

// type DriveFile = {
//   id: string;
//   name: string;
// };

// // Generic metadata type (adjust based on your generator)
// type FileMetadata = Record<string, any>;

// const DriveManager: React.FC = () => {
//   const [files, setFiles] = useState<DriveFile[]>([]);
//   const [metadata, setMetadata] = useState<FileMetadata[]>([]);

//   // Fetch files
//   const fetchFiles = async () => {
//     const res = await listFiles();
//     setFiles(res);
//   };

//   // Init
//   useEffect(() => {
//     initDrive();
//     fetchFiles();
//   }, []);



// //   useEffect(() => {
// //   if (files.length > 0) {
// //     const generated = generateFileMetadata(files as any); // or properly typed
// //     setMetadata(generated);
// //   } else {
// //     setMetadata([]);
// //   }
// // }, [files]);

//   const handleLogin = () => login();

// const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
//   const files = e.target.files;
//   if (!files) return;

//   const fileArray = Array.from(files);

//   const metadataList = generateFileMetadata(fileArray); // ✅ correct

//   setMetadata((prev) => [...prev, ...metadataList]);

//   for (const file of fileArray) {
//     await uploadFile(file);
//   }

//   fetchFiles();
// };

// const copyMetadataToClipboard = async () => {
//   try {
//     const json = JSON.stringify(metadata, null, 2);
//     await navigator.clipboard.writeText(json);
//     alert('Metadata copied to clipboard!');
//   } catch (err) {
//     console.error('Copy failed:', err);
//   }
// };
//   return (
//     <div className="drive-manager">
//       <button onClick={handleLogin}>Login with Google</button>
//       <input type="file" onChange={handleUpload} />

//       <h3>Files:</h3>
//       <ul>
//         {files.map((f) => (
//           <li key={f.id}>
//             {f.name}
//             <button onClick={() => downloadFile(f.id, f.name)}>Download</button>
//           </li>
//         ))}
//       </ul>

//       {/* <div className="metadata-results">
//         <h3>Metadata</h3>

//         {metadata.length === 0 ? (
//           <p>No metadata available</p>
//         ) : (
//           metadata.map((item, index) => (
//             <div key={index} className="metadata-item">
//               {Object.entries(item).map(([key, value]) => (
//                 <p key={key}>
//                   {key}: <strong>{String(value)}</strong>
//                 </p>
//               ))}
//             </div>
//           ))
//         )}
//       </div> */}
//       <div className="metadata-results">
//   <h3>Metadata</h3>

//   {metadata.length === 0 ? (
//     <p>No metadata available</p>
//   ) : (
//     <>
//       <button onClick={copyMetadataToClipboard}>
//         Copy JSON
//       </button>

//      <pre>
//   {metadata.length > 0
//     ? JSON.stringify(metadata[0], null, 2)
//     : 'No metadata'}
// </pre>

//       {metadata.map((item, index) => (
//         <div key={index} className="metadata-item">
//           {Object.entries(item).map(([key, value]) => (
//             <p key={key}>
//               {key}: <strong>{String(value)}</strong>
//             </p>
//           ))}
//         </div>
//       ))}
//     </>
//   )}
// </div>
//     </div>
//   );
// };

// export default DriveManager;


import React, { useEffect, useState } from 'react';
import { initDrive, login, uploadFile, listFiles, downloadFile } from '../utils/app';
import "../Styles/GoogleDrive.css";
import { generateFileMetadata } from '../utils/metadata';

type DriveFile = {
  id: string;
  name: string;
};

// Generic metadata type (adjust based on your generator)
type FileMetadata = Record<string, any>;

const DriveManager: React.FC = () => {
  const [files, setFiles] = useState<DriveFile[]>([]);
  const [metadata, setMetadata] = useState<FileMetadata | null>(null);

  // Fetch files from Drive
  const fetchFiles = async () => {
    const res = await listFiles();
    setFiles(res);
  };

  // Initialize Google Drive
  useEffect(() => {
    initDrive();
    fetchFiles();
  }, []);

  const handleLogin = () => login();

  // Upload file and store metadata as single object
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Generate metadata for this single file
    const meta = generateFileMetadata([file])[0]; // Take only the first object
    setMetadata(meta);

    // Upload file
    await uploadFile(file);

    fetchFiles();
  };

  // Copy metadata JSON to clipboard
  const copyMetadataToClipboard = async () => {
    if (!metadata) return;
    try {
      const json = JSON.stringify(metadata, null, 2);
      await navigator.clipboard.writeText(json);
      alert('Metadata copied to clipboard!');
    } catch (err) {
      console.error('Copy failed:', err);
    }
  };

  return (
    <div className="drive-manager">
      <button onClick={handleLogin}>Login with Google</button>
      <input type="file" onChange={handleUpload} />

      <h3>Files:</h3>
      <ul>
        {files.map((f) => (
          <li key={f.id}>
            {f.name}
            <button onClick={() => downloadFile(f.id, f.name)}>Download</button>
          </li>
        ))}
      </ul>

      <div className="metadata-results">
        <h3>Metadata</h3>
        {!metadata ? (
          <p>No metadata available</p>
        ) : (
          <>
            <button onClick={copyMetadataToClipboard}>Copy JSON</button>
            <pre>{JSON.stringify(metadata, null, 2)}</pre>
            <div className="metadata-item">
              {Object.entries(metadata).map(([key, value]) => (
                <p key={key}>
                  {key}: <strong>{String(value)}</strong>
                </p>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DriveManager;