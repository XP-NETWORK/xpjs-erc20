import { ethers } from "ethers";
import { DummyErc20 } from "web3-erc20-contracts-types";
import { BridgeChainMapper } from "..";
export declare type EvmBridgeChainMapper = BridgeChainMapper<DummyErc20, ethers.BigNumber, ethers.ContractReceipt, string>;
export declare function evmMapper(provider: ethers.providers.Provider): EvmBridgeChainMapper;
//# sourceMappingURL=mapper.d.ts.map