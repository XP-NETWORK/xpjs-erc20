import { FullBridgeChain } from "../chains";
import { ChainMetaMap, ChainNonces } from "./meta";

export type InferChainMeta<T extends ChainNonces> = ReturnType<ChainMetaMap[T]>;

export type InferBridgeChain<T extends ChainNonces> = ReturnType<
  ChainMetaMap[T]
>[0];

type Equals<X, Y> = (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y
  ? 1
  : 2
  ? true
  : false;

type NAssertUnknown<T> = Equals<T, unknown> extends false ? T : never;

export type InferChainArgs<T extends ChainNonces> =
  InferBridgeChain<T> extends FullBridgeChain<
    infer S,
    infer T,
    infer A,
    infer Txn,
    infer Addr
  >
    ? [
        NAssertUnknown<S>,
        NAssertUnknown<T>,
        NAssertUnknown<A>,
        NAssertUnknown<Txn>,
        NAssertUnknown<Addr>
      ]
    : never;

export type InferParams<T extends ChainNonces> = ChainMetaMap[T] extends (
  p: infer P
) => any
  ? NAssertUnknown<P>
  : never;
