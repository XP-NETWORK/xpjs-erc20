import { BridgeChainFactory } from "../chains";
import { evmBridgeFactory } from "../chains/evm";

export const ChainNonce = {
  Ethereum: 0x1,
  Ropsten: 0x10001,
  BSC: 0x2,
  BSCTestNet: 0x10002,
  Polygon: 0x3,
  Mumbai: 0x10003,
  Fantom: 0x4,
  FantomTestNet: 0x10004,
} as const;

export type ChainNonces = typeof ChainNonce[keyof typeof ChainNonce];

// Static assert to ensure that MetaMap covers all Chain Nonce
type ChainStaticAssert<T> = T extends {
  [K in ChainNonces]: BridgeChainFactory<any, any, any, any, any, any>;
}
  ? T
  : never;

type EvmFactory = typeof evmBridgeFactory;

export type ChainMetaMap = ChainStaticAssert<{
  [ChainNonce.Ethereum]: EvmFactory;
  [ChainNonce.Ropsten]: EvmFactory;
  [ChainNonce.BSC]: EvmFactory;
  [ChainNonce.BSCTestNet]: EvmFactory;
  [ChainNonce.Polygon]: EvmFactory;
  [ChainNonce.Mumbai]: EvmFactory;
  [ChainNonce.Fantom]: EvmFactory;
  [ChainNonce.FantomTestNet]: EvmFactory;
}>;
