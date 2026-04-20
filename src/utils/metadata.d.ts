export declare const generateFileMetadata: (files: File[]) => {
    id: string;
    file_name: string;
    file_size: number;
    creation_date: string;
    modification_date: string;
    file_hash: string;
}[];
export declare const generateUniqueId: () => string;
export declare const generateFileHash: () => string;
