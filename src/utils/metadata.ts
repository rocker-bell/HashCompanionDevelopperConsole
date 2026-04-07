
// export const generateFileMetadata = (file) => {
//   const fileMetadata = {
//     id: generateUniqueId(),
//     file_name: file.name,
//     file_size: file.size,
//     creation_date: new Date(file.lastModified).toISOString(),
//     modification_date: new Date().toISOString(),
//     file_hash: generateFileHash(file),
//   };
//   return fileMetadata;
// };


export const generateFileMetadata = (files: File[]) => {
  return files.map((file) => ({
    id: generateUniqueId(),
    file_name: file.name,
    file_size: file.size,
    creation_date: new Date(file.lastModified).toISOString(),
    modification_date: new Date().toISOString(),
    file_hash: generateFileHash(),
  }));
};

// Helper function to generate a unique ID for the file (could use a UUID or a simple timestamp approach)
export const generateUniqueId = () => {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
};

// Dummy function for generating file hash (to be replaced with actual hash generation)
export const generateFileHash = () => {
  // You can use a hashing library like `crypto` to generate a hash from the file's contents
  // For now, returning a placeholder hash
  return "cf0c161e3c7f0833be1faa8961311f1fc01a7e5a868fe0744770e5aa4f73b2cb";
};


