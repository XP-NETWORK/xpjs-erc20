import { Erc20TransferChecks, FullBridgeChain } from "..";
import algosdk from "algosdk";
declare type AlgoSigenr = algosdk.Account;
export declare type AlgoBridgeChain = FullBridgeChain<AlgoSigenr, number, bigint, string, algosdk.Address> & Erc20TransferChecks<number, algosdk.Address>;
export declare type AlgoParams = {
    algod: algosdk.Algodv2;
    indexer: algosdk.Indexer;
    bridgeId: number;
};
export declare function algoBridgeChain(p: AlgoParams): AlgoBridgeChain;
export {};
//# sourceMappingURL=bridge.d.ts.map