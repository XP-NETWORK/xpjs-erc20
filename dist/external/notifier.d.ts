export declare type EvNotifer = ReturnType<typeof evNotifier>;
export declare function evNotifier(url: string): {
    notifyValidator(fromChain: number, txHash: string): Promise<void>;
};
//# sourceMappingURL=notifier.d.ts.map