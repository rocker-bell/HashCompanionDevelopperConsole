/**
 * Initialize the Drive module.
 * Call this once in your app (e.g., in App.tsx useEffect)
 */
export declare function initDrive(): void;
/** Trigger Google login */
export declare function login(): void;
/** Upload a file to Google Drive */
export declare function uploadFile(file: File, folderId?: string): Promise<any>;
/** List files in Drive or in a specific folder */
export declare function listFiles(folderId?: string): Promise<any>;
/** Download a file from Drive */
export declare function downloadFile(fileId: string, fileName: string): Promise<void>;
