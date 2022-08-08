export declare function mainNetBridgeDeps(): {
    scVerify: {
        getWrappedToken(nativeChainId: number, wrappedChainId: number, nativeToken: string): Promise<string | undefined>;
        getTokenPairByWrapped(wrappedChainId: number, wrappedToken: string): Promise<{
            nativeChain: number;
            wrappedChain: number;
            nativeToken: string;
            wrappedToken: string;
        } | undefined>;
    };
    exchangeRate: import("crypto-exchange-rate").ExchangeRateRepo & import("crypto-exchange-rate").BatchExchangeRateRepo & {
        getCacheExpiry(): number;
    };
    notifier: {
        notifyValidator(fromChain: number, txHash: string): Promise<void>;
    };
};
//# sourceMappingURL=deps.d.ts.map