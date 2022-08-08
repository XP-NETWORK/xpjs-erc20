export declare type TxResp = {
    txId: string;
};
/**
 * Selected address & ledger must be given explicitly
 */
export declare type AlgoSignerH = {
    readonly algoSigner: BrowserSigner;
    readonly address: string;
    readonly ledger: Ledger;
};
export declare type SignedTxn = {
    txID?: string;
    blob: string;
};
export declare type Ledger = "MainNet" | "TestNet" | "any";
export declare type BrowserSigner = {
    accounts(args: {
        ledger: Ledger;
    }): Promise<{
        address: string;
    }[]>;
    signTxn(transactions: {
        txn: string;
    }[]): Promise<SignedTxn[]>;
    send(info: {
        ledger: Ledger;
        tx: string;
    }): Promise<TxResp>;
};
/**
 * This library is written in typescript.
 * unfortunately the browser extension injects the AlgoSigner in a way we can't get a typed object wwithout this hack.
 *
 * @return Strongly typed AlgoSigner from extension
 */
export declare function typedAlgoSigner(): BrowserSigner;
//# sourceMappingURL=signer.d.ts.map