import { Erc20TransferChecks, FullBridgeChain } from "..";
import algosdk from "algosdk";
import { AlgoSignerH } from "./signer";
import MyAlgoConnect from "@randlabs/myalgo-connect";
declare type AlgoUtils = {
    algoSignerWrapper: (acc: algosdk.Account) => AlgoSignerH;
    myAlgoSignerWrapper: (acc: MyAlgoConnect, address: string) => AlgoSignerH;
    optInAsa: (acc: AlgoSignerH, asaId: number) => Promise<string | undefined>;
};
export declare type AlgoBridgeChain = FullBridgeChain<AlgoSignerH, number, bigint, string, algosdk.Address> & Erc20TransferChecks<number, algosdk.Address, number> & AlgoUtils;
export declare type AlgoParams = {
    algod: algosdk.Algodv2;
    indexer: algosdk.Indexer;
    bridgeId: number;
};
export declare function algoBridgeChain(p: AlgoParams): AlgoBridgeChain;
export {};
//# sourceMappingURL=bridge.d.ts.map