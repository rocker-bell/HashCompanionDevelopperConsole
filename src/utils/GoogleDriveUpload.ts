// import React, { useState, useEffect } from 'react';
// import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
// import { google } from 'googleapis';

// const CLIENT_ID = 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com';  // Replace with your Google Client ID

// const GoogleDriveUpload = () => {
//   const [authToken, setAuthToken] = useState(null);
//   const [file, setFile] = useState(null);
//   const [uploadStatus, setUploadStatus] = useState('');

//   useEffect(() => {
//     // This is a placeholder for the logic to handle the file upload with Google Drive API once the authToken is available
//     if (authToken && file) {
//       uploadFileToDrive(file, authToken);
//     }
//   }, [authToken, file]);

//   const handleLoginSuccess = (response) => {
//     setAuthToken(response.credential);  // Store the auth token after successful login
//     console.log('Google Login Success:', response);
//   };

//   const handleLoginFailure = (error) => {
//     console.error('Google Login Failed:', error);
//   };

//   const handleFileChange = (event) => {
//     const selectedFile = event.target.files[0];
//     setFile(selectedFile);
//   };

//   const uploadFileToDrive = (file, authToken) => {
//     const drive = google.drive({ version: 'v3', auth: authToken });

//     const formData = new FormData();
//     formData.append('file', file);

//     const fileMetadata = {
//       name: file.name, // Use the file name
//     };

//     const media = {
//       mimeType: file.type,
//       body: file,
//     };

//     drive.files.create(
//       {
//         resource: fileMetadata,
//         media: media,
//         fields: 'id',
//       },
//       (err, res) => {
//         if (err) {
//           setUploadStatus(`Error uploading file: ${err}`);
//         } else {
//           setUploadStatus(`File uploaded successfully! File ID: ${res.data.id}`);
//         }
//       }
//     );
//   };

//   return (
//     <div>
//       <GoogleOAuthProvider clientId={CLIENT_ID}>
//         {!authToken ? (
//           <GoogleLogin
//             onSuccess={handleLoginSuccess}
//             onError={handleLoginFailure}
//             useOneTap
//           />
//         ) : (
//           <div>
//             <h3>Upload File to Google Drive</h3>
//             <input type="file" onChange={handleFileChange} />
//             <button
//               onClick={() => uploadFileToDrive(file, authToken)}
//               disabled={!file}
//             >
//               Upload to Google Drive
//             </button>
//             <p>{uploadStatus}</p>
//           </div>
//         )}
//       </GoogleOAuthProvider>
//     </div>
//   );
// };

// export default GoogleDriveUpload;


// import React, { useState, useEffect } from 'react';
// import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
// import { google } from 'googleapis';

// const CLIENT_ID = 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com'; // Replace with your Google Client ID

// const GoogleDriveUpload = () => {
//   const [authToken, setAuthToken] = useState(null);
//   const [files, setFiles] = useState([]);
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [uploadStatus, setUploadStatus] = useState('');
  
//   // Fetch files from Google Drive when the authToken is available
//   useEffect(() => {
//     if (authToken) {
//       fetchFilesFromDrive(authToken);
//     }
//   }, [authToken]);

//   const handleLoginSuccess = (response) => {
//     setAuthToken(response.credential); // Store the auth token after successful login
//     console.log('Google Login Success:', response);
//   };

//   const handleLoginFailure = (error) => {
//     console.error('Google Login Failed:', error);
//   };

//   // Fetch files from Google Drive
//   const fetchFilesFromDrive = async (authToken) => {
//     const drive = google.drive({ version: 'v3', auth: authToken });

//     try {
//       const res = await drive.files.list({
//         pageSize: 10, // You can adjust the number of files to fetch
//         fields: 'files(id, name, mimeType)',
//       });

//       const fileList = res.data.files || [];
//       console.log('Fetched Files:', fileList);

//       // Loop through the files and select a file based on a condition
//       // In this case, we are selecting a file whose name contains "sample"
//       const selected = fileList.find(file => file.name.includes('sample'));
//       if (selected) {
//         setSelectedFile(selected);
//         setUploadStatus(`Selected file: ${selected.name}`);
//       } else {
//         setUploadStatus('No file matching the condition found.');
//       }

//       // Update the state with the fetched files
//       setFiles(fileList);
//     } catch (error) {
//       console.error('Error fetching files from Drive:', error);
//       setUploadStatus('Failed to fetch files.');
//     }
//   };

//   return (
//     <div>
//       <GoogleOAuthProvider clientId={CLIENT_ID}>
//         {!authToken ? (
//           <GoogleLogin
//             onSuccess={handleLoginSuccess}
//             onError={handleLoginFailure}
//             useOneTap
//           />
//         ) : (
//           <div>
//             <h3>Fetch Files from Google Drive</h3>

//             {/* Show fetched files */}
//             <div>
//               <h4>Files in Google Drive:</h4>
//               <ul>
//                 {files.map(file => (
//                   <li key={file.id}>
//                     {file.name} (ID: {file.id}) - Type: {file.mimeType}
//                   </li>
//                 ))}
//               </ul>
//             </div>

//             {/* Show the selected file */}
//             <div>
//               {selectedFile ? (
//                 <p>Selected File: {selectedFile.name} (ID: {selectedFile.id})</p>
//               ) : (
//                 <p>No file selected based on the condition.</p>
//               )}
//             </div>

//             <p>{uploadStatus}</p>
//           </div>
//         )}
//       </GoogleOAuthProvider>
//     </div>
//   );
// };

// export default GoogleDriveUpload;




// import React, { useState, useEffect } from 'react';
// import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
// import { google } from 'googleapis';
// import { generateFileMetadata } from './metadata'; // Import the utility function

// const CLIENT_ID = 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com'; // Replace with your Google Client ID

// const GoogleDriveUpload = () => {
//   const [authToken, setAuthToken] = useState(null);
//   const [files, setFiles] = useState([]);
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [uploadStatus, setUploadStatus] = useState('');
//   const [fileMetadata, setFileMetadata] = useState(null);
  
//   // Handle file input and metadata generation
//   const handleFileChange = (event) => {
//     const file = event.target.files[0];
//     if (file) {
//       const metadata = generateFileMetadata(file); // Generate metadata from the selected file
//       setFileMetadata(metadata); // Set metadata
//       setSelectedFile(file); // Set the selected file
//     }
//   };

//   // Handle login success
//   const handleLoginSuccess = (response) => {
//     setAuthToken(response.credential); // Store the auth token after successful login
//     console.log('Google Login Success:', response);
//   };

//   const handleLoginFailure = (error) => {
//     console.error('Google Login Failed:', error);
//   };

//   // Fetch files from Google Drive (optional, if you want to list files)
//   useEffect(() => {
//     if (authToken) {
//       fetchFilesFromDrive(authToken);
//     }
//   }, [authToken]);

//   // Fetch files from Google Drive
//   const fetchFilesFromDrive = async (authToken) => {
//     const drive = google.drive({ version: 'v3', auth: authToken });

//     try {
//       const res = await drive.files.list({
//         pageSize: 10, // Adjust the number of files to fetch
//         fields: 'files(id, name, mimeType)',
//       });

//       const fileList = res.data.files || [];
//       console.log('Fetched Files:', fileList);
//       setFiles(fileList); // Update the state with the fetched files
//     } catch (error) {
//       console.error('Error fetching files from Drive:', error);
//       setUploadStatus('Failed to fetch files.');
//     }
//   };

//   // Upload the file to Google Drive
//   const handleUpload = async () => {
//     if (!selectedFile || !authToken) {
//       alert("Please select a file and log in first.");
//       return;
//     }

//     const drive = google.drive({ version: 'v3', auth: authToken });
//     const formData = new FormData();
//     formData.append('file', selectedFile);
//     formData.append('metadata', JSON.stringify(fileMetadata)); // Attach file metadata

//     try {
//       const res = await drive.files.create({
//         requestBody: {
//           name: selectedFile.name, // File name to be uploaded
//           mimeType: selectedFile.type, // MIME type of the file
//           parents: ['root'], // Optionally specify a folder to upload to
//         },
//         media: {
//           mimeType: selectedFile.type,
//           body: formData.get('file'), // Attach the file
//         },
//       });
      
//       console.log("File uploaded:", res.data);
//       setUploadStatus(`File uploaded successfully: ${selectedFile.name}`);
//     } catch (error) {
//       console.error("Error uploading file:", error);
//       setUploadStatus("Failed to upload file.");
//     }
//   };

//   return (
//     <div>
//       <GoogleOAuthProvider clientId={CLIENT_ID}>
//         {!authToken ? (
//           <GoogleLogin
//             onSuccess={handleLoginSuccess}
//             onError={handleLoginFailure}
//             useOneTap
//           />
//         ) : (
//           <div>
//             <h3>Upload File to Google Drive</h3>

//             <div>
//               <input
//                 type="file"
//                 accept="*/*" // Allow all file types, can filter specific extensions
//                 onChange={handleFileChange}
//               />
//             </div>

//             {fileMetadata && (
//               <div>
//                 <h4>File Metadata:</h4>
//                 <pre>{JSON.stringify(fileMetadata, null, 2)}</pre>
//               </div>
//             )}

//             <div>
//               <button onClick={handleUpload} disabled={!selectedFile}>
//                 Upload to Google Drive
//               </button>
//             </div>

//             <div>
//               <h4>Upload Status:</h4>
//               <p>{uploadStatus}</p>
//             </div>

//             {/* Show fetched files */}
//             <div>
//               <h4>Files in Google Drive:</h4>
//               <ul>
//                 {files.map((file) => (
//                   <li key={file.id}>
//                     {file.name} (ID: {file.id}) - Type: {file.mimeType}
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           </div>
//         )}
//       </GoogleOAuthProvider>
//     </div>
//   );
// };

// export default GoogleDriveUpload;


// import React, { useState, useEffect, ChangeEvent } from "react";
// import { GoogleOAuthProvider, GoogleLogin, CredentialResponse } from "@react-oauth/google";
// import { google } from "googleapis";
// import { generateFileMetadata } from "./metadata";

// const CLIENT_ID: string = "YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com";

// interface DriveFile {
//   id: string;
//   name: string;
//   mimeType: string;
// }

// interface FileMetadata {
//   [key: string]: any;
// }

// const GoogleDriveUpload: React.FC = () => {
//   const [authToken, setAuthToken] = useState<string | null>(null);
//   const [files, setFiles] = useState<DriveFile[]>([]);
//   const [selectedFile, setSelectedFile] = useState<File | null>(null);
//   const [uploadStatus, setUploadStatus] = useState<string>("");
//   const [fileMetadata, setFileMetadata] = useState<FileMetadata | null>(null);

//   // Handle file input and metadata generation
//   const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
//     const file = event.target.files?.[0];
//     if (file) {
//       const metadata = generateFileMetadata(file);
//       setFileMetadata(metadata);
//       setSelectedFile(file);
//     }
//   };

//   // Handle login success
//   const handleLoginSuccess = (response: CredentialResponse) => {
//     if (response.credential) {
//       setAuthToken(response.credential);
//     }
//     console.log("Google Login Success:", response);
//   };

//   const handleLoginFailure = () => {
//     console.error("Google Login Failed");
//   };

//   // Fetch files when token is available
//   useEffect(() => {
//     if (authToken) {
//       fetchFilesFromDrive(authToken);
//     }
//   }, [authToken]);

//   // Fetch files from Google Drive
//   const fetchFilesFromDrive = async (token: string) => {
//     const drive = google.drive({ version: "v3", auth: token });

//     try {
//       const res = await drive.files.list({
//         pageSize: 10,
//         fields: "files(id, name, mimeType)",
//       });

//       const fileList: DriveFile[] = (res.data.files as DriveFile[]) || [];
//       console.log("Fetched Files:", fileList);
//       setFiles(fileList);
//     } catch (error) {
//       console.error("Error fetching files from Drive:", error);
//       setUploadStatus("Failed to fetch files.");
//     }
//   };

//   // Upload file to Google Drive
//   const handleUpload = async () => {
//     if (!selectedFile || !authToken) {
//       alert("Please select a file and log in first.");
//       return;
//     }

//     const drive = google.drive({ version: "v3", auth: authToken });

//     try {
//       const res = await drive.files.create({
//         requestBody: {
//           name: selectedFile.name,
//           mimeType: selectedFile.type,
//           parents: ["root"],
//         },
//         media: {
//           mimeType: selectedFile.type,
//           body: selectedFile as any, // googleapis typing workaround
//         },
//       });

//       console.log("File uploaded:", res.data);
//       setUploadStatus(`File uploaded successfully: ${selectedFile.name}`);
//     } catch (error) {
//       console.error("Error uploading file:", error);
//       setUploadStatus("Failed to upload file.");
//     }
//   };

//   return (
//     <div>
//       <GoogleOAuthProvider clientId={CLIENT_ID}>
//         {!authToken ? (
//           <GoogleLogin
//             onSuccess={handleLoginSuccess}
//             onError={handleLoginFailure}
//             useOneTap
//           />
//         ) : (
//           <div>
//             <h3>Upload File to Google Drive</h3>

//             <div>
//               <input type="file" accept="*/*" onChange={handleFileChange} />
//             </div>

//             {fileMetadata && (
//               <div>
//                 <h4>File Metadata:</h4>
//                 <pre>{JSON.stringify(fileMetadata, null, 2)}</pre>
//               </div>
//             )}

//             <div>
//               <button onClick={handleUpload} disabled={!selectedFile}>
//                 Upload to Google Drive
//               </button>
//             </div>

//             <div>
//               <h4>Upload Status:</h4>
//               <p>{uploadStatus}</p>
//             </div>

//             <div>
//               <h4>Files in Google Drive:</h4>
//               <ul>
//                 {files.map((file) => (
//                   <li key={file.id}>
//                     {file.name} (ID: {file.id}) - Type: {file.mimeType}
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           </div>
//         )}
//       </GoogleOAuthProvider>
//     </div>
//   );
// };

// export default GoogleDriveUpload;