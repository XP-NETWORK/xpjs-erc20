"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.algoBridgeChain = void 0;
const algosdk_1 = __importDefault(require("algosdk"));
// TODO
const TRANSFER_NATIVE_COST = BigInt(1);
// TODO
const TRANSFER_WRAPPED_COST = BigInt(1);
const enc = new TextEncoder();
function algoBridgeChain(p) {
    function isOptedByAddr(assetId, addr) {
        return p.indexer
            .lookupAccountAssets(addr)
            .assetId(assetId)
            .do()
            .then(() => true)
            .catch((err) => {
            console.log("error", err);
            return false;
        });
    }
    function isOptedByBridge(assetId) {
        return isOptedByAddr(assetId, algosdk_1.default.getApplicationAddress(p.bridgeId));
    }
    const preTransferCheck = async (t, r) => {
        const res = await isOptedByAddr(t, algosdk_1.default.encodeAddress(r.publicKey));
        return res ? undefined : `receiver must opt in to asset ${t}`;
    };
    return {
        async tokenBalance(token, address) {
            const res = await p.indexer
                .lookupAccountAssets(algosdk_1.default.encodeAddress(address.publicKey))
                .assetId(token)
                .do()
                .catch(() => ({ assets: [{ amount: 0 }] }));
            return BigInt(res.assets[0].amount);
        },
        estimateTransferNative() {
            return Promise.resolve(TRANSFER_NATIVE_COST);
        },
        estimateTransferWrapped() {
            return Promise.resolve(TRANSFER_WRAPPED_COST);
        },
        async preTransfer() {
            // TODO
            return undefined;
        },
        async transferNative(sender, nativeToken, chainNonce, amt, to, txFee) {
            const params = await p.algod.getTransactionParams().do();
            let txns = [];
            if (!(await isOptedByBridge(nativeToken))) {
                const optInAsaTxn = algosdk_1.default.makeApplicationNoOpTxnFromObject({
                    from: sender.addr,
                    suggestedParams: params,
                    appIndex: p.bridgeId,
                    appArgs: [enc.encode("optin_asa")],
                    foreignAssets: [nativeToken],
                });
                optInAsaTxn.amount = 100000;
                optInAsaTxn.fee = 2000;
                txns.push(optInAsaTxn);
            }
            const asaTxn = algosdk_1.default.makeAssetTransferTxnWithSuggestedParamsFromObject({
                from: sender.addr,
                suggestedParams: params,
                to: algosdk_1.default.getApplicationAddress(p.bridgeId),
                amount: amt,
                assetIndex: nativeToken,
            });
            const payTxn = algosdk_1.default.makePaymentTxnWithSuggestedParamsFromObject({
                from: sender.addr,
                suggestedParams: params,
                to: algosdk_1.default.getApplicationAddress(p.bridgeId),
                amount: txFee,
            });
            const callTxn = algosdk_1.default.makeApplicationNoOpTxnFromObject({
                from: sender.addr,
                suggestedParams: params,
                appIndex: p.bridgeId,
                appArgs: [
                    enc.encode("send_native"),
                    algosdk_1.default.encodeUint64(amt),
                    algosdk_1.default.encodeUint64(chainNonce),
                    enc.encode(to),
                ],
            });
            txns.push(asaTxn, payTxn, callTxn);
            algosdk_1.default.assignGroupID(txns);
            const sTxns = txns.map((t) => t.signTxn(sender.sk));
            await p.algod.sendRawTransaction(sTxns).do();
            return callTxn.txID();
        },
        async transferWrapped(sender, wToken, chainNonce, amt, to, txFee) {
            const params = await p.algod.getTransactionParams().do();
            const asaTxn = algosdk_1.default.makeAssetTransferTxnWithSuggestedParamsFromObject({
                from: sender.addr,
                suggestedParams: params,
                to: algosdk_1.default.getApplicationAddress(p.bridgeId),
                amount: amt,
                assetIndex: wToken,
            });
            const payTxn = algosdk_1.default.makePaymentTxnWithSuggestedParamsFromObject({
                from: sender.addr,
                suggestedParams: params,
                to: algosdk_1.default.getApplicationAddress(p.bridgeId),
                amount: txFee,
            });
            const callTxn = algosdk_1.default.makeApplicationNoOpTxnFromObject({
                from: sender.addr,
                suggestedParams: params,
                appIndex: p.bridgeId,
                appArgs: [
                    enc.encode("send_wrapped"),
                    algosdk_1.default.encodeUint64(amt),
                    algosdk_1.default.encodeUint64(chainNonce),
                    enc.encode(to),
                ],
            });
            algosdk_1.default.assignGroupID([asaTxn, payTxn, callTxn]);
            const sTxns = [asaTxn, payTxn, callTxn].map((t) => t.signTxn(sender.sk));
            await p.algod.sendRawTransaction(sTxns).do();
            return callTxn.txID();
        },
        preReceiveForeignCheck: preTransferCheck,
        preReceiveNativeCheck: preTransferCheck,
    };
}
exports.algoBridgeChain = algoBridgeChain;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnJpZGdlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2NoYWlucy9hbGdvL2JyaWRnZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFDQSxzREFBOEI7QUFtQjlCLE9BQU87QUFDUCxNQUFNLG9CQUFvQixHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUN2QyxPQUFPO0FBQ1AsTUFBTSxxQkFBcUIsR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFFeEMsTUFBTSxHQUFHLEdBQUcsSUFBSSxXQUFXLEVBQUUsQ0FBQztBQUU5QixTQUFnQixlQUFlLENBQUMsQ0FBYTtJQUMzQyxTQUFTLGFBQWEsQ0FBQyxPQUFlLEVBQUUsSUFBWTtRQUNsRCxPQUFPLENBQUMsQ0FBQyxPQUFPO2FBQ2IsbUJBQW1CLENBQUMsSUFBSSxDQUFDO2FBQ3pCLE9BQU8sQ0FBQyxPQUFPLENBQUM7YUFDaEIsRUFBRSxFQUFFO2FBQ0osSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQzthQUNoQixLQUFLLENBQUMsQ0FBQyxHQUFHLEVBQUUsRUFBRTtZQUNiLE9BQU8sQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1lBQzFCLE9BQU8sS0FBSyxDQUFDO1FBQ2YsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDO0lBRUQsU0FBUyxlQUFlLENBQUMsT0FBZTtRQUN0QyxPQUFPLGFBQWEsQ0FBQyxPQUFPLEVBQUUsaUJBQU8sQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztJQUMzRSxDQUFDO0lBRUQsTUFBTSxnQkFBZ0IsR0FBOEMsS0FBSyxFQUN2RSxDQUFDLEVBQ0QsQ0FBQyxFQUNELEVBQUU7UUFDRixNQUFNLEdBQUcsR0FBRyxNQUFNLGFBQWEsQ0FBQyxDQUFDLEVBQUUsaUJBQU8sQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFD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