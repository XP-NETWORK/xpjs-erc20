import { ethers, Signer } from "ethers";
import { FullBridgeChain } from "..";
import { DummyErc20 } from "web3-erc20-contracts-types";
export declare type EvmBridgeChain = FullBridgeChain<Signer, DummyErc20, ethers.BigNumber, ethers.ContractReceipt, string>;
export declare type EvmParams = {
    provider: ethers.providers.Provider;
    bridgeAddr: string;
};
export declare function evmBridgeChain(p: EvmParams): EvmBridgeChain;
//# sourceMappingURL=bridge.d.ts.map