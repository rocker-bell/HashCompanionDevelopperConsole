import { Client } from "@hashgraph/sdk";
export declare const createClient: (accountId: string, privateKey: string) => Client;
export declare const fetchApps: (accountId: string, privateKey: string) => Promise<string[]>;
