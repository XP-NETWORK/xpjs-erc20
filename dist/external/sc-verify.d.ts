declare type TokenQueryResp = {
    nativeChain: number;
    wrappedChain: number;
    nativeToken: string;
    wrappedToken: string;
};
export declare type ScVerifyRepo = ReturnType<typeof scVerifyRepo>;
export declare function scVerifyRepo(baseURL: string): {
    getWrappedToken(nativeChainId: number, wrappedChainId: number, nativeToken: string): Promise<string | undefined>;
    getTokenPairByWrapped(wrappedChainId: number, wrappedToken: string): Promise<TokenQueryResp | undefined>;
};
export {};
//# sourceMappingURL=sc-verify.d.ts.map