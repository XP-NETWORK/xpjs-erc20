import { Erc20BridgeChain } from "../chains";
import { ChainMetaMap, ChainNonces } from "./meta";

export type InferChainMeta<T extends ChainNonces> = ReturnType<ChainMetaMap[T]>;

export type InferBridgeChain<T extends ChainNonces> = InferChainMeta<T>[0];

type Equals<X, Y> = (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y
  ? 1
  : 2
  ? true
  : false;

type AssertFalse<A> = A extends false ? A : never;

type NAssertUnknown<T> = AssertFalse<Equals<T, unknown>>;

export type InferSigner<T extends ChainNonces> =
  InferBridgeChain<T> extends Erc20BridgeChain<
    infer S,
    unknown,
    unknown,
    unknown
  >
    ? NAssertUnknown<S>
    : never;

export type InferParams<T extends ChainNonces> = ChainMetaMap[T] extends (
  p: infer P
) => any
  ? NAssertUnknown<P>
  : never;
