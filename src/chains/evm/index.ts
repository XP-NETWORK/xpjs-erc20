import { evmBridgeChain, EvmBridgeChain, EvmParams } from "./bridge";
import { EvmBridgeChainMapper, evmMapper } from "./mapper";

export type EvmBridge = [EvmBridgeChain, EvmBridgeChainMapper];

export function evmBridgeFactory(p: EvmParams): EvmBridge {
  return [evmBridgeChain(p), evmMapper(p.provider)];
}
