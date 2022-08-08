import BigNumber from "bignumber.js";
import { ExchangeRateRepo } from "crypto-exchange-rate";
import { ScVerifyRepo } from "../external/sc-verify";
import { ChainNonces } from "./meta";
import { InferBridgeChain, InferChainArgs, InferParams } from "./type-utils";
export declare type Erc20MultiBridge = {
    inner<T extends ChainNonces>(nonce: T): Promise<InferBridgeChain<T>>;
    tokenBalance<T extends ChainNonces>(nonce: T, token: string, addr: string): Promise<BigNumber>;
    estimateFees<S extends ChainNonces, R extends ChainNonces>(sourceNonce: S, token: string, targetNonce: R): Promise<BigNumber>;
    preTransfer<T extends ChainNonces>(nonce: T, sender: InferChainArgs<T>[0], token: string, amt: BigNumber): Promise<string | undefined>;
    transferTokens<T extends ChainNonces, R extends ChainNonces>(nonce: T, sender: InferChainArgs<T>[0], token: string, chainNonce: R, amt: BigNumber, to: string, txFee?: BigNumber): Promise<string>;
};
export declare type MultiBridgeParams = Partial<{
    [K in ChainNonces]: InferParams<K>;
}>;
export declare type MultiBridgeDeps = {
    scVerify: ScVerifyRepo;
    exchangeRate: ExchangeRateRepo;
};
export declare function erc20MultiBridge(p: MultiBridgeParams, d: MultiBridgeDeps): Erc20MultiBridge;
//# sourceMappingURL=index.d.ts.map