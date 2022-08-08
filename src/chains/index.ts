import BigNumber from "bignumber.js";

export type Erc20Utils<T, A, Addr> = {
  tokenBalance(token: T, address: Addr): Promise<A>;
};

export type EstimateTxFee<A> = {
  estimateTransferNative: () => Promise<A>;
  estimateTransferWrapped: () => Promise<A>;
};

export type Erc20TransferChecks<T, Addr> = {
  preReceiveForeignCheck(token: T, receiver: Addr): Promise<string | undefined>;
  preReceiveNativeCheck(token: T, receiver: Addr): Promise<string | undefined>;
};

export type Erc20BridgeChain<S, T, A, Txn> = {
  preTransfer(sender: S, token: T, amt: A): Promise<Txn | undefined>;

  transferNative(
    sender: S,
    nativeToken: T,
    chainNonce: number,
    amt: A,
    to: string,
    txFee: A
  ): Promise<Txn>;

  transferWrapped(
    sender: S,
    wToken: T,
    chainNonce: number,
    amt: A,
    to: string,
    txFee: A
  ): Promise<Txn>;
};

export type FullBridgeChain<S, T, A, Txn, Addr> = Erc20BridgeChain<
  S,
  T,
  A,
  Txn
> &
  EstimateTxFee<A> &
  Erc20Utils<T, A, Addr> &
  Partial<Erc20TransferChecks<T, Addr>>;

export type BridgeChainMapper<T, A, Txn, Addr> = {
  txnToDomain(txn: Txn): string;
  addrFromDomain(addr: string): Addr;
  tokenFromDomain(token: string): T;
  bigNumToDomain(bign: A): BigNumber;
  bigNumFromDomain(bign: BigNumber): A;
};

export type BridgeChainFactory<P, S, T, A, Txn, Addr> = (
  params: P
) => [FullBridgeChain<S, T, A, Txn, Addr>, BridgeChainMapper<T, A, Txn, Addr>];

export type MappedBridgeChain<S> = FullBridgeChain<
  S,
  string,
  BigNumber,
  string,
  string
>;

export function chainMapCombine<S, T, A, Txn, Addr>([chain, mapper]: ReturnType<
  BridgeChainFactory<any, S, T, A, Txn, Addr>
>): MappedBridgeChain<S> {
  const preReceiveForeignCheck: MappedBridgeChain<S>["preReceiveForeignCheck"] =
    chain.preReceiveForeignCheck &&
    ((t, r) =>
      chain.preReceiveForeignCheck!(
        mapper.tokenFromDomain(t),
        mapper.addrFromDomain(r)
      ));

  const preReceiveNativeCheck: MappedBridgeChain<S>["preReceiveNativeCheck"] =
    chain.preReceiveNativeCheck &&
    ((t, r) =>
      chain.preReceiveNativeCheck!(
        mapper.tokenFromDomain(t),
        mapper.addrFromDomain(r)
      ));

  return {
    tokenBalance: (t, a) =>
      chain
        .tokenBalance(mapper.tokenFromDomain(t), mapper.addrFromDomain(a))
        .then(mapper.bigNumToDomain),

    estimateTransferNative: () =>
      chain.estimateTransferNative().then(mapper.bigNumToDomain),

    estimateTransferWrapped: () =>
      chain.estimateTransferWrapped().then(mapper.bigNumToDomain),

    preTransfer: (s, t, a) =>
      chain
        .preTransfer(s, mapper.tokenFromDomain(t), mapper.bigNumFromDomain(a))
        .then((t) => t && mapper.txnToDomain(t)),

    transferNative: (s, t, c, a, to, tf) =>
      chain
        .transferNative(
          s,
          mapper.tokenFromDomain(t),
          c,
          mapper.bigNumFromDomain(a),
          to,
          mapper.bigNumFromDomain(tf)
        )
        .then(mapper.txnToDomain),

    transferWrapped: (s, t, c, a, to, tf) =>
      chain
        .transferWrapped(
          s,
          mapper.tokenFromDomain(t),
          c,
          mapper.bigNumFromDomain(a),
          to,
          mapper.bigNumFromDomain(tf)
        )
        .then(mapper.txnToDomain),
    preReceiveForeignCheck,
    preReceiveNativeCheck,
  };
}
