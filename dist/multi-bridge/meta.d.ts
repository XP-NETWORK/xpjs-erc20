import { BridgeChainFactory } from "../chains";
import { algoBridgeFactory } from "../chains/algo";
import { evmBridgeFactory } from "../chains/evm";
export declare const ChainNonce: {
    readonly Ethereum: 1;
    readonly Ropsten: 65537;
    readonly BSC: 2;
    readonly BSCTestNet: 65538;
    readonly Polygon: 3;
    readonly Mumbai: 65539;
    readonly Fantom: 4;
    readonly FantomTestNet: 65540;
    readonly Algorand: 5;
    readonly AlgorandTestnet: 65541;
};
export declare type ChainNonces = typeof ChainNonce[keyof typeof ChainNonce];
declare type ChainStaticAssert<T> = T extends {
    [K in ChainNonces]: BridgeChainFactory<any, any, any, any, any, any>;
} ? T : never;
declare type EvmFactory = typeof evmBridgeFactory;
declare type AlgoFactory = typeof algoBridgeFactory;
export declare type ChainMetaMap = ChainStaticAssert<{
    [ChainNonce.Ethereum]: EvmFactory;
    [ChainNonce.Ropsten]: EvmFactory;
    [ChainNonce.BSC]: EvmFactory;
    [ChainNonce.BSCTestNet]: EvmFactory;
    [ChainNonce.Polygon]: EvmFactory;
    [ChainNonce.Mumbai]: EvmFactory;
    [ChainNonce.Fantom]: EvmFactory;
    [ChainNonce.FantomTestNet]: EvmFactory;
    [ChainNonce.Algorand]: AlgoFactory;
    [ChainNonce.AlgorandTestnet]: AlgoFactory;
}>;
export {};
//# sourceMappingURL=meta.d.ts.map