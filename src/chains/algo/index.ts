import { algoBridgeChain, AlgoBridgeChain, AlgoParams } from "./bridge";
import { AlgoBridgeChainMapper, algoMapper } from "./mapper";
export { AlgoSignerH, typedAlgoSigner } from "./signer";

export type AlgoBridge = [AlgoBridgeChain, AlgoBridgeChainMapper];

export function algoBridgeFactory(p: AlgoParams): AlgoBridge {
  return [algoBridgeChain(p), algoMapper()];
}
