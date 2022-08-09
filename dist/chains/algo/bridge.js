"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.algoBridgeChain = void 0;
const algosdk_1 = __importDefault(require("algosdk"));
const js_base64_1 = require("js-base64");
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
                    from: sender.address,
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
                from: sender.address,
                suggestedParams: params,
                to: algosdk_1.default.getApplicationAddress(p.bridgeId),
                amount: amt,
                assetIndex: nativeToken,
            });
            const payTxn = algosdk_1.default.makePaymentTxnWithSuggestedParamsFromObject({
                from: sender.address,
                suggestedParams: params,
                to: algosdk_1.default.getApplicationAddress(p.bridgeId),
                amount: txFee,
            });
            const callTxn = algosdk_1.default.makeApplicationNoOpTxnFromObject({
                from: sender.address,
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
            const sTxns = await sender.algoSigner.signTxn(txns.map((t) => ({ txn: js_base64_1.Base64.fromUint8Array(t.toByte()) })));
            await p.algod
                .sendRawTransaction(sTxns.map((s) => js_base64_1.Base64.toUint8Array(s.blob)))
                .do();
            return callTxn.txID();
        },
        async transferWrapped(sender, wToken, chainNonce, amt, to, txFee) {
            const params = await p.algod.getTransactionParams().do();
            const asaTxn = algosdk_1.default.makeAssetTransferTxnWithSuggestedParamsFromObject({
                from: sender.address,
                suggestedParams: params,
                to: algosdk_1.default.getApplicationAddress(p.bridgeId),
                amount: amt,
                assetIndex: wToken,
            });
            const payTxn = algosdk_1.default.makePaymentTxnWithSuggestedParamsFromObject({
                from: sender.address,
                suggestedParams: params,
                to: algosdk_1.default.getApplicationAddress(p.bridgeId),
                amount: txFee,
            });
            const callTxn = algosdk_1.default.makeApplicationNoOpTxnFromObject({
                from: sender.address,
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
            const sTxns = await sender.algoSigner.signTxn([asaTxn, payTxn, callTxn].map((t) => ({
                txn: js_base64_1.Base64.fromUint8Array(t.toByte()),
            })));
            await p.algod
                .sendRawTransaction(sTxns.map((s) => js_base64_1.Base64.toUint8Array(s.blob)))
                .do();
            return callTxn.txID();
        },
        preReceiveForeignCheck: preTransferCheck,
        preReceiveNativeCheck: preTransferCheck,
        algoSignerWrapper(acc) {
            const signer = {
                accounts(_) {
                    return Promise.resolve([
                        {
                            address: acc.addr,
                        },
                    ]);
                },
                signTxn(txns) {
                    return Promise.resolve(txns.map((t) => {
                        const signed = algosdk_1.default.signTransaction(algosdk_1.default.decodeUnsignedTransaction(js_base64_1.Base64.toUint8Array(t.txn)), acc.sk);
                        return {
                            txID: signed.txID,
                            blob: js_base64_1.Base64.fromUint8Array(signed.blob),
                        };
                    }));
                },
                send({ tx }) {
                    return p.algod.sendRawTransaction(js_base64_1.Base64.toUint8Array(tx)).do();
                },
            };
            return {
                algoSigner: signer,
                address: acc.addr,
                ledger: "any",
            };
        },
        async optInAsa(signer, asaId) {
            if (await isOptedByAddr(asaId, signer.address)) {
                return undefined;
            }
            const suggestedParams = await p.algod.getTransactionParams().do();
            const optInTx = algosdk_1.default.makeAssetTransferTxnWithSuggestedParamsFromObject({
                from: signer.address,
                to: signer.address,
                amount: 0,
                assetIndex: asaId,
                suggestedParams,
            });
            const sTx = await signer.algoSigner.signTxn([
                { txn: js_base64_1.Base64.fromUint8Array(optInTx.toByte()) },
            ]);
            await p.algod.sendRawTransaction(js_base64_1.Base64.toUint8Array(sTx[0].blob)).do();
            return optInTx.txID();
        },
    };
}
exports.algoBridgeChain = algoBridgeChain;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnJpZGdlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2NoYWlucy9hbGdvL2JyaWRnZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFDQSxzREFBOEI7QUFFOUIseUNBQW1DO0FBdUJuQyxPQUFPO0FBQ1AsTUFBTSxvQkFBb0IsR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDdkMsT0FBTztBQUNQLE1BQU0scUJBQXFCLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBRXhDLE1BQU0sR0FBRyxHQUFHLElBQUksV0FBVyxFQUFFLENBQUM7QUFFOUIsU0FBZ0IsZUFBZSxDQUFDLENBQWE7SUFDM0MsU0FBUyxhQUFhLENBQUMsT0FBZSxFQUFFLElBQVk7UUFDbEQsT0FBTyxDQUFDLENBQUMsT0FBTzthQUNiLG1CQUFtQixDQUFDLElBQUksQ0FBQzthQUN6QixPQUFPLENBQUMsT0FBTyxDQUFDO2FBQ2hCLEVBQUUsRUFBRTthQUNKLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUM7YUFDaEIsS0FBSyxDQUFDLENBQUMsR0FBRyxFQUFFLEVBQUU7WUFDYixPQUFPLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxHQUFHLENBQUMsQ0FBQztZQUMxQixPQUFPLEtBQUssQ0FBQztRQUNmLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUVELFNBQVMsZUFBZSxDQUFDLE9BQWU7UUFDdEMsT0FBTyxhQUFhLENBQUMsT0FBTyxFQUFFLGlCQUFPLENBQUMscUJBQXFCLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7SUFDM0UsQ0FBQztJQUVELE1BQU0sZ0JBQWdCLEdBQThDLEtBQUssRUFDdkUsQ0FBQyxFQUNELENBQUMsRUFDRCxFQUFFO1FBQ0YsTUFBTSxHQUFHLEdBQUcsTUFBTSxhQUFhLENBQUMsQ0FBQyxFQUFFLGlCQUFPLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxT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