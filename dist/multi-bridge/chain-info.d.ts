import BigNumber from "bignumber.js";
import { SupportedCurrency } from "crypto-exchange-rate";
import { ChainMetaMap, ChainNonces } from "./meta";
declare type ChainInfo = {
    [K in ChainNonces]: {
        name: string;
        decimals: BigNumber;
        factory: ChainMetaMap[K];
        currency: SupportedCurrency;
        blockExplorer: string;
    };
};
export declare const ChainInfo: ChainInfo;
export {};
//# sourceMappingURL=chain-info.d.ts.map