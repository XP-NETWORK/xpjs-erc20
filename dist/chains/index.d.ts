import BigNumber from "bignumber.js";
export declare type Erc20Utils<T, A, Addr> = {
    balance(address: string): Promise<A>;
    tokenBalance(token: T, address: Addr): Promise<A>;
    tokenParams(token: T): Promise<any>;
};
export declare type EstimateTxFee<A> = {
    estimateTransferNative: () => Promise<A>;
    estimateTransferWrapped: () => Promise<A>;
};
export declare type ErrData<T> = {
    reason: string;
    data: T;
};
export declare type Erc20TransferChecks<T, Addr, E> = {
    preReceiveForeignCheck(token: T, receiver: Addr): Promise<ErrData<E> | undefined>;
    preReceiveNativeCheck(token: T, receiver: Addr): Promise<ErrData<E> | undefined>;
};
export declare type Erc20BridgeChain<S, T, A, Txn> = {
    preTransfer(sender: S, token: T, amt: A): Promise<Txn | undefined>;
    transferNative(sender: S, nativeToken: T, chainNonce: number, amt: A, to: string, txFee: A): Promise<Txn>;
    transferWrapped(sender: S, wToken: T, chainNonce: number, amt: A, to: string, txFee: A): Promise<Txn>;
};
export declare type FullBridgeChain<S, T, A, Txn, Addr, E = unknown> = Erc20BridgeChain<S, T, A, Txn> & EstimateTxFee<A> & Erc20Utils<T, A, Addr> & Partial<Erc20TransferChecks<T, Addr, E>>;
export declare type BridgeChainMapper<T, A, Txn, Addr> = {
    txnToDomain(txn: Txn): string;
    addrFromDomain(addr: string): Addr;
    accountFromDomain(acc: string): string;
    tokenFromDomain(token: string): T;
    bigNumToDomain(bign: A): BigNumber;
    bigNumFromDomain(bign: BigNumber): A;
    default(p: any): any;
};
export declare type BridgeChainFactory<P, S, T, A, Txn, Addr> = (params: P) => [FullBridgeChain<S, T, A, Txn, Addr>, BridgeChainMapper<T, A, Txn, Addr>];
export declare type MappedBridgeChain<S> = FullBridgeChain<S, string, BigNumber, string, string>;
export declare function chainMapCombine<S, T, A, Txn, Addr>([chain, mapper]: ReturnType<BridgeChainFactory<any, S, T, A, Txn, Addr>>): MappedBridgeChain<S>;
//# sourceMappingURL=index.d.ts.map