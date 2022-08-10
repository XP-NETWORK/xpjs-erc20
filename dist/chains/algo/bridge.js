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
        return res
            ? undefined
            : { reason: `receiver must opt in to asset ${t}`, data: t };
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
        myAlgoSignerWrapper(acc, address) {
            const signer = {
                async accounts(_) {
                    const accs = await acc.connect();
                    return accs;
                },
                async signTxn(txns) {
                    const stxs = await acc.signTransaction(txns.map(({ txn }) => txn));
                    return stxs.map((tx) => ({
                        txID: tx.txID,
                        blob: js_base64_1.Base64.fromUint8Array(tx.blob),
                    }));
                },
                send(info) {
                    return p.algod.sendRawTransaction(js_base64_1.Base64.toUint8Array(info.tx)).do();
                },
            };
            return {
                algoSigner: signer,
                address,
                ledger: "any",
            };
        },
    };
}
exports.algoBridgeChain = algoBridgeChain;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnJpZGdlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2NoYWlucy9hbGdvL2JyaWRnZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFDQSxzREFBOEI7QUFFOUIseUNBQW1DO0FBeUJuQyxPQUFPO0FBQ1AsTUFBTSxvQkFBb0IsR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDdkMsT0FBTztBQUNQLE1BQU0scUJBQXFCLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBRXhDLE1BQU0sR0FBRyxHQUFHLElBQUksV0FBVyxFQUFFLENBQUM7QUFFOUIsU0FBZ0IsZUFBZSxDQUFDLENBQWE7SUFDM0MsU0FBUyxhQUFhLENBQUMsT0FBZSxFQUFFLElBQVk7UUFDbEQsT0FBTyxDQUFDLENBQUMsT0FBTzthQUNiLG1CQUFtQixDQUFDLElBQUksQ0FBQzthQUN6QixPQUFPLENBQUMsT0FBTyxDQUFDO2FBQ2hCLEVBQUUsRUFBRTthQUNKLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUM7YUFDaEIsS0FBSyxDQUFDLENBQUMsR0FBRyxFQUFFLEVBQUU7WUFDYixPQUFPLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxHQUFHLENBQUMsQ0FBQztZQUMxQixPQUFPLEtBQUssQ0FBQztRQUNmLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUVELFNBQVMsZUFBZSxDQUFDLE9BQWU7UUFDdEMsT0FBTyxhQUFhLENBQUMsT0FBTyxFQUFFLGlCQUFPLENBQUMscUJBQXFCLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7SUFDM0UsQ0FBQztJQUVELE1BQU0sZ0JBQWdCLEdBQThDLEtBQUssRUFDdkUsQ0FBQyxFQUNELENBQUMsRUFDRCxFQUFFO1FBQ0YsTUFBTSxHQUFHLEdBQUcsTUFBTSxhQUFhLENBQUMsQ0FBQyxFQUFFLGlCQUFPLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxT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