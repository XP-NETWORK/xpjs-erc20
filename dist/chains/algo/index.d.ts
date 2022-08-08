import { AlgoBridgeChain, AlgoParams } from "./bridge";
import { AlgoBridgeChainMapper } from "./mapper";
export { AlgoSignerH, typedAlgoSigner } from "./signer";
export declare type AlgoBridge = [AlgoBridgeChain, AlgoBridgeChainMapper];
export declare function algoBridgeFactory(p: AlgoParams): AlgoBridge;
//# sourceMappingURL=index.d.ts.map